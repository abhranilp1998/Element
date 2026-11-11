(() => {
  'use strict';
  const frames = [...document.querySelectorAll('iframe[data-soundcloud]')];
  if (!frames.length) return;
  const records = [];
  const volume = document.querySelector('#room-volume');
  const mute = document.querySelector('#room-mute');
  const pause = document.querySelector('#pause-all');
  const nowPlaying = document.querySelector('#room-now-playing');
  let currentVolume = 60;
  let previousVolume = 60;
  let activeRecord = null;
  function syncControls() {
    if (volume) volume.value = String(currentVolume);
    if (mute) {
      mute.textContent = currentVolume === 0 ? 'Unmute' : 'Mute';
      mute.setAttribute('aria-pressed', String(currentVolume === 0));
    }
  }
  function setVolume(value) {
    currentVolume = value;
    if (value > 0) previousVolume = value;
    records.filter(record => record.ready).forEach(record => record.widget.setVolume(value));
    syncControls();
  }
  volume?.addEventListener('input', () => setVolume(Number(volume.value)));
  mute?.addEventListener('click', () => setVolume(currentVolume === 0 ? previousVolume : 0));
  pause?.addEventListener('click', () => records.forEach(record => record.widget.pause()));
  document.addEventListener('musicfilterchange', () => {
    records.forEach(record => { if (record.frame.closest('[hidden]')) record.widget.pause(); });
  });
  document.querySelector('#archive-tracks')?.addEventListener('toggle', event => {
    if (!event.target.open) records.filter(record => record.frame.closest('#archive-tracks')).forEach(record => record.widget.pause());
  });
  const script = document.createElement('script');
  script.src = 'https://w.soundcloud.com/player/api.js';
  const apiTimer = setTimeout(apiFailed, 12000);
  function apiFailed() {
    clearTimeout(apiTimer);
    frames.forEach(frame => {
      const status = frame.closest('.soundcloud-entry').querySelector('.embed-status');
      status.firstChild.textContent = 'Shared controls could not connect. Use the embedded player or the external link. ';
    });
  }
  script.onerror = apiFailed;
  script.onload = () => {
    clearTimeout(apiTimer);
    if (!window.SC?.Widget) { apiFailed(); return; }
    frames.forEach(frame => {
      const entry = frame.closest('.soundcloud-entry');
      const status = entry.querySelector('.embed-status');
      const title = frame.dataset.title || 'Kiss My Ass';
      const widget = window.SC.Widget(frame);
      const record = { widget, frame, ready: false };
      records.push(record);
      function unavailable() {
        record.ready = false;
        entry.dataset.playerState = 'unavailable';
        status.firstChild.textContent = 'This archive track is unavailable here. ';
      }
      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.getCurrentSound(sound => {
          if (!sound?.id || !sound.title || !(sound.duration > 0) || sound.streamable === false) { unavailable(); return; }
          record.ready = true;
          entry.dataset.playerState = 'ready';
          widget.setVolume(currentVolume);
          status.firstChild.textContent = 'Ready to play. ';
          [volume, mute, pause].filter(Boolean).forEach(control => { control.disabled = false; });
        });
      });
      widget.bind(window.SC.Widget.Events.PLAY, () => {
        activeRecord = record;
        records.filter(other => other !== record).forEach(other => other.widget.pause());
        entry.dataset.playerState = 'playing';
        status.firstChild.textContent = 'Now playing. ';
        if (nowPlaying) nowPlaying.textContent = title;
      });
      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        if (entry.dataset.playerState !== 'playing') return;
        entry.dataset.playerState = 'ready';
        status.firstChild.textContent = 'Paused. ';
        if (nowPlaying && activeRecord === record) nowPlaying.textContent = 'Paused · ' + title;
      });
      widget.bind(window.SC.Widget.Events.FINISH, () => {
        entry.dataset.playerState = 'ready';
        status.firstChild.textContent = 'Play it again? ';
        if (nowPlaying && activeRecord === record) nowPlaying.textContent = 'Choose your next track';
      });
      widget.bind(window.SC.Widget.Events.ERROR || 'error', unavailable);
    });
  };
  syncControls();
  document.head.append(script);
})();
