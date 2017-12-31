chrome.extension.sendMessage({
  from: 'content',
  action: 'show_page_action',
}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);

    // ----------------------------------------------------------
    // This part of the script triggers when page is done loading
    console.log("Hello. This message was sent from scripts/inject.js");
    // ----------------------------------------------------------

  }
  }, 10);
});

function string2HTML(string) {
  var div = document.createElement('div');
  div.innerHTML = string;
  return div.firstChild;
}

var parent = document.getElementById('gt-res-tools-l');

const url = chrome.extension.getURL('icons/icon48.png');
const element = string2HTML(`<div id="trutyi-button" class="goog-toolbar-button" style="float: left;" data-tooltip-align="t,c" data-tooltip="Trutyi"><a title="Trutyi"><img src="${url}" style="max-width: 26px;"></img></a></div>`);
element.addEventListener('click', function(e) {
  element.disabled = true;
  e.preventDefault();
  var payload = {
    term: document.getElementById('source').value,
    definition: document.getElementById('result_box').textContent,
  };
  chrome.runtime.sendMessage({
    from: 'content',
    action: 'add_term',
    payload: payload,
  }, function(response){
    if (response.success) {
      console.log('ok');
    } else {
      console.log('nok');
    }
    element.disabled = false;
  });
});

parent.appendChild(element);
