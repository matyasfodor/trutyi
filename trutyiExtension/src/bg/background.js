// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
const STATE = {
  accessToken: null,
  userId: null,
  selectedSet: null,
};

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
      fetch('https://enigmatic-savannah-14867.herokuapp.com/terms/', {
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

window.addEventListener("message", (message) => {
  let {access_token} = message.data;
  quizletWindow.close();
  localStorage.setItem('quizlet_access_token', access_token);
  localStorage.setItem('quizlet_user_id', message.data.user_id);
  STATE.accessToken = message.data.access_token;
  STATE.userId = message.data.user_id;
}, false);
