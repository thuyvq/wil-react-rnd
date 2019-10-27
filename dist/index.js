'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

var regenerator = runtime_1;

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".styles_container__2pRR5 {\n  position: fixed;\n  z-index: 9998;\n  user-select: none;\n  will-change: top, left, width, height;\n}\n\n.styles_overlay__CLSq- {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n}\n\n.styles_itemDraggable__2Vdtp {\n  cursor: move;\n}\n\n.styles_right__1THUQ {\n  position: absolute;\n  top: 0;\n  right: -6px;\n  bottom: 0;\n  z-index: 999;\n  width: 12px;\n  cursor: ew-resize;\n}\n\n.styles_left__1QLwJ {\n  position: absolute;\n  top: 0;\n  left: -6px;\n  bottom: 0;\n  z-index: 999;\n  width: 12px;\n  cursor: ew-resize;\n}\n\n.styles_bottom__1CYW9 {\n  position: absolute;\n  left: 0;\n  bottom: -6px;\n  right: 0;\n  z-index: 999;\n  height: 12px;\n  cursor: ns-resize;\n}\n\n.styles_top__1as09 {\n  position: absolute;\n  left: 0;\n  top: -6px;\n  right: 0;\n  z-index: 999;\n  height: 12px;\n  cursor: ns-resize;\n}\n\n.styles_topRight__39a0w {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  z-index: 999;\n  width: 16px;\n  height: 16px;\n  cursor: nesw-resize;\n}\n\n.styles_topLeft__HUW5l {\n  position: absolute;\n  top: -8px;\n  left: -8px;\n  z-index: 999;\n  width: 16px;\n  height: 16px;\n  cursor: nwse-resize;\n}\n\n.styles_bottomRight__wprib {\n  position: absolute;\n  bottom: -8px;\n  right: -8px;\n  z-index: 999;\n  width: 16px;\n  height: 16px;\n  cursor: nwse-resize;\n}\n\n.styles_bottomLeft__-4BZv {\n  position: absolute;\n  bottom: -8px;\n  left: -8px;\n  z-index: 999;\n  width: 16px;\n  height: 16px;\n  cursor: nesw-resize;\n}\n";
var styles = {"container":"styles_container__2pRR5","overlay":"styles_overlay__CLSq-","itemDraggable":"styles_itemDraggable__2Vdtp","right":"styles_right__1THUQ","left":"styles_left__1QLwJ","bottom":"styles_bottom__1CYW9","top":"styles_top__1as09","topRight":"styles_topRight__39a0w","topLeft":"styles_topLeft__HUW5l","bottomRight":"styles_bottomRight__wprib","bottomLeft":"styles_bottomLeft__-4BZv"};
styleInject(css);

var WilRnd =
/*#__PURE__*/
function (_Component) {
  _inherits(WilRnd, _Component);

  function WilRnd() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, WilRnd);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WilRnd)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      measure: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      isStartDraggable: false,
      isStartResizable: false,
      resizeCurrent: "",
      currentOffsetY: 0,
      currentOffsetX: 0,
      hasZIndex: false
    });

    _defineProperty(_assertThisInitialized(_this), "els", {
      $container: null,
      $draggable: null,
      $top: null,
      $right: null,
      $bottom: null,
      $left: null,
      $topRight: null,
      $bottomRight: null,
      $bottomLeft: null,
      $topLeft: null
    });

    _defineProperty(_assertThisInitialized(_this), "debounce", null);

    _defineProperty(_assertThisInitialized(_this), "_getEvent", function (event) {
      return event.touches ? event.touches[0] : event;
    });

    _defineProperty(_assertThisInitialized(_this), "_getOffset", function (event) {
      var clientRect = event.target.getBoundingClientRect();
      return event.touches ? {
        offsetX: event.touches[0].pageX - clientRect.left,
        offsetY: event.touches[0].pageY - clientRect.top
      } : {
        offsetX: event.offsetX,
        offsetY: event.offsetY
      };
    });

    _defineProperty(_assertThisInitialized(_this), "_handleStartDragging", function (event) {
      var _this$_getOffset = _this._getOffset(event),
          offsetX = _this$_getOffset.offsetX,
          offsetY = _this$_getOffset.offsetY;

      _this.setState({
        currentOffsetY: offsetY,
        currentOffsetX: offsetX
      });

      _this._handleStartDraggable(event);

      _this._handleStartResize(event, "top");

      _this._handleStartResize(event, "right");

      _this._handleStartResize(event, "bottom");

      _this._handleStartResize(event, "left");

      _this._handleStartResize(event, "topRight");

      _this._handleStartResize(event, "topLeft");

      _this._handleStartResize(event, "bottomRight");

      _this._handleStartResize(event, "bottomLeft");
    });

    _defineProperty(_assertThisInitialized(_this), "_handleStartDraggable", function (event) {
      var onDragStart = _this.props.onDragStart;

      var measure = _this._getMeasure();

      if (_this.els.$draggable) {
        _this.setState({
          isStartDraggable: _this.els.$draggable.contains(event.target)
        });
      }

      if (_this.els.$draggable && _this.els.$draggable.contains(event.target)) {
        onDragStart(measure);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_handleStartResize", function (event, type) {
      var onResizeStart = _this.props.onResizeStart;

      var measure = _this._getMeasure();

      var $type = "$".concat(type);

      if (_this.els[$type] && _this.els[$type].contains(event.target)) {
        _this.setState({
          resizeCurrent: type,
          isStartResizable: true
        });

        onResizeStart(type, measure);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_handleMouseMove",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee(event) {
        var _this$state, isStartResizable, resizeCurrent, isStartDraggable, _this$_getEvent, pageX, pageY, containerClientRect, width, height;

        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$state = _this.state, isStartResizable = _this$state.isStartResizable, resizeCurrent = _this$state.resizeCurrent, isStartDraggable = _this$state.isStartDraggable;

                if (!_this.els.$container) {
                  _context.next = 39;
                  break;
                }

                _this$_getEvent = _this._getEvent(event), pageX = _this$_getEvent.pageX, pageY = _this$_getEvent.pageY;
                containerClientRect = _this.els.$container.getBoundingClientRect();
                width = containerClientRect.width, height = containerClientRect.height;

                if (!isStartDraggable) {
                  _context.next = 9;
                  break;
                }

                _context.next = 8;
                return _this._handleDragging(pageX, pageY, width, height, containerClientRect);

              case 8:
                _this._handlePropOnDrag();

              case 9:
                if (!isStartResizable) {
                  _context.next = 39;
                  break;
                }

                _context.t0 = resizeCurrent;
                _context.next = _context.t0 === "top" ? 13 : _context.t0 === "right" ? 16 : _context.t0 === "bottom" ? 19 : _context.t0 === "left" ? 22 : _context.t0 === "topRight" ? 25 : _context.t0 === "bottomRight" ? 28 : _context.t0 === "bottomLeft" ? 31 : _context.t0 === "topLeft" ? 34 : 37;
                break;

              case 13:
                _context.next = 15;
                return _this._handleResizeTop(pageY);

              case 15:
                return _context.abrupt("break", 38);

              case 16:
                _context.next = 18;
                return _this._handleResizeRight(pageX);

              case 18:
                return _context.abrupt("break", 38);

              case 19:
                _context.next = 21;
                return _this._handleResizeBottom(pageY);

              case 21:
                return _context.abrupt("break", 38);

              case 22:
                _context.next = 24;
                return _this._handleResizeLeft(pageX);

              case 24:
                return _context.abrupt("break", 38);

              case 25:
                _context.next = 27;
                return Promise.all([_this._handleResizeTop(pageY), _this._handleResizeRight(pageX)]);

              case 27:
                return _context.abrupt("break", 38);

              case 28:
                _context.next = 30;
                return Promise.all([_this._handleResizeBottom(pageY), _this._handleResizeRight(pageX)]);

              case 30:
                return _context.abrupt("break", 38);

              case 31:
                _context.next = 33;
                return Promise.all([_this._handleResizeBottom(pageY), _this._handleResizeLeft(pageX)]);

              case 33:
                return _context.abrupt("break", 38);

              case 34:
                _context.next = 36;
                return Promise.all([_this._handleResizeTop(pageY), _this._handleResizeLeft(pageX)]);

              case 36:
                return _context.abrupt("break", 38);

              case 37:
                return _context.abrupt("break", 38);

              case 38:
                _this._handlePropOnResize();

              case 39:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "_handlePropOnDrag", function () {
      var onDrag = _this.props.onDrag;

      var measure = _this._getMeasure();

      onDrag(measure);
    });

    _defineProperty(_assertThisInitialized(_this), "_handlePropOnResize", function () {
      var _this$props = _this.props,
          onResize = _this$props.onResize,
          onResizeDebounce = _this$props.onResizeDebounce,
          timeDebounce = _this$props.timeDebounce;

      var measure = _this._getMeasure();

      onResize(measure);
      clearTimeout(_this.debounce);
      _this.debounce = setTimeout(function () {
        onResizeDebounce(measure);
      }, timeDebounce);
    });

    _defineProperty(_assertThisInitialized(_this), "_handleResizeRight",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee2(pageX) {
        var widthRange, measure, width;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                widthRange = _this.props.widthRange;
                measure = _this._getMeasure();
                width = pageX - measure.left;

                if (!(width > widthRange[0] && width < widthRange[1])) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 6;
                return _this.setState({
                  measure: _objectSpread2({}, measure, {
                    width: width
                  })
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "_handleResizeBottom",
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee3(pageY) {
        var heightRange, measure, height;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                heightRange = _this.props.heightRange;
                measure = _this._getMeasure();
                height = pageY - measure.top;

                if (!(height > heightRange[0] && height < heightRange[1])) {
                  _context3.next = 6;
                  break;
                }

                _context3.next = 6;
                return _this.setState({
                  measure: _objectSpread2({}, measure, {
                    height: height
                  })
                });

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "_handleResizeLeft",
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee4(pageX) {
        var widthRange, measure, width;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                widthRange = _this.props.widthRange;
                measure = _this._getMeasure();
                width = measure.width + measure.left - pageX;

                if (!(width > widthRange[0] && width < widthRange[1])) {
                  _context4.next = 6;
                  break;
                }

                _context4.next = 6;
                return _this.setState({
                  measure: _objectSpread2({}, measure, {
                    left: pageX,
                    width: width
                  })
                });

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "_handleResizeTop",
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee5(pageY) {
        var heightRange, measure, height;
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                heightRange = _this.props.heightRange;
                measure = _this._getMeasure();
                height = measure.height + measure.top - pageY;

                if (!(height > heightRange[0] && height < heightRange[1])) {
                  _context5.next = 6;
                  break;
                }

                _context5.next = 6;
                return _this.setState({
                  measure: _objectSpread2({}, measure, {
                    top: pageY,
                    height: height
                  })
                });

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "_handleDragging",
    /*#__PURE__*/
    function () {
      var _ref6 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee6(pageX, pageY, width, height, containerClientRect) {
        var _this$state2, currentOffsetY, currentOffsetX, itemDragClientRect, top, left;

        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _this$state2 = _this.state, currentOffsetY = _this$state2.currentOffsetY, currentOffsetX = _this$state2.currentOffsetX;

                if (!_this.els.$draggable) {
                  _context6.next = 7;
                  break;
                }

                itemDragClientRect = _this.els.$draggable.getBoundingClientRect();
                top = pageY - currentOffsetY - (itemDragClientRect.top - containerClientRect.top);
                left = pageX - currentOffsetX - (itemDragClientRect.left - containerClientRect.left);
                _context6.next = 7;
                return _this.setState({
                  measure: {
                    top: top,
                    left: left,
                    width: width,
                    height: height
                  }
                });

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      return function (_x6, _x7, _x8, _x9, _x10) {
        return _ref6.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "_handleStopDragging", function (event) {
      var onEnd = _this.props.onEnd;

      var measure = _this._getMeasure();

      _this.setState({
        isStartDraggable: false,
        isStartResizable: false,
        resizeCurrent: ""
      });

      if (_this.els.$draggable && _this.els.$draggable.contains(event.target) || _this.els.$top && _this.els.$top.contains(event.target) || _this.els.$right && _this.els.$right.contains(event.target) || _this.els.$bottom && _this.els.$bottom.contains(event.target) || _this.els.$left && _this.els.$left.contains(event.target) || _this.els.$topRight && _this.els.$topRight.contains(event.target) || _this.els.$bottomRight && _this.els.$bottomRight.contains(event.target) || _this.els.$bottomLeft && _this.els.$bottomLeft.contains(event.target) || _this.els.$topLeft && _this.els.$topLeft.contains(event.target)) {
        onEnd(measure);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_setRef", function (el) {
      return function (c) {
        _this.els[el] = c;
      };
    });

    _defineProperty(_assertThisInitialized(_this), "_handleChildrenParam", function () {
      var _this$state3 = _this.state,
          isStartDraggable = _this$state3.isStartDraggable,
          isStartResizable = _this$state3.isStartResizable;

      var measure = _this._getMeasure();

      return {
        dragRef: _this._setRef("$draggable"),
        measure: measure,
        isStartDraggable: isStartDraggable,
        isStartResizable: isStartResizable
      };
    });

    _defineProperty(_assertThisInitialized(_this), "_setHasZIndex", function (value) {
      return function () {
        _this.setState({
          hasZIndex: value
        });
      };
    });

    _defineProperty(_assertThisInitialized(_this), "_checkLeft", function (left) {
      var dragHorizontalRange = _this.props.dragHorizontalRange;

      if (left <= dragHorizontalRange[0]) {
        return dragHorizontalRange[0];
      }

      if (left >= dragHorizontalRange[1]) {
        return dragHorizontalRange[1];
      }

      return left;
    });

    _defineProperty(_assertThisInitialized(_this), "_checkTop", function (top) {
      var dragVerticalRange = _this.props.dragVerticalRange;

      if (top <= dragVerticalRange[0]) {
        return dragVerticalRange[0];
      }

      if (top >= dragVerticalRange[1]) {
        return dragVerticalRange[1];
      }

      return top;
    });

    _defineProperty(_assertThisInitialized(_this), "_getMeasure", function () {
      var measure = _this.state.measure;
      var top = measure.top,
          left = measure.left,
          width = measure.width,
          height = measure.height;
      return {
        top: _this._checkTop(top),
        left: _this._checkLeft(left),
        width: width,
        height: height
      };
    });

    _defineProperty(_assertThisInitialized(_this), "_getStyles", function () {
      var _this$state4 = _this.state,
          hasZIndex = _this$state4.hasZIndex,
          isStartDraggable = _this$state4.isStartDraggable;

      var measure = _this._getMeasure();

      var top = measure.top,
          left = measure.left,
          width = measure.width,
          height = measure.height;
      return _objectSpread2({
        outline: "none",
        top: isStartDraggable ? 0 : top,
        left: isStartDraggable ? 0 : left
      }, isStartDraggable ? {
        transform: "translate(".concat(left, "px, ").concat(top, "px)")
      } : {}, {
        width: width,
        height: height
      }, hasZIndex ? {
        zIndex: 10000
      } : {});
    });

    _defineProperty(_assertThisInitialized(_this), "_renderItemResize", function () {
      return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
        ref: _this._setRef("$top"),
        className: styles.top
      }), React__default.createElement("div", {
        ref: _this._setRef("$right"),
        className: styles.right
      }), React__default.createElement("div", {
        ref: _this._setRef("$bottom"),
        className: styles.bottom
      }), React__default.createElement("div", {
        ref: _this._setRef("$left"),
        className: styles.left
      }), React__default.createElement("div", {
        ref: _this._setRef("$topRight"),
        className: styles.topRight
      }), React__default.createElement("div", {
        ref: _this._setRef("$topLeft"),
        className: styles.topLeft
      }), React__default.createElement("div", {
        ref: _this._setRef("$bottomRight"),
        className: styles.bottomRight
      }), React__default.createElement("div", {
        ref: _this._setRef("$bottomLeft"),
        className: styles.bottomLeft
      }));
    });

    return _this;
  }

  _createClass(WilRnd, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var defaultMeasure = this.props.defaultMeasure;
      this.setState({
        measure: defaultMeasure
      });

      if (this.els.$draggable) {
        this.els.$draggable.classList.add(styles.itemDraggable);
      }

      window.addEventListener("mousedown", this._handleStartDragging);
      window.addEventListener("touchstart", this._handleStartDragging);
      window.addEventListener("mousemove", this._handleMouseMove);
      window.addEventListener("touchmove", this._handleMouseMove);
      window.addEventListener("mouseup", this._handleStopDragging);
      window.addEventListener("touchend", this._handleStopDragging);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("mousedown", this._handleStartDragging);
      window.removeEventListener("touchstart", this._handleStartDragging);
      window.removeEventListener("mousemove", this._handleMouseMove);
      window.removeEventListener("touchmove", this._handleMouseMove);
      window.removeEventListener("mouseup", this._handleStopDragging);
      window.removeEventListener("touchend", this._handleStopDragging);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          containerClassName = _this$props2.containerClassName;
      var _this$state5 = this.state,
          isStartDraggable = _this$state5.isStartDraggable,
          isStartResizable = _this$state5.isStartResizable;
      return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
        ref: this._setRef("$container"),
        style: this._getStyles(),
        className: "".concat(styles.container, " ").concat(containerClassName).trim(),
        role: "presentation",
        onFocus: this._setHasZIndex(true),
        onBlur: this._setHasZIndex(false),
        tabIndex: "-1"
      }, children(this._handleChildrenParam()), this._renderItemResize()), (isStartDraggable || isStartResizable) && React__default.createElement("div", {
        classNam: styles.overlay,
        style: {
          zIndex: 99
        }
      }));
    }
  }]);

  return WilRnd;
}(React.Component);

_defineProperty(WilRnd, "defaultProps", {
  onDragStart: function onDragStart(measure) {},
  onResizeStart: function onResizeStart(type, measure) {},
  onDrag: function onDrag(measure) {},
  onResize: function onResize(measure) {},
  onResizeDebounce: function onResizeDebounce(measure) {},
  onEnd: function onEnd(measure) {},
  widthRange: [0, Infinity],
  heightRange: [0, Infinity],
  dragHorizontalRange: [-Infinity, Infinity],
  dragVerticalRange: [-Infinity, Infinity],
  timeDebounce: 400,
  containerClassName: ""
});

module.exports = WilRnd;
//# sourceMappingURL=index.js.map
