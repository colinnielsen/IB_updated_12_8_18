function renderFrames(params) {
  var hash = window.location.href.split('#')[1];
  var iframeLinks = {
    'edit': {
      1: 'francpairon.html',
      4: 'guypeellaert.html',
      6: 'zapa.html',
      7: 'cardin.html',
      8: 'contre-courant.html',
      9: 'thomaspozsgai.html'
    }
  }

  function createFrames(passedHash, params) {
    var selectedDiv;
    var i = document.createElement('iframe');

    if (passedHash) {
      selectedDiv = document.getElementById('slide' + passedHash);
    } else {
      selectedDiv = document.getElementById('slide' + hash);
    }

    i.scrolling = 'yes';
    i.sandbox = 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation';
    i.src = 'archive/edit/' + iframeLinks['edit'][passedHash];

    if (params == 'init') {
      i.addEventListener('load', addNeighboringFrames);
    }
    if (!selectedDiv.children.length) {
      selectedDiv.appendChild(i);
    }
  }

  function addNeighboringFrames() {
    var leftHash = (hash - 1);
    var rightHash = (hash + 1);
    var greatestKeyInSection;
    Object.keys(iframeLinks['edit']).map(function (key, index) {
      if (key > iframeLinks['edit'][index - 1]) {
        greatestKeyInSection = key;
      }
    });

    if (leftHash >= 0) {
      createFrames(leftHash);
    }
    if (rightHash <= greatestKeyInSection) {
      createFrames(rightHash);
    }
  }
  createFrames(undefined, params);
}
