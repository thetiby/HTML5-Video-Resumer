// Remove expired videos
function clearVideos() {
	// Calculate time
	var expireTime = 1000 * 60 * 60 * 24 * 30; // 1 Month
	var minDate = Date.now() - expireTime;

	// Iterate videos
	chrome.storage.local.get(null, function(items) {
		for(var key in items) {
			if(items.hasOwnProperty(key)) {
				var item = items[key];
				if(item.date < minDate) {
					storageRemoveVideo(key);
				}
			}
		}
	});
}

// Run on startup
chrome.runtime.onStartup.addListener(function() {
	clearVideos();
});
