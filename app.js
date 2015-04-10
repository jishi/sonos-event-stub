'use strict';

var SonosDiscovery = require('sonos-discovery');

var discovery = new SonosDiscovery();

var coordinator;
var roomName = 'Office';
var stopTimer;
var stopTimeout = 3000; // in ms, eq 30 seconds
var isActive;

// You can't get the player unless it has been discovered
// On first topology-change, you will have found your system
discovery.on('topology-change', function () {
  // remove event handler if topology changes
  if (coordinator)
    coordinator.removeListener('transport-state', transportChangeHandler);

  console.log('fetching player Office');
  var player = discovery.getPlayer('Office');
  coordinator = player.coordinator;
  coordinator.on('transport-state', transportChangeHandler);
});

function transportChangeHandler(transportData) {
  var state = transportData.state;
  if (!isActive && state.playerState == 'PLAYING') {
    // Player is started, or is playing
    console.log('Player is active');
    isActive = true; // use this flag to know if the stop state is the first one after play.
    clearTimeout(stopTimer);

    // ADD code for starting playback here

    return;
  }

  if (isActive && (state.playerState == 'STOPPED' || state.playerState == 'PAUSED_PLAYBACK')) {
    clearTimeout(stopTimer);
    isActive = false;
    console.log('queueing a stop signal');
    stopTimer = setTimeout(stopHandler, stopTimeout);
  }
}

function stopHandler() {
  console.log('Player has been stopped for', stopTimeout, 'seconds');
  // ADD code for stop here
}