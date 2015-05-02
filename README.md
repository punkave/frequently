# frequently

<a href="http://apostrophenow.org/"><img src="https://raw.githubusercontent.com/punkave/frequently/master/logos/logo-box-madefor.png" align="right" /></a>

*frequently* is handy for implementing "background save," or any time you want something to happen "every so often, plus when I want it, but never simultaneously."

## Example

```javascript
var frequently = require('frequently');

var save = frequently(doSave, 5000);

function doSave(callback) {
  // Carry out an async save operation, then...
  return callback(null);
}

// Now we're saving every 5 seconds. But we
// can also save on demand, without the
// risk of simultaneous saves in progress

function saveRightNow() {
  save.now(function(err) {
    if (err) {
      // ... Oh no
    } else {
      // ... Go ahead and do something that
      // should always follow save

      // We want to stop autosaving now
      frequently.stop();

      // We changed our minds, save now
      // and start autosaving again
      frequently.now();
    }
  });
}
```

## Usage

`frequently(fn)`

Calls the given function every `interval` milliseconds,
plus any time the function actually takes. The function
must invoke a callback.

Returns an object with `now` and `stop` methods. If the `now`
method is called, a new call to the function is scheduled
to happen as soon as possible, after any call that may
already be in progress. If a function is passed to
`now`, any parameters passed to the callback of `task`
are passed on to that function.

If several calls to `now()` are made before the
first results in an invocation of `task`, only the last invocation actually takes place. This prevents "slamming" of the server.

There is also a `stop` method which prevents any further
calls from being scheduled at intervals.

Calling `now` after `stop` will schedule an immediate invocation of `task` and then begin invoking it at intervals again.

The function's first invocation does not take place until
at least `interval` milliseconds pass or `now()` is called.

## In the browser

`frequently` is designed to work in the browser with or without `browserify`. In the absence of `browserify`, `frequently` just becomes a global function.

## About P'unk Avenue and Apostrophe

`frequently` was created at [P'unk Avenue](http://punkave.com) for use in many projects built with Apostrophe, an open-source content management system built on node.js. If you like `frequently` you should definitely [check out apostrophenow.org](http://apostrophenow.org).

## Support

Feel free to open issues on [github](http://github.com/punkave/frequently).

<a href="http://punkave.com/"><img src="https://raw.githubusercontent.com/punkave/frequently/master/logos/logo-box-builtby.png" /></a>

## Changelog

### CHANGES IN 0.1.0

Initial release. With shiny unit tests, of course.
