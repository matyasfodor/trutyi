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

const element = string2HTML(`<button style="font-weight: 600">TRUTYI</button>`);
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
    console.log(response);
    element.disabled = false;
    //If you need a response, do stuff with it here
  });
});
parent.appendChild(element);