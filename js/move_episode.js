// Clicked?
document.getElementById("next_button").addEventListener("click", function(){
  goto_episode(true);
});
document.getElementById("previous_button").addEventListener("click", function(){
  goto_episode(false);
});

// GETリクエストを投げてそのレスポンスに対して色々する関数
function http_get(url, callback) {
  var xml_http = new XMLHttpRequest();
  xml_http.open("GET", url, false);
  xml_http.send(null);

  callback(xml_http.responseText);
}

// 次または前のエピソードへ遷移する関数
function goto_episode(is_next){
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
          if(is_next){
            title_words[i] = int_word + 1;
          }else{
            title_words[i] = int_word - 1;
          }
          break;
        }
    }

    var parameter = title_words.join("+");
    var reqest_url = "http://www.anitube.se/search/?search_id=" + parameter;

    // 次の動画ページにジャンプ
    http_get(reqest_url, function(html){
      parser = new DOMParser();
      dom = parser.parseFromString(html, "text/html");
      next_episode_url = dom.querySelector(".videoThumb > a").href;
      chrome.tabs.update(null, {"url": next_episode_url});
    });
  });
}
