// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
const STATE = {
  accessToken: null,
  userId: null,
  selectedSet: null,
  sets: [],
};

function startup() {
  STATE.accessToken = localStorage.getItem('quizlet_access_token') || null;
  STATE.userId = localStorage.getItem('quizlet_user_id') || null;
  if (STATE.accessToken) {
    document.getElementById('quizlet-login').disabled = true;
    document.getElementById('state').innerHTML = 'Logged in';
  } else {
    document.getElementById('quizlet-logout').disabled = true;
    document.getElementById('state').innerHTML = 'Logged out';
  }
  loadSets();
}
const backend = 'https://enigmatic-savannah-14867.herokuapp.com';
//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.from == 'content' && request.action == 'show_page_action') {
      chrome.pageAction.show(sender.tab.id);
      sendResponse();
    } else if (request.from == 'content' && request.action == 'add_term') {
      var payload = request.payload;
      payload.access_token = STATE.accessToken;
      payload.set_id = STATE.selectedSet;
      fetch(backend + '/terms/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }).then(() => {sendResponse('OK');}, () => {sendResponse('NOK');})
    }
  });

// TODO IIFE, strict mode;
var quizletWindow;
document.getElementById('quizlet-login').onclick = () => {
  var url = backend + '/auth/';
  quizletWindow = window.open(url, 'Quizlet auth', "height=600,width=1100");
};


document.getElementById('quizlet-logout').onclick = () => {
  STATE.accessToken = null;
  STATE.userId = null;
  STATE.sets = null;
  STATE.selectedSet = null;
  localStorage.clear();
  window.location.reload();
}

window.addEventListener("message", (message) => {
  let {access_token} = message.data;
  quizletWindow.close();
  localStorage.setItem('quizlet_access_token', access_token);
  localStorage.setItem('quizlet_user_id', message.data.user_id);
  STATE.accessToken = message.data.access_token;
  STATE.userId = message.data.user_id;
  loadSets();
}, false);


function loadSets() {
  if (!STATE.userId) return;
  var url = backend + '/sets/?user_id=' + STATE.userId;
  fetch(url, {
    headers: {
      Authorization: 'Bearer ' + STATE.accessToken,
    },
  }).then((v) => {
    v.json().then((data) => {
      STATE.sets = data;
      // Or not in the list
      if (!STATE.selectedSet) {
        STATE.selectedSet = data[0].id;
      }
      renderSets();
    })
  })
}

function string2HTML(string) {
  var div = document.createElement('div');
  div.innerHTML = string;
  return div.firstChild;
}


function renderSets() {
  var container = document.getElementById('sets');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  STATE.sets.forEach((set) => {
    var element = string2HTML('<li>' + set.title + '</li>');
    element.dataset.set = JSON.stringify(set);
    element.onclick = (v) => {
      let set = JSON.parse(v.target.dataset.set)
      STATE.selectedSet = set.id;
      renderSets();
    }
    if (set.id === STATE.selectedSet) {
      element.style = 'font-weight: bold';
    }
    container.appendChild(element)
  })
}

startup();
