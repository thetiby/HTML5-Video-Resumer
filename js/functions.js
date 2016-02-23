/* Chrome Storage */
// Save video
function storageSetVideo(source, obj) {
	var save = {};
	save[source] = obj;
	chrome.storage.local.set(save);
}

// Get video
function storageGetVideo(source, callback) {
	chrome.storage.local.get(source, callback);
}

// Remove video
function storageRemoveVideo(source) {
	chrome.storage.local.remove(source);
}
