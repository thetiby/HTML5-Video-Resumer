// Get informed about new elements
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
	for(var i = 0; i < mutations.length; i++) {
		var mutation = mutations[i];
		for(var j = 0; j < mutation.addedNodes.length; j++) {
			var node = mutation.addedNodes[j];
			if(node.nodeName == 'VIDEO') {
				videoAdded(node);
			}
		}
	}
});
observer.observe(document, {
	subtree: true,
	childList: true
});

// Find video in current elements
var elems = document.getElementsByTagName('VIDEO');
for(var i = 0; i < elems.length; i++) {
	var elem = elems[i];
	videoAdded(elem);
}

// Handle video
function videoAdded(video) {
	// Set variables
	video.resume_initialized = false; // If it has been tried to resume the video
	video.resume_last_saved_time = -1;

	// Register events
	video.addEventListener('loadedmetadata', videoUpdate);
	video.addEventListener('timeupdate', videoUpdate);
	video.addEventListener('playing', videoUpdate);
	video.addEventListener('pause', videoUpdate);

	video.addEventListener('ended', videoEnded);
}

// Video state has been updated
function videoUpdate(event) {
	var video = event.target;

	// Check if source is present
	var source = formatURL(video.currentSrc);
	if(source == '') {
		return;
	}

	// Save current time if initialized
	if(video.resume_initialized) {
		// Make sure to save max. 1x per second
		var time = Math.floor(video.currentTime); // Floor to not skip the last part of the second
		if(video.resume_last_saved_time != time) {
			video.resume_last_saved_time = time;

			// Save video time
			var save = {};
			save[source] = {
				time: time,
				date: Date.now()
			};
			chrome.storage.local.set(save);
		}
	}

	// Try to Resume
	else {
		// Load current time
		chrome.storage.local.get(source, function(save) {
			video.resume_initialized = true;

			// Update video time
			if(save[source] !== undefined) {
				video.currentTime = save[source].time;
			}
		});
	}
}

// Video finished
function videoEnded(event) {
	// Remove video from storage
	var video = event.target;
	var source = formatURL(video.currentSrc);
	chrome.storage.local.remove(source);
}

// Format URL
function formatURL(url) {
	// Strip parameters
	return url.split('?')[0];
}
