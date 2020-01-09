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
	video.addEventListener('seeked', videoUpdate);
	video.addEventListener('playing', videoUpdate);
	video.addEventListener('play', videoUpdate);
	video.addEventListener('pause', videoUpdate);

	video.addEventListener('ended', videoEnded);
}

// Video state has been updated
function videoUpdate(event) {
	var video = event.target;
	var time = Math.floor(video.currentTime); // Floor to not skip the last part of the second
	history.replaceState(null, document.title, location.href.replace(/(\&t=\d+)|$/, `&t=${time}`))
}
