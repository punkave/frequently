var assert = require("assert");
var frequently = require("../index.js");
describe('frequently', function() {

  it('runs a function at approx 100ms intervals', function(done) {
    var count = 0;
    var testTask = frequently(doTestTask, 100);
    function doTestTask(callback) {
      count++;
      return setImmediate(callback);
    }
    setTimeout(function() {
      assert(count >= 5);
      assert(count <= 7);
      testTask.stop();
      done();
    }, 600);
  });

  it('stops running function after stop is called', function(done) {
    var count = 0;
    var testTask = frequently(doTestTask, 100);
    function doTestTask(callback) {
      count++;
      if (count === 3) {
        testTask.stop();
      }
      return setImmediate(callback);
    }
    setTimeout(function() {
      assert(count === 3);
      done();
    }, 600);
  });

  it('resumes running function when "now" is called after "stop"', function(done) {
    var count = 0;
    var testTask = frequently(doTestTask, 100);
    function doTestTask(callback) {
      count++;
      if (count === 3) {
        testTask.stop();
        testTask.now();
      }
      return setImmediate(callback);
    }
    setTimeout(function() {
      assert(count >= 5);
      assert(count <= 7);
      testTask.stop();
      done();
    }, 600);
  });

  it('"now" does not result in overlapping calls in progress', function(done) {
    var count = 0;

    var testTask = frequently(doTestTask, 100);

    var active = 0;

    function doTestTask(callback) {
      if (active) {
        // overlapping invocations = bad
        assert(false);
      }
      active++;
      count++;
      return setTimeout(function() {
        active--;
        return callback();
        // take 50ms to complete so we have time
        // to create a possible overlap
      }, 50);
    }

    // after 125ms invoke "now"; the first
    // invocation should already be in progress
    setTimeout(function() {
      testTask.now();
    }, 125);

    // after 260ms there should be two completed
    // invocations (but also note the assert above
    // to check for overlap)
    setTimeout(function() {
      assert(count === 2);
      testTask.stop();
      done();
    }, 260);
  });

  it('"now" callback receives parameters passed to task callback', function(done) {

    var count = 0;

    var testTask = frequently(doTestTask, 50);

    function doTestTask(callback) {
      count++;
      return setTimeout(function() {
        return callback(count);
      }, 0);
    }

    // after 75ms invoke "now"; should
    // receive the argument passed to the
    // task callback, and only be called once
    setTimeout(function() {
      var called = 0;
      testTask.now(function(arg) {
        called++;
        assert(called === 1);
        assert(arg === 2);
      });
    }, 75);

    // Let it run for numerous invocations
    // before stopping
    setTimeout(function() {
      testTask.stop();
      done();
    }, 500);
  });
});

