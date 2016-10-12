name_key = "episode_name";
url_key = "episode_url";
current_url = "";

// Clicked?
// 動かない！わからない！
document.addEventListener('DOMContentLoaded', function(){

  chrome.tabs.query({"active": true, currentWindow:true}, function(tabs){
    console.log(tabs[0].url.indexOf('anitube'));
    if(tabs[0].url.indexOf('anitube') != -1){
      document.getElementById("save_button").disabled     = false;
      document.getElementById("next_button").disabled     = false;
      document.getElementById("previous_button").disabled = false;
    }else{
      document.getElementById("save_button").disabled     = true;
      document.getElementById("next_button").disabled     = true;
      document.getElementById("previous_button").disabled = true;
    }
  });

  var episode_name = JSON.parse(localStorage.getItem(name_key));
  if (episode_name){
    document.getElementById("saved_episode_name").innerHTML = episode_name;
  }else{
    document.getElementById("load_button").disabled = true;
  }
});

// Clicked?
document.getElementById("save_button").addEventListener("click", function(){
  save_episode();
});
document.getElementById("load_button").addEventListener("click", function(){
  load_episode();
});

function save_episode() { 
  console.log("save");
  chrome.tabs.query({"active": true, currentWindow:true}, function(tabs){
    chrome.tabs.executeScript(null, {
      "code": "document.getElementsByClassName('mainBoxHeader')[0].innerHTML"
    }, function(results){
      //console.log("results", results);
      if(tabs.length == 0 || !results[0]) {
        console.info("failed to save! :(");
        return;
      }
      // save episode
      localStorage.setItem(url_key, JSON.stringify(tabs[0].url));
      localStorage.setItem(name_key, JSON.stringify(results[0]));
      document.getElementById("load_button").disabled = false;
      document.getElementById("saved_episode_name").innerHTML = results[0];
    });
  });
};

function load_episode() {
  var saved_url = JSON.parse(localStorage.getItem(url_key));
  console.log("load", saved_url);
  if(saved_url){
    chrome.tabs.create({"url": saved_url, "active": true});
  }
};
