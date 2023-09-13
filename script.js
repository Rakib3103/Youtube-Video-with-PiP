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
  // Additional features can be added here
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
  const state = player.getPlayerState();
  if (state === 1) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
};

// Volume control
const volumeControl = document.createElement("input");
volumeControl.type = "range";
volumeControl.min = 0;
volumeControl.max = 100;
volumeControl.value = 50;
volumeControl.oninput = (event) => {
  player.setVolume(event.target.value);
};

// Mute button
const muteButton = document.createElement("button");
muteButton.innerText = "Mute/Unmute";
muteButton.onclick = () => {
  if (player.isMuted()) {
    player.unMute();
  } else {
    player.mute();
  }
};

// Add controls to video container
videoContainer.appendChild(playPauseButton);
videoContainer.appendChild(volumeControl);
videoContainer.appendChild(muteButton);

// Scroll event to toggle PiP mode
window.addEventListener("scroll", () => {
  if (!isInViewport(videoContainer)) {
    enablePiPMode();
  } else {
    disablePiPMode();
  }
});

// Exit PiP mode on click
videoContainer.addEventListener("click", function() {
  if (videoContainer.classList.contains("pip-mode")) {
    disablePiPMode();
  }
});
