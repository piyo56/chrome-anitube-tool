
// Page Action?
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (tab.url.indexOf('anitube') != -1) {
    //show page action
    chrome.pageAction.show(tabId);
  }
});

// Clicked?
chrome.pageAction.onClicked.addListener(function(tab) {
});
