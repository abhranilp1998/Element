function icarusshow(event) {
    event.preventDefault();
    
    // Get the element with the class name "icarus-logo" (not tagName)
    var btnInfoElement = document.getElementById("icarus-logo");

    // Hide the button
    btnInfoElement.style.visibility = 'hidden';

    // Create a new <div> element for the overlay
    var overlayDiv = document.createElement("div");
    overlayDiv.className = "overlay";
    overlayDiv.style.position = "fixed";
    overlayDiv.style.top = "0";
    overlayDiv.style.left = "0";
    overlayDiv.style.width = "100%";
    overlayDiv.style.height = "100%";
    // overlayDiv.style.background = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black background
    overlayDiv.style.zIndex = "9998"; // Ensure the overlay is behind the content but above other elements

    // Create a new <div> element
    var newDiv = document.createElement("div");
    var icarus= document.createElement("img");
    newDiv.className= "icarus-div";
    icarus.src="assets/images/icarus.png";
    icarus.className= "icarus-img";

    newDiv.style.position = "fixed";
    newDiv.style.top = "50%";
    newDiv.style.left = "50%";
    newDiv.style.transform = "translate(-50%, -50%)";
    newDiv.style.zIndex = "9999";
    overlayDiv.style.backdropFilter = "blur(10px)"; // Apply backdrop filter to blur the entire page

    // Add the new <div> element to the page
    newDiv.appendChild(icarus);
    
    // Append the new div to the document body
    document.body.appendChild(overlayDiv);
    document.body.appendChild(newDiv);

    //exit
    overlayDiv,newDiv.addEventListener("click",function(event){
        document.body.removeChild(overlayDiv);
        document.body.removeChild(newDiv);

        btnInfoElement.style.visibility = 'visible';

    })
}

function goToTop(event){
    event.preventDefault;
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
