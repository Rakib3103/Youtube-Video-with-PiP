var player;

//YouTube API initialization
function onYouTubeIframeAPIReady() {
  player = new YT.Player('videoFrame', {
    events: {
      'onReady': onPlayerReady,           //This line sets up an event handler for the 'onReady' event of the YouTube player.
                                         //  When the player is ready, it will call the onPlayerReady function.
    }
  });
}

function onPlayerReady(event) {
  console.log("Player is ready.");      //Checking if player is ready
}

// Check if video container is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();                     // line calculates the position and dimensions of the specified element in perspective to the viewport.
  return rect.top >= 0 && rect.bottom <= window.innerHeight;        // returns a Boolean value (true or false) based on whether the element is in the viewport.
                                                                    //rect.top >= 0: if top edge of the element is at or below the top edge of the viewport. If YES then TRUE.
                                                                    //rect.bottom <= window.innerHeight: If the bottom edge of the element is at or above the bottom edge of the viewport. If YES then TRUE.
}

// Enable Picture-in-Picture (PiP) mode
function enablePiPMode() {
  videoContainer.classList.add("pip-mode");                         
}

// Disable Picture-in-Picture (PiP) mode
function disablePiPMode() {
  videoContainer.classList.remove("pip-mode");
}

const videoContainer = document.getElementById("videoContainer");

// Play/Pause button
const playPauseButton = document.createElement("button");
playPauseButton.innerText = "Play/Pause";
playPauseButton.onclick = () => {
  if (player && typeof player.getPlayerState === "function") {        // Checks if the function is available and passes 1 & 2 val
    const state = player.getPlayerState();
    if (state === 1) {                                                // if state === 1 then PLAY else if state === 2, then  PAUSE
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  } else {
    console.error("Player object not initialized or getPlayerState method not available.");
  }
};

// Volume control
const volumeControl = document.createElement("input");
volumeControl.type = "range";
volumeControl.min = 0;                                                // Defining volume ranges
volumeControl.max = 100;                                              // Defining volume ranges
volumeControl.value = 50;                                             // Defining volume ranges
volumeControl.oninput = (event) => {
  if (player && typeof player.setVolume === "function") {             // Ensuring set Volume exists
    player.setVolume(event.target.value);
  }
};

// Mute button
const muteButton = document.createElement("button");
muteButton.innerText = "Mute/Unmute";
muteButton.onclick = () => {
  if (player && typeof player.isMuted === "function") {       
    if (player.isMuted()) {
      player.unMute();
    } else {
      player.mute();
    }
  } else {
    console.error("Player object not initialized or mute-related methods not available.");
  }
};

// Add controls to video container this will be displayed inside the video container.
videoContainer.appendChild(playPauseButton);
videoContainer.appendChild(volumeControl);
videoContainer.appendChild(muteButton);

// For Flickering Issue I added a timer
let timer;

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;          // Checking if in view port
}

// Scroll event to toggle PiP mode and addition of debouncer
window.addEventListener("scroll", () => {                               // Sets up a scroll event listener on the window object.
  clearTimeout(timer);                                                  // To prevent multiple rapid executions of the code.

  timer = setTimeout(() => {                                             // Initializing new timeout code inside executes after 100 milliseconds delay.
    const scrolled = window.scrollY;                                     // Current vertical scroll position of the window
    const windowHeight = window.innerHeight;                             // Height of the visible portion of the browser window or viewport
    const docHeight = document.body.scrollHeight;                        // Gets the total height of the document (the entire web page)

    // Keep PiP mode if scrolling near the bottom
    if (docHeight - scrolled - windowHeight <= 100) {                    //checks if the user is scrolling near the bottom of the page. 
      return;                                                            // If the distance between the bottom of the document and the current scroll position is less than or equal to 100 pixels, it means the user is near the bottom of the page. In this case, the code doesnot toggle PiP mode. 
    }                                                                    // This condition likely ensures that PiP mode is maintained when the user is scrolling through the footer of the webpage.

    // Check if video is entirely in viewport
    if (isInViewport(videoContainer)) {
      disablePiPMode();
    } else {
      enablePiPMode();
    }
  }, 100);  // debounce for 100 milliseconds
});

// Exit PiP mode on click
videoContainer.addEventListener("click", function(event) {
  if (event.target === playPauseButton || event.target === muteButton || event.target === volumeControl) {
    return;  // Ignore clicks on play/pause and mute buttons
  }

  if (videoContainer.classList.contains("pip-mode")) {
    disablePiPMode();
  }
});

// Variables to store mouse position and PiP window position
let isDragging = false;
let initialMouseX;
let initialMouseY;
let initialWindowX;
let initialWindowY;

// Function to start dragging
function startDrag(event) {
  isDragging = true;
  initialMouseX = event.clientX;
  initialMouseY = event.clientY;
  initialWindowX = videoContainer.offsetLeft;
  initialWindowY = videoContainer.offsetTop;
}

// Function to stop dragging
function stopDrag() {
  isDragging = false;
}

// Function to handle dragging
function handleDrag(event) {
  if (isDragging) {
    const deltaX = event.clientX - initialMouseX;
    const deltaY = event.clientY - initialMouseY;
    const newWindowX = initialWindowX + deltaX;
    const newWindowY = initialWindowY + deltaY;
    
    // Setting the new position of the PiP window
    videoContainer.style.left = newWindowX + 'px';
    videoContainer.style.top = newWindowY + 'px';
  }
}

// Adding event listeners to enable dragging
videoContainer.addEventListener("mousedown", startDrag);
document.addEventListener("mouseup", stopDrag);
document.addEventListener("mousemove", handleDrag);

