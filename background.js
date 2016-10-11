Array.prototype.getLastVal = function (){ return this[this.length -1];}

function http_get(url, callback) {
  var xml_http = new XMLHttpRequest();
  xml_http.open("GET", url, false); // false for synchronous request
  xml_http.send(null);

  callback(xml_http.responseText);
}

// Page Action?
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (tab.url.indexOf('anitube') != -1) {
    //show page action
    chrome.pageAction.show(tabId);
  }
});

// Clicked?
chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {
    "code": "document.getElementsByClassName('mainBoxHeader')[0].innerHTML"
  }, function(results){

    var movie_title = results[0];
    var title_words = movie_title.split(" ");

    // 名前を空白でsplitし逆順でまわす
    for(var i=title_words.length-1; i>=0; i--){
      int_word = parseInt(title_words[i])
      // parseIntしてNaNでないならば
      if(!Number.isNaN(int_word)){
        title_words[i] = int_word + 1;
        break;
      }
    }

    var parameter = title_words.join("+");
    var reqest_url = "http://www.anitube.se/search/?search_id=" + parameter;
    
    // 次の動画ページにジャンプ
    http_get(reqest_url, function(html){
      parser = new DOMParser();
      dom = parser.parseFromString(html, "text/html");

      //検索して一番目の候補のURLを取得して返す
      next_movie_url = dom.querySelector(".videoThumb > a").href;
      chrome.tabs.update(null, {"url": next_movie_url});
    });
  });
});
