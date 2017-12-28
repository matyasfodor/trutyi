// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

// TODO IIFE, strict mode;
var quizletWindow;
document.getElementById('quizlet-login').onclick = () => {
  var url = 'https://enigmatic-savannah-14867.herokuapp.com/auth/';
  quizletWindow = window.open(url, 'Quizlet auth', "height=600,width=1100");
};

window.addEventListener("message", function(message) {
  let {code} = message.data;
  quizletWindow.close();
  localStorage.setItem('myCat', 'Tom');
  console.log('message received: ', arguments)
}, false);
