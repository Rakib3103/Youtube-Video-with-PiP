var player;

// YouTube API initialization
function onYouTubeIframeAPIReady() {
  player = new YT.Player('videoFrame', {
    events: {
      'onReady': onPlayerReady,
    }
  });
}

function onPlayerReady(event) {
  console.log("Player is ready.");
}

// Check if video container is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

// Enable Picture-in-Picture mode
function enablePiPMode() {
  videoContainer.classList.add("pip-mode");
}

// Disable Picture-in-Picture mode
function disablePiPMode() {
  videoContainer.classList.remove("pip-mode");
}

const videoContainer = document.getElementById("videoContainer");

// Play/Pause button
const playPauseButton = document.createElement("button");
playPauseButton.innerText = "Play/Pause";
playPauseButton.onclick = () => {
  if (player && typeof player.getPlayerState === "function") {
    const state = player.getPlayerState();
    if (state === 1) {
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
volumeControl.min = 0;
volumeControl.max = 100;
volumeControl.value = 50;
volumeControl.oninput = (event) => {
  if (player && typeof player.setVolume === "function") {
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

// Add controls to video container
videoContainer.appendChild(playPauseButton);
videoContainer.appendChild(volumeControl);
videoContainer.appendChild(muteButton);

let timer;

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

// Scroll event to toggle PiP mode
window.addEventListener("scroll", () => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    const scrolled = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.body.scrollHeight;

    // Keep PiP mode if scrolling near the bottom
    if (docHeight - scrolled - windowHeight <= 100) {
      return;
    }

    // Check if video is entirely in viewport
    if (isInViewport(videoContainer)) {
      disablePiPMode();
    } else {
      enablePiPMode();
    }
  }, 100);  // debounce for 100 milliseconds
});


// Exit PiP mode on click
// Exit PiP mode on click
videoContainer.addEventListener("click", function(event) {
  if (event.target === playPauseButton || event.target === muteButton || event.target === volumeControl) {
    return;  // Ignore clicks on play/pause and mute buttons
  }

  if (videoContainer.classList.contains("pip-mode")) {
    disablePiPMode();
  }
});

