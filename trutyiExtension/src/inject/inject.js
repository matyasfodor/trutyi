chrome.extension.sendMessage({}, function(response) {
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

// div.innerHTML = `<div id="gt-res-cucucu" class="share-button goog-toolbar-button"style="user-select: none;">
// 		<span style="font-weight: 600">TRUTYI</span>
// </div>`;
element = string2HTML(`<button style="font-weight: 600">TRUTYI</button>`);
element.addEventListener('click', function(e) {
	e.preventDefault();
	var payload = {
		term: document.getElementById('source').value,
		definition: document.getElementById('result_box').textContent,
	};

	fetch('https://enigmatic-savannah-14867.herokuapp.com/terms/', {
		method: 'POST',
		body: JSON.stringify(payload),
	}).then(() => {
	}, (a) => {
	})
});
parent.appendChild(element);