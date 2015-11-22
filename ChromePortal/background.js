chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('debug.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});
