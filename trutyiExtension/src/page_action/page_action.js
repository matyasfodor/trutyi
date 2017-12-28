document.getElementById('open-extension').onclick = () => {
  chrome.tabs.create({url: window.location.origin + '/src/bg/background.html'});
}
