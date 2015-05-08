if ((typeof module === 'object') && (typeof module.exports === 'object')) {
  module.exports = frequently;
} else {
  // we're in the browser without browserify, just let
  // frequently hang out as a function
}

function frequently(task, interval) {
  var timeout;
  var stopped = false;
  var goCallback;
  var runAgain = false;

  schedule();

  function go() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    return task(function() {
      if (goCallback) {
        goCallback.apply(this, arguments);
        goCallback = null;
      }
      schedule();
    });
  };

  function schedule() {
    if (runAgain) {
      timeout = setTimeout(go, 0);
      runAgain = false;
      return;
    }
    if ((!stopped) && (!timeout)) {
      timeout = setTimeout(go, interval);
    }
  }

  return {
    now: function(fn) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = setTimeout(go, 0);
      } else if (stopped) {
        timeout = setTimeout(go, 0);
      } else {
        runAgain = true;
      }
      stopped = false;
      goCallback = fn;
    },
    stop: function() {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      stopped = true;
    }
  };
}
