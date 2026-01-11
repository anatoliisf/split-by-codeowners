#!/usr/bin/env node
require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 380:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 251:
/***/ (function(module) {

/**
  * This file contains the Bottleneck library (MIT), compiled to ES2017, and without Clustering support.
  * https://github.com/SGrondin/bottleneck
  */
(function (global, factory) {
	 true ? module.exports = factory() :
	0;
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var load = function(received, defaults, onto = {}) {
	  var k, ref, v;
	  for (k in defaults) {
	    v = defaults[k];
	    onto[k] = (ref = received[k]) != null ? ref : v;
	  }
	  return onto;
	};

	var overwrite = function(received, defaults, onto = {}) {
	  var k, v;
	  for (k in received) {
	    v = received[k];
	    if (defaults[k] !== void 0) {
	      onto[k] = v;
	    }
	  }
	  return onto;
	};

	var parser = {
		load: load,
		overwrite: overwrite
	};

	var DLList;

	DLList = class DLList {
	  constructor(incr, decr) {
	    this.incr = incr;
	    this.decr = decr;
	    this._first = null;
	    this._last = null;
	    this.length = 0;
	  }

	  push(value) {
	    var node;
	    this.length++;
	    if (typeof this.incr === "function") {
	      this.incr();
	    }
	    node = {
	      value,
	      prev: this._last,
	      next: null
	    };
	    if (this._last != null) {
	      this._last.next = node;
	      this._last = node;
	    } else {
	      this._first = this._last = node;
	    }
	    return void 0;
	  }

	  shift() {
	    var value;
	    if (this._first == null) {
	      return;
	    } else {
	      this.length--;
	      if (typeof this.decr === "function") {
	        this.decr();
	      }
	    }
	    value = this._first.value;
	    if ((this._first = this._first.next) != null) {
	      this._first.prev = null;
	    } else {
	      this._last = null;
	    }
	    return value;
	  }

	  first() {
	    if (this._first != null) {
	      return this._first.value;
	    }
	  }

	  getArray() {
	    var node, ref, results;
	    node = this._first;
	    results = [];
	    while (node != null) {
	      results.push((ref = node, node = node.next, ref.value));
	    }
	    return results;
	  }

	  forEachShift(cb) {
	    var node;
	    node = this.shift();
	    while (node != null) {
	      (cb(node), node = this.shift());
	    }
	    return void 0;
	  }

	  debug() {
	    var node, ref, ref1, ref2, results;
	    node = this._first;
	    results = [];
	    while (node != null) {
	      results.push((ref = node, node = node.next, {
	        value: ref.value,
	        prev: (ref1 = ref.prev) != null ? ref1.value : void 0,
	        next: (ref2 = ref.next) != null ? ref2.value : void 0
	      }));
	    }
	    return results;
	  }

	};

	var DLList_1 = DLList;

	var Events;

	Events = class Events {
	  constructor(instance) {
	    this.instance = instance;
	    this._events = {};
	    if ((this.instance.on != null) || (this.instance.once != null) || (this.instance.removeAllListeners != null)) {
	      throw new Error("An Emitter already exists for this object");
	    }
	    this.instance.on = (name, cb) => {
	      return this._addListener(name, "many", cb);
	    };
	    this.instance.once = (name, cb) => {
	      return this._addListener(name, "once", cb);
	    };
	    this.instance.removeAllListeners = (name = null) => {
	      if (name != null) {
	        return delete this._events[name];
	      } else {
	        return this._events = {};
	      }
	    };
	  }

	  _addListener(name, status, cb) {
	    var base;
	    if ((base = this._events)[name] == null) {
	      base[name] = [];
	    }
	    this._events[name].push({cb, status});
	    return this.instance;
	  }

	  listenerCount(name) {
	    if (this._events[name] != null) {
	      return this._events[name].length;
	    } else {
	      return 0;
	    }
	  }

	  async trigger(name, ...args) {
	    var e, promises;
	    try {
	      if (name !== "debug") {
	        this.trigger("debug", `Event triggered: ${name}`, args);
	      }
	      if (this._events[name] == null) {
	        return;
	      }
	      this._events[name] = this._events[name].filter(function(listener) {
	        return listener.status !== "none";
	      });
	      promises = this._events[name].map(async(listener) => {
	        var e, returned;
	        if (listener.status === "none") {
	          return;
	        }
	        if (listener.status === "once") {
	          listener.status = "none";
	        }
	        try {
	          returned = typeof listener.cb === "function" ? listener.cb(...args) : void 0;
	          if (typeof (returned != null ? returned.then : void 0) === "function") {
	            return (await returned);
	          } else {
	            return returned;
	          }
	        } catch (error) {
	          e = error;
	          {
	            this.trigger("error", e);
	          }
	          return null;
	        }
	      });
	      return ((await Promise.all(promises))).find(function(x) {
	        return x != null;
	      });
	    } catch (error) {
	      e = error;
	      {
	        this.trigger("error", e);
	      }
	      return null;
	    }
	  }

	};

	var Events_1 = Events;

	var DLList$1, Events$1, Queues;

	DLList$1 = DLList_1;

	Events$1 = Events_1;

	Queues = class Queues {
	  constructor(num_priorities) {
	    var i;
	    this.Events = new Events$1(this);
	    this._length = 0;
	    this._lists = (function() {
	      var j, ref, results;
	      results = [];
	      for (i = j = 1, ref = num_priorities; (1 <= ref ? j <= ref : j >= ref); i = 1 <= ref ? ++j : --j) {
	        results.push(new DLList$1((() => {
	          return this.incr();
	        }), (() => {
	          return this.decr();
	        })));
	      }
	      return results;
	    }).call(this);
	  }

	  incr() {
	    if (this._length++ === 0) {
	      return this.Events.trigger("leftzero");
	    }
	  }

	  decr() {
	    if (--this._length === 0) {
	      return this.Events.trigger("zero");
	    }
	  }

	  push(job) {
	    return this._lists[job.options.priority].push(job);
	  }

	  queued(priority) {
	    if (priority != null) {
	      return this._lists[priority].length;
	    } else {
	      return this._length;
	    }
	  }

	  shiftAll(fn) {
	    return this._lists.forEach(function(list) {
	      return list.forEachShift(fn);
	    });
	  }

	  getFirst(arr = this._lists) {
	    var j, len, list;
	    for (j = 0, len = arr.length; j < len; j++) {
	      list = arr[j];
	      if (list.length > 0) {
	        return list;
	      }
	    }
	    return [];
	  }

	  shiftLastFrom(priority) {
	    return this.getFirst(this._lists.slice(priority).reverse()).shift();
	  }

	};

	var Queues_1 = Queues;

	var BottleneckError;

	BottleneckError = class BottleneckError extends Error {};

	var BottleneckError_1 = BottleneckError;

	var BottleneckError$1, DEFAULT_PRIORITY, Job, NUM_PRIORITIES, parser$1;

	NUM_PRIORITIES = 10;

	DEFAULT_PRIORITY = 5;

	parser$1 = parser;

	BottleneckError$1 = BottleneckError_1;

	Job = class Job {
	  constructor(task, args, options, jobDefaults, rejectOnDrop, Events, _states, Promise) {
	    this.task = task;
	    this.args = args;
	    this.rejectOnDrop = rejectOnDrop;
	    this.Events = Events;
	    this._states = _states;
	    this.Promise = Promise;
	    this.options = parser$1.load(options, jobDefaults);
	    this.options.priority = this._sanitizePriority(this.options.priority);
	    if (this.options.id === jobDefaults.id) {
	      this.options.id = `${this.options.id}-${this._randomIndex()}`;
	    }
	    this.promise = new this.Promise((_resolve, _reject) => {
	      this._resolve = _resolve;
	      this._reject = _reject;
	    });
	    this.retryCount = 0;
	  }

	  _sanitizePriority(priority) {
	    var sProperty;
	    sProperty = ~~priority !== priority ? DEFAULT_PRIORITY : priority;
	    if (sProperty < 0) {
	      return 0;
	    } else if (sProperty > NUM_PRIORITIES - 1) {
	      return NUM_PRIORITIES - 1;
	    } else {
	      return sProperty;
	    }
	  }

	  _randomIndex() {
	    return Math.random().toString(36).slice(2);
	  }

	  doDrop({error, message = "This job has been dropped by Bottleneck"} = {}) {
	    if (this._states.remove(this.options.id)) {
	      if (this.rejectOnDrop) {
	        this._reject(error != null ? error : new BottleneckError$1(message));
	      }
	      this.Events.trigger("dropped", {args: this.args, options: this.options, task: this.task, promise: this.promise});
	      return true;
	    } else {
	      return false;
	    }
	  }

	  _assertStatus(expected) {
	    var status;
	    status = this._states.jobStatus(this.options.id);
	    if (!(status === expected || (expected === "DONE" && status === null))) {
	      throw new BottleneckError$1(`Invalid job status ${status}, expected ${expected}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`);
	    }
	  }

	  doReceive() {
	    this._states.start(this.options.id);
	    return this.Events.trigger("received", {args: this.args, options: this.options});
	  }

	  doQueue(reachedHWM, blocked) {
	    this._assertStatus("RECEIVED");
	    this._states.next(this.options.id);
	    return this.Events.trigger("queued", {args: this.args, options: this.options, reachedHWM, blocked});
	  }

	  doRun() {
	    if (this.retryCount === 0) {
	      this._assertStatus("QUEUED");
	      this._states.next(this.options.id);
	    } else {
	      this._assertStatus("EXECUTING");
	    }
	    return this.Events.trigger("scheduled", {args: this.args, options: this.options});
	  }

	  async doExecute(chained, clearGlobalState, run, free) {
	    var error, eventInfo, passed;
	    if (this.retryCount === 0) {
	      this._assertStatus("RUNNING");
	      this._states.next(this.options.id);
	    } else {
	      this._assertStatus("EXECUTING");
	    }
	    eventInfo = {args: this.args, options: this.options, retryCount: this.retryCount};
	    this.Events.trigger("executing", eventInfo);
	    try {
	      passed = (await (chained != null ? chained.schedule(this.options, this.task, ...this.args) : this.task(...this.args)));
	      if (clearGlobalState()) {
	        this.doDone(eventInfo);
	        await free(this.options, eventInfo);
	        this._assertStatus("DONE");
	        return this._resolve(passed);
	      }
	    } catch (error1) {
	      error = error1;
	      return this._onFailure(error, eventInfo, clearGlobalState, run, free);
	    }
	  }

	  doExpire(clearGlobalState, run, free) {
	    var error, eventInfo;
	    if (this._states.jobStatus(this.options.id === "RUNNING")) {
	      this._states.next(this.options.id);
	    }
	    this._assertStatus("EXECUTING");
	    eventInfo = {args: this.args, options: this.options, retryCount: this.retryCount};
	    error = new BottleneckError$1(`This job timed out after ${this.options.expiration} ms.`);
	    return this._onFailure(error, eventInfo, clearGlobalState, run, free);
	  }

	  async _onFailure(error, eventInfo, clearGlobalState, run, free) {
	    var retry, retryAfter;
	    if (clearGlobalState()) {
	      retry = (await this.Events.trigger("failed", error, eventInfo));
	      if (retry != null) {
	        retryAfter = ~~retry;
	        this.Events.trigger("retry", `Retrying ${this.options.id} after ${retryAfter} ms`, eventInfo);
	        this.retryCount++;
	        return run(retryAfter);
	      } else {
	        this.doDone(eventInfo);
	        await free(this.options, eventInfo);
	        this._assertStatus("DONE");
	        return this._reject(error);
	      }
	    }
	  }

	  doDone(eventInfo) {
	    this._assertStatus("EXECUTING");
	    this._states.next(this.options.id);
	    return this.Events.trigger("done", eventInfo);
	  }

	};

	var Job_1 = Job;

	var BottleneckError$2, LocalDatastore, parser$2;

	parser$2 = parser;

	BottleneckError$2 = BottleneckError_1;

	LocalDatastore = class LocalDatastore {
	  constructor(instance, storeOptions, storeInstanceOptions) {
	    this.instance = instance;
	    this.storeOptions = storeOptions;
	    this.clientId = this.instance._randomIndex();
	    parser$2.load(storeInstanceOptions, storeInstanceOptions, this);
	    this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now();
	    this._running = 0;
	    this._done = 0;
	    this._unblockTime = 0;
	    this.ready = this.Promise.resolve();
	    this.clients = {};
	    this._startHeartbeat();
	  }

	  _startHeartbeat() {
	    var base;
	    if ((this.heartbeat == null) && (((this.storeOptions.reservoirRefreshInterval != null) && (this.storeOptions.reservoirRefreshAmount != null)) || ((this.storeOptions.reservoirIncreaseInterval != null) && (this.storeOptions.reservoirIncreaseAmount != null)))) {
	      return typeof (base = (this.heartbeat = setInterval(() => {
	        var amount, incr, maximum, now, reservoir;
	        now = Date.now();
	        if ((this.storeOptions.reservoirRefreshInterval != null) && now >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval) {
	          this._lastReservoirRefresh = now;
	          this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount;
	          this.instance._drainAll(this.computeCapacity());
	        }
	        if ((this.storeOptions.reservoirIncreaseInterval != null) && now >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval) {
	          ({
	            reservoirIncreaseAmount: amount,
	            reservoirIncreaseMaximum: maximum,
	            reservoir
	          } = this.storeOptions);
	          this._lastReservoirIncrease = now;
	          incr = maximum != null ? Math.min(amount, maximum - reservoir) : amount;
	          if (incr > 0) {
	            this.storeOptions.reservoir += incr;
	            return this.instance._drainAll(this.computeCapacity());
	          }
	        }
	      }, this.heartbeatInterval))).unref === "function" ? base.unref() : void 0;
	    } else {
	      return clearInterval(this.heartbeat);
	    }
	  }

	  async __publish__(message) {
	    await this.yieldLoop();
	    return this.instance.Events.trigger("message", message.toString());
	  }

	  async __disconnect__(flush) {
	    await this.yieldLoop();
	    clearInterval(this.heartbeat);
	    return this.Promise.resolve();
	  }

	  yieldLoop(t = 0) {
	    return new this.Promise(function(resolve, reject) {
	      return setTimeout(resolve, t);
	    });
	  }

	  computePenalty() {
	    var ref;
	    return (ref = this.storeOptions.penalty) != null ? ref : (15 * this.storeOptions.minTime) || 5000;
	  }

	  async __updateSettings__(options) {
	    await this.yieldLoop();
	    parser$2.overwrite(options, options, this.storeOptions);
	    this._startHeartbeat();
	    this.instance._drainAll(this.computeCapacity());
	    return true;
	  }

	  async __running__() {
	    await this.yieldLoop();
	    return this._running;
	  }

	  async __queued__() {
	    await this.yieldLoop();
	    return this.instance.queued();
	  }

	  async __done__() {
	    await this.yieldLoop();
	    return this._done;
	  }

	  async __groupCheck__(time) {
	    await this.yieldLoop();
	    return (this._nextRequest + this.timeout) < time;
	  }

	  computeCapacity() {
	    var maxConcurrent, reservoir;
	    ({maxConcurrent, reservoir} = this.storeOptions);
	    if ((maxConcurrent != null) && (reservoir != null)) {
	      return Math.min(maxConcurrent - this._running, reservoir);
	    } else if (maxConcurrent != null) {
	      return maxConcurrent - this._running;
	    } else if (reservoir != null) {
	      return reservoir;
	    } else {
	      return null;
	    }
	  }

	  conditionsCheck(weight) {
	    var capacity;
	    capacity = this.computeCapacity();
	    return (capacity == null) || weight <= capacity;
	  }

	  async __incrementReservoir__(incr) {
	    var reservoir;
	    await this.yieldLoop();
	    reservoir = this.storeOptions.reservoir += incr;
	    this.instance._drainAll(this.computeCapacity());
	    return reservoir;
	  }

	  async __currentReservoir__() {
	    await this.yieldLoop();
	    return this.storeOptions.reservoir;
	  }

	  isBlocked(now) {
	    return this._unblockTime >= now;
	  }

	  check(weight, now) {
	    return this.conditionsCheck(weight) && (this._nextRequest - now) <= 0;
	  }

	  async __check__(weight) {
	    var now;
	    await this.yieldLoop();
	    now = Date.now();
	    return this.check(weight, now);
	  }

	  async __register__(index, weight, expiration) {
	    var now, wait;
	    await this.yieldLoop();
	    now = Date.now();
	    if (this.conditionsCheck(weight)) {
	      this._running += weight;
	      if (this.storeOptions.reservoir != null) {
	        this.storeOptions.reservoir -= weight;
	      }
	      wait = Math.max(this._nextRequest - now, 0);
	      this._nextRequest = now + wait + this.storeOptions.minTime;
	      return {
	        success: true,
	        wait,
	        reservoir: this.storeOptions.reservoir
	      };
	    } else {
	      return {
	        success: false
	      };
	    }
	  }

	  strategyIsBlock() {
	    return this.storeOptions.strategy === 3;
	  }

	  async __submit__(queueLength, weight) {
	    var blocked, now, reachedHWM;
	    await this.yieldLoop();
	    if ((this.storeOptions.maxConcurrent != null) && weight > this.storeOptions.maxConcurrent) {
	      throw new BottleneckError$2(`Impossible to add a job having a weight of ${weight} to a limiter having a maxConcurrent setting of ${this.storeOptions.maxConcurrent}`);
	    }
	    now = Date.now();
	    reachedHWM = (this.storeOptions.highWater != null) && queueLength === this.storeOptions.highWater && !this.check(weight, now);
	    blocked = this.strategyIsBlock() && (reachedHWM || this.isBlocked(now));
	    if (blocked) {
	      this._unblockTime = now + this.computePenalty();
	      this._nextRequest = this._unblockTime + this.storeOptions.minTime;
	      this.instance._dropAllQueued();
	    }
	    return {
	      reachedHWM,
	      blocked,
	      strategy: this.storeOptions.strategy
	    };
	  }

	  async __free__(index, weight) {
	    await this.yieldLoop();
	    this._running -= weight;
	    this._done += weight;
	    this.instance._drainAll(this.computeCapacity());
	    return {
	      running: this._running
	    };
	  }

	};

	var LocalDatastore_1 = LocalDatastore;

	var BottleneckError$3, States;

	BottleneckError$3 = BottleneckError_1;

	States = class States {
	  constructor(status1) {
	    this.status = status1;
	    this._jobs = {};
	    this.counts = this.status.map(function() {
	      return 0;
	    });
	  }

	  next(id) {
	    var current, next;
	    current = this._jobs[id];
	    next = current + 1;
	    if ((current != null) && next < this.status.length) {
	      this.counts[current]--;
	      this.counts[next]++;
	      return this._jobs[id]++;
	    } else if (current != null) {
	      this.counts[current]--;
	      return delete this._jobs[id];
	    }
	  }

	  start(id) {
	    var initial;
	    initial = 0;
	    this._jobs[id] = initial;
	    return this.counts[initial]++;
	  }

	  remove(id) {
	    var current;
	    current = this._jobs[id];
	    if (current != null) {
	      this.counts[current]--;
	      delete this._jobs[id];
	    }
	    return current != null;
	  }

	  jobStatus(id) {
	    var ref;
	    return (ref = this.status[this._jobs[id]]) != null ? ref : null;
	  }

	  statusJobs(status) {
	    var k, pos, ref, results, v;
	    if (status != null) {
	      pos = this.status.indexOf(status);
	      if (pos < 0) {
	        throw new BottleneckError$3(`status must be one of ${this.status.join(', ')}`);
	      }
	      ref = this._jobs;
	      results = [];
	      for (k in ref) {
	        v = ref[k];
	        if (v === pos) {
	          results.push(k);
	        }
	      }
	      return results;
	    } else {
	      return Object.keys(this._jobs);
	    }
	  }

	  statusCounts() {
	    return this.counts.reduce(((acc, v, i) => {
	      acc[this.status[i]] = v;
	      return acc;
	    }), {});
	  }

	};

	var States_1 = States;

	var DLList$2, Sync;

	DLList$2 = DLList_1;

	Sync = class Sync {
	  constructor(name, Promise) {
	    this.schedule = this.schedule.bind(this);
	    this.name = name;
	    this.Promise = Promise;
	    this._running = 0;
	    this._queue = new DLList$2();
	  }

	  isEmpty() {
	    return this._queue.length === 0;
	  }

	  async _tryToRun() {
	    var args, cb, error, reject, resolve, returned, task;
	    if ((this._running < 1) && this._queue.length > 0) {
	      this._running++;
	      ({task, args, resolve, reject} = this._queue.shift());
	      cb = (await (async function() {
	        try {
	          returned = (await task(...args));
	          return function() {
	            return resolve(returned);
	          };
	        } catch (error1) {
	          error = error1;
	          return function() {
	            return reject(error);
	          };
	        }
	      })());
	      this._running--;
	      this._tryToRun();
	      return cb();
	    }
	  }

	  schedule(task, ...args) {
	    var promise, reject, resolve;
	    resolve = reject = null;
	    promise = new this.Promise(function(_resolve, _reject) {
	      resolve = _resolve;
	      return reject = _reject;
	    });
	    this._queue.push({task, args, resolve, reject});
	    this._tryToRun();
	    return promise;
	  }

	};

	var Sync_1 = Sync;

	var version = "2.19.5";
	var version$1 = {
		version: version
	};

	var version$2 = /*#__PURE__*/Object.freeze({
		version: version,
		default: version$1
	});

	var require$$2 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var require$$3 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var require$$4 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var Events$2, Group, IORedisConnection$1, RedisConnection$1, Scripts$1, parser$3;

	parser$3 = parser;

	Events$2 = Events_1;

	RedisConnection$1 = require$$2;

	IORedisConnection$1 = require$$3;

	Scripts$1 = require$$4;

	Group = (function() {
	  class Group {
	    constructor(limiterOptions = {}) {
	      this.deleteKey = this.deleteKey.bind(this);
	      this.limiterOptions = limiterOptions;
	      parser$3.load(this.limiterOptions, this.defaults, this);
	      this.Events = new Events$2(this);
	      this.instances = {};
	      this.Bottleneck = Bottleneck_1;
	      this._startAutoCleanup();
	      this.sharedConnection = this.connection != null;
	      if (this.connection == null) {
	        if (this.limiterOptions.datastore === "redis") {
	          this.connection = new RedisConnection$1(Object.assign({}, this.limiterOptions, {Events: this.Events}));
	        } else if (this.limiterOptions.datastore === "ioredis") {
	          this.connection = new IORedisConnection$1(Object.assign({}, this.limiterOptions, {Events: this.Events}));
	        }
	      }
	    }

	    key(key = "") {
	      var ref;
	      return (ref = this.instances[key]) != null ? ref : (() => {
	        var limiter;
	        limiter = this.instances[key] = new this.Bottleneck(Object.assign(this.limiterOptions, {
	          id: `${this.id}-${key}`,
	          timeout: this.timeout,
	          connection: this.connection
	        }));
	        this.Events.trigger("created", limiter, key);
	        return limiter;
	      })();
	    }

	    async deleteKey(key = "") {
	      var deleted, instance;
	      instance = this.instances[key];
	      if (this.connection) {
	        deleted = (await this.connection.__runCommand__(['del', ...Scripts$1.allKeys(`${this.id}-${key}`)]));
	      }
	      if (instance != null) {
	        delete this.instances[key];
	        await instance.disconnect();
	      }
	      return (instance != null) || deleted > 0;
	    }

	    limiters() {
	      var k, ref, results, v;
	      ref = this.instances;
	      results = [];
	      for (k in ref) {
	        v = ref[k];
	        results.push({
	          key: k,
	          limiter: v
	        });
	      }
	      return results;
	    }

	    keys() {
	      return Object.keys(this.instances);
	    }

	    async clusterKeys() {
	      var cursor, end, found, i, k, keys, len, next, start;
	      if (this.connection == null) {
	        return this.Promise.resolve(this.keys());
	      }
	      keys = [];
	      cursor = null;
	      start = `b_${this.id}-`.length;
	      end = "_settings".length;
	      while (cursor !== 0) {
	        [next, found] = (await this.connection.__runCommand__(["scan", cursor != null ? cursor : 0, "match", `b_${this.id}-*_settings`, "count", 10000]));
	        cursor = ~~next;
	        for (i = 0, len = found.length; i < len; i++) {
	          k = found[i];
	          keys.push(k.slice(start, -end));
	        }
	      }
	      return keys;
	    }

	    _startAutoCleanup() {
	      var base;
	      clearInterval(this.interval);
	      return typeof (base = (this.interval = setInterval(async() => {
	        var e, k, ref, results, time, v;
	        time = Date.now();
	        ref = this.instances;
	        results = [];
	        for (k in ref) {
	          v = ref[k];
	          try {
	            if ((await v._store.__groupCheck__(time))) {
	              results.push(this.deleteKey(k));
	            } else {
	              results.push(void 0);
	            }
	          } catch (error) {
	            e = error;
	            results.push(v.Events.trigger("error", e));
	          }
	        }
	        return results;
	      }, this.timeout / 2))).unref === "function" ? base.unref() : void 0;
	    }

	    updateSettings(options = {}) {
	      parser$3.overwrite(options, this.defaults, this);
	      parser$3.overwrite(options, options, this.limiterOptions);
	      if (options.timeout != null) {
	        return this._startAutoCleanup();
	      }
	    }

	    disconnect(flush = true) {
	      var ref;
	      if (!this.sharedConnection) {
	        return (ref = this.connection) != null ? ref.disconnect(flush) : void 0;
	      }
	    }

	  }
	  Group.prototype.defaults = {
	    timeout: 1000 * 60 * 5,
	    connection: null,
	    Promise: Promise,
	    id: "group-key"
	  };

	  return Group;

	}).call(commonjsGlobal);

	var Group_1 = Group;

	var Batcher, Events$3, parser$4;

	parser$4 = parser;

	Events$3 = Events_1;

	Batcher = (function() {
	  class Batcher {
	    constructor(options = {}) {
	      this.options = options;
	      parser$4.load(this.options, this.defaults, this);
	      this.Events = new Events$3(this);
	      this._arr = [];
	      this._resetPromise();
	      this._lastFlush = Date.now();
	    }

	    _resetPromise() {
	      return this._promise = new this.Promise((res, rej) => {
	        return this._resolve = res;
	      });
	    }

	    _flush() {
	      clearTimeout(this._timeout);
	      this._lastFlush = Date.now();
	      this._resolve();
	      this.Events.trigger("batch", this._arr);
	      this._arr = [];
	      return this._resetPromise();
	    }

	    add(data) {
	      var ret;
	      this._arr.push(data);
	      ret = this._promise;
	      if (this._arr.length === this.maxSize) {
	        this._flush();
	      } else if ((this.maxTime != null) && this._arr.length === 1) {
	        this._timeout = setTimeout(() => {
	          return this._flush();
	        }, this.maxTime);
	      }
	      return ret;
	    }

	  }
	  Batcher.prototype.defaults = {
	    maxTime: null,
	    maxSize: null,
	    Promise: Promise
	  };

	  return Batcher;

	}).call(commonjsGlobal);

	var Batcher_1 = Batcher;

	var require$$4$1 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var require$$8 = getCjsExportFromNamespace(version$2);

	var Bottleneck, DEFAULT_PRIORITY$1, Events$4, Job$1, LocalDatastore$1, NUM_PRIORITIES$1, Queues$1, RedisDatastore$1, States$1, Sync$1, parser$5,
	  splice = [].splice;

	NUM_PRIORITIES$1 = 10;

	DEFAULT_PRIORITY$1 = 5;

	parser$5 = parser;

	Queues$1 = Queues_1;

	Job$1 = Job_1;

	LocalDatastore$1 = LocalDatastore_1;

	RedisDatastore$1 = require$$4$1;

	Events$4 = Events_1;

	States$1 = States_1;

	Sync$1 = Sync_1;

	Bottleneck = (function() {
	  class Bottleneck {
	    constructor(options = {}, ...invalid) {
	      var storeInstanceOptions, storeOptions;
	      this._addToQueue = this._addToQueue.bind(this);
	      this._validateOptions(options, invalid);
	      parser$5.load(options, this.instanceDefaults, this);
	      this._queues = new Queues$1(NUM_PRIORITIES$1);
	      this._scheduled = {};
	      this._states = new States$1(["RECEIVED", "QUEUED", "RUNNING", "EXECUTING"].concat(this.trackDoneStatus ? ["DONE"] : []));
	      this._limiter = null;
	      this.Events = new Events$4(this);
	      this._submitLock = new Sync$1("submit", this.Promise);
	      this._registerLock = new Sync$1("register", this.Promise);
	      storeOptions = parser$5.load(options, this.storeDefaults, {});
	      this._store = (function() {
	        if (this.datastore === "redis" || this.datastore === "ioredis" || (this.connection != null)) {
	          storeInstanceOptions = parser$5.load(options, this.redisStoreDefaults, {});
	          return new RedisDatastore$1(this, storeOptions, storeInstanceOptions);
	        } else if (this.datastore === "local") {
	          storeInstanceOptions = parser$5.load(options, this.localStoreDefaults, {});
	          return new LocalDatastore$1(this, storeOptions, storeInstanceOptions);
	        } else {
	          throw new Bottleneck.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`);
	        }
	      }).call(this);
	      this._queues.on("leftzero", () => {
	        var ref;
	        return (ref = this._store.heartbeat) != null ? typeof ref.ref === "function" ? ref.ref() : void 0 : void 0;
	      });
	      this._queues.on("zero", () => {
	        var ref;
	        return (ref = this._store.heartbeat) != null ? typeof ref.unref === "function" ? ref.unref() : void 0 : void 0;
	      });
	    }

	    _validateOptions(options, invalid) {
	      if (!((options != null) && typeof options === "object" && invalid.length === 0)) {
	        throw new Bottleneck.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.");
	      }
	    }

	    ready() {
	      return this._store.ready;
	    }

	    clients() {
	      return this._store.clients;
	    }

	    channel() {
	      return `b_${this.id}`;
	    }

	    channel_client() {
	      return `b_${this.id}_${this._store.clientId}`;
	    }

	    publish(message) {
	      return this._store.__publish__(message);
	    }

	    disconnect(flush = true) {
	      return this._store.__disconnect__(flush);
	    }

	    chain(_limiter) {
	      this._limiter = _limiter;
	      return this;
	    }

	    queued(priority) {
	      return this._queues.queued(priority);
	    }

	    clusterQueued() {
	      return this._store.__queued__();
	    }

	    empty() {
	      return this.queued() === 0 && this._submitLock.isEmpty();
	    }

	    running() {
	      return this._store.__running__();
	    }

	    done() {
	      return this._store.__done__();
	    }

	    jobStatus(id) {
	      return this._states.jobStatus(id);
	    }

	    jobs(status) {
	      return this._states.statusJobs(status);
	    }

	    counts() {
	      return this._states.statusCounts();
	    }

	    _randomIndex() {
	      return Math.random().toString(36).slice(2);
	    }

	    check(weight = 1) {
	      return this._store.__check__(weight);
	    }

	    _clearGlobalState(index) {
	      if (this._scheduled[index] != null) {
	        clearTimeout(this._scheduled[index].expiration);
	        delete this._scheduled[index];
	        return true;
	      } else {
	        return false;
	      }
	    }

	    async _free(index, job, options, eventInfo) {
	      var e, running;
	      try {
	        ({running} = (await this._store.__free__(index, options.weight)));
	        this.Events.trigger("debug", `Freed ${options.id}`, eventInfo);
	        if (running === 0 && this.empty()) {
	          return this.Events.trigger("idle");
	        }
	      } catch (error1) {
	        e = error1;
	        return this.Events.trigger("error", e);
	      }
	    }

	    _run(index, job, wait) {
	      var clearGlobalState, free, run;
	      job.doRun();
	      clearGlobalState = this._clearGlobalState.bind(this, index);
	      run = this._run.bind(this, index, job);
	      free = this._free.bind(this, index, job);
	      return this._scheduled[index] = {
	        timeout: setTimeout(() => {
	          return job.doExecute(this._limiter, clearGlobalState, run, free);
	        }, wait),
	        expiration: job.options.expiration != null ? setTimeout(function() {
	          return job.doExpire(clearGlobalState, run, free);
	        }, wait + job.options.expiration) : void 0,
	        job: job
	      };
	    }

	    _drainOne(capacity) {
	      return this._registerLock.schedule(() => {
	        var args, index, next, options, queue;
	        if (this.queued() === 0) {
	          return this.Promise.resolve(null);
	        }
	        queue = this._queues.getFirst();
	        ({options, args} = next = queue.first());
	        if ((capacity != null) && options.weight > capacity) {
	          return this.Promise.resolve(null);
	        }
	        this.Events.trigger("debug", `Draining ${options.id}`, {args, options});
	        index = this._randomIndex();
	        return this._store.__register__(index, options.weight, options.expiration).then(({success, wait, reservoir}) => {
	          var empty;
	          this.Events.trigger("debug", `Drained ${options.id}`, {success, args, options});
	          if (success) {
	            queue.shift();
	            empty = this.empty();
	            if (empty) {
	              this.Events.trigger("empty");
	            }
	            if (reservoir === 0) {
	              this.Events.trigger("depleted", empty);
	            }
	            this._run(index, next, wait);
	            return this.Promise.resolve(options.weight);
	          } else {
	            return this.Promise.resolve(null);
	          }
	        });
	      });
	    }

	    _drainAll(capacity, total = 0) {
	      return this._drainOne(capacity).then((drained) => {
	        var newCapacity;
	        if (drained != null) {
	          newCapacity = capacity != null ? capacity - drained : capacity;
	          return this._drainAll(newCapacity, total + drained);
	        } else {
	          return this.Promise.resolve(total);
	        }
	      }).catch((e) => {
	        return this.Events.trigger("error", e);
	      });
	    }

	    _dropAllQueued(message) {
	      return this._queues.shiftAll(function(job) {
	        return job.doDrop({message});
	      });
	    }

	    stop(options = {}) {
	      var done, waitForExecuting;
	      options = parser$5.load(options, this.stopDefaults);
	      waitForExecuting = (at) => {
	        var finished;
	        finished = () => {
	          var counts;
	          counts = this._states.counts;
	          return (counts[0] + counts[1] + counts[2] + counts[3]) === at;
	        };
	        return new this.Promise((resolve, reject) => {
	          if (finished()) {
	            return resolve();
	          } else {
	            return this.on("done", () => {
	              if (finished()) {
	                this.removeAllListeners("done");
	                return resolve();
	              }
	            });
	          }
	        });
	      };
	      done = options.dropWaitingJobs ? (this._run = function(index, next) {
	        return next.doDrop({
	          message: options.dropErrorMessage
	        });
	      }, this._drainOne = () => {
	        return this.Promise.resolve(null);
	      }, this._registerLock.schedule(() => {
	        return this._submitLock.schedule(() => {
	          var k, ref, v;
	          ref = this._scheduled;
	          for (k in ref) {
	            v = ref[k];
	            if (this.jobStatus(v.job.options.id) === "RUNNING") {
	              clearTimeout(v.timeout);
	              clearTimeout(v.expiration);
	              v.job.doDrop({
	                message: options.dropErrorMessage
	              });
	            }
	          }
	          this._dropAllQueued(options.dropErrorMessage);
	          return waitForExecuting(0);
	        });
	      })) : this.schedule({
	        priority: NUM_PRIORITIES$1 - 1,
	        weight: 0
	      }, () => {
	        return waitForExecuting(1);
	      });
	      this._receive = function(job) {
	        return job._reject(new Bottleneck.prototype.BottleneckError(options.enqueueErrorMessage));
	      };
	      this.stop = () => {
	        return this.Promise.reject(new Bottleneck.prototype.BottleneckError("stop() has already been called"));
	      };
	      return done;
	    }

	    async _addToQueue(job) {
	      var args, blocked, error, options, reachedHWM, shifted, strategy;
	      ({args, options} = job);
	      try {
	        ({reachedHWM, blocked, strategy} = (await this._store.__submit__(this.queued(), options.weight)));
	      } catch (error1) {
	        error = error1;
	        this.Events.trigger("debug", `Could not queue ${options.id}`, {args, options, error});
	        job.doDrop({error});
	        return false;
	      }
	      if (blocked) {
	        job.doDrop();
	        return true;
	      } else if (reachedHWM) {
	        shifted = strategy === Bottleneck.prototype.strategy.LEAK ? this._queues.shiftLastFrom(options.priority) : strategy === Bottleneck.prototype.strategy.OVERFLOW_PRIORITY ? this._queues.shiftLastFrom(options.priority + 1) : strategy === Bottleneck.prototype.strategy.OVERFLOW ? job : void 0;
	        if (shifted != null) {
	          shifted.doDrop();
	        }
	        if ((shifted == null) || strategy === Bottleneck.prototype.strategy.OVERFLOW) {
	          if (shifted == null) {
	            job.doDrop();
	          }
	          return reachedHWM;
	        }
	      }
	      job.doQueue(reachedHWM, blocked);
	      this._queues.push(job);
	      await this._drainAll();
	      return reachedHWM;
	    }

	    _receive(job) {
	      if (this._states.jobStatus(job.options.id) != null) {
	        job._reject(new Bottleneck.prototype.BottleneckError(`A job with the same id already exists (id=${job.options.id})`));
	        return false;
	      } else {
	        job.doReceive();
	        return this._submitLock.schedule(this._addToQueue, job);
	      }
	    }

	    submit(...args) {
	      var cb, fn, job, options, ref, ref1, task;
	      if (typeof args[0] === "function") {
	        ref = args, [fn, ...args] = ref, [cb] = splice.call(args, -1);
	        options = parser$5.load({}, this.jobDefaults);
	      } else {
	        ref1 = args, [options, fn, ...args] = ref1, [cb] = splice.call(args, -1);
	        options = parser$5.load(options, this.jobDefaults);
	      }
	      task = (...args) => {
	        return new this.Promise(function(resolve, reject) {
	          return fn(...args, function(...args) {
	            return (args[0] != null ? reject : resolve)(args);
	          });
	        });
	      };
	      job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
	      job.promise.then(function(args) {
	        return typeof cb === "function" ? cb(...args) : void 0;
	      }).catch(function(args) {
	        if (Array.isArray(args)) {
	          return typeof cb === "function" ? cb(...args) : void 0;
	        } else {
	          return typeof cb === "function" ? cb(args) : void 0;
	        }
	      });
	      return this._receive(job);
	    }

	    schedule(...args) {
	      var job, options, task;
	      if (typeof args[0] === "function") {
	        [task, ...args] = args;
	        options = {};
	      } else {
	        [options, task, ...args] = args;
	      }
	      job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
	      this._receive(job);
	      return job.promise;
	    }

	    wrap(fn) {
	      var schedule, wrapped;
	      schedule = this.schedule.bind(this);
	      wrapped = function(...args) {
	        return schedule(fn.bind(this), ...args);
	      };
	      wrapped.withOptions = function(options, ...args) {
	        return schedule(options, fn, ...args);
	      };
	      return wrapped;
	    }

	    async updateSettings(options = {}) {
	      await this._store.__updateSettings__(parser$5.overwrite(options, this.storeDefaults));
	      parser$5.overwrite(options, this.instanceDefaults, this);
	      return this;
	    }

	    currentReservoir() {
	      return this._store.__currentReservoir__();
	    }

	    incrementReservoir(incr = 0) {
	      return this._store.__incrementReservoir__(incr);
	    }

	  }
	  Bottleneck.default = Bottleneck;

	  Bottleneck.Events = Events$4;

	  Bottleneck.version = Bottleneck.prototype.version = require$$8.version;

	  Bottleneck.strategy = Bottleneck.prototype.strategy = {
	    LEAK: 1,
	    OVERFLOW: 2,
	    OVERFLOW_PRIORITY: 4,
	    BLOCK: 3
	  };

	  Bottleneck.BottleneckError = Bottleneck.prototype.BottleneckError = BottleneckError_1;

	  Bottleneck.Group = Bottleneck.prototype.Group = Group_1;

	  Bottleneck.RedisConnection = Bottleneck.prototype.RedisConnection = require$$2;

	  Bottleneck.IORedisConnection = Bottleneck.prototype.IORedisConnection = require$$3;

	  Bottleneck.Batcher = Bottleneck.prototype.Batcher = Batcher_1;

	  Bottleneck.prototype.jobDefaults = {
	    priority: DEFAULT_PRIORITY$1,
	    weight: 1,
	    expiration: null,
	    id: "<no-id>"
	  };

	  Bottleneck.prototype.storeDefaults = {
	    maxConcurrent: null,
	    minTime: 0,
	    highWater: null,
	    strategy: Bottleneck.prototype.strategy.LEAK,
	    penalty: null,
	    reservoir: null,
	    reservoirRefreshInterval: null,
	    reservoirRefreshAmount: null,
	    reservoirIncreaseInterval: null,
	    reservoirIncreaseAmount: null,
	    reservoirIncreaseMaximum: null
	  };

	  Bottleneck.prototype.localStoreDefaults = {
	    Promise: Promise,
	    timeout: null,
	    heartbeatInterval: 250
	  };

	  Bottleneck.prototype.redisStoreDefaults = {
	    Promise: Promise,
	    timeout: null,
	    heartbeatInterval: 5000,
	    clientTimeout: 10000,
	    Redis: null,
	    clientOptions: {},
	    clusterNodes: null,
	    clearDatastore: false,
	    connection: null
	  };

	  Bottleneck.prototype.instanceDefaults = {
	    datastore: "local",
	    connection: null,
	    id: "<no-id>",
	    rejectOnDrop: true,
	    trackDoneStatus: false,
	    Promise: Promise
	  };

	  Bottleneck.prototype.stopDefaults = {
	    enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
	    dropWaitingJobs: true,
	    dropErrorMessage: "This limiter has been stopped."
	  };

	  return Bottleneck;

	}).call(commonjsGlobal);

	var Bottleneck_1 = Bottleneck;

	var lib = Bottleneck_1;

	return lib;

})));


/***/ }),

/***/ 691:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var balanced = __nccwpck_require__(380);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m) return [str];

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  if (/\$$/.test(m.pre)) {    
    for (var k = 0; k < post.length; k++) {
      var expansion = pre+ '{' + m.body + '}' + post[k];
      expansions.push(expansion);
    }
  } else {
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = m.body.indexOf(',') >= 0;
    if (!isSequence && !isOptions) {
      // {a},b}
      if (m.post.match(/,(?!,).*\}/)) {
        str = m.pre + '{' + m.body + escClose + m.post;
        return expand(str);
      }
      return [str];
    }

    var n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        // x{{a,b}}y ==> x{a}y x{b}y
        n = expand(n[0], false).map(embrace);
        if (n.length === 1) {
          return post.map(function(p) {
            return m.pre + n[0] + p;
          });
        }
      }
    }

    // at this point, n is the parts, and we know it's not a comma set
    // with a single entry.
    var N;

    if (isSequence) {
      var x = numeric(n[0]);
      var y = numeric(n[1]);
      var width = Math.max(n[0].length, n[1].length)
      var incr = n.length == 3
        ? Math.abs(numeric(n[2]))
        : 1;
      var test = lte;
      var reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      var pad = n.some(isPadded);

      N = [];

      for (var i = x; test(i, y); i += incr) {
        var c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === '\\')
            c = '';
        } else {
          c = String(i);
          if (pad) {
            var need = width - c.length;
            if (need > 0) {
              var z = new Array(need + 1).join('0');
              if (i < 0)
                c = '-' + z + c.slice(1);
              else
                c = z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = [];

      for (var j = 0; j < n.length; j++) {
        N.push.apply(N, expand(n[j], false));
      }
    }

    for (var j = 0; j < N.length; j++) {
      for (var k = 0; k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion)
          expansions.push(expansion);
      }
    }
  }

  return expansions;
}



/***/ }),

/***/ 168:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runSplit = runSplit;
const node_path_1 = __importDefault(__nccwpck_require__(760));
const node_fs_1 = __importDefault(__nccwpck_require__(24));
const buckets_1 = __nccwpck_require__(140);
const codeowners_1 = __nccwpck_require__(586);
const git_1 = __nccwpck_require__(243);
const github_1 = __nccwpck_require__(248);
const ghcli_1 = __nccwpck_require__(64);
function formatTemplate(tpl, vars) {
    let out = tpl;
    for (const [k, v] of Object.entries(vars))
        out = out.split(`{${k}}`).join(v);
    return out;
}
function ensureDirExists(dir) {
    if (!node_fs_1.default.existsSync(dir))
        (0, buckets_1.ensureDir)(dir);
}
async function runSplit(config, logger) {
    if (config.createPrs && config.dryRun) {
        throw new Error("create_prs=true requires dry_run=false (we need patch files to create bucket branches/PRs).");
    }
    // 1) discover + filter changed files
    const changed = (0, git_1.getChangedFiles)(config.baseRef);
    const filtered = (0, buckets_1.applyExcludes)(changed, config.excludePatterns);
    logger.info(`Changed files: ${changed.length} (after excludes: ${filtered.length})`);
    if (!filtered.length) {
        return { buckets: [], matrix: { include: [] }, prs: [] };
    }
    // 2) parse CODEOWNERS + bucketize by owners-set
    const rules = (0, codeowners_1.parseCodeowners)(config.codeownersPath);
    const bucketsMap = new Map();
    for (const file of filtered) {
        const { owners, rule } = (0, codeowners_1.ownersForFile)(file, rules);
        const sortedOwners = (owners ?? []).slice().sort();
        const isUnowned = sortedOwners.length === 0;
        if (isUnowned && !config.includeUnowned)
            continue;
        const key = isUnowned
            ? config.unownedBucketKey
            : sortedOwners.join("|").replaceAll("@", "").replaceAll("/", "-").replaceAll(" ", "");
        const existing = bucketsMap.get(key);
        if (!existing) {
            bucketsMap.set(key, {
                key,
                owners: sortedOwners,
                files: [{ file, owners: sortedOwners, rule }]
            });
        }
        else {
            existing.files.push({ file, owners: sortedOwners, rule });
        }
    }
    const buckets = [...bucketsMap.values()].sort((a, b) => a.key.localeCompare(b.key));
    if (buckets.length > config.maxBuckets) {
        throw new Error(`Too many buckets: ${buckets.length} > max_buckets=${config.maxBuckets}`);
    }
    // 3) write per-bucket patches
    if (!config.dryRun) {
        ensureDirExists(config.patchDir);
        buckets.forEach((b, idx) => {
            const patchPath = node_path_1.default.posix.join(config.patchDir.replaceAll("\\", "/"), `${config.bucketPrefix}-${idx + 1}.patch`);
            const paths = b.files.map((f) => f.file);
            logger.info(`Writing ${patchPath} (${paths.length} files) for bucket=${b.key}`);
            (0, git_1.writePatchForPaths)(patchPath, paths);
        });
    }
    else {
        logger.info("dry_run=true; not generating patches.");
    }
    const matrix = (0, buckets_1.toMatrix)(buckets, config.patchDir, config.bucketPrefix);
    // 4) optionally create PRs (worktrees so we don't disturb the current working tree)
    let prs = undefined;
    if (config.createPrs) {
        const token = config.githubToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
        const repo = config.repo ?? (0, git_1.parseGitHubRemote)((0, git_1.getRemoteUrl)(config.remoteName));
        const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
        // Auth mode selection:
        // - In GitHub Actions: ALWAYS use token-based API (gh may not be installed/auth'd).
        // - Locally: prefer gh CLI for best DevX, but if gh isn't auth'd and a token is available, fall back to token.
        if (isGitHubActions && !token) {
            throw new Error("Missing GitHub token (set github_token input or GITHUB_TOKEN / GH_TOKEN env var)");
        }
        let useGhCli = !isGitHubActions;
        let octokit = useGhCli ? null : (0, github_1.getOctokit)(token);
        let baseBranch;
        if (useGhCli) {
            try {
                const cwd = process.cwd();
                (0, ghcli_1.assertGhAuthenticated)(cwd);
                baseBranch = config.baseBranch || (0, ghcli_1.getDefaultBranchViaGh)(cwd);
            }
            catch (e) {
                if (token) {
                    logger.warn("gh is not authenticated; falling back to token auth.");
                    useGhCli = false;
                    octokit = (0, github_1.getOctokit)(token);
                    baseBranch = config.baseBranch || (await (0, github_1.getDefaultBranch)(octokit, repo));
                }
                else {
                    throw e;
                }
            }
        }
        else {
            baseBranch = config.baseBranch || (await (0, github_1.getDefaultBranch)(octokit, repo));
        }
        const baseRef = "HEAD";
        ensureDirExists((0, git_1.worktreeBaseDir)());
        prs = [];
        for (let i = 0; i < buckets.length; i++) {
            const b = buckets[i];
            const patchPath = node_path_1.default.posix.join(config.patchDir.replaceAll("\\", "/"), `${config.bucketPrefix}-${i + 1}.patch`);
            const branch = `${config.branchPrefix}${b.key}`.replaceAll(" ", "");
            const worktreeDir = (0, git_1.tempDirForBucket)(b.key);
            logger.info(`Creating PR for bucket=${b.key} on branch=${branch}`);
            (0, git_1.worktreeAdd)(branch, baseRef, worktreeDir);
            try {
                (0, git_1.applyPatch)(patchPath, worktreeDir);
                const committed = (0, git_1.commitAllStaged)(config.commitMessage, worktreeDir);
                if (!committed) {
                    logger.warn(`No staged changes for bucket=${b.key}; skipping push/PR.`);
                    continue;
                }
                (0, git_1.pushBranch)(config.remoteName, branch, worktreeDir);
                const ownersStr = b.owners.length ? b.owners.join(", ") : "(unowned)";
                const filesStr = b.files.map(f => `- ${f.file}`).join("\n");
                const title = formatTemplate(config.prTitle, { owners: ownersStr, bucket_key: b.key });
                const body = formatTemplate(config.prBody, { owners: ownersStr, bucket_key: b.key, files: filesStr });
                const pr = useGhCli
                    ? (() => {
                        return (0, ghcli_1.upsertPullRequestViaGh)({
                            cwd: worktreeDir,
                            base: baseBranch,
                            head: branch,
                            title,
                            body,
                            draft: config.draft,
                            bucketKey: b.key
                        });
                    })()
                    : await (0, github_1.upsertPullRequest)({
                        octokit: octokit,
                        repo,
                        base: baseBranch,
                        head: branch,
                        title,
                        body,
                        draft: config.draft,
                        bucketKey: b.key
                    });
                prs.push(pr);
                logger.info(`PR: ${pr.url}`);
            }
            finally {
                (0, git_1.worktreeRemove)(worktreeDir);
            }
        }
    }
    if (config.cleanupPatches && !config.dryRun) {
        const cwd = process.cwd();
        const abs = node_path_1.default.resolve(cwd, config.patchDir);
        const safePrefix = cwd.endsWith(node_path_1.default.sep) ? cwd : cwd + node_path_1.default.sep;
        if (!abs.startsWith(safePrefix)) {
            throw new Error(`Refusing to delete patch_dir outside repo: ${abs}`);
        }
        if (abs === cwd) {
            throw new Error("Refusing to delete patch_dir equal to repo root.");
        }
        if (node_fs_1.default.existsSync(abs)) {
            logger.info(`Cleaning up patches dir: ${config.patchDir}`);
            node_fs_1.default.rmSync(abs, { recursive: true, force: true });
        }
    }
    return { buckets, matrix, prs };
}


/***/ }),

/***/ 140:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseBool = parseBool;
exports.readMultiline = readMultiline;
exports.applyExcludes = applyExcludes;
exports.ensureDir = ensureDir;
exports.toMatrix = toMatrix;
const node_fs_1 = __importDefault(__nccwpck_require__(24));
const node_path_1 = __importDefault(__nccwpck_require__(760));
const minimatch_1 = __nccwpck_require__(507);
function parseBool(v) {
    return String(v).toLowerCase() === "true";
}
function readMultiline(input) {
    return (input || "")
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);
}
function applyExcludes(files, excludePatterns) {
    if (!excludePatterns.length)
        return files;
    return files.filter(f => !excludePatterns.some(p => (0, minimatch_1.minimatch)(f, p, { dot: true })));
}
function ownersKey(owners) {
    return owners.slice().sort().join("|");
}
function stableBucketKey(owners, unownedKey) {
    if (!owners.length)
        return unownedKey;
    return ownersKey(owners)
        .replaceAll("@", "")
        .replaceAll("/", "-")
        .replaceAll(" ", "");
}
function ensureDir(dir) {
    node_fs_1.default.mkdirSync(dir, { recursive: true });
}
function toMatrix(buckets, patchDir, bucketPrefix) {
    return {
        include: buckets.map((b, i) => ({
            bucket_key: b.key,
            owners: b.owners,
            files: b.files.map(f => f.file),
            patch_path: node_path_1.default.posix.join(patchDir.replaceAll("\\", "/"), `${bucketPrefix}-${i + 1}.patch`)
        }))
    };
}


/***/ }),

/***/ 586:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseCodeowners = parseCodeowners;
exports.ownersForFile = ownersForFile;
const node_fs_1 = __importDefault(__nccwpck_require__(24));
const minimatch_1 = __nccwpck_require__(507);
function splitPatternOwners(line) {
    // CODEOWNERS lines are: <pattern><whitespace><owner>...
    // Patterns may contain spaces if escaped as `\ `.
    // We parse by finding the first whitespace not escaped by a backslash.
    let i = 0;
    let escaped = false;
    for (; i < line.length; i++) {
        const ch = line[i];
        if (escaped) {
            escaped = false;
            continue;
        }
        if (ch === "\\") {
            escaped = true;
            continue;
        }
        if (/\s/.test(ch))
            break;
    }
    const rawPattern = line.slice(0, i).trim();
    const rest = line.slice(i).trim();
    if (!rawPattern || !rest)
        return null;
    const pattern = rawPattern.replaceAll("\\ ", " ");
    const owners = rest.split(/\s+/).filter(Boolean);
    if (!owners.length)
        return null;
    return { pattern, owners };
}
function parseCodeowners(path) {
    const text = node_fs_1.default.readFileSync(path, "utf8");
    const rules = [];
    for (const raw of text.split("\n")) {
        const line = raw.trim();
        if (!line || line.startsWith("#"))
            continue;
        const parsed = splitPatternOwners(line);
        if (!parsed)
            continue;
        rules.push({ pattern: parsed.pattern, owners: parsed.owners });
    }
    return rules;
}
function hasGlobMagic(p) {
    // Good-enough heuristic for gitignore-style globs.
    return /[*?\[]/.test(p);
}
function matches(file, pattern) {
    // GitHub CODEOWNERS patterns are gitignore-like:
    // - Leading `/` anchors to repo root
    // - Pattern without `/` matches a basename anywhere
    // - A directory pattern matches everything under it (e.g. `/frontend/admin` should match `/frontend/admin/**`)
    const f = file.replace(/\\/g, "/").replace(/^\.?\//, "");
    let pat = pattern.replace(/\\/g, "/").trim();
    if (!pat)
        return false;
    const anchored = pat.startsWith("/");
    if (anchored)
        pat = pat.slice(1);
    // Directory patterns: trailing `/` means directory; also treat non-glob literal paths as directory-or-file match.
    const trailingSlash = pat.endsWith("/");
    if (trailingSlash)
        pat = pat.slice(0, -1);
    const isLiteral = !hasGlobMagic(pat);
    const hasSlash = pat.includes("/");
    // Literal path: match exact file OR directory subtree.
    if (isLiteral && (anchored || hasSlash)) {
        return f === pat || f.startsWith(pat + "/");
    }
    // Literal basename: match basename OR directory subtree anywhere.
    if (isLiteral && !hasSlash) {
        const base = f.split("/").pop() ?? f;
        if (base === pat)
            return true;
        return f.includes("/" + pat + "/");
    }
    // Glob patterns: use minimatch.
    // - If anchored: match from repo root.
    // - If not anchored and no slash: match basename anywhere.
    // - If not anchored but includes a slash: match relative to repo root (like a root CODEOWNERS / .gitignore).
    const matchBase = !anchored && !hasSlash;
    const mm = (0, minimatch_1.minimatch)(f, pat, { dot: true, matchBase });
    if (mm)
        return true;
    // If the pattern explicitly denotes a directory (trailing slash), also match directory subtree.
    if (trailingSlash) {
        // Convert `dir/` to subtree match.
        return (0, minimatch_1.minimatch)(f, pat + "/**", { dot: true, matchBase: false });
    }
    return false;
}
function ownersForFile(file, rules) {
    let hit;
    for (const r of rules)
        if (matches(file, r.pattern))
            hit = r; // last wins
    return { owners: hit?.owners ?? [], rule: hit?.pattern };
}


/***/ }),

/***/ 64:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assertGhAuthenticated = assertGhAuthenticated;
exports.getDefaultBranchViaGh = getDefaultBranchViaGh;
exports.upsertPullRequestViaGh = upsertPullRequestViaGh;
const node_child_process_1 = __nccwpck_require__(421);
function sh(cmd, cwd) {
    return (0, node_child_process_1.execSync)(cmd, { encoding: "utf8", cwd }).trim();
}
function assertGhAuthenticated(cwd) {
    try {
        (0, node_child_process_1.execSync)(`gh auth status`, { cwd, stdio: "ignore" });
    }
    catch {
        throw new Error("Missing GitHub auth for local PR creation. Run `gh auth login` (or pass --token / set GH_TOKEN / GITHUB_TOKEN).");
    }
}
function getDefaultBranchViaGh(cwd) {
    // gh has built-in jq filtering (no system jq required)
    return sh(`gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`, cwd);
}
function tryParseJson(s) {
    try {
        return JSON.parse(s);
    }
    catch {
        return null;
    }
}
function upsertPullRequestViaGh(params) {
    const { cwd, base, head, title, body, draft, bucketKey } = params;
    const listRaw = sh(`gh pr list --state open --head "${head.replace(/"/g, '\\"')}" --json number,url --limit 1`, cwd);
    const list = tryParseJson(listRaw) ?? [];
    if (list.length) {
        const pr = list[0];
        // Update title/body; leave draft state as-is.
        (0, node_child_process_1.execSync)(`gh pr edit ${pr.number} --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}"`, { cwd, stdio: "inherit" });
        return { bucket_key: bucketKey, branch: head, number: pr.number, url: pr.url };
    }
    // Create new PR; gh prints URL on success.
    const draftFlag = draft ? "--draft" : "";
    const url = sh(`gh pr create --head "${head.replace(/"/g, '\\"')}" --base "${base.replace(/"/g, '\\"')}" --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}" ${draftFlag}`, cwd);
    // We don't know the PR number without another API call; leave as 0 for now.
    return { bucket_key: bucketKey, branch: head, number: 0, url };
}


/***/ }),

/***/ 243:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getChangedFiles = getChangedFiles;
exports.writePatchForPaths = writePatchForPaths;
exports.getRemoteUrl = getRemoteUrl;
exports.parseGitHubRemote = parseGitHubRemote;
exports.getHeadSha = getHeadSha;
exports.ensureGitIdentity = ensureGitIdentity;
exports.worktreeBaseDir = worktreeBaseDir;
exports.worktreeAdd = worktreeAdd;
exports.worktreeRemove = worktreeRemove;
exports.commitAllStaged = commitAllStaged;
exports.pushBranch = pushBranch;
exports.applyPatch = applyPatch;
exports.tempDirForBucket = tempDirForBucket;
const node_child_process_1 = __nccwpck_require__(421);
const node_fs_1 = __importDefault(__nccwpck_require__(24));
const node_path_1 = __importDefault(__nccwpck_require__(760));
function sh(cmd, cwd) {
    return (0, node_child_process_1.execSync)(cmd, { encoding: "utf8", cwd }).trim();
}
function execAllowExitCodes(cmd, allowed, opts) {
    try {
        (0, node_child_process_1.execSync)(cmd, opts);
    }
    catch (e) {
        const status = e?.status;
        if (typeof status === "number" && allowed.includes(status))
            return;
        throw e;
    }
}
function getChangedFiles(baseRef) {
    // Changed vs HEAD (staged + unstaged)
    // Note: we keep this intentionally workspace-focused (codemods often produce uncommitted changes).
    // If baseRef is provided, we currently still use HEAD vs working tree (baseRef is used for PR base branch elsewhere).
    const diff = sh(`git diff --name-only HEAD`);
    const untracked = sh(`git ls-files --others --exclude-standard`);
    const out = new Set();
    if (diff)
        diff.split("\n").map(s => s.trim()).filter(Boolean).forEach(p => out.add(p));
    if (untracked)
        untracked.split("\n").map(s => s.trim()).filter(Boolean).forEach(p => out.add(p));
    // Optional: if baseRef provided, you can extend to include committed changes too
    // (left minimal—most codemod flows are uncommitted workspace changes)
    // Defensive: git can sometimes surface untracked directories (e.g. nested git checkouts) as `dir/`.
    // Filter out directories to avoid later patch-generation errors.
    const filesOnly = [...out].filter((p) => {
        const normalized = p.replace(/\\/g, "/");
        if (normalized.endsWith("/"))
            return false;
        try {
            return !node_fs_1.default.lstatSync(node_path_1.default.resolve(process.cwd(), p)).isDirectory();
        }
        catch {
            // If it doesn't exist or can't be stat'd, keep it; later steps will surface a clearer error.
            return true;
        }
    });
    return filesOnly.sort((a, b) => a.localeCompare(b));
}
function listUntrackedIn(paths) {
    if (!paths.length)
        return [];
    const quoted = paths.map(p => `"${p.replace(/"/g, '\\"')}"`).join(" ");
    const out = sh(`git ls-files --others --exclude-standard -- ${quoted}`);
    return out ? out.split("\n").map(s => s.trim()).filter(Boolean) : [];
}
function listTrackedIn(paths) {
    const untracked = new Set(listUntrackedIn(paths));
    return paths.filter(p => !untracked.has(p));
}
function writePatchForPaths(patchPath, paths) {
    if (!paths.length)
        return;
    const abs = node_path_1.default.resolve(process.cwd(), patchPath);
    const untracked = listUntrackedIn(paths);
    const tracked = listTrackedIn(paths);
    // 1) tracked modifications/deletions/renames
    if (tracked.length) {
        const quoted = tracked.map(p => `"${p.replace(/"/g, '\\"')}"`).join(" ");
        // IMPORTANT: diff against HEAD so patches are stable regardless of whether the user staged changes already.
        // (Plain `git diff` only captures *unstaged* changes.)
        (0, node_child_process_1.execSync)(`git diff --binary HEAD -- ${quoted} > "${abs.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
    }
    else {
        (0, node_child_process_1.execSync)(`: > "${abs.replace(/"/g, '\\"')}"`);
    }
    // 2) untracked additions (append, without touching index)
    for (const f of untracked) {
        const q = `"${f.replace(/"/g, '\\"')}"`;
        // `git diff --no-index` returns exit code 1 when differences exist (expected). We need the stdout either way.
        try {
            // IMPORTANT: for --no-index, pass exactly TWO paths, no `--` pathspec separator.
            const out = (0, node_child_process_1.execSync)(`git diff --binary --no-index /dev/null ${q}`, {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "pipe"],
            });
            if (out)
                node_fs_1.default.appendFileSync(abs, out);
        }
        catch (e) {
            const status = e?.status;
            const stdout = (e?.stdout ?? "");
            const stderr = (e?.stderr ?? "");
            const outStr = Buffer.isBuffer(stdout) ? stdout.toString("utf8") : String(stdout);
            const errStr = Buffer.isBuffer(stderr) ? stderr.toString("utf8") : String(stderr);
            if (status === 1) {
                if (errStr.trim()) {
                    // When status=1, stderr should usually be empty. If it's not, treat as a real error.
                    throw new Error(errStr.trim());
                }
                if (outStr)
                    node_fs_1.default.appendFileSync(abs, outStr);
                continue;
            }
            throw new Error(errStr.trim() || `git diff --no-index failed with status=${status ?? "unknown"}`);
        }
    }
}
function getRemoteUrl(remoteName = "origin") {
    return sh(`git config --get remote.${remoteName}.url`);
}
function parseGitHubRemote(remoteUrl) {
    // Supports:
    // - git@github.com:OWNER/REPO.git
    // - https://github.com/OWNER/REPO.git
    // - https://github.com/OWNER/REPO
    const cleaned = remoteUrl.trim();
    const ssh = cleaned.match(/^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/);
    if (ssh)
        return { owner: ssh[1], repo: ssh[2] };
    const https = cleaned.match(/^https?:\/\/github\.com\/([^/]+)\/(.+?)(?:\.git)?$/);
    if (https)
        return { owner: https[1], repo: https[2] };
    throw new Error(`Unsupported remote URL (expected GitHub): ${remoteUrl}`);
}
function getHeadSha(cwd) {
    return sh(`git rev-parse HEAD`, cwd);
}
function ensureGitIdentity(cwd) {
    // Ensure commits work in CI even if user.name/email aren't configured.
    const name = sh(`git config user.name || true`, cwd);
    const email = sh(`git config user.email || true`, cwd);
    if (!name)
        (0, node_child_process_1.execSync)(`git config user.name "split-by-codeowners"`, { cwd, stdio: "inherit" });
    if (!email)
        (0, node_child_process_1.execSync)(`git config user.email "split-by-codeowners@users.noreply.github.com"`, { cwd, stdio: "inherit" });
}
function worktreeBaseDir() {
    return node_path_1.default.resolve(process.cwd(), ".split-by-codeowners-worktrees");
}
function worktreeAdd(branch, baseRef, worktreeDir) {
    (0, node_child_process_1.execSync)(`git worktree add -B "${branch.replace(/"/g, '\\"')}" "${worktreeDir.replace(/"/g, '\\"')}" "${baseRef.replace(/"/g, '\\"')}"`, {
        stdio: "inherit"
    });
}
function worktreeRemove(worktreeDir) {
    (0, node_child_process_1.execSync)(`git worktree remove --force "${worktreeDir.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
}
function commitAllStaged(message, cwd) {
    // No-op if nothing staged
    try {
        (0, node_child_process_1.execSync)(`git diff --cached --quiet`, { cwd, stdio: "inherit" });
        return false;
    }
    catch {
        // has staged changes
    }
    ensureGitIdentity(cwd);
    (0, node_child_process_1.execSync)(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd, stdio: "inherit" });
    return true;
}
function pushBranch(remoteName, branch, cwd) {
    (0, node_child_process_1.execSync)(`git push "${remoteName.replace(/"/g, '\\"')}" "${branch.replace(/"/g, '\\"')}" --force`, { cwd, stdio: "inherit" });
}
function applyPatch(patchPath, cwd) {
    const abs = node_path_1.default.resolve(process.cwd(), patchPath);
    (0, node_child_process_1.execSync)(`git apply --index "${abs.replace(/"/g, '\\"')}"`, { cwd, stdio: "inherit" });
}
function tempDirForBucket(bucketKey) {
    const safe = bucketKey.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80) || "bucket";
    return node_path_1.default.join(worktreeBaseDir(), `${safe}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
}


/***/ }),

/***/ 248:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokit = getOctokit;
exports.getDefaultBranch = getDefaultBranch;
exports.upsertPullRequest = upsertPullRequest;
const octokit_1 = __nccwpck_require__(264);
function getOctokit(token) {
    if (!token)
        throw new Error("Missing GitHub token (set github_token input or GITHUB_TOKEN / GH_TOKEN env var)");
    return new octokit_1.Octokit({ auth: token });
}
async function getDefaultBranch(octokit, repo) {
    const res = await octokit.rest.repos.get({ owner: repo.owner, repo: repo.repo });
    return res.data.default_branch;
}
async function upsertPullRequest(params) {
    const { octokit, repo, base, head, title, body, draft, bucketKey } = params;
    const headWithOwner = `${repo.owner}:${head}`;
    const existing = await octokit.rest.pulls.list({
        owner: repo.owner,
        repo: repo.repo,
        state: "open",
        head: headWithOwner,
        base
    });
    if (existing.data.length) {
        const pr = existing.data[0];
        const updated = await octokit.rest.pulls.update({
            owner: repo.owner,
            repo: repo.repo,
            pull_number: pr.number,
            title,
            body
        });
        return { bucket_key: bucketKey, branch: head, number: updated.data.number, url: updated.data.html_url };
    }
    const created = await octokit.rest.pulls.create({
        owner: repo.owner,
        repo: repo.repo,
        head,
        base,
        title,
        body,
        draft
    });
    return { bucket_key: bucketKey, branch: head, number: created.data.number, url: created.data.html_url };
}


/***/ }),

/***/ 421:
/***/ ((module) => {

"use strict";
module.exports = require("node:child_process");

/***/ }),

/***/ 24:
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ 760:
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ 120:
/***/ ((module) => {

"use strict";
var __webpack_unused_export__;


const NullObject = function NullObject () { }
NullObject.prototype = Object.create(null)

/**
 * RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
 *
 * parameter     = token "=" ( token / quoted-string )
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 * quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
 * qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
 * obs-text      = %x80-FF
 * quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
 */
const paramRE = /; *([!#$%&'*+.^\w`|~-]+)=("(?:[\v\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\v\u0020-\u00ff])*"|[!#$%&'*+.^\w`|~-]+) */gu

/**
 * RegExp to match quoted-pair in RFC 7230 sec 3.2.6
 *
 * quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
 * obs-text    = %x80-FF
 */
const quotedPairRE = /\\([\v\u0020-\u00ff])/gu

/**
 * RegExp to match type in RFC 7231 sec 3.1.1.1
 *
 * media-type = type "/" subtype
 * type       = token
 * subtype    = token
 */
const mediaTypeRE = /^[!#$%&'*+.^\w|~-]+\/[!#$%&'*+.^\w|~-]+$/u

// default ContentType to prevent repeated object creation
const defaultContentType = { type: '', parameters: new NullObject() }
Object.freeze(defaultContentType.parameters)
Object.freeze(defaultContentType)

/**
 * Parse media type to object.
 *
 * @param {string|object} header
 * @return {Object}
 * @public
 */

function parse (header) {
  if (typeof header !== 'string') {
    throw new TypeError('argument header is required and must be a string')
  }

  let index = header.indexOf(';')
  const type = index !== -1
    ? header.slice(0, index).trim()
    : header.trim()

  if (mediaTypeRE.test(type) === false) {
    throw new TypeError('invalid media type')
  }

  const result = {
    type: type.toLowerCase(),
    parameters: new NullObject()
  }

  // parse parameters
  if (index === -1) {
    return result
  }

  let key
  let match
  let value

  paramRE.lastIndex = index

  while ((match = paramRE.exec(header))) {
    if (match.index !== index) {
      throw new TypeError('invalid parameter format')
    }

    index += match[0].length
    key = match[1].toLowerCase()
    value = match[2]

    if (value[0] === '"') {
      // remove quotes and escapes
      value = value
        .slice(1, value.length - 1)

      quotedPairRE.test(value) && (value = value.replace(quotedPairRE, '$1'))
    }

    result.parameters[key] = value
  }

  if (index !== header.length) {
    throw new TypeError('invalid parameter format')
  }

  return result
}

function safeParse (header) {
  if (typeof header !== 'string') {
    return defaultContentType
  }

  let index = header.indexOf(';')
  const type = index !== -1
    ? header.slice(0, index).trim()
    : header.trim()

  if (mediaTypeRE.test(type) === false) {
    return defaultContentType
  }

  const result = {
    type: type.toLowerCase(),
    parameters: new NullObject()
  }

  // parse parameters
  if (index === -1) {
    return result
  }

  let key
  let match
  let value

  paramRE.lastIndex = index

  while ((match = paramRE.exec(header))) {
    if (match.index !== index) {
      return defaultContentType
    }

    index += match[0].length
    key = match[1].toLowerCase()
    value = match[2]

    if (value[0] === '"') {
      // remove quotes and escapes
      value = value
        .slice(1, value.length - 1)

      quotedPairRE.test(value) && (value = value.replace(quotedPairRE, '$1'))
    }

    result.parameters[key] = value
  }

  if (index !== header.length) {
    return defaultContentType
  }

  return result
}

__webpack_unused_export__ = { parse, safeParse }
__webpack_unused_export__ = parse
module.exports.xL = safeParse
__webpack_unused_export__ = defaultContentType


/***/ }),

/***/ 305:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assertValidPattern = void 0;
const MAX_PATTERN_LENGTH = 1024 * 64;
const assertValidPattern = (pattern) => {
    if (typeof pattern !== 'string') {
        throw new TypeError('invalid pattern');
    }
    if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError('pattern is too long');
    }
};
exports.assertValidPattern = assertValidPattern;
//# sourceMappingURL=assert-valid-pattern.js.map

/***/ }),

/***/ 803:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// parse a single path portion
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AST = void 0;
const brace_expressions_js_1 = __nccwpck_require__(90);
const unescape_js_1 = __nccwpck_require__(851);
const types = new Set(['!', '?', '+', '*', '@']);
const isExtglobType = (c) => types.has(c);
// Patterns that get prepended to bind to the start of either the
// entire string, or just a single path portion, to prevent dots
// and/or traversal patterns, when needed.
// Exts don't need the ^ or / bit, because the root binds that already.
const startNoTraversal = '(?!(?:^|/)\\.\\.?(?:$|/))';
const startNoDot = '(?!\\.)';
// characters that indicate a start of pattern needs the "no dots" bit,
// because a dot *might* be matched. ( is not in the list, because in
// the case of a child extglob, it will handle the prevention itself.
const addPatternStart = new Set(['[', '.']);
// cases where traversal is A-OK, no dot prevention needed
const justDots = new Set(['..', '.']);
const reSpecials = new Set('().*{}+?[]^$\\!');
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// any single thing other than /
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// use + when we need to ensure that *something* matches, because the * is
// the only thing in the path portion.
const starNoEmpty = qmark + '+?';
// remove the \ chars that we added if we end up doing a nonmagic compare
// const deslash = (s: string) => s.replace(/\\(.)/g, '$1')
class AST {
    type;
    #root;
    #hasMagic;
    #uflag = false;
    #parts = [];
    #parent;
    #parentIndex;
    #negs;
    #filledNegs = false;
    #options;
    #toString;
    // set to true if it's an extglob with no children
    // (which really means one child of '')
    #emptyExt = false;
    constructor(type, parent, options = {}) {
        this.type = type;
        // extglobs are inherently magical
        if (type)
            this.#hasMagic = true;
        this.#parent = parent;
        this.#root = this.#parent ? this.#parent.#root : this;
        this.#options = this.#root === this ? options : this.#root.#options;
        this.#negs = this.#root === this ? [] : this.#root.#negs;
        if (type === '!' && !this.#root.#filledNegs)
            this.#negs.push(this);
        this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
    }
    get hasMagic() {
        /* c8 ignore start */
        if (this.#hasMagic !== undefined)
            return this.#hasMagic;
        /* c8 ignore stop */
        for (const p of this.#parts) {
            if (typeof p === 'string')
                continue;
            if (p.type || p.hasMagic)
                return (this.#hasMagic = true);
        }
        // note: will be undefined until we generate the regexp src and find out
        return this.#hasMagic;
    }
    // reconstructs the pattern
    toString() {
        if (this.#toString !== undefined)
            return this.#toString;
        if (!this.type) {
            return (this.#toString = this.#parts.map(p => String(p)).join(''));
        }
        else {
            return (this.#toString =
                this.type + '(' + this.#parts.map(p => String(p)).join('|') + ')');
        }
    }
    #fillNegs() {
        /* c8 ignore start */
        if (this !== this.#root)
            throw new Error('should only call on root');
        if (this.#filledNegs)
            return this;
        /* c8 ignore stop */
        // call toString() once to fill this out
        this.toString();
        this.#filledNegs = true;
        let n;
        while ((n = this.#negs.pop())) {
            if (n.type !== '!')
                continue;
            // walk up the tree, appending everthing that comes AFTER parentIndex
            let p = n;
            let pp = p.#parent;
            while (pp) {
                for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
                    for (const part of n.#parts) {
                        /* c8 ignore start */
                        if (typeof part === 'string') {
                            throw new Error('string part in extglob AST??');
                        }
                        /* c8 ignore stop */
                        part.copyIn(pp.#parts[i]);
                    }
                }
                p = pp;
                pp = p.#parent;
            }
        }
        return this;
    }
    push(...parts) {
        for (const p of parts) {
            if (p === '')
                continue;
            /* c8 ignore start */
            if (typeof p !== 'string' && !(p instanceof AST && p.#parent === this)) {
                throw new Error('invalid part: ' + p);
            }
            /* c8 ignore stop */
            this.#parts.push(p);
        }
    }
    toJSON() {
        const ret = this.type === null
            ? this.#parts.slice().map(p => (typeof p === 'string' ? p : p.toJSON()))
            : [this.type, ...this.#parts.map(p => p.toJSON())];
        if (this.isStart() && !this.type)
            ret.unshift([]);
        if (this.isEnd() &&
            (this === this.#root ||
                (this.#root.#filledNegs && this.#parent?.type === '!'))) {
            ret.push({});
        }
        return ret;
    }
    isStart() {
        if (this.#root === this)
            return true;
        // if (this.type) return !!this.#parent?.isStart()
        if (!this.#parent?.isStart())
            return false;
        if (this.#parentIndex === 0)
            return true;
        // if everything AHEAD of this is a negation, then it's still the "start"
        const p = this.#parent;
        for (let i = 0; i < this.#parentIndex; i++) {
            const pp = p.#parts[i];
            if (!(pp instanceof AST && pp.type === '!')) {
                return false;
            }
        }
        return true;
    }
    isEnd() {
        if (this.#root === this)
            return true;
        if (this.#parent?.type === '!')
            return true;
        if (!this.#parent?.isEnd())
            return false;
        if (!this.type)
            return this.#parent?.isEnd();
        // if not root, it'll always have a parent
        /* c8 ignore start */
        const pl = this.#parent ? this.#parent.#parts.length : 0;
        /* c8 ignore stop */
        return this.#parentIndex === pl - 1;
    }
    copyIn(part) {
        if (typeof part === 'string')
            this.push(part);
        else
            this.push(part.clone(this));
    }
    clone(parent) {
        const c = new AST(this.type, parent);
        for (const p of this.#parts) {
            c.copyIn(p);
        }
        return c;
    }
    static #parseAST(str, ast, pos, opt) {
        let escaping = false;
        let inBrace = false;
        let braceStart = -1;
        let braceNeg = false;
        if (ast.type === null) {
            // outside of a extglob, append until we find a start
            let i = pos;
            let acc = '';
            while (i < str.length) {
                const c = str.charAt(i++);
                // still accumulate escapes at this point, but we do ignore
                // starts that are escaped
                if (escaping || c === '\\') {
                    escaping = !escaping;
                    acc += c;
                    continue;
                }
                if (inBrace) {
                    if (i === braceStart + 1) {
                        if (c === '^' || c === '!') {
                            braceNeg = true;
                        }
                    }
                    else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                        inBrace = false;
                    }
                    acc += c;
                    continue;
                }
                else if (c === '[') {
                    inBrace = true;
                    braceStart = i;
                    braceNeg = false;
                    acc += c;
                    continue;
                }
                if (!opt.noext && isExtglobType(c) && str.charAt(i) === '(') {
                    ast.push(acc);
                    acc = '';
                    const ext = new AST(c, ast);
                    i = AST.#parseAST(str, ext, i, opt);
                    ast.push(ext);
                    continue;
                }
                acc += c;
            }
            ast.push(acc);
            return i;
        }
        // some kind of extglob, pos is at the (
        // find the next | or )
        let i = pos + 1;
        let part = new AST(null, ast);
        const parts = [];
        let acc = '';
        while (i < str.length) {
            const c = str.charAt(i++);
            // still accumulate escapes at this point, but we do ignore
            // starts that are escaped
            if (escaping || c === '\\') {
                escaping = !escaping;
                acc += c;
                continue;
            }
            if (inBrace) {
                if (i === braceStart + 1) {
                    if (c === '^' || c === '!') {
                        braceNeg = true;
                    }
                }
                else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                    inBrace = false;
                }
                acc += c;
                continue;
            }
            else if (c === '[') {
                inBrace = true;
                braceStart = i;
                braceNeg = false;
                acc += c;
                continue;
            }
            if (isExtglobType(c) && str.charAt(i) === '(') {
                part.push(acc);
                acc = '';
                const ext = new AST(c, part);
                part.push(ext);
                i = AST.#parseAST(str, ext, i, opt);
                continue;
            }
            if (c === '|') {
                part.push(acc);
                acc = '';
                parts.push(part);
                part = new AST(null, ast);
                continue;
            }
            if (c === ')') {
                if (acc === '' && ast.#parts.length === 0) {
                    ast.#emptyExt = true;
                }
                part.push(acc);
                acc = '';
                ast.push(...parts, part);
                return i;
            }
            acc += c;
        }
        // unfinished extglob
        // if we got here, it was a malformed extglob! not an extglob, but
        // maybe something else in there.
        ast.type = null;
        ast.#hasMagic = undefined;
        ast.#parts = [str.substring(pos - 1)];
        return i;
    }
    static fromGlob(pattern, options = {}) {
        const ast = new AST(null, undefined, options);
        AST.#parseAST(pattern, ast, 0, options);
        return ast;
    }
    // returns the regular expression if there's magic, or the unescaped
    // string if not.
    toMMPattern() {
        // should only be called on root
        /* c8 ignore start */
        if (this !== this.#root)
            return this.#root.toMMPattern();
        /* c8 ignore stop */
        const glob = this.toString();
        const [re, body, hasMagic, uflag] = this.toRegExpSource();
        // if we're in nocase mode, and not nocaseMagicOnly, then we do
        // still need a regular expression if we have to case-insensitively
        // match capital/lowercase characters.
        const anyMagic = hasMagic ||
            this.#hasMagic ||
            (this.#options.nocase &&
                !this.#options.nocaseMagicOnly &&
                glob.toUpperCase() !== glob.toLowerCase());
        if (!anyMagic) {
            return body;
        }
        const flags = (this.#options.nocase ? 'i' : '') + (uflag ? 'u' : '');
        return Object.assign(new RegExp(`^${re}$`, flags), {
            _src: re,
            _glob: glob,
        });
    }
    get options() {
        return this.#options;
    }
    // returns the string match, the regexp source, whether there's magic
    // in the regexp (so a regular expression is required) and whether or
    // not the uflag is needed for the regular expression (for posix classes)
    // TODO: instead of injecting the start/end at this point, just return
    // the BODY of the regexp, along with the start/end portions suitable
    // for binding the start/end in either a joined full-path makeRe context
    // (where we bind to (^|/), or a standalone matchPart context (where
    // we bind to ^, and not /).  Otherwise slashes get duped!
    //
    // In part-matching mode, the start is:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: ^(?!\.\.?$)
    // - if dots allowed or not possible: ^
    // - if dots possible and not allowed: ^(?!\.)
    // end is:
    // - if not isEnd(): nothing
    // - else: $
    //
    // In full-path matching mode, we put the slash at the START of the
    // pattern, so start is:
    // - if first pattern: same as part-matching mode
    // - if not isStart(): nothing
    // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
    // - if dots allowed or not possible: /
    // - if dots possible and not allowed: /(?!\.)
    // end is:
    // - if last pattern, same as part-matching mode
    // - else nothing
    //
    // Always put the (?:$|/) on negated tails, though, because that has to be
    // there to bind the end of the negated pattern portion, and it's easier to
    // just stick it in now rather than try to inject it later in the middle of
    // the pattern.
    //
    // We can just always return the same end, and leave it up to the caller
    // to know whether it's going to be used joined or in parts.
    // And, if the start is adjusted slightly, can do the same there:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
    // - if dots allowed or not possible: (?:/|^)
    // - if dots possible and not allowed: (?:/|^)(?!\.)
    //
    // But it's better to have a simpler binding without a conditional, for
    // performance, so probably better to return both start options.
    //
    // Then the caller just ignores the end if it's not the first pattern,
    // and the start always gets applied.
    //
    // But that's always going to be $ if it's the ending pattern, or nothing,
    // so the caller can just attach $ at the end of the pattern when building.
    //
    // So the todo is:
    // - better detect what kind of start is needed
    // - return both flavors of starting pattern
    // - attach $ at the end of the pattern when creating the actual RegExp
    //
    // Ah, but wait, no, that all only applies to the root when the first pattern
    // is not an extglob. If the first pattern IS an extglob, then we need all
    // that dot prevention biz to live in the extglob portions, because eg
    // +(*|.x*) can match .xy but not .yx.
    //
    // So, return the two flavors if it's #root and the first child is not an
    // AST, otherwise leave it to the child AST to handle it, and there,
    // use the (?:^|/) style of start binding.
    //
    // Even simplified further:
    // - Since the start for a join is eg /(?!\.) and the start for a part
    // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
    // or start or whatever) and prepend ^ or / at the Regexp construction.
    toRegExpSource(allowDot) {
        const dot = allowDot ?? !!this.#options.dot;
        if (this.#root === this)
            this.#fillNegs();
        if (!this.type) {
            const noEmpty = this.isStart() && this.isEnd();
            const src = this.#parts
                .map(p => {
                const [re, _, hasMagic, uflag] = typeof p === 'string'
                    ? AST.#parseGlob(p, this.#hasMagic, noEmpty)
                    : p.toRegExpSource(allowDot);
                this.#hasMagic = this.#hasMagic || hasMagic;
                this.#uflag = this.#uflag || uflag;
                return re;
            })
                .join('');
            let start = '';
            if (this.isStart()) {
                if (typeof this.#parts[0] === 'string') {
                    // this is the string that will match the start of the pattern,
                    // so we need to protect against dots and such.
                    // '.' and '..' cannot match unless the pattern is that exactly,
                    // even if it starts with . or dot:true is set.
                    const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
                    if (!dotTravAllowed) {
                        const aps = addPatternStart;
                        // check if we have a possibility of matching . or ..,
                        // and prevent that.
                        const needNoTrav = 
                        // dots are allowed, and the pattern starts with [ or .
                        (dot && aps.has(src.charAt(0))) ||
                            // the pattern starts with \., and then [ or .
                            (src.startsWith('\\.') && aps.has(src.charAt(2))) ||
                            // the pattern starts with \.\., and then [ or .
                            (src.startsWith('\\.\\.') && aps.has(src.charAt(4)));
                        // no need to prevent dots if it can't match a dot, or if a
                        // sub-pattern will be preventing it anyway.
                        const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
                        start = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : '';
                    }
                }
            }
            // append the "end of path portion" pattern to negation tails
            let end = '';
            if (this.isEnd() &&
                this.#root.#filledNegs &&
                this.#parent?.type === '!') {
                end = '(?:$|\\/)';
            }
            const final = start + src + end;
            return [
                final,
                (0, unescape_js_1.unescape)(src),
                (this.#hasMagic = !!this.#hasMagic),
                this.#uflag,
            ];
        }
        // We need to calculate the body *twice* if it's a repeat pattern
        // at the start, once in nodot mode, then again in dot mode, so a
        // pattern like *(?) can match 'x.y'
        const repeated = this.type === '*' || this.type === '+';
        // some kind of extglob
        const start = this.type === '!' ? '(?:(?!(?:' : '(?:';
        let body = this.#partsToRegExp(dot);
        if (this.isStart() && this.isEnd() && !body && this.type !== '!') {
            // invalid extglob, has to at least be *something* present, if it's
            // the entire path portion.
            const s = this.toString();
            this.#parts = [s];
            this.type = null;
            this.#hasMagic = undefined;
            return [s, (0, unescape_js_1.unescape)(this.toString()), false, false];
        }
        // XXX abstract out this map method
        let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot
            ? ''
            : this.#partsToRegExp(true);
        if (bodyDotAllowed === body) {
            bodyDotAllowed = '';
        }
        if (bodyDotAllowed) {
            body = `(?:${body})(?:${bodyDotAllowed})*?`;
        }
        // an empty !() is exactly equivalent to a starNoEmpty
        let final = '';
        if (this.type === '!' && this.#emptyExt) {
            final = (this.isStart() && !dot ? startNoDot : '') + starNoEmpty;
        }
        else {
            const close = this.type === '!'
                ? // !() must match something,but !(x) can match ''
                    '))' +
                        (this.isStart() && !dot && !allowDot ? startNoDot : '') +
                        star +
                        ')'
                : this.type === '@'
                    ? ')'
                    : this.type === '?'
                        ? ')?'
                        : this.type === '+' && bodyDotAllowed
                            ? ')'
                            : this.type === '*' && bodyDotAllowed
                                ? `)?`
                                : `)${this.type}`;
            final = start + body + close;
        }
        return [
            final,
            (0, unescape_js_1.unescape)(body),
            (this.#hasMagic = !!this.#hasMagic),
            this.#uflag,
        ];
    }
    #partsToRegExp(dot) {
        return this.#parts
            .map(p => {
            // extglob ASTs should only contain parent ASTs
            /* c8 ignore start */
            if (typeof p === 'string') {
                throw new Error('string type in extglob ast??');
            }
            /* c8 ignore stop */
            // can ignore hasMagic, because extglobs are already always magic
            const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
            this.#uflag = this.#uflag || uflag;
            return re;
        })
            .filter(p => !(this.isStart() && this.isEnd()) || !!p)
            .join('|');
    }
    static #parseGlob(glob, hasMagic, noEmpty = false) {
        let escaping = false;
        let re = '';
        let uflag = false;
        for (let i = 0; i < glob.length; i++) {
            const c = glob.charAt(i);
            if (escaping) {
                escaping = false;
                re += (reSpecials.has(c) ? '\\' : '') + c;
                continue;
            }
            if (c === '\\') {
                if (i === glob.length - 1) {
                    re += '\\\\';
                }
                else {
                    escaping = true;
                }
                continue;
            }
            if (c === '[') {
                const [src, needUflag, consumed, magic] = (0, brace_expressions_js_1.parseClass)(glob, i);
                if (consumed) {
                    re += src;
                    uflag = uflag || needUflag;
                    i += consumed - 1;
                    hasMagic = hasMagic || magic;
                    continue;
                }
            }
            if (c === '*') {
                if (noEmpty && glob === '*')
                    re += starNoEmpty;
                else
                    re += star;
                hasMagic = true;
                continue;
            }
            if (c === '?') {
                re += qmark;
                hasMagic = true;
                continue;
            }
            re += regExpEscape(c);
        }
        return [re, (0, unescape_js_1.unescape)(glob), !!hasMagic, uflag];
    }
}
exports.AST = AST;
//# sourceMappingURL=ast.js.map

/***/ }),

/***/ 90:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// translate the various posix character classes into unicode properties
// this works across all unicode locales
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseClass = void 0;
// { <posix class>: [<translation>, /u flag required, negated]
const posixClasses = {
    '[:alnum:]': ['\\p{L}\\p{Nl}\\p{Nd}', true],
    '[:alpha:]': ['\\p{L}\\p{Nl}', true],
    '[:ascii:]': ['\\x' + '00-\\x' + '7f', false],
    '[:blank:]': ['\\p{Zs}\\t', true],
    '[:cntrl:]': ['\\p{Cc}', true],
    '[:digit:]': ['\\p{Nd}', true],
    '[:graph:]': ['\\p{Z}\\p{C}', true, true],
    '[:lower:]': ['\\p{Ll}', true],
    '[:print:]': ['\\p{C}', true],
    '[:punct:]': ['\\p{P}', true],
    '[:space:]': ['\\p{Z}\\t\\r\\n\\v\\f', true],
    '[:upper:]': ['\\p{Lu}', true],
    '[:word:]': ['\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}', true],
    '[:xdigit:]': ['A-Fa-f0-9', false],
};
// only need to escape a few things inside of brace expressions
// escapes: [ \ ] -
const braceEscape = (s) => s.replace(/[[\]\\-]/g, '\\$&');
// escape all regexp magic characters
const regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// everything has already been escaped, we just have to join
const rangesToString = (ranges) => ranges.join('');
// takes a glob string at a posix brace expression, and returns
// an equivalent regular expression source, and boolean indicating
// whether the /u flag needs to be applied, and the number of chars
// consumed to parse the character class.
// This also removes out of order ranges, and returns ($.) if the
// entire class just no good.
const parseClass = (glob, position) => {
    const pos = position;
    /* c8 ignore start */
    if (glob.charAt(pos) !== '[') {
        throw new Error('not in a brace expression');
    }
    /* c8 ignore stop */
    const ranges = [];
    const negs = [];
    let i = pos + 1;
    let sawStart = false;
    let uflag = false;
    let escaping = false;
    let negate = false;
    let endPos = pos;
    let rangeStart = '';
    WHILE: while (i < glob.length) {
        const c = glob.charAt(i);
        if ((c === '!' || c === '^') && i === pos + 1) {
            negate = true;
            i++;
            continue;
        }
        if (c === ']' && sawStart && !escaping) {
            endPos = i + 1;
            break;
        }
        sawStart = true;
        if (c === '\\') {
            if (!escaping) {
                escaping = true;
                i++;
                continue;
            }
            // escaped \ char, fall through and treat like normal char
        }
        if (c === '[' && !escaping) {
            // either a posix class, a collation equivalent, or just a [
            for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
                if (glob.startsWith(cls, i)) {
                    // invalid, [a-[] is fine, but not [a-[:alpha]]
                    if (rangeStart) {
                        return ['$.', false, glob.length - pos, true];
                    }
                    i += cls.length;
                    if (neg)
                        negs.push(unip);
                    else
                        ranges.push(unip);
                    uflag = uflag || u;
                    continue WHILE;
                }
            }
        }
        // now it's just a normal character, effectively
        escaping = false;
        if (rangeStart) {
            // throw this range away if it's not valid, but others
            // can still match.
            if (c > rangeStart) {
                ranges.push(braceEscape(rangeStart) + '-' + braceEscape(c));
            }
            else if (c === rangeStart) {
                ranges.push(braceEscape(c));
            }
            rangeStart = '';
            i++;
            continue;
        }
        // now might be the start of a range.
        // can be either c-d or c-] or c<more...>] or c] at this point
        if (glob.startsWith('-]', i + 1)) {
            ranges.push(braceEscape(c + '-'));
            i += 2;
            continue;
        }
        if (glob.startsWith('-', i + 1)) {
            rangeStart = c;
            i += 2;
            continue;
        }
        // not the start of a range, just a single character
        ranges.push(braceEscape(c));
        i++;
    }
    if (endPos < i) {
        // didn't see the end of the class, not a valid class,
        // but might still be valid as a literal match.
        return ['', false, 0, false];
    }
    // if we got no ranges and no negates, then we have a range that
    // cannot possibly match anything, and that poisons the whole glob
    if (!ranges.length && !negs.length) {
        return ['$.', false, glob.length - pos, true];
    }
    // if we got one positive range, and it's a single character, then that's
    // not actually a magic pattern, it's just that one literal character.
    // we should not treat that as "magic", we should just return the literal
    // character. [_] is a perfectly valid way to escape glob magic chars.
    if (negs.length === 0 &&
        ranges.length === 1 &&
        /^\\?.$/.test(ranges[0]) &&
        !negate) {
        const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
        return [regexpEscape(r), false, endPos - pos, false];
    }
    const sranges = '[' + (negate ? '^' : '') + rangesToString(ranges) + ']';
    const snegs = '[' + (negate ? '' : '^') + rangesToString(negs) + ']';
    const comb = ranges.length && negs.length
        ? '(' + sranges + '|' + snegs + ')'
        : ranges.length
            ? sranges
            : snegs;
    return [comb, uflag, endPos - pos, true];
};
exports.parseClass = parseClass;
//# sourceMappingURL=brace-expressions.js.map

/***/ }),

/***/ 800:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.escape = void 0;
/**
 * Escape all magic characters in a glob pattern.
 *
 * If the {@link windowsPathsNoEscape | GlobOptions.windowsPathsNoEscape}
 * option is used, then characters are escaped by wrapping in `[]`, because
 * a magic character wrapped in a character class can only be satisfied by
 * that exact character.  In this mode, `\` is _not_ escaped, because it is
 * not interpreted as a magic character, but instead as a path separator.
 */
const escape = (s, { windowsPathsNoEscape = false, } = {}) => {
    // don't need to escape +@! because we escape the parens
    // that make those magic, and escaping ! as [!] isn't valid,
    // because [!]] is a valid glob class meaning not ']'.
    return windowsPathsNoEscape
        ? s.replace(/[?*()[\]]/g, '[$&]')
        : s.replace(/[?*()[\]\\]/g, '\\$&');
};
exports.escape = escape;
//# sourceMappingURL=escape.js.map

/***/ }),

/***/ 507:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unescape = exports.escape = exports.AST = exports.Minimatch = exports.match = exports.makeRe = exports.braceExpand = exports.defaults = exports.filter = exports.GLOBSTAR = exports.sep = exports.minimatch = void 0;
const brace_expansion_1 = __importDefault(__nccwpck_require__(691));
const assert_valid_pattern_js_1 = __nccwpck_require__(305);
const ast_js_1 = __nccwpck_require__(803);
const escape_js_1 = __nccwpck_require__(800);
const unescape_js_1 = __nccwpck_require__(851);
const minimatch = (p, pattern, options = {}) => {
    (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
    // shortcut: comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === '#') {
        return false;
    }
    return new Minimatch(pattern, options).match(p);
};
exports.minimatch = minimatch;
// Optimized checking for the most common glob patterns.
const starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
const starDotExtTest = (ext) => (f) => !f.startsWith('.') && f.endsWith(ext);
const starDotExtTestDot = (ext) => (f) => f.endsWith(ext);
const starDotExtTestNocase = (ext) => {
    ext = ext.toLowerCase();
    return (f) => !f.startsWith('.') && f.toLowerCase().endsWith(ext);
};
const starDotExtTestNocaseDot = (ext) => {
    ext = ext.toLowerCase();
    return (f) => f.toLowerCase().endsWith(ext);
};
const starDotStarRE = /^\*+\.\*+$/;
const starDotStarTest = (f) => !f.startsWith('.') && f.includes('.');
const starDotStarTestDot = (f) => f !== '.' && f !== '..' && f.includes('.');
const dotStarRE = /^\.\*+$/;
const dotStarTest = (f) => f !== '.' && f !== '..' && f.startsWith('.');
const starRE = /^\*+$/;
const starTest = (f) => f.length !== 0 && !f.startsWith('.');
const starTestDot = (f) => f.length !== 0 && f !== '.' && f !== '..';
const qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
const qmarksTestNocase = ([$0, ext = '']) => {
    const noext = qmarksTestNoExt([$0]);
    if (!ext)
        return noext;
    ext = ext.toLowerCase();
    return (f) => noext(f) && f.toLowerCase().endsWith(ext);
};
const qmarksTestNocaseDot = ([$0, ext = '']) => {
    const noext = qmarksTestNoExtDot([$0]);
    if (!ext)
        return noext;
    ext = ext.toLowerCase();
    return (f) => noext(f) && f.toLowerCase().endsWith(ext);
};
const qmarksTestDot = ([$0, ext = '']) => {
    const noext = qmarksTestNoExtDot([$0]);
    return !ext ? noext : (f) => noext(f) && f.endsWith(ext);
};
const qmarksTest = ([$0, ext = '']) => {
    const noext = qmarksTestNoExt([$0]);
    return !ext ? noext : (f) => noext(f) && f.endsWith(ext);
};
const qmarksTestNoExt = ([$0]) => {
    const len = $0.length;
    return (f) => f.length === len && !f.startsWith('.');
};
const qmarksTestNoExtDot = ([$0]) => {
    const len = $0.length;
    return (f) => f.length === len && f !== '.' && f !== '..';
};
/* c8 ignore start */
const defaultPlatform = (typeof process === 'object' && process
    ? (typeof process.env === 'object' &&
        process.env &&
        process.env.__MINIMATCH_TESTING_PLATFORM__) ||
        process.platform
    : 'posix');
const path = {
    win32: { sep: '\\' },
    posix: { sep: '/' },
};
/* c8 ignore stop */
exports.sep = defaultPlatform === 'win32' ? path.win32.sep : path.posix.sep;
exports.minimatch.sep = exports.sep;
exports.GLOBSTAR = Symbol('globstar **');
exports.minimatch.GLOBSTAR = exports.GLOBSTAR;
// any single thing other than /
// don't need to escape / when using new RegExp()
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
const twoStarDot = '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?';
// not a ^ or / followed by a dot,
// followed by anything, any number of times.
const twoStarNoDot = '(?:(?!(?:\\/|^)\\.).)*?';
const filter = (pattern, options = {}) => (p) => (0, exports.minimatch)(p, pattern, options);
exports.filter = filter;
exports.minimatch.filter = exports.filter;
const ext = (a, b = {}) => Object.assign({}, a, b);
const defaults = (def) => {
    if (!def || typeof def !== 'object' || !Object.keys(def).length) {
        return exports.minimatch;
    }
    const orig = exports.minimatch;
    const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
    return Object.assign(m, {
        Minimatch: class Minimatch extends orig.Minimatch {
            constructor(pattern, options = {}) {
                super(pattern, ext(def, options));
            }
            static defaults(options) {
                return orig.defaults(ext(def, options)).Minimatch;
            }
        },
        AST: class AST extends orig.AST {
            /* c8 ignore start */
            constructor(type, parent, options = {}) {
                super(type, parent, ext(def, options));
            }
            /* c8 ignore stop */
            static fromGlob(pattern, options = {}) {
                return orig.AST.fromGlob(pattern, ext(def, options));
            }
        },
        unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
        escape: (s, options = {}) => orig.escape(s, ext(def, options)),
        filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
        defaults: (options) => orig.defaults(ext(def, options)),
        makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
        braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
        match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
        sep: orig.sep,
        GLOBSTAR: exports.GLOBSTAR,
    });
};
exports.defaults = defaults;
exports.minimatch.defaults = exports.defaults;
// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
const braceExpand = (pattern, options = {}) => {
    (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
    // Thanks to Yeting Li <https://github.com/yetingli> for
    // improving this regexp to avoid a ReDOS vulnerability.
    if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        // shortcut. no need to expand.
        return [pattern];
    }
    return (0, brace_expansion_1.default)(pattern);
};
exports.braceExpand = braceExpand;
exports.minimatch.braceExpand = exports.braceExpand;
// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
const makeRe = (pattern, options = {}) => new Minimatch(pattern, options).makeRe();
exports.makeRe = makeRe;
exports.minimatch.makeRe = exports.makeRe;
const match = (list, pattern, options = {}) => {
    const mm = new Minimatch(pattern, options);
    list = list.filter(f => mm.match(f));
    if (mm.options.nonull && !list.length) {
        list.push(pattern);
    }
    return list;
};
exports.match = match;
exports.minimatch.match = exports.match;
// replace stuff like \* with *
const globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
class Minimatch {
    options;
    set;
    pattern;
    windowsPathsNoEscape;
    nonegate;
    negate;
    comment;
    empty;
    preserveMultipleSlashes;
    partial;
    globSet;
    globParts;
    nocase;
    isWindows;
    platform;
    windowsNoMagicRoot;
    regexp;
    constructor(pattern, options = {}) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
        options = options || {};
        this.options = options;
        this.pattern = pattern;
        this.platform = options.platform || defaultPlatform;
        this.isWindows = this.platform === 'win32';
        this.windowsPathsNoEscape =
            !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
            this.pattern = this.pattern.replace(/\\/g, '/');
        }
        this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
        this.regexp = null;
        this.negate = false;
        this.nonegate = !!options.nonegate;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;
        this.nocase = !!this.options.nocase;
        this.windowsNoMagicRoot =
            options.windowsNoMagicRoot !== undefined
                ? options.windowsNoMagicRoot
                : !!(this.isWindows && this.nocase);
        this.globSet = [];
        this.globParts = [];
        this.set = [];
        // make the set of regexps etc.
        this.make();
    }
    hasMagic() {
        if (this.options.magicalBraces && this.set.length > 1) {
            return true;
        }
        for (const pattern of this.set) {
            for (const part of pattern) {
                if (typeof part !== 'string')
                    return true;
            }
        }
        return false;
    }
    debug(..._) { }
    make() {
        const pattern = this.pattern;
        const options = this.options;
        // empty patterns and comments match nothing.
        if (!options.nocomment && pattern.charAt(0) === '#') {
            this.comment = true;
            return;
        }
        if (!pattern) {
            this.empty = true;
            return;
        }
        // step 1: figure out negation, etc.
        this.parseNegate();
        // step 2: expand braces
        this.globSet = [...new Set(this.braceExpand())];
        if (options.debug) {
            this.debug = (...args) => console.error(...args);
        }
        this.debug(this.pattern, this.globSet);
        // step 3: now we have a set, so turn each one into a series of
        // path-portion matching patterns.
        // These will be regexps, except in the case of "**", which is
        // set to the GLOBSTAR object for globstar behavior,
        // and will not contain any / characters
        //
        // First, we preprocess to make the glob pattern sets a bit simpler
        // and deduped.  There are some perf-killing patterns that can cause
        // problems with a glob walk, but we can simplify them down a bit.
        const rawGlobParts = this.globSet.map(s => this.slashSplit(s));
        this.globParts = this.preprocess(rawGlobParts);
        this.debug(this.pattern, this.globParts);
        // glob --> regexps
        let set = this.globParts.map((s, _, __) => {
            if (this.isWindows && this.windowsNoMagicRoot) {
                // check if it's a drive or unc path.
                const isUNC = s[0] === '' &&
                    s[1] === '' &&
                    (s[2] === '?' || !globMagic.test(s[2])) &&
                    !globMagic.test(s[3]);
                const isDrive = /^[a-z]:/i.test(s[0]);
                if (isUNC) {
                    return [...s.slice(0, 4), ...s.slice(4).map(ss => this.parse(ss))];
                }
                else if (isDrive) {
                    return [s[0], ...s.slice(1).map(ss => this.parse(ss))];
                }
            }
            return s.map(ss => this.parse(ss));
        });
        this.debug(this.pattern, set);
        // filter out everything that didn't compile properly.
        this.set = set.filter(s => s.indexOf(false) === -1);
        // do not treat the ? in UNC paths as magic
        if (this.isWindows) {
            for (let i = 0; i < this.set.length; i++) {
                const p = this.set[i];
                if (p[0] === '' &&
                    p[1] === '' &&
                    this.globParts[i][2] === '?' &&
                    typeof p[3] === 'string' &&
                    /^[a-z]:$/i.test(p[3])) {
                    p[2] = '?';
                }
            }
        }
        this.debug(this.pattern, this.set);
    }
    // various transforms to equivalent pattern sets that are
    // faster to process in a filesystem walk.  The goal is to
    // eliminate what we can, and push all ** patterns as far
    // to the right as possible, even if it increases the number
    // of patterns that we have to process.
    preprocess(globParts) {
        // if we're not in globstar mode, then turn all ** into *
        if (this.options.noglobstar) {
            for (let i = 0; i < globParts.length; i++) {
                for (let j = 0; j < globParts[i].length; j++) {
                    if (globParts[i][j] === '**') {
                        globParts[i][j] = '*';
                    }
                }
            }
        }
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
            // aggressive optimization for the purpose of fs walking
            globParts = this.firstPhasePreProcess(globParts);
            globParts = this.secondPhasePreProcess(globParts);
        }
        else if (optimizationLevel >= 1) {
            // just basic optimizations to remove some .. parts
            globParts = this.levelOneOptimize(globParts);
        }
        else {
            // just collapse multiple ** portions into one
            globParts = this.adjascentGlobstarOptimize(globParts);
        }
        return globParts;
    }
    // just get rid of adjascent ** portions
    adjascentGlobstarOptimize(globParts) {
        return globParts.map(parts => {
            let gs = -1;
            while (-1 !== (gs = parts.indexOf('**', gs + 1))) {
                let i = gs;
                while (parts[i + 1] === '**') {
                    i++;
                }
                if (i !== gs) {
                    parts.splice(gs, i - gs);
                }
            }
            return parts;
        });
    }
    // get rid of adjascent ** and resolve .. portions
    levelOneOptimize(globParts) {
        return globParts.map(parts => {
            parts = parts.reduce((set, part) => {
                const prev = set[set.length - 1];
                if (part === '**' && prev === '**') {
                    return set;
                }
                if (part === '..') {
                    if (prev && prev !== '..' && prev !== '.' && prev !== '**') {
                        set.pop();
                        return set;
                    }
                }
                set.push(part);
                return set;
            }, []);
            return parts.length === 0 ? [''] : parts;
        });
    }
    levelTwoFileOptimize(parts) {
        if (!Array.isArray(parts)) {
            parts = this.slashSplit(parts);
        }
        let didSomething = false;
        do {
            didSomething = false;
            // <pre>/<e>/<rest> -> <pre>/<rest>
            if (!this.preserveMultipleSlashes) {
                for (let i = 1; i < parts.length - 1; i++) {
                    const p = parts[i];
                    // don't squeeze out UNC patterns
                    if (i === 1 && p === '' && parts[0] === '')
                        continue;
                    if (p === '.' || p === '') {
                        didSomething = true;
                        parts.splice(i, 1);
                        i--;
                    }
                }
                if (parts[0] === '.' &&
                    parts.length === 2 &&
                    (parts[1] === '.' || parts[1] === '')) {
                    didSomething = true;
                    parts.pop();
                }
            }
            // <pre>/<p>/../<rest> -> <pre>/<rest>
            let dd = 0;
            while (-1 !== (dd = parts.indexOf('..', dd + 1))) {
                const p = parts[dd - 1];
                if (p && p !== '.' && p !== '..' && p !== '**') {
                    didSomething = true;
                    parts.splice(dd - 1, 2);
                    dd -= 2;
                }
            }
        } while (didSomething);
        return parts.length === 0 ? [''] : parts;
    }
    // First phase: single-pattern processing
    // <pre> is 1 or more portions
    // <rest> is 1 or more portions
    // <p> is any portion other than ., .., '', or **
    // <e> is . or ''
    //
    // **/.. is *brutal* for filesystem walking performance, because
    // it effectively resets the recursive walk each time it occurs,
    // and ** cannot be reduced out by a .. pattern part like a regexp
    // or most strings (other than .., ., and '') can be.
    //
    // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
    // <pre>/<e>/<rest> -> <pre>/<rest>
    // <pre>/<p>/../<rest> -> <pre>/<rest>
    // **/**/<rest> -> **/<rest>
    //
    // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
    // this WOULD be allowed if ** did follow symlinks, or * didn't
    firstPhasePreProcess(globParts) {
        let didSomething = false;
        do {
            didSomething = false;
            // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
            for (let parts of globParts) {
                let gs = -1;
                while (-1 !== (gs = parts.indexOf('**', gs + 1))) {
                    let gss = gs;
                    while (parts[gss + 1] === '**') {
                        // <pre>/**/**/<rest> -> <pre>/**/<rest>
                        gss++;
                    }
                    // eg, if gs is 2 and gss is 4, that means we have 3 **
                    // parts, and can remove 2 of them.
                    if (gss > gs) {
                        parts.splice(gs + 1, gss - gs);
                    }
                    let next = parts[gs + 1];
                    const p = parts[gs + 2];
                    const p2 = parts[gs + 3];
                    if (next !== '..')
                        continue;
                    if (!p ||
                        p === '.' ||
                        p === '..' ||
                        !p2 ||
                        p2 === '.' ||
                        p2 === '..') {
                        continue;
                    }
                    didSomething = true;
                    // edit parts in place, and push the new one
                    parts.splice(gs, 1);
                    const other = parts.slice(0);
                    other[gs] = '**';
                    globParts.push(other);
                    gs--;
                }
                // <pre>/<e>/<rest> -> <pre>/<rest>
                if (!this.preserveMultipleSlashes) {
                    for (let i = 1; i < parts.length - 1; i++) {
                        const p = parts[i];
                        // don't squeeze out UNC patterns
                        if (i === 1 && p === '' && parts[0] === '')
                            continue;
                        if (p === '.' || p === '') {
                            didSomething = true;
                            parts.splice(i, 1);
                            i--;
                        }
                    }
                    if (parts[0] === '.' &&
                        parts.length === 2 &&
                        (parts[1] === '.' || parts[1] === '')) {
                        didSomething = true;
                        parts.pop();
                    }
                }
                // <pre>/<p>/../<rest> -> <pre>/<rest>
                let dd = 0;
                while (-1 !== (dd = parts.indexOf('..', dd + 1))) {
                    const p = parts[dd - 1];
                    if (p && p !== '.' && p !== '..' && p !== '**') {
                        didSomething = true;
                        const needDot = dd === 1 && parts[dd + 1] === '**';
                        const splin = needDot ? ['.'] : [];
                        parts.splice(dd - 1, 2, ...splin);
                        if (parts.length === 0)
                            parts.push('');
                        dd -= 2;
                    }
                }
            }
        } while (didSomething);
        return globParts;
    }
    // second phase: multi-pattern dedupes
    // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
    // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
    // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
    //
    // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
    // ^-- not valid because ** doens't follow symlinks
    secondPhasePreProcess(globParts) {
        for (let i = 0; i < globParts.length - 1; i++) {
            for (let j = i + 1; j < globParts.length; j++) {
                const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
                if (matched) {
                    globParts[i] = [];
                    globParts[j] = matched;
                    break;
                }
            }
        }
        return globParts.filter(gs => gs.length);
    }
    partsMatch(a, b, emptyGSMatch = false) {
        let ai = 0;
        let bi = 0;
        let result = [];
        let which = '';
        while (ai < a.length && bi < b.length) {
            if (a[ai] === b[bi]) {
                result.push(which === 'b' ? b[bi] : a[ai]);
                ai++;
                bi++;
            }
            else if (emptyGSMatch && a[ai] === '**' && b[bi] === a[ai + 1]) {
                result.push(a[ai]);
                ai++;
            }
            else if (emptyGSMatch && b[bi] === '**' && a[ai] === b[bi + 1]) {
                result.push(b[bi]);
                bi++;
            }
            else if (a[ai] === '*' &&
                b[bi] &&
                (this.options.dot || !b[bi].startsWith('.')) &&
                b[bi] !== '**') {
                if (which === 'b')
                    return false;
                which = 'a';
                result.push(a[ai]);
                ai++;
                bi++;
            }
            else if (b[bi] === '*' &&
                a[ai] &&
                (this.options.dot || !a[ai].startsWith('.')) &&
                a[ai] !== '**') {
                if (which === 'a')
                    return false;
                which = 'b';
                result.push(b[bi]);
                ai++;
                bi++;
            }
            else {
                return false;
            }
        }
        // if we fall out of the loop, it means they two are identical
        // as long as their lengths match
        return a.length === b.length && result;
    }
    parseNegate() {
        if (this.nonegate)
            return;
        const pattern = this.pattern;
        let negate = false;
        let negateOffset = 0;
        for (let i = 0; i < pattern.length && pattern.charAt(i) === '!'; i++) {
            negate = !negate;
            negateOffset++;
        }
        if (negateOffset)
            this.pattern = pattern.slice(negateOffset);
        this.negate = negate;
    }
    // set partial to true to test if, for example,
    // "/a/b" matches the start of "/*/b/*/d"
    // Partial means, if you run out of file before you run
    // out of pattern, then that's fine, as long as all
    // the parts match.
    matchOne(file, pattern, partial = false) {
        const options = this.options;
        // UNC paths like //?/X:/... can match X:/... and vice versa
        // Drive letters in absolute drive or unc paths are always compared
        // case-insensitively.
        if (this.isWindows) {
            const fileDrive = typeof file[0] === 'string' && /^[a-z]:$/i.test(file[0]);
            const fileUNC = !fileDrive &&
                file[0] === '' &&
                file[1] === '' &&
                file[2] === '?' &&
                /^[a-z]:$/i.test(file[3]);
            const patternDrive = typeof pattern[0] === 'string' && /^[a-z]:$/i.test(pattern[0]);
            const patternUNC = !patternDrive &&
                pattern[0] === '' &&
                pattern[1] === '' &&
                pattern[2] === '?' &&
                typeof pattern[3] === 'string' &&
                /^[a-z]:$/i.test(pattern[3]);
            const fdi = fileUNC ? 3 : fileDrive ? 0 : undefined;
            const pdi = patternUNC ? 3 : patternDrive ? 0 : undefined;
            if (typeof fdi === 'number' && typeof pdi === 'number') {
                const [fd, pd] = [file[fdi], pattern[pdi]];
                if (fd.toLowerCase() === pd.toLowerCase()) {
                    pattern[pdi] = fd;
                    if (pdi > fdi) {
                        pattern = pattern.slice(pdi);
                    }
                    else if (fdi > pdi) {
                        file = file.slice(fdi);
                    }
                }
            }
        }
        // resolve and reduce . and .. portions in the file as well.
        // dont' need to do the second phase, because it's only one string[]
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
            file = this.levelTwoFileOptimize(file);
        }
        this.debug('matchOne', this, { file, pattern });
        this.debug('matchOne', file.length, pattern.length);
        for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
            this.debug('matchOne loop');
            var p = pattern[pi];
            var f = file[fi];
            this.debug(pattern, p, f);
            // should be impossible.
            // some invalid regexp stuff in the set.
            /* c8 ignore start */
            if (p === false) {
                return false;
            }
            /* c8 ignore stop */
            if (p === exports.GLOBSTAR) {
                this.debug('GLOBSTAR', [pattern, p, f]);
                // "**"
                // a/**/b/**/c would match the following:
                // a/b/x/y/z/c
                // a/x/y/z/b/c
                // a/b/x/b/x/c
                // a/b/c
                // To do this, take the rest of the pattern after
                // the **, and see if it would match the file remainder.
                // If so, return success.
                // If not, the ** "swallows" a segment, and try again.
                // This is recursively awful.
                //
                // a/**/b/**/c matching a/b/x/y/z/c
                // - a matches a
                // - doublestar
                //   - matchOne(b/x/y/z/c, b/**/c)
                //     - b matches b
                //     - doublestar
                //       - matchOne(x/y/z/c, c) -> no
                //       - matchOne(y/z/c, c) -> no
                //       - matchOne(z/c, c) -> no
                //       - matchOne(c, c) yes, hit
                var fr = fi;
                var pr = pi + 1;
                if (pr === pl) {
                    this.debug('** at the end');
                    // a ** at the end will just swallow the rest.
                    // We have found a match.
                    // however, it will not swallow /.x, unless
                    // options.dot is set.
                    // . and .. are *never* matched by **, for explosively
                    // exponential reasons.
                    for (; fi < fl; fi++) {
                        if (file[fi] === '.' ||
                            file[fi] === '..' ||
                            (!options.dot && file[fi].charAt(0) === '.'))
                            return false;
                    }
                    return true;
                }
                // ok, let's see if we can swallow whatever we can.
                while (fr < fl) {
                    var swallowee = file[fr];
                    this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);
                    // XXX remove this slice.  Just pass the start index.
                    if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                        this.debug('globstar found match!', fr, fl, swallowee);
                        // found a match.
                        return true;
                    }
                    else {
                        // can't swallow "." or ".." ever.
                        // can only swallow ".foo" when explicitly asked.
                        if (swallowee === '.' ||
                            swallowee === '..' ||
                            (!options.dot && swallowee.charAt(0) === '.')) {
                            this.debug('dot detected!', file, fr, pattern, pr);
                            break;
                        }
                        // ** swallows a segment, and continue.
                        this.debug('globstar swallow a segment, and continue');
                        fr++;
                    }
                }
                // no match was found.
                // However, in partial mode, we can't say this is necessarily over.
                /* c8 ignore start */
                if (partial) {
                    // ran out of file
                    this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
                    if (fr === fl) {
                        return true;
                    }
                }
                /* c8 ignore stop */
                return false;
            }
            // something other than **
            // non-magic patterns just have to match exactly
            // patterns with magic have been turned into regexps.
            let hit;
            if (typeof p === 'string') {
                hit = f === p;
                this.debug('string match', p, f, hit);
            }
            else {
                hit = p.test(f);
                this.debug('pattern match', p, f, hit);
            }
            if (!hit)
                return false;
        }
        // Note: ending in / means that we'll get a final ""
        // at the end of the pattern.  This can only match a
        // corresponding "" at the end of the file.
        // If the file ends in /, then it can only match a
        // a pattern that ends in /, unless the pattern just
        // doesn't have any more for it. But, a/b/ should *not*
        // match "a/b/*", even though "" matches against the
        // [^/]*? pattern, except in partial mode, where it might
        // simply not be reached yet.
        // However, a/b/ should still satisfy a/*
        // now either we fell off the end of the pattern, or we're done.
        if (fi === fl && pi === pl) {
            // ran out of pattern and filename at the same time.
            // an exact hit!
            return true;
        }
        else if (fi === fl) {
            // ran out of file, but still had pattern left.
            // this is ok if we're doing the match as part of
            // a glob fs traversal.
            return partial;
        }
        else if (pi === pl) {
            // ran out of pattern, still have file left.
            // this is only acceptable if we're on the very last
            // empty segment of a file with a trailing slash.
            // a/* should match a/b/
            return fi === fl - 1 && file[fi] === '';
            /* c8 ignore start */
        }
        else {
            // should be unreachable.
            throw new Error('wtf?');
        }
        /* c8 ignore stop */
    }
    braceExpand() {
        return (0, exports.braceExpand)(this.pattern, this.options);
    }
    parse(pattern) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
        const options = this.options;
        // shortcuts
        if (pattern === '**')
            return exports.GLOBSTAR;
        if (pattern === '')
            return '';
        // far and away, the most common glob pattern parts are
        // *, *.*, and *.<ext>  Add a fast check method for those.
        let m;
        let fastTest = null;
        if ((m = pattern.match(starRE))) {
            fastTest = options.dot ? starTestDot : starTest;
        }
        else if ((m = pattern.match(starDotExtRE))) {
            fastTest = (options.nocase
                ? options.dot
                    ? starDotExtTestNocaseDot
                    : starDotExtTestNocase
                : options.dot
                    ? starDotExtTestDot
                    : starDotExtTest)(m[1]);
        }
        else if ((m = pattern.match(qmarksRE))) {
            fastTest = (options.nocase
                ? options.dot
                    ? qmarksTestNocaseDot
                    : qmarksTestNocase
                : options.dot
                    ? qmarksTestDot
                    : qmarksTest)(m);
        }
        else if ((m = pattern.match(starDotStarRE))) {
            fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
        }
        else if ((m = pattern.match(dotStarRE))) {
            fastTest = dotStarTest;
        }
        const re = ast_js_1.AST.fromGlob(pattern, this.options).toMMPattern();
        if (fastTest && typeof re === 'object') {
            // Avoids overriding in frozen environments
            Reflect.defineProperty(re, 'test', { value: fastTest });
        }
        return re;
    }
    makeRe() {
        if (this.regexp || this.regexp === false)
            return this.regexp;
        // at this point, this.set is a 2d array of partial
        // pattern strings, or "**".
        //
        // It's better to use .match().  This function shouldn't
        // be used, really, but it's pretty convenient sometimes,
        // when you just want to work with a regex.
        const set = this.set;
        if (!set.length) {
            this.regexp = false;
            return this.regexp;
        }
        const options = this.options;
        const twoStar = options.noglobstar
            ? star
            : options.dot
                ? twoStarDot
                : twoStarNoDot;
        const flags = new Set(options.nocase ? ['i'] : []);
        // regexpify non-globstar patterns
        // if ** is only item, then we just do one twoStar
        // if ** is first, and there are more, prepend (\/|twoStar\/)? to next
        // if ** is last, append (\/twoStar|) to previous
        // if ** is in the middle, append (\/|\/twoStar\/) to previous
        // then filter out GLOBSTAR symbols
        let re = set
            .map(pattern => {
            const pp = pattern.map(p => {
                if (p instanceof RegExp) {
                    for (const f of p.flags.split(''))
                        flags.add(f);
                }
                return typeof p === 'string'
                    ? regExpEscape(p)
                    : p === exports.GLOBSTAR
                        ? exports.GLOBSTAR
                        : p._src;
            });
            pp.forEach((p, i) => {
                const next = pp[i + 1];
                const prev = pp[i - 1];
                if (p !== exports.GLOBSTAR || prev === exports.GLOBSTAR) {
                    return;
                }
                if (prev === undefined) {
                    if (next !== undefined && next !== exports.GLOBSTAR) {
                        pp[i + 1] = '(?:\\/|' + twoStar + '\\/)?' + next;
                    }
                    else {
                        pp[i] = twoStar;
                    }
                }
                else if (next === undefined) {
                    pp[i - 1] = prev + '(?:\\/|' + twoStar + ')?';
                }
                else if (next !== exports.GLOBSTAR) {
                    pp[i - 1] = prev + '(?:\\/|\\/' + twoStar + '\\/)' + next;
                    pp[i + 1] = exports.GLOBSTAR;
                }
            });
            return pp.filter(p => p !== exports.GLOBSTAR).join('/');
        })
            .join('|');
        // need to wrap in parens if we had more than one thing with |,
        // otherwise only the first will be anchored to ^ and the last to $
        const [open, close] = set.length > 1 ? ['(?:', ')'] : ['', ''];
        // must match entire pattern
        // ending in a * or ** will make it less strict.
        re = '^' + open + re + close + '$';
        // can match anything, as long as it's not this.
        if (this.negate)
            re = '^(?!' + re + ').+$';
        try {
            this.regexp = new RegExp(re, [...flags].join(''));
            /* c8 ignore start */
        }
        catch (ex) {
            // should be impossible
            this.regexp = false;
        }
        /* c8 ignore stop */
        return this.regexp;
    }
    slashSplit(p) {
        // if p starts with // on windows, we preserve that
        // so that UNC paths aren't broken.  Otherwise, any number of
        // / characters are coalesced into one, unless
        // preserveMultipleSlashes is set to true.
        if (this.preserveMultipleSlashes) {
            return p.split('/');
        }
        else if (this.isWindows && /^\/\/[^\/]+/.test(p)) {
            // add an extra '' for the one we lose
            return ['', ...p.split(/\/+/)];
        }
        else {
            return p.split(/\/+/);
        }
    }
    match(f, partial = this.partial) {
        this.debug('match', f, this.pattern);
        // short-circuit in the case of busted things.
        // comments, etc.
        if (this.comment) {
            return false;
        }
        if (this.empty) {
            return f === '';
        }
        if (f === '/' && partial) {
            return true;
        }
        const options = this.options;
        // windows: need to use /, not \
        if (this.isWindows) {
            f = f.split('\\').join('/');
        }
        // treat the test path as a set of pathparts.
        const ff = this.slashSplit(f);
        this.debug(this.pattern, 'split', ff);
        // just ONE of the pattern sets in this.set needs to match
        // in order for it to be valid.  If negating, then just one
        // match means that we have failed.
        // Either way, return on the first hit.
        const set = this.set;
        this.debug(this.pattern, 'set', set);
        // Find the basename of the path by looking for the last non-empty segment
        let filename = ff[ff.length - 1];
        if (!filename) {
            for (let i = ff.length - 2; !filename && i >= 0; i--) {
                filename = ff[i];
            }
        }
        for (let i = 0; i < set.length; i++) {
            const pattern = set[i];
            let file = ff;
            if (options.matchBase && pattern.length === 1) {
                file = [filename];
            }
            const hit = this.matchOne(file, pattern, partial);
            if (hit) {
                if (options.flipNegate) {
                    return true;
                }
                return !this.negate;
            }
        }
        // didn't get any hits.  this is success if it's a negative
        // pattern, failure otherwise.
        if (options.flipNegate) {
            return false;
        }
        return this.negate;
    }
    static defaults(def) {
        return exports.minimatch.defaults(def).Minimatch;
    }
}
exports.Minimatch = Minimatch;
/* c8 ignore start */
var ast_js_2 = __nccwpck_require__(803);
Object.defineProperty(exports, "AST", ({ enumerable: true, get: function () { return ast_js_2.AST; } }));
var escape_js_2 = __nccwpck_require__(800);
Object.defineProperty(exports, "escape", ({ enumerable: true, get: function () { return escape_js_2.escape; } }));
var unescape_js_2 = __nccwpck_require__(851);
Object.defineProperty(exports, "unescape", ({ enumerable: true, get: function () { return unescape_js_2.unescape; } }));
/* c8 ignore stop */
exports.minimatch.AST = ast_js_1.AST;
exports.minimatch.Minimatch = Minimatch;
exports.minimatch.escape = escape_js_1.escape;
exports.minimatch.unescape = unescape_js_1.unescape;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 851:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unescape = void 0;
/**
 * Un-escape a string that has been escaped with {@link escape}.
 *
 * If the {@link windowsPathsNoEscape} option is used, then square-brace
 * escapes are removed, but not backslash escapes.  For example, it will turn
 * the string `'[*]'` into `*`, but it will not turn `'\\*'` into `'*'`,
 * becuase `\` is a path separator in `windowsPathsNoEscape` mode.
 *
 * When `windowsPathsNoEscape` is not set, then both brace escapes and
 * backslash escapes are removed.
 *
 * Slashes (and backslashes in `windowsPathsNoEscape` mode) cannot be escaped
 * or unescaped.
 */
const unescape = (s, { windowsPathsNoEscape = false, } = {}) => {
    return windowsPathsNoEscape
        ? s.replace(/\[([^\/\\])\]/g, '$1')
        : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, '$1$2').replace(/\\([^\/])/g, '$1');
};
exports.unescape = unescape;
//# sourceMappingURL=unescape.js.map

/***/ }),

/***/ 264:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {

"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  App: () => (/* binding */ dist_bundle_App),
  OAuthApp: () => (/* binding */ dist_bundle_OAuthApp),
  Octokit: () => (/* binding */ Octokit),
  RequestError: () => (/* reexport */ RequestError),
  createNodeMiddleware: () => (/* reexport */ dist_node_createNodeMiddleware)
});

;// CONCATENATED MODULE: ./node_modules/universal-user-agent/index.js
function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && process.version !== undefined) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${
      process.arch
    })`;
  }

  return "<environment undetectable>";
}

;// CONCATENATED MODULE: ./node_modules/before-after-hook/lib/register.js
// @ts-check

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce((callback, name) => {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(() => {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce((method, registered) => {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}

;// CONCATENATED MODULE: ./node_modules/before-after-hook/lib/add.js
// @ts-check

function addHook(state, kind, name, hook) {
  const orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = (method, options) => {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = (method, options) => {
      let result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then((result_) => {
          result = result_;
          return orig(result, options);
        })
        .then(() => {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = (method, options) => {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch((error) => {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}

;// CONCATENATED MODULE: ./node_modules/before-after-hook/lib/remove.js
// @ts-check

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  const index = state.registry[name]
    .map((registered) => {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}

;// CONCATENATED MODULE: ./node_modules/before-after-hook/index.js
// @ts-check





// bind with array of arguments: https://stackoverflow.com/a/21792913
const bind = Function.bind;
const bindable = bind.bind(bind);

function bindApi(hook, state, name) {
  const removeHookRef = bindable(removeHook, null).apply(
    null,
    name ? [state, name] : [state]
  );
  hook.api = { remove: removeHookRef };
  hook.remove = removeHookRef;
  ["before", "error", "after", "wrap"].forEach((kind) => {
    const args = name ? [state, kind, name] : [state, kind];
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
  });
}

function Singular() {
  const singularHookName = Symbol("Singular");
  const singularHookState = {
    registry: {},
  };
  const singularHook = register.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook;
}

function Collection() {
  const state = {
    registry: {},
  };

  const hook = register.bind(null, state);
  bindApi(hook, state);

  return hook;
}

/* harmony default export */ const before_after_hook = ({ Singular, Collection });

;// CONCATENATED MODULE: ./node_modules/@octokit/endpoint/dist-bundle/index.js
// pkg/dist-src/defaults.js


// pkg/dist-src/version.js
var VERSION = "0.0.0-development";

// pkg/dist-src/defaults.js
var userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;
var DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: ""
  }
};

// pkg/dist-src/util/lowercase-keys.js
function lowercaseKeys(object) {
  if (!object) {
    return {};
  }
  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

// pkg/dist-src/util/is-plain-object.js
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}

// pkg/dist-src/util/merge-deep.js
function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach((key) => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, { [key]: options[key] });
      else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, { [key]: options[key] });
    }
  });
  return result;
}

// pkg/dist-src/util/remove-undefined-properties.js
function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === void 0) {
      delete obj[key];
    }
  }
  return obj;
}

// pkg/dist-src/merge.js
function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }
  options.headers = lowercaseKeys(options.headers);
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options);
  if (options.url === "/graphql") {
    if (defaults && defaults.mediaType.previews?.length) {
      mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(
        (preview) => !mergedOptions.mediaType.previews.includes(preview)
      ).concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = (mergedOptions.mediaType.previews || []).map((preview) => preview.replace(/-preview/, ""));
  }
  return mergedOptions;
}

// pkg/dist-src/util/add-query-parameters.js
function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);
  if (names.length === 0) {
    return url;
  }
  return url + separator + names.map((name) => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }
    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

// pkg/dist-src/util/extract-url-variable-names.js
var urlVariableRegex = /\{[^{}}]+\}/g;
function removeNonChars(variableName) {
  return variableName.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);
  if (!matches) {
    return [];
  }
  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

// pkg/dist-src/util/omit.js
function omit(object, keysToOmit) {
  const result = { __proto__: null };
  for (const key of Object.keys(object)) {
    if (keysToOmit.indexOf(key) === -1) {
      result[key] = object[key];
    }
  }
  return result;
}

// pkg/dist-src/util/url-template.js
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }
    return part;
  }).join("");
}
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
  var value = context[key], result = [];
  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();
      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }
      result.push(
        encodeValue(operator, value, isKeyOperator(operator) ? key : "")
      );
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            result.push(
              encodeValue(operator, value2, isKeyOperator(operator) ? key : "")
            );
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            tmp.push(encodeValue(operator, value2));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }
        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}
function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}
function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  template = template.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(_, expression, literal) {
      if (expression) {
        let operator = "";
        const values = [];
        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }
        expression.split(/,/g).forEach(function(variable) {
          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
          values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
        });
        if (operator && operator !== "+") {
          var separator = ",";
          if (operator === "?") {
            separator = "&";
          } else if (operator !== "#") {
            separator = operator;
          }
          return (values.length !== 0 ? operator : "") + values.join(separator);
        } else {
          return values.join(",");
        }
      } else {
        return encodeReserved(literal);
      }
    }
  );
  if (template === "/") {
    return template;
  } else {
    return template.replace(/\/$/, "");
  }
}

// pkg/dist-src/parse.js
function parse(options) {
  let method = options.method.toUpperCase();
  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);
  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }
  const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      headers.accept = headers.accept.split(/,/).map(
        (format) => format.replace(
          /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
          `application/vnd$1$2.${options.mediaType.format}`
        )
      ).join(",");
    }
    if (url.endsWith("/graphql")) {
      if (options.mediaType.previews?.length) {
        const previewsFromAcceptHeader = headers.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g) || [];
        headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
          const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
          return `application/vnd.github.${preview}-preview${format}`;
        }).join(",");
      }
    }
  }
  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      }
    }
  }
  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  }
  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  }
  return Object.assign(
    { method, url, headers },
    typeof body !== "undefined" ? { body } : null,
    options.request ? { request: options.request } : null
  );
}

// pkg/dist-src/endpoint-with-defaults.js
function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

// pkg/dist-src/with-defaults.js
function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS2 = merge(oldDefaults, newDefaults);
  const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
  return Object.assign(endpoint2, {
    DEFAULTS: DEFAULTS2,
    defaults: withDefaults.bind(null, DEFAULTS2),
    merge: merge.bind(null, DEFAULTS2),
    parse
  });
}

// pkg/dist-src/index.js
var endpoint = withDefaults(null, DEFAULTS);


// EXTERNAL MODULE: ./node_modules/fast-content-type-parse/index.js
var fast_content_type_parse = __nccwpck_require__(120);
;// CONCATENATED MODULE: ./node_modules/@octokit/request-error/dist-src/index.js
class RequestError extends Error {
  name;
  /**
   * http status code
   */
  status;
  /**
   * Request options that lead to the error.
   */
  request;
  /**
   * Response object if a response was received
   */
  response;
  constructor(message, statusCode, options) {
    super(message);
    this.name = "HttpError";
    this.status = Number.parseInt(statusCode);
    if (Number.isNaN(this.status)) {
      this.status = 0;
    }
    if ("response" in options) {
      this.response = options.response;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(
          /(?<! ) .*$/,
          " [REDACTED]"
        )
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }
}


;// CONCATENATED MODULE: ./node_modules/@octokit/request/dist-bundle/index.js
// pkg/dist-src/index.js


// pkg/dist-src/defaults.js


// pkg/dist-src/version.js
var dist_bundle_VERSION = "9.2.4";

// pkg/dist-src/defaults.js
var defaults_default = {
  headers: {
    "user-agent": `octokit-request.js/${dist_bundle_VERSION} ${getUserAgent()}`
  }
};

// pkg/dist-src/fetch-wrapper.js


// pkg/dist-src/is-plain-object.js
function dist_bundle_isPlainObject(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}

// pkg/dist-src/fetch-wrapper.js

async function fetchWrapper(requestOptions) {
  const fetch = requestOptions.request?.fetch || globalThis.fetch;
  if (!fetch) {
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  }
  const log = requestOptions.request?.log || console;
  const parseSuccessResponseBody = requestOptions.request?.parseSuccessResponseBody !== false;
  const body = dist_bundle_isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body) ? JSON.stringify(requestOptions.body) : requestOptions.body;
  const requestHeaders = Object.fromEntries(
    Object.entries(requestOptions.headers).map(([name, value]) => [
      name,
      String(value)
    ])
  );
  let fetchResponse;
  try {
    fetchResponse = await fetch(requestOptions.url, {
      method: requestOptions.method,
      body,
      redirect: requestOptions.request?.redirect,
      headers: requestHeaders,
      signal: requestOptions.request?.signal,
      // duplex must be set if request.body is ReadableStream or Async Iterables.
      // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
      ...requestOptions.body && { duplex: "half" }
    });
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        error.status = 500;
        throw error;
      }
      message = error.message;
      if (error.name === "TypeError" && "cause" in error) {
        if (error.cause instanceof Error) {
          message = error.cause.message;
        } else if (typeof error.cause === "string") {
          message = error.cause;
        }
      }
    }
    const requestError = new RequestError(message, 500, {
      request: requestOptions
    });
    requestError.cause = error;
    throw requestError;
  }
  const status = fetchResponse.status;
  const url = fetchResponse.url;
  const responseHeaders = {};
  for (const [key, value] of fetchResponse.headers) {
    responseHeaders[key] = value;
  }
  const octokitResponse = {
    url,
    status,
    headers: responseHeaders,
    data: ""
  };
  if ("deprecation" in responseHeaders) {
    const matches = responseHeaders.link && responseHeaders.link.match(/<([^<>]+)>; rel="deprecation"/);
    const deprecationLink = matches && matches.pop();
    log.warn(
      `[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${responseHeaders.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`
    );
  }
  if (status === 204 || status === 205) {
    return octokitResponse;
  }
  if (requestOptions.method === "HEAD") {
    if (status < 400) {
      return octokitResponse;
    }
    throw new RequestError(fetchResponse.statusText, status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  if (status === 304) {
    octokitResponse.data = await getResponseData(fetchResponse);
    throw new RequestError("Not modified", status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  if (status >= 400) {
    octokitResponse.data = await getResponseData(fetchResponse);
    throw new RequestError(toErrorMessage(octokitResponse.data), status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  octokitResponse.data = parseSuccessResponseBody ? await getResponseData(fetchResponse) : fetchResponse.body;
  return octokitResponse;
}
async function getResponseData(response) {
  const contentType = response.headers.get("content-type");
  if (!contentType) {
    return response.text().catch(() => "");
  }
  const mimetype = (0,fast_content_type_parse/* safeParse */.xL)(contentType);
  if (isJSONResponse(mimetype)) {
    let text = "";
    try {
      text = await response.text();
      return JSON.parse(text);
    } catch (err) {
      return text;
    }
  } else if (mimetype.type.startsWith("text/") || mimetype.parameters.charset?.toLowerCase() === "utf-8") {
    return response.text().catch(() => "");
  } else {
    return response.arrayBuffer().catch(() => new ArrayBuffer(0));
  }
}
function isJSONResponse(mimetype) {
  return mimetype.type === "application/json" || mimetype.type === "application/scim+json";
}
function toErrorMessage(data) {
  if (typeof data === "string") {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return "Unknown error";
  }
  if ("message" in data) {
    const suffix = "documentation_url" in data ? ` - ${data.documentation_url}` : "";
    return Array.isArray(data.errors) ? `${data.message}: ${data.errors.map((v) => JSON.stringify(v)).join(", ")}${suffix}` : `${data.message}${suffix}`;
  }
  return `Unknown error: ${JSON.stringify(data)}`;
}

// pkg/dist-src/with-defaults.js
function dist_bundle_withDefaults(oldEndpoint, newDefaults) {
  const endpoint2 = oldEndpoint.defaults(newDefaults);
  const newApi = function(route, parameters) {
    const endpointOptions = endpoint2.merge(route, parameters);
    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint2.parse(endpointOptions));
    }
    const request2 = (route2, parameters2) => {
      return fetchWrapper(
        endpoint2.parse(endpoint2.merge(route2, parameters2))
      );
    };
    Object.assign(request2, {
      endpoint: endpoint2,
      defaults: dist_bundle_withDefaults.bind(null, endpoint2)
    });
    return endpointOptions.request.hook(request2, endpointOptions);
  };
  return Object.assign(newApi, {
    endpoint: endpoint2,
    defaults: dist_bundle_withDefaults.bind(null, endpoint2)
  });
}

// pkg/dist-src/index.js
var dist_bundle_request = dist_bundle_withDefaults(endpoint, defaults_default);


;// CONCATENATED MODULE: ./node_modules/@octokit/graphql/dist-bundle/index.js
// pkg/dist-src/index.js



// pkg/dist-src/version.js
var graphql_dist_bundle_VERSION = "0.0.0-development";

// pkg/dist-src/with-defaults.js


// pkg/dist-src/graphql.js


// pkg/dist-src/error.js
function _buildMessageForResponseErrors(data) {
  return `Request failed due to following response errors:
` + data.errors.map((e) => ` - ${e.message}`).join("\n");
}
var GraphqlResponseError = class extends Error {
  constructor(request2, headers, response) {
    super(_buildMessageForResponseErrors(response));
    this.request = request2;
    this.headers = headers;
    this.response = response;
    this.errors = response.errors;
    this.data = response.data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  name = "GraphqlResponseError";
  errors;
  data;
};

// pkg/dist-src/graphql.js
var NON_VARIABLE_OPTIONS = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType",
  "operationName"
];
var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request2, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(
        new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
      );
    }
    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
      return Promise.reject(
        new Error(
          `[@octokit/graphql] "${key}" cannot be used as variable name`
        )
      );
    }
  }
  const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
  const requestOptions = Object.keys(
    parsedOptions
  ).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }
    if (!result.variables) {
      result.variables = {};
    }
    result.variables[key] = parsedOptions[key];
    return result;
  }, {});
  const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }
  return request2(requestOptions).then((response) => {
    if (response.data.errors) {
      const headers = {};
      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }
      throw new GraphqlResponseError(
        requestOptions,
        headers,
        response.data
      );
    }
    return response.data.data;
  });
}

// pkg/dist-src/with-defaults.js
function graphql_dist_bundle_withDefaults(request2, newDefaults) {
  const newRequest = request2.defaults(newDefaults);
  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };
  return Object.assign(newApi, {
    defaults: graphql_dist_bundle_withDefaults.bind(null, newRequest),
    endpoint: newRequest.endpoint
  });
}

// pkg/dist-src/index.js
var graphql2 = graphql_dist_bundle_withDefaults(dist_bundle_request, {
  headers: {
    "user-agent": `octokit-graphql.js/${graphql_dist_bundle_VERSION} ${getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return graphql_dist_bundle_withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}


;// CONCATENATED MODULE: ./node_modules/@octokit/auth-token/dist-bundle/index.js
// pkg/dist-src/is-jwt.js
var b64url = "(?:[a-zA-Z0-9_-]+)";
var sep = "\\.";
var jwtRE = new RegExp(`^${b64url}${sep}${b64url}${sep}${b64url}$`);
var isJWT = jwtRE.test.bind(jwtRE);

// pkg/dist-src/auth.js
async function auth(token) {
  const isApp = isJWT(token);
  const isInstallation = token.startsWith("v1.") || token.startsWith("ghs_");
  const isUserToServer = token.startsWith("ghu_");
  const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
  return {
    type: "token",
    token,
    tokenType
  };
}

// pkg/dist-src/with-authorization-prefix.js
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }
  return `token ${token}`;
}

// pkg/dist-src/hook.js
async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(
    route,
    parameters
  );
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

// pkg/dist-src/index.js
var createTokenAuth = function createTokenAuth2(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }
  if (typeof token !== "string") {
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  }
  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};


;// CONCATENATED MODULE: ./node_modules/@octokit/core/dist-src/version.js
const version_VERSION = "6.1.6";


;// CONCATENATED MODULE: ./node_modules/@octokit/core/dist-src/index.js






const noop = () => {
};
const consoleWarn = console.warn.bind(console);
const consoleError = console.error.bind(console);
function createLogger(logger = {}) {
  if (typeof logger.debug !== "function") {
    logger.debug = noop;
  }
  if (typeof logger.info !== "function") {
    logger.info = noop;
  }
  if (typeof logger.warn !== "function") {
    logger.warn = consoleWarn;
  }
  if (typeof logger.error !== "function") {
    logger.error = consoleError;
  }
  return logger;
}
const userAgentTrail = `octokit-core.js/${version_VERSION} ${getUserAgent()}`;
class dist_src_Octokit {
  static VERSION = version_VERSION;
  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};
        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }
        super(
          Object.assign(
            {},
            defaults,
            options,
            options.userAgent && defaults.userAgent ? {
              userAgent: `${options.userAgent} ${defaults.userAgent}`
            } : null
          )
        );
      }
    };
    return OctokitWithDefaults;
  }
  static plugins = [];
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin(...newPlugins) {
    const currentPlugins = this.plugins;
    const NewOctokit = class extends this {
      static plugins = currentPlugins.concat(
        newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
      );
    };
    return NewOctokit;
  }
  constructor(options = {}) {
    const hook = new before_after_hook.Collection();
    const requestDefaults = {
      baseUrl: dist_bundle_request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        // @ts-ignore internal usage only, no need to type
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    requestDefaults.headers["user-agent"] = options.userAgent ? `${options.userAgent} ${userAgentTrail}` : userAgentTrail;
    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }
    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }
    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }
    this.request = dist_bundle_request.defaults(requestDefaults);
    this.graphql = withCustomRequest(this.request).defaults(requestDefaults);
    this.log = createLogger(options.log);
    this.hook = hook;
    if (!options.authStrategy) {
      if (!options.auth) {
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        const auth = createTokenAuth(options.auth);
        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const { authStrategy, ...otherOptions } = options;
      const auth = authStrategy(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: otherOptions
          },
          options.auth
        )
      );
      hook.wrap("request", auth.hook);
      this.auth = auth;
    }
    const classConstructor = this.constructor;
    for (let i = 0; i < classConstructor.plugins.length; ++i) {
      Object.assign(this, classConstructor.plugins[i](this, options));
    }
  }
  // assigned during constructor
  request;
  graphql;
  log;
  hook;
  // TODO: type `octokit.auth` based on passed options.authStrategy
  auth;
}


;// CONCATENATED MODULE: ./node_modules/@octokit/plugin-paginate-rest/dist-bundle/index.js
// pkg/dist-src/version.js
var plugin_paginate_rest_dist_bundle_VERSION = "0.0.0-development";

// pkg/dist-src/normalize-paginated-list-response.js
function normalizePaginatedListResponse(response) {
  if (!response.data) {
    return {
      ...response,
      data: []
    };
  }
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response;
  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;
  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }
  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }
  response.data.total_count = totalCount;
  return response;
}

// pkg/dist-src/iterator.js
function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return { done: true };
        try {
          const response = await requestMethod({ method, url, headers });
          const normalizedResponse = normalizePaginatedListResponse(response);
          url = ((normalizedResponse.headers.link || "").match(
            /<([^<>]+)>;\s*rel="next"/
          ) || [])[1];
          return { value: normalizedResponse };
        } catch (error) {
          if (error.status !== 409) throw error;
          url = "";
          return {
            value: {
              status: 200,
              headers: {},
              data: []
            }
          };
        }
      }
    })
  };
}

// pkg/dist-src/paginate.js
function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = void 0;
  }
  return gather(
    octokit,
    [],
    iterator(octokit, route, parameters)[Symbol.asyncIterator](),
    mapFn
  );
}
function gather(octokit, results, iterator2, mapFn) {
  return iterator2.next().then((result) => {
    if (result.done) {
      return results;
    }
    let earlyExit = false;
    function done() {
      earlyExit = true;
    }
    results = results.concat(
      mapFn ? mapFn(result.value, done) : result.value.data
    );
    if (earlyExit) {
      return results;
    }
    return gather(octokit, results, iterator2, mapFn);
  });
}

// pkg/dist-src/compose-paginate.js
var composePaginateRest = Object.assign(paginate, {
  iterator
});

// pkg/dist-src/generated/paginating-endpoints.js
var paginatingEndpoints = (/* unused pure expression or super */ null && ([
  "GET /advisories",
  "GET /app/hook/deliveries",
  "GET /app/installation-requests",
  "GET /app/installations",
  "GET /assignments/{assignment_id}/accepted_assignments",
  "GET /classrooms",
  "GET /classrooms/{classroom_id}/assignments",
  "GET /enterprises/{enterprise}/code-security/configurations",
  "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories",
  "GET /enterprises/{enterprise}/dependabot/alerts",
  "GET /enterprises/{enterprise}/secret-scanning/alerts",
  "GET /events",
  "GET /gists",
  "GET /gists/public",
  "GET /gists/starred",
  "GET /gists/{gist_id}/comments",
  "GET /gists/{gist_id}/commits",
  "GET /gists/{gist_id}/forks",
  "GET /installation/repositories",
  "GET /issues",
  "GET /licenses",
  "GET /marketplace_listing/plans",
  "GET /marketplace_listing/plans/{plan_id}/accounts",
  "GET /marketplace_listing/stubbed/plans",
  "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
  "GET /networks/{owner}/{repo}/events",
  "GET /notifications",
  "GET /organizations",
  "GET /orgs/{org}/actions/cache/usage-by-repository",
  "GET /orgs/{org}/actions/hosted-runners",
  "GET /orgs/{org}/actions/permissions/repositories",
  "GET /orgs/{org}/actions/runner-groups",
  "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/hosted-runners",
  "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories",
  "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners",
  "GET /orgs/{org}/actions/runners",
  "GET /orgs/{org}/actions/secrets",
  "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
  "GET /orgs/{org}/actions/variables",
  "GET /orgs/{org}/actions/variables/{name}/repositories",
  "GET /orgs/{org}/attestations/{subject_digest}",
  "GET /orgs/{org}/blocks",
  "GET /orgs/{org}/campaigns",
  "GET /orgs/{org}/code-scanning/alerts",
  "GET /orgs/{org}/code-security/configurations",
  "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories",
  "GET /orgs/{org}/codespaces",
  "GET /orgs/{org}/codespaces/secrets",
  "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories",
  "GET /orgs/{org}/copilot/billing/seats",
  "GET /orgs/{org}/copilot/metrics",
  "GET /orgs/{org}/dependabot/alerts",
  "GET /orgs/{org}/dependabot/secrets",
  "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories",
  "GET /orgs/{org}/events",
  "GET /orgs/{org}/failed_invitations",
  "GET /orgs/{org}/hooks",
  "GET /orgs/{org}/hooks/{hook_id}/deliveries",
  "GET /orgs/{org}/insights/api/route-stats/{actor_type}/{actor_id}",
  "GET /orgs/{org}/insights/api/subject-stats",
  "GET /orgs/{org}/insights/api/user-stats/{user_id}",
  "GET /orgs/{org}/installations",
  "GET /orgs/{org}/invitations",
  "GET /orgs/{org}/invitations/{invitation_id}/teams",
  "GET /orgs/{org}/issues",
  "GET /orgs/{org}/members",
  "GET /orgs/{org}/members/{username}/codespaces",
  "GET /orgs/{org}/migrations",
  "GET /orgs/{org}/migrations/{migration_id}/repositories",
  "GET /orgs/{org}/organization-roles/{role_id}/teams",
  "GET /orgs/{org}/organization-roles/{role_id}/users",
  "GET /orgs/{org}/outside_collaborators",
  "GET /orgs/{org}/packages",
  "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
  "GET /orgs/{org}/personal-access-token-requests",
  "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories",
  "GET /orgs/{org}/personal-access-tokens",
  "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories",
  "GET /orgs/{org}/private-registries",
  "GET /orgs/{org}/projects",
  "GET /orgs/{org}/properties/values",
  "GET /orgs/{org}/public_members",
  "GET /orgs/{org}/repos",
  "GET /orgs/{org}/rulesets",
  "GET /orgs/{org}/rulesets/rule-suites",
  "GET /orgs/{org}/rulesets/{ruleset_id}/history",
  "GET /orgs/{org}/secret-scanning/alerts",
  "GET /orgs/{org}/security-advisories",
  "GET /orgs/{org}/settings/network-configurations",
  "GET /orgs/{org}/team/{team_slug}/copilot/metrics",
  "GET /orgs/{org}/teams",
  "GET /orgs/{org}/teams/{team_slug}/discussions",
  "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
  "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
  "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
  "GET /orgs/{org}/teams/{team_slug}/invitations",
  "GET /orgs/{org}/teams/{team_slug}/members",
  "GET /orgs/{org}/teams/{team_slug}/projects",
  "GET /orgs/{org}/teams/{team_slug}/repos",
  "GET /orgs/{org}/teams/{team_slug}/teams",
  "GET /projects/columns/{column_id}/cards",
  "GET /projects/{project_id}/collaborators",
  "GET /projects/{project_id}/columns",
  "GET /repos/{owner}/{repo}/actions/artifacts",
  "GET /repos/{owner}/{repo}/actions/caches",
  "GET /repos/{owner}/{repo}/actions/organization-secrets",
  "GET /repos/{owner}/{repo}/actions/organization-variables",
  "GET /repos/{owner}/{repo}/actions/runners",
  "GET /repos/{owner}/{repo}/actions/runs",
  "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
  "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs",
  "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
  "GET /repos/{owner}/{repo}/actions/secrets",
  "GET /repos/{owner}/{repo}/actions/variables",
  "GET /repos/{owner}/{repo}/actions/workflows",
  "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
  "GET /repos/{owner}/{repo}/activity",
  "GET /repos/{owner}/{repo}/assignees",
  "GET /repos/{owner}/{repo}/attestations/{subject_digest}",
  "GET /repos/{owner}/{repo}/branches",
  "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
  "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
  "GET /repos/{owner}/{repo}/code-scanning/alerts",
  "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
  "GET /repos/{owner}/{repo}/code-scanning/analyses",
  "GET /repos/{owner}/{repo}/codespaces",
  "GET /repos/{owner}/{repo}/codespaces/devcontainers",
  "GET /repos/{owner}/{repo}/codespaces/secrets",
  "GET /repos/{owner}/{repo}/collaborators",
  "GET /repos/{owner}/{repo}/comments",
  "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
  "GET /repos/{owner}/{repo}/commits",
  "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
  "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
  "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
  "GET /repos/{owner}/{repo}/commits/{ref}/check-suites",
  "GET /repos/{owner}/{repo}/commits/{ref}/status",
  "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
  "GET /repos/{owner}/{repo}/contributors",
  "GET /repos/{owner}/{repo}/dependabot/alerts",
  "GET /repos/{owner}/{repo}/dependabot/secrets",
  "GET /repos/{owner}/{repo}/deployments",
  "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
  "GET /repos/{owner}/{repo}/environments",
  "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies",
  "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps",
  "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets",
  "GET /repos/{owner}/{repo}/environments/{environment_name}/variables",
  "GET /repos/{owner}/{repo}/events",
  "GET /repos/{owner}/{repo}/forks",
  "GET /repos/{owner}/{repo}/hooks",
  "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries",
  "GET /repos/{owner}/{repo}/invitations",
  "GET /repos/{owner}/{repo}/issues",
  "GET /repos/{owner}/{repo}/issues/comments",
  "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
  "GET /repos/{owner}/{repo}/issues/events",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/events",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
  "GET /repos/{owner}/{repo}/keys",
  "GET /repos/{owner}/{repo}/labels",
  "GET /repos/{owner}/{repo}/milestones",
  "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
  "GET /repos/{owner}/{repo}/notifications",
  "GET /repos/{owner}/{repo}/pages/builds",
  "GET /repos/{owner}/{repo}/projects",
  "GET /repos/{owner}/{repo}/pulls",
  "GET /repos/{owner}/{repo}/pulls/comments",
  "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
  "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
  "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
  "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
  "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
  "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
  "GET /repos/{owner}/{repo}/releases",
  "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
  "GET /repos/{owner}/{repo}/releases/{release_id}/reactions",
  "GET /repos/{owner}/{repo}/rules/branches/{branch}",
  "GET /repos/{owner}/{repo}/rulesets",
  "GET /repos/{owner}/{repo}/rulesets/rule-suites",
  "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history",
  "GET /repos/{owner}/{repo}/secret-scanning/alerts",
  "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations",
  "GET /repos/{owner}/{repo}/security-advisories",
  "GET /repos/{owner}/{repo}/stargazers",
  "GET /repos/{owner}/{repo}/subscribers",
  "GET /repos/{owner}/{repo}/tags",
  "GET /repos/{owner}/{repo}/teams",
  "GET /repos/{owner}/{repo}/topics",
  "GET /repositories",
  "GET /search/code",
  "GET /search/commits",
  "GET /search/issues",
  "GET /search/labels",
  "GET /search/repositories",
  "GET /search/topics",
  "GET /search/users",
  "GET /teams/{team_id}/discussions",
  "GET /teams/{team_id}/discussions/{discussion_number}/comments",
  "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions",
  "GET /teams/{team_id}/discussions/{discussion_number}/reactions",
  "GET /teams/{team_id}/invitations",
  "GET /teams/{team_id}/members",
  "GET /teams/{team_id}/projects",
  "GET /teams/{team_id}/repos",
  "GET /teams/{team_id}/teams",
  "GET /user/blocks",
  "GET /user/codespaces",
  "GET /user/codespaces/secrets",
  "GET /user/emails",
  "GET /user/followers",
  "GET /user/following",
  "GET /user/gpg_keys",
  "GET /user/installations",
  "GET /user/installations/{installation_id}/repositories",
  "GET /user/issues",
  "GET /user/keys",
  "GET /user/marketplace_purchases",
  "GET /user/marketplace_purchases/stubbed",
  "GET /user/memberships/orgs",
  "GET /user/migrations",
  "GET /user/migrations/{migration_id}/repositories",
  "GET /user/orgs",
  "GET /user/packages",
  "GET /user/packages/{package_type}/{package_name}/versions",
  "GET /user/public_emails",
  "GET /user/repos",
  "GET /user/repository_invitations",
  "GET /user/social_accounts",
  "GET /user/ssh_signing_keys",
  "GET /user/starred",
  "GET /user/subscriptions",
  "GET /user/teams",
  "GET /users",
  "GET /users/{username}/attestations/{subject_digest}",
  "GET /users/{username}/events",
  "GET /users/{username}/events/orgs/{org}",
  "GET /users/{username}/events/public",
  "GET /users/{username}/followers",
  "GET /users/{username}/following",
  "GET /users/{username}/gists",
  "GET /users/{username}/gpg_keys",
  "GET /users/{username}/keys",
  "GET /users/{username}/orgs",
  "GET /users/{username}/packages",
  "GET /users/{username}/projects",
  "GET /users/{username}/received_events",
  "GET /users/{username}/received_events/public",
  "GET /users/{username}/repos",
  "GET /users/{username}/social_accounts",
  "GET /users/{username}/ssh_signing_keys",
  "GET /users/{username}/starred",
  "GET /users/{username}/subscriptions"
]));

// pkg/dist-src/paginating-endpoints.js
function isPaginatingEndpoint(arg) {
  if (typeof arg === "string") {
    return paginatingEndpoints.includes(arg);
  } else {
    return false;
  }
}

// pkg/dist-src/index.js
function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = plugin_paginate_rest_dist_bundle_VERSION;


;// CONCATENATED MODULE: ./node_modules/@octokit/plugin-paginate-graphql/dist-bundle/index.js
// pkg/dist-src/errors.js
var generateMessage = (path, cursorValue) => `The cursor at "${path.join(
  ","
)}" did not change its value "${cursorValue}" after a page transition. Please make sure your that your query is set up correctly.`;
var MissingCursorChange = class extends Error {
  constructor(pageInfo, cursorValue) {
    super(generateMessage(pageInfo.pathInQuery, cursorValue));
    this.pageInfo = pageInfo;
    this.cursorValue = cursorValue;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  name = "MissingCursorChangeError";
};
var MissingPageInfo = class extends Error {
  constructor(response) {
    super(
      `No pageInfo property found in response. Please make sure to specify the pageInfo in your query. Response-Data: ${JSON.stringify(
        response,
        null,
        2
      )}`
    );
    this.response = response;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  name = "MissingPageInfo";
};

// pkg/dist-src/object-helpers.js
var isObject = (value) => Object.prototype.toString.call(value) === "[object Object]";
function findPaginatedResourcePath(responseData) {
  const paginatedResourcePath = deepFindPathToProperty(
    responseData,
    "pageInfo"
  );
  if (paginatedResourcePath.length === 0) {
    throw new MissingPageInfo(responseData);
  }
  return paginatedResourcePath;
}
var deepFindPathToProperty = (object, searchProp, path = []) => {
  for (const key of Object.keys(object)) {
    const currentPath = [...path, key];
    const currentValue = object[key];
    if (isObject(currentValue)) {
      if (currentValue.hasOwnProperty(searchProp)) {
        return currentPath;
      }
      const result = deepFindPathToProperty(
        currentValue,
        searchProp,
        currentPath
      );
      if (result.length > 0) {
        return result;
      }
    }
  }
  return [];
};
var get = (object, path) => {
  return path.reduce((current, nextProperty) => current[nextProperty], object);
};
var set = (object, path, mutator) => {
  const lastProperty = path[path.length - 1];
  const parentPath = [...path].slice(0, -1);
  const parent = get(object, parentPath);
  if (typeof mutator === "function") {
    parent[lastProperty] = mutator(parent[lastProperty]);
  } else {
    parent[lastProperty] = mutator;
  }
};

// pkg/dist-src/extract-page-info.js
var extractPageInfos = (responseData) => {
  const pageInfoPath = findPaginatedResourcePath(responseData);
  return {
    pathInQuery: pageInfoPath,
    pageInfo: get(responseData, [...pageInfoPath, "pageInfo"])
  };
};

// pkg/dist-src/page-info.js
var isForwardSearch = (givenPageInfo) => {
  return givenPageInfo.hasOwnProperty("hasNextPage");
};
var getCursorFrom = (pageInfo) => isForwardSearch(pageInfo) ? pageInfo.endCursor : pageInfo.startCursor;
var hasAnotherPage = (pageInfo) => isForwardSearch(pageInfo) ? pageInfo.hasNextPage : pageInfo.hasPreviousPage;

// pkg/dist-src/iterator.js
var createIterator = (octokit) => {
  return (query, initialParameters = {}) => {
    let nextPageExists = true;
    let parameters = { ...initialParameters };
    return {
      [Symbol.asyncIterator]: () => ({
        async next() {
          if (!nextPageExists) return { done: true, value: {} };
          const response = await octokit.graphql(
            query,
            parameters
          );
          const pageInfoContext = extractPageInfos(response);
          const nextCursorValue = getCursorFrom(pageInfoContext.pageInfo);
          nextPageExists = hasAnotherPage(pageInfoContext.pageInfo);
          if (nextPageExists && nextCursorValue === parameters.cursor) {
            throw new MissingCursorChange(pageInfoContext, nextCursorValue);
          }
          parameters = {
            ...parameters,
            cursor: nextCursorValue
          };
          return { done: false, value: response };
        }
      })
    };
  };
};

// pkg/dist-src/merge-responses.js
var mergeResponses = (response1, response2) => {
  if (Object.keys(response1).length === 0) {
    return Object.assign(response1, response2);
  }
  const path = findPaginatedResourcePath(response1);
  const nodesPath = [...path, "nodes"];
  const newNodes = get(response2, nodesPath);
  if (newNodes) {
    set(response1, nodesPath, (values) => {
      return [...values, ...newNodes];
    });
  }
  const edgesPath = [...path, "edges"];
  const newEdges = get(response2, edgesPath);
  if (newEdges) {
    set(response1, edgesPath, (values) => {
      return [...values, ...newEdges];
    });
  }
  const pageInfoPath = [...path, "pageInfo"];
  set(response1, pageInfoPath, get(response2, pageInfoPath));
  return response1;
};

// pkg/dist-src/paginate.js
var createPaginate = (octokit) => {
  const iterator = createIterator(octokit);
  return async (query, initialParameters = {}) => {
    let mergedResponse = {};
    for await (const response of iterator(
      query,
      initialParameters
    )) {
      mergedResponse = mergeResponses(mergedResponse, response);
    }
    return mergedResponse;
  };
};

// pkg/dist-src/version.js
var plugin_paginate_graphql_dist_bundle_VERSION = "0.0.0-development";

// pkg/dist-src/index.js
function paginateGraphQL(octokit) {
  return {
    graphql: Object.assign(octokit.graphql, {
      paginate: Object.assign(createPaginate(octokit), {
        iterator: createIterator(octokit)
      })
    })
  };
}


;// CONCATENATED MODULE: ./node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/version.js
const dist_src_version_VERSION = "14.0.0";

//# sourceMappingURL=version.js.map

;// CONCATENATED MODULE: ./node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/generated/endpoints.js
const Endpoints = {
  actions: {
    addCustomLabelsToSelfHostedRunnerForOrg: [
      "POST /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    addCustomLabelsToSelfHostedRunnerForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    addRepoAccessToSelfHostedRunnerGroupInOrg: [
      "PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    approveWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
    ],
    cancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
    ],
    createEnvironmentVariable: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    createHostedRunnerForOrg: ["POST /orgs/{org}/actions/hosted-runners"],
    createOrUpdateEnvironmentSecret: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    createOrgVariable: ["POST /orgs/{org}/actions/variables"],
    createRegistrationTokenForOrg: [
      "POST /orgs/{org}/actions/runners/registration-token"
    ],
    createRegistrationTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/registration-token"
    ],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/remove-token"
    ],
    createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
    createWorkflowDispatch: [
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
    ],
    deleteActionsCacheById: [
      "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
    ],
    deleteActionsCacheByKey: [
      "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
    ],
    deleteArtifact: [
      "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
    ],
    deleteEnvironmentSecret: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    deleteEnvironmentVariable: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    deleteHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    deleteRepoVariable: [
      "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
    ],
    deleteSelfHostedRunnerFromOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}"
    ],
    deleteSelfHostedRunnerFromRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: [
      "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    disableSelectedRepositoryGithubActionsOrganization: [
      "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    disableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
    ],
    downloadArtifact: [
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
    ],
    downloadJobLogsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
    ],
    downloadWorkflowRunAttemptLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
    ],
    downloadWorkflowRunLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    enableSelectedRepositoryGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    enableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
    ],
    forceCancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"
    ],
    generateRunnerJitconfigForOrg: [
      "POST /orgs/{org}/actions/runners/generate-jitconfig"
    ],
    generateRunnerJitconfigForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
    ],
    getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
    getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
    getActionsCacheUsageByRepoForOrg: [
      "GET /orgs/{org}/actions/cache/usage-by-repository"
    ],
    getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
    getAllowedActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/selected-actions"
    ],
    getAllowedActionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getCustomOidcSubClaimForRepo: [
      "GET /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    getEnvironmentPublicKey: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"
    ],
    getEnvironmentSecret: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    getEnvironmentVariable: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    getGithubActionsDefaultWorkflowPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions/workflow"
    ],
    getGithubActionsDefaultWorkflowPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    getGithubActionsPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions"
    ],
    getGithubActionsPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions"
    ],
    getHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    getHostedRunnersGithubOwnedImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/github-owned"
    ],
    getHostedRunnersLimitsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/limits"
    ],
    getHostedRunnersMachineSpecsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/machine-sizes"
    ],
    getHostedRunnersPartnerImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/partner"
    ],
    getHostedRunnersPlatformsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/platforms"
    ],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
    getPendingDeploymentsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    getRepoPermissions: [
      "GET /repos/{owner}/{repo}/actions/permissions",
      {},
      { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
    ],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
    getReviewsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
    ],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowAccessToRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/access"
    ],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
    ],
    getWorkflowRunUsage: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
    ],
    getWorkflowUsage: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
    ],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listEnvironmentSecrets: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"
    ],
    listEnvironmentVariables: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    listGithubHostedRunnersInGroupForOrg: [
      "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/hosted-runners"
    ],
    listHostedRunnersForOrg: ["GET /orgs/{org}/actions/hosted-runners"],
    listJobsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
    ],
    listJobsForWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
    ],
    listLabelsForSelfHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    listLabelsForSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listOrgVariables: ["GET /orgs/{org}/actions/variables"],
    listRepoOrganizationSecrets: [
      "GET /repos/{owner}/{repo}/actions/organization-secrets"
    ],
    listRepoOrganizationVariables: [
      "GET /repos/{owner}/{repo}/actions/organization-variables"
    ],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/downloads"
    ],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    listSelectedReposForOrgVariable: [
      "GET /orgs/{org}/actions/variables/{name}/repositories"
    ],
    listSelectedRepositoriesEnabledGithubActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/repositories"
    ],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
    ],
    listWorkflowRuns: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
    ],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunJobForWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
    ],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    reRunWorkflowFailedJobs: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    removeCustomLabelFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeCustomLabelFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgVariable: [
      "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    reviewCustomGatesForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
    ],
    reviewPendingDeploymentsForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    setAllowedActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/selected-actions"
    ],
    setAllowedActionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    setCustomLabelsForSelfHostedRunnerForOrg: [
      "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    setCustomLabelsForSelfHostedRunnerForRepo: [
      "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    setCustomOidcSubClaimForRepo: [
      "PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    setGithubActionsDefaultWorkflowPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/workflow"
    ],
    setGithubActionsDefaultWorkflowPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    setGithubActionsPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions"
    ],
    setGithubActionsPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories"
    ],
    setSelectedRepositoriesEnabledGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories"
    ],
    setWorkflowAccessToRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/access"
    ],
    updateEnvironmentVariable: [
      "PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    updateHostedRunnerForOrg: [
      "PATCH /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
    updateRepoVariable: [
      "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
    ]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: [
      "DELETE /notifications/threads/{thread_id}/subscription"
    ],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: [
      "GET /notifications/threads/{thread_id}/subscription"
    ],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: [
      "GET /users/{username}/events/orgs/{org}"
    ],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: [
      "GET /users/{username}/received_events/public"
    ],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/notifications"
    ],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsDone: ["DELETE /notifications/threads/{thread_id}"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: [
      "PUT /notifications/threads/{thread_id}/subscription"
    ],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
    ],
    addRepoToInstallationForAuthenticatedUser: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    checkToken: ["POST /applications/{client_id}/token"],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: [
      "POST /app/installations/{installation_id}/access_tokens"
    ],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: [
      "GET /marketplace_listing/accounts/{account_id}"
    ],
    getSubscriptionPlanForAccountStubbed: [
      "GET /marketplace_listing/stubbed/accounts/{account_id}"
    ],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: [
      "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
    ],
    listInstallationReposForAuthenticatedUser: [
      "GET /user/installations/{installation_id}/repositories"
    ],
    listInstallationRequestsForAuthenticatedApp: [
      "GET /app/installation-requests"
    ],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: [
      "GET /user/marketplace_purchases/stubbed"
    ],
    listWebhookDeliveries: ["GET /app/hook/deliveries"],
    redeliverWebhookDelivery: [
      "POST /app/hook/deliveries/{delivery_id}/attempts"
    ],
    removeRepoFromInstallation: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
    ],
    removeRepoFromInstallationForAuthenticatedUser: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: [
      "DELETE /app/installations/{installation_id}/suspended"
    ],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: [
      "GET /users/{username}/settings/billing/actions"
    ],
    getGithubBillingUsageReportOrg: [
      "GET /organizations/{org}/settings/billing/usage"
    ],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: [
      "GET /users/{username}/settings/billing/packages"
    ],
    getSharedStorageBillingOrg: [
      "GET /orgs/{org}/settings/billing/shared-storage"
    ],
    getSharedStorageBillingUser: [
      "GET /users/{username}/settings/billing/shared-storage"
    ]
  },
  campaigns: {
    createCampaign: ["POST /orgs/{org}/campaigns"],
    deleteCampaign: ["DELETE /orgs/{org}/campaigns/{campaign_number}"],
    getCampaignSummary: ["GET /orgs/{org}/campaigns/{campaign_number}"],
    listOrgCampaigns: ["GET /orgs/{org}/campaigns"],
    updateCampaign: ["PATCH /orgs/{org}/campaigns/{campaign_number}"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: [
      "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
    ],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: [
      "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
    ],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestRun: [
      "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
    ],
    rerequestSuite: [
      "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
    ],
    setSuitesPreferences: [
      "PATCH /repos/{owner}/{repo}/check-suites/preferences"
    ],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    commitAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"
    ],
    createAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    createVariantAnalysis: [
      "POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"
    ],
    deleteAnalysis: [
      "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
    ],
    deleteCodeqlDatabase: [
      "DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
      {},
      { renamedParameters: { alert_id: "alert_number" } }
    ],
    getAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
    ],
    getAutofix: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    getCodeqlDatabase: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    getVariantAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"
    ],
    getVariantAnalysisRepoTask: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"
    ],
    listAlertInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
      {},
      { renamed: ["codeScanning", "listAlertInstances"] }
    ],
    listCodeqlDatabases: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
    ],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
    ],
    updateDefaultSetup: [
      "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
    ],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codeSecurity: {
    attachConfiguration: [
      "POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"
    ],
    attachEnterpriseConfiguration: [
      "POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"
    ],
    createConfiguration: ["POST /orgs/{org}/code-security/configurations"],
    createConfigurationForEnterprise: [
      "POST /enterprises/{enterprise}/code-security/configurations"
    ],
    deleteConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    deleteConfigurationForEnterprise: [
      "DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    detachConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/detach"
    ],
    getConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    getConfigurationForRepository: [
      "GET /repos/{owner}/{repo}/code-security-configuration"
    ],
    getConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations"
    ],
    getConfigurationsForOrg: ["GET /orgs/{org}/code-security/configurations"],
    getDefaultConfigurations: [
      "GET /orgs/{org}/code-security/configurations/defaults"
    ],
    getDefaultConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/defaults"
    ],
    getRepositoriesForConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"
    ],
    getRepositoriesForEnterpriseConfiguration: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"
    ],
    getSingleConfigurationForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    setConfigurationAsDefault: [
      "PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"
    ],
    setConfigurationAsDefaultForEnterprise: [
      "PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"
    ],
    updateConfiguration: [
      "PATCH /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    updateEnterpriseConfiguration: [
      "PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct"],
    getConductCode: ["GET /codes_of_conduct/{key}"]
  },
  codespaces: {
    addRepositoryForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    checkPermissionsForDevcontainer: [
      "GET /repos/{owner}/{repo}/codespaces/permissions_check"
    ],
    codespaceMachinesForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/machines"
    ],
    createForAuthenticatedUser: ["POST /user/codespaces"],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}"
    ],
    createWithPrForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
    ],
    createWithRepoForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/codespaces"
    ],
    deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
    deleteFromOrganization: [
      "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    deleteSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}"
    ],
    exportForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/exports"
    ],
    getCodespacesForUserInOrg: [
      "GET /orgs/{org}/members/{username}/codespaces"
    ],
    getExportDetailsForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/exports/{export_id}"
    ],
    getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
    getPublicKeyForAuthenticatedUser: [
      "GET /user/codespaces/secrets/public-key"
    ],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    getSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}"
    ],
    listDevcontainersInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/devcontainers"
    ],
    listForAuthenticatedUser: ["GET /user/codespaces"],
    listInOrganization: [
      "GET /orgs/{org}/codespaces",
      {},
      { renamedParameters: { org_id: "org" } }
    ],
    listInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces"
    ],
    listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
    listRepositoriesForSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}/repositories"
    ],
    listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    preFlightWithRepoForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/new"
    ],
    publishForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/publish"
    ],
    removeRepositoryForSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repoMachinesForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/machines"
    ],
    setRepositoriesForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
    stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
    stopInOrganization: [
      "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
    ],
    updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
  },
  copilot: {
    addCopilotSeatsForTeams: [
      "POST /orgs/{org}/copilot/billing/selected_teams"
    ],
    addCopilotSeatsForUsers: [
      "POST /orgs/{org}/copilot/billing/selected_users"
    ],
    cancelCopilotSeatAssignmentForTeams: [
      "DELETE /orgs/{org}/copilot/billing/selected_teams"
    ],
    cancelCopilotSeatAssignmentForUsers: [
      "DELETE /orgs/{org}/copilot/billing/selected_users"
    ],
    copilotMetricsForOrganization: ["GET /orgs/{org}/copilot/metrics"],
    copilotMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],
    getCopilotOrganizationDetails: ["GET /orgs/{org}/copilot/billing"],
    getCopilotSeatDetailsForUser: [
      "GET /orgs/{org}/members/{username}/copilot"
    ],
    listCopilotSeats: ["GET /orgs/{org}/copilot/billing/seats"]
  },
  dependabot: {
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
    getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/dependabot/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
    listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
    ]
  },
  dependencyGraph: {
    createRepositorySnapshot: [
      "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
    ],
    diffRange: [
      "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
    ],
    exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
  },
  emojis: { get: ["GET /emojis"] },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  hostedCompute: {
    createNetworkConfigurationForOrg: [
      "POST /orgs/{org}/settings/network-configurations"
    ],
    deleteNetworkConfigurationFromOrg: [
      "DELETE /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkConfigurationForOrg: [
      "GET /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkSettingsForOrg: [
      "GET /orgs/{org}/settings/network-settings/{network_settings_id}"
    ],
    listNetworkConfigurationsForOrg: [
      "GET /orgs/{org}/settings/network-configurations"
    ],
    updateNetworkConfigurationForOrg: [
      "PATCH /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: [
      "GET /user/interaction-limits",
      {},
      { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
    ],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: [
      "DELETE /repos/{owner}/{repo}/interaction-limits"
    ],
    removeRestrictionsForYourPublicRepos: [
      "DELETE /user/interaction-limits",
      {},
      { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
    ],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: [
      "PUT /user/interaction-limits",
      {},
      { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
    ]
  },
  issues: {
    addAssignees: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    addSubIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    checkUserCanBeAssignedToIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
    ],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
    ],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
    ],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: [
      "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
    ],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
    ],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: [
      "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
    ],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    listSubIssues: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    removeAssignees: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    removeLabel: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
    ],
    removeSubIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"
    ],
    reprioritizeSubIssue: [
      "PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"
    ],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: [
      "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
    ]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: [
      "POST /markdown/raw",
      { headers: { "content-type": "text/plain; charset=utf-8" } }
    ]
  },
  meta: {
    get: ["GET /meta"],
    getAllVersions: ["GET /versions"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    deleteArchiveForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/archive"
    ],
    deleteArchiveForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/archive"
    ],
    downloadArchiveForOrg: [
      "GET /orgs/{org}/migrations/{migration_id}/archive"
    ],
    getArchiveForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/archive"
    ],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
    listForAuthenticatedUser: ["GET /user/migrations"],
    listForOrg: ["GET /orgs/{org}/migrations"],
    listReposForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/repositories"
    ],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
    listReposForUser: [
      "GET /user/migrations/{migration_id}/repositories",
      {},
      { renamed: ["migrations", "listReposForAuthenticatedUser"] }
    ],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    unlockRepoForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    unlockRepoForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
    ]
  },
  oidc: {
    getOidcCustomSubTemplateForOrg: [
      "GET /orgs/{org}/actions/oidc/customization/sub"
    ],
    updateOidcCustomSubTemplateForOrg: [
      "PUT /orgs/{org}/actions/oidc/customization/sub"
    ]
  },
  orgs: {
    addSecurityManagerTeam: [
      "PUT /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"
      }
    ],
    assignTeamToOrgRole: [
      "PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    assignUserToOrgRole: [
      "PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: [
      "PUT /orgs/{org}/outside_collaborators/{username}"
    ],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createIssueType: ["POST /orgs/{org}/issue-types"],
    createOrUpdateCustomProperties: ["PATCH /orgs/{org}/properties/schema"],
    createOrUpdateCustomPropertiesValuesForRepos: [
      "PATCH /orgs/{org}/properties/values"
    ],
    createOrUpdateCustomProperty: [
      "PUT /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    createWebhook: ["POST /orgs/{org}/hooks"],
    delete: ["DELETE /orgs/{org}"],
    deleteIssueType: ["DELETE /orgs/{org}/issue-types/{issue_type_id}"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    enableOrDisableSecurityProductOnAllOrgRepos: [
      "POST /orgs/{org}/{security_product}/{enablement}",
      {},
      {
        deprecated: "octokit.rest.orgs.enableOrDisableSecurityProductOnAllOrgRepos() is deprecated, see https://docs.github.com/rest/orgs/orgs#enable-or-disable-a-security-feature-for-an-organization"
      }
    ],
    get: ["GET /orgs/{org}"],
    getAllCustomProperties: ["GET /orgs/{org}/properties/schema"],
    getCustomProperty: [
      "GET /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getOrgRole: ["GET /orgs/{org}/organization-roles/{role_id}"],
    getOrgRulesetHistory: ["GET /orgs/{org}/rulesets/{ruleset_id}/history"],
    getOrgRulesetVersion: [
      "GET /orgs/{org}/rulesets/{ruleset_id}/history/{version_id}"
    ],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    getWebhookDelivery: [
      "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listAttestations: ["GET /orgs/{org}/attestations/{subject_digest}"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listCustomPropertiesValuesForRepos: ["GET /orgs/{org}/properties/values"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listIssueTypes: ["GET /orgs/{org}/issue-types"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOrgRoleTeams: ["GET /orgs/{org}/organization-roles/{role_id}/teams"],
    listOrgRoleUsers: ["GET /orgs/{org}/organization-roles/{role_id}/users"],
    listOrgRoles: ["GET /orgs/{org}/organization-roles"],
    listOrganizationFineGrainedPermissions: [
      "GET /orgs/{org}/organization-fine-grained-permissions"
    ],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPatGrantRepositories: [
      "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"
    ],
    listPatGrantRequestRepositories: [
      "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
    ],
    listPatGrantRequests: ["GET /orgs/{org}/personal-access-token-requests"],
    listPatGrants: ["GET /orgs/{org}/personal-access-tokens"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listSecurityManagerTeams: [
      "GET /orgs/{org}/security-managers",
      {},
      {
        deprecated: "octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"
      }
    ],
    listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeCustomProperty: [
      "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: [
      "DELETE /orgs/{org}/outside_collaborators/{username}"
    ],
    removePublicMembershipForAuthenticatedUser: [
      "DELETE /orgs/{org}/public_members/{username}"
    ],
    removeSecurityManagerTeam: [
      "DELETE /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"
      }
    ],
    reviewPatGrantRequest: [
      "POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"
    ],
    reviewPatGrantRequestsInBulk: [
      "POST /orgs/{org}/personal-access-token-requests"
    ],
    revokeAllOrgRolesTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}"
    ],
    revokeAllOrgRolesUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}"
    ],
    revokeOrgRoleTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    revokeOrgRoleUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: [
      "PUT /orgs/{org}/public_members/{username}"
    ],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateIssueType: ["PUT /orgs/{org}/issue-types/{issue_type_id}"],
    updateMembershipForAuthenticatedUser: [
      "PATCH /user/memberships/orgs/{org}"
    ],
    updatePatAccess: ["POST /orgs/{org}/personal-access-tokens/{pat_id}"],
    updatePatAccesses: ["POST /orgs/{org}/personal-access-tokens"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}"
    ],
    deletePackageForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    deletePackageForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}"
    ],
    deletePackageVersionForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getAllPackageVersionsForAPackageOwnedByAnOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
      {},
      { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
    ],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions",
      {},
      {
        renamed: [
          "packages",
          "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
        ]
      }
    ],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions"
    ],
    getPackageForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}"
    ],
    getPackageForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    getPackageForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}"
    ],
    getPackageVersionForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    listDockerMigrationConflictingPackagesForAuthenticatedUser: [
      "GET /user/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForOrganization: [
      "GET /orgs/{org}/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForUser: [
      "GET /users/{username}/docker/conflicts"
    ],
    listPackagesForAuthenticatedUser: ["GET /user/packages"],
    listPackagesForOrganization: ["GET /orgs/{org}/packages"],
    listPackagesForUser: ["GET /users/{username}/packages"],
    restorePackageForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageVersionForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ]
  },
  privateRegistries: {
    createOrgPrivateRegistry: ["POST /orgs/{org}/private-registries"],
    deleteOrgPrivateRegistry: [
      "DELETE /orgs/{org}/private-registries/{secret_name}"
    ],
    getOrgPrivateRegistry: ["GET /orgs/{org}/private-registries/{secret_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/private-registries/public-key"],
    listOrgPrivateRegistries: ["GET /orgs/{org}/private-registries"],
    updateOrgPrivateRegistry: [
      "PATCH /orgs/{org}/private-registries/{secret_name}"
    ]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
    ],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    deletePendingReview: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    deleteReviewComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ],
    dismissReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
    ],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    listReviewComments: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    requestReviewers: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    submitReview: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
    ],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
    ],
    updateReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    updateReviewComment: [
      "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ]
  },
  rateLimit: { get: ["GET /rate_limit"] },
  reactions: {
    createForCommitComment: [
      "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    createForIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
    ],
    createForIssueComment: [
      "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    createForPullRequestReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    createForRelease: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    createForTeamDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    createForTeamDiscussionInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ],
    deleteForCommitComment: [
      "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
    ],
    deleteForIssueComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForPullRequestComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForRelease: [
      "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussion: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussionComment: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
    ],
    listForCommitComment: [
      "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    listForIssueComment: [
      "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    listForPullRequestReviewComment: [
      "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    listForRelease: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    listForTeamDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    listForTeamDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ]
  },
  repos: {
    acceptInvitation: [
      "PATCH /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
    ],
    acceptInvitationForAuthenticatedUser: [
      "PATCH /user/repository_invitations/{invitation_id}"
    ],
    addAppAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    addTeamAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    addUserAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    cancelPagesDeployment: [
      "POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"
    ],
    checkAutomatedSecurityFixes: [
      "GET /repos/{owner}/{repo}/automated-security-fixes"
    ],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkPrivateVulnerabilityReporting: [
      "GET /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    checkVulnerabilityAlerts: [
      "GET /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: [
      "GET /repos/{owner}/{repo}/compare/{basehead}"
    ],
    createAttestation: ["POST /repos/{owner}/{repo}/attestations"],
    createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
    createCommitComment: [
      "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    createCommitSignatureProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentBranchPolicy: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    createDeploymentProtectionRule: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    createDeploymentStatus: [
      "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateCustomPropertiesValues: [
      "PATCH /repos/{owner}/{repo}/properties/values"
    ],
    createOrUpdateEnvironment: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createOrgRuleset: ["POST /orgs/{org}/rulesets"],
    createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployments"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
    createUsingTemplate: [
      "POST /repos/{template_owner}/{template_repo}/generate"
    ],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: [
      "DELETE /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
    ],
    declineInvitationForAuthenticatedUser: [
      "DELETE /user/repository_invitations/{invitation_id}"
    ],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    deleteAdminBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    deleteAnEnvironment: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    deleteBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: [
      "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
    ],
    deleteDeploymentBranchPolicy: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: [
      "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
    deletePullRequestReviewProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: [
      "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: [
      "DELETE /repos/{owner}/{repo}/automated-security-fixes"
    ],
    disableDeploymentProtectionRule: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    disablePrivateVulnerabilityReporting: [
      "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    disableVulnerabilityAlerts: [
      "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    downloadArchive: [
      "GET /repos/{owner}/{repo}/zipball/{ref}",
      {},
      { renamed: ["repos", "downloadZipballArchive"] }
    ],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: [
      "PUT /repos/{owner}/{repo}/automated-security-fixes"
    ],
    enablePrivateVulnerabilityReporting: [
      "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    enableVulnerabilityAlerts: [
      "PUT /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    generateReleaseNotes: [
      "POST /repos/{owner}/{repo}/releases/generate-notes"
    ],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    getAdminBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    getAllDeploymentProtectionRules: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
    ],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
    getAppsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
    ],
    getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: [
      "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
    ],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getCustomDeploymentProtectionRule: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    getCustomPropertiesValues: ["GET /repos/{owner}/{repo}/properties/values"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentBranchPolicy: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    getDeploymentStatus: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
    ],
    getEnvironment: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getOrgRuleSuite: ["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],
    getOrgRuleSuites: ["GET /orgs/{org}/rulesets/rule-suites"],
    getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
    getOrgRulesets: ["GET /orgs/{org}/rulesets"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesDeployment: [
      "GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"
    ],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getRepoRuleSuite: [
      "GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"
    ],
    getRepoRuleSuites: ["GET /repos/{owner}/{repo}/rulesets/rule-suites"],
    getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    getRepoRulesetHistory: [
      "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history"
    ],
    getRepoRulesetVersion: [
      "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history/{version_id}"
    ],
    getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
    getStatusChecksProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    getTeamsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
    ],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
    ],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    getWebhookDelivery: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    listActivities: ["GET /repos/{owner}/{repo}/activity"],
    listAttestations: [
      "GET /repos/{owner}/{repo}/attestations/{subject_digest}"
    ],
    listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
    ],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: [
      "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listCustomDeploymentRuleIntegrations: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
    ],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentBranchPolicies: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    listDeploymentStatuses: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
    ],
    listReleaseAssets: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
    ],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhookDeliveries: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
    ],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeAppAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    removeCollaborator: [
      "DELETE /repos/{owner}/{repo}/collaborators/{username}"
    ],
    removeStatusCheckContexts: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    removeStatusCheckProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    removeTeamAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    removeUserAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    setAppAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    setStatusCheckContexts: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    setTeamAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    setUserAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateDeploymentBranchPolicy: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: [
      "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
    updatePullRequestReviewProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: [
      "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    updateStatusCheckPotection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
      {},
      { renamed: ["repos", "updateStatusCheckProtection"] }
    ],
    updateStatusCheckProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: [
      "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    uploadReleaseAsset: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
      { baseUrl: "https://uploads.github.com" }
    ]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits"],
    issuesAndPullRequests: [
      "GET /search/issues",
      {},
      {
        deprecated: "octokit.rest.search.issuesAndPullRequests() is deprecated, see https://docs.github.com/rest/search/search#search-issues-and-pull-requests"
      }
    ],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  secretScanning: {
    createPushProtectionBypass: [
      "POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ],
    getScanHistory: ["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/secret-scanning/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    listLocationsForAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ]
  },
  securityAdvisories: {
    createFork: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"
    ],
    createPrivateVulnerabilityReport: [
      "POST /repos/{owner}/{repo}/security-advisories/reports"
    ],
    createRepositoryAdvisory: [
      "POST /repos/{owner}/{repo}/security-advisories"
    ],
    createRepositoryAdvisoryCveRequest: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
    ],
    getGlobalAdvisory: ["GET /advisories/{ghsa_id}"],
    getRepositoryAdvisory: [
      "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ],
    listGlobalAdvisories: ["GET /advisories"],
    listOrgRepositoryAdvisories: ["GET /orgs/{org}/security-advisories"],
    listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
    updateRepositoryAdvisory: [
      "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    addOrUpdateRepoPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    checkPermissionsForRepoInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    deleteDiscussionInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    getDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    getMembershipForUserInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/invitations"
    ],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    removeRepoInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    updateDiscussionCommentInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    updateDiscussionInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: [
      "POST /user/emails",
      {},
      { renamed: ["users", "addEmailForAuthenticatedUser"] }
    ],
    addEmailForAuthenticatedUser: ["POST /user/emails"],
    addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: [
      "POST /user/gpg_keys",
      {},
      { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
    ],
    createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: [
      "POST /user/keys",
      {},
      { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
    ],
    createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
    createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
    deleteEmailForAuthenticated: [
      "DELETE /user/emails",
      {},
      { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
    ],
    deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: [
      "DELETE /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
    ],
    deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: [
      "DELETE /user/keys/{key_id}",
      {},
      { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
    ],
    deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
    deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
    deleteSshSigningKeyForAuthenticatedUser: [
      "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getById: ["GET /user/{account_id}"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: [
      "GET /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
    ],
    getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: [
      "GET /user/keys/{key_id}",
      {},
      { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
    ],
    getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
    getSshSigningKeyForAuthenticatedUser: [
      "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    list: ["GET /users"],
    listAttestations: ["GET /users/{username}/attestations/{subject_digest}"],
    listBlockedByAuthenticated: [
      "GET /user/blocks",
      {},
      { renamed: ["users", "listBlockedByAuthenticatedUser"] }
    ],
    listBlockedByAuthenticatedUser: ["GET /user/blocks"],
    listEmailsForAuthenticated: [
      "GET /user/emails",
      {},
      { renamed: ["users", "listEmailsForAuthenticatedUser"] }
    ],
    listEmailsForAuthenticatedUser: ["GET /user/emails"],
    listFollowedByAuthenticated: [
      "GET /user/following",
      {},
      { renamed: ["users", "listFollowedByAuthenticatedUser"] }
    ],
    listFollowedByAuthenticatedUser: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: [
      "GET /user/gpg_keys",
      {},
      { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
    ],
    listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: [
      "GET /user/public_emails",
      {},
      { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
    ],
    listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: [
      "GET /user/keys",
      {},
      { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
    ],
    listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
    listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
    listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
    listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
    listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
    setPrimaryEmailVisibilityForAuthenticated: [
      "PATCH /user/email/visibility",
      {},
      { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
    ],
    setPrimaryEmailVisibilityForAuthenticatedUser: [
      "PATCH /user/email/visibility"
    ],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};
var endpoints_default = Endpoints;

//# sourceMappingURL=endpoints.js.map

;// CONCATENATED MODULE: ./node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/endpoints-to-methods.js

const endpointMethodsMap = /* @__PURE__ */ new Map();
for (const [scope, endpoints] of Object.entries(endpoints_default)) {
  for (const [methodName, endpoint] of Object.entries(endpoints)) {
    const [route, defaults, decorations] = endpoint;
    const [method, url] = route.split(/ /);
    const endpointDefaults = Object.assign(
      {
        method,
        url
      },
      defaults
    );
    if (!endpointMethodsMap.has(scope)) {
      endpointMethodsMap.set(scope, /* @__PURE__ */ new Map());
    }
    endpointMethodsMap.get(scope).set(methodName, {
      scope,
      methodName,
      endpointDefaults,
      decorations
    });
  }
}
const handler = {
  has({ scope }, methodName) {
    return endpointMethodsMap.get(scope).has(methodName);
  },
  getOwnPropertyDescriptor(target, methodName) {
    return {
      value: this.get(target, methodName),
      // ensures method is in the cache
      configurable: true,
      writable: true,
      enumerable: true
    };
  },
  defineProperty(target, methodName, descriptor) {
    Object.defineProperty(target.cache, methodName, descriptor);
    return true;
  },
  deleteProperty(target, methodName) {
    delete target.cache[methodName];
    return true;
  },
  ownKeys({ scope }) {
    return [...endpointMethodsMap.get(scope).keys()];
  },
  set(target, methodName, value) {
    return target.cache[methodName] = value;
  },
  get({ octokit, scope, cache }, methodName) {
    if (cache[methodName]) {
      return cache[methodName];
    }
    const method = endpointMethodsMap.get(scope).get(methodName);
    if (!method) {
      return void 0;
    }
    const { endpointDefaults, decorations } = method;
    if (decorations) {
      cache[methodName] = decorate(
        octokit,
        scope,
        methodName,
        endpointDefaults,
        decorations
      );
    } else {
      cache[methodName] = octokit.request.defaults(endpointDefaults);
    }
    return cache[methodName];
  }
};
function endpointsToMethods(octokit) {
  const newMethods = {};
  for (const scope of endpointMethodsMap.keys()) {
    newMethods[scope] = new Proxy({ octokit, scope, cache: {} }, handler);
  }
  return newMethods;
}
function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  function withDecorations(...args) {
    let options = requestWithDefaults.endpoint.merge(...args);
    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: void 0
      });
      return requestWithDefaults(options);
    }
    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(
        `octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`
      );
    }
    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }
    if (decorations.renamedParameters) {
      const options2 = requestWithDefaults.endpoint.merge(...args);
      for (const [name, alias] of Object.entries(
        decorations.renamedParameters
      )) {
        if (name in options2) {
          octokit.log.warn(
            `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`
          );
          if (!(alias in options2)) {
            options2[alias] = options2[name];
          }
          delete options2[name];
        }
      }
      return requestWithDefaults(options2);
    }
    return requestWithDefaults(...args);
  }
  return Object.assign(withDecorations, requestWithDefaults);
}

//# sourceMappingURL=endpoints-to-methods.js.map

;// CONCATENATED MODULE: ./node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/index.js


function restEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    rest: api
  };
}
restEndpointMethods.VERSION = dist_src_version_VERSION;
function legacyRestEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    ...api,
    rest: api
  };
}
legacyRestEndpointMethods.VERSION = dist_src_version_VERSION;

//# sourceMappingURL=index.js.map

// EXTERNAL MODULE: ./node_modules/bottleneck/light.js
var light = __nccwpck_require__(251);
;// CONCATENATED MODULE: ./node_modules/@octokit/plugin-retry/dist-bundle/index.js
// pkg/dist-src/version.js
var plugin_retry_dist_bundle_VERSION = "0.0.0-development";

// pkg/dist-src/error-request.js
async function errorRequest(state, octokit, error, options) {
  if (!error.request || !error.request.request) {
    throw error;
  }
  if (error.status >= 400 && !state.doNotRetry.includes(error.status)) {
    const retries = options.request.retries != null ? options.request.retries : state.retries;
    const retryAfter = Math.pow((options.request.retryCount || 0) + 1, 2);
    throw octokit.retry.retryRequest(error, retries, retryAfter);
  }
  throw error;
}

// pkg/dist-src/wrap-request.js


async function wrapRequest(state, octokit, request, options) {
  const limiter = new light();
  limiter.on("failed", function(error, info) {
    const maxRetries = ~~error.request.request.retries;
    const after = ~~error.request.request.retryAfter;
    options.request.retryCount = info.retryCount + 1;
    if (maxRetries > info.retryCount) {
      return after * state.retryAfterBaseValue;
    }
  });
  return limiter.schedule(
    requestWithGraphqlErrorHandling.bind(null, state, octokit, request),
    options
  );
}
async function requestWithGraphqlErrorHandling(state, octokit, request, options) {
  const response = await request(request, options);
  if (response.data && response.data.errors && response.data.errors.length > 0 && /Something went wrong while executing your query/.test(
    response.data.errors[0].message
  )) {
    const error = new RequestError(response.data.errors[0].message, 500, {
      request: options,
      response
    });
    return errorRequest(state, octokit, error, options);
  }
  return response;
}

// pkg/dist-src/index.js
function retry(octokit, octokitOptions) {
  const state = Object.assign(
    {
      enabled: true,
      retryAfterBaseValue: 1e3,
      doNotRetry: [400, 401, 403, 404, 410, 422, 451],
      retries: 3
    },
    octokitOptions.retry
  );
  if (state.enabled) {
    octokit.hook.error("request", errorRequest.bind(null, state, octokit));
    octokit.hook.wrap("request", wrapRequest.bind(null, state, octokit));
  }
  return {
    retry: {
      retryRequest: (error, retries, retryAfter) => {
        error.request.request = Object.assign({}, error.request.request, {
          retries,
          retryAfter
        });
        return error;
      }
    }
  };
}
retry.VERSION = plugin_retry_dist_bundle_VERSION;


;// CONCATENATED MODULE: ./node_modules/@octokit/plugin-throttling/dist-bundle/index.js
// pkg/dist-src/index.js


// pkg/dist-src/version.js
var plugin_throttling_dist_bundle_VERSION = "0.0.0-development";

// pkg/dist-src/wrap-request.js
var dist_bundle_noop = () => Promise.resolve();
function dist_bundle_wrapRequest(state, request, options) {
  return state.retryLimiter.schedule(doRequest, state, request, options);
}
async function doRequest(state, request, options) {
  const { pathname } = new URL(options.url, "http://github.test");
  const isAuth = isAuthRequest(options.method, pathname);
  const isWrite = !isAuth && options.method !== "GET" && options.method !== "HEAD";
  const isSearch = options.method === "GET" && pathname.startsWith("/search/");
  const isGraphQL = pathname.startsWith("/graphql");
  const retryCount = ~~request.retryCount;
  const jobOptions = retryCount > 0 ? { priority: 0, weight: 0 } : {};
  if (state.clustering) {
    jobOptions.expiration = 1e3 * 60;
  }
  if (isWrite || isGraphQL) {
    await state.write.key(state.id).schedule(jobOptions, dist_bundle_noop);
  }
  if (isWrite && state.triggersNotification(pathname)) {
    await state.notifications.key(state.id).schedule(jobOptions, dist_bundle_noop);
  }
  if (isSearch) {
    await state.search.key(state.id).schedule(jobOptions, dist_bundle_noop);
  }
  const req = (isAuth ? state.auth : state.global).key(state.id).schedule(jobOptions, request, options);
  if (isGraphQL) {
    const res = await req;
    if (res.data.errors != null && res.data.errors.some((error) => error.type === "RATE_LIMITED")) {
      const error = Object.assign(new Error("GraphQL Rate Limit Exceeded"), {
        response: res,
        data: res.data
      });
      throw error;
    }
  }
  return req;
}
function isAuthRequest(method, pathname) {
  return method === "PATCH" && // https://docs.github.com/en/rest/apps/apps?apiVersion=2022-11-28#create-a-scoped-access-token
  /^\/applications\/[^/]+\/token\/scoped$/.test(pathname) || method === "POST" && // https://docs.github.com/en/rest/apps/oauth-applications?apiVersion=2022-11-28#reset-a-token
  (/^\/applications\/[^/]+\/token$/.test(pathname) || // https://docs.github.com/en/rest/apps/apps?apiVersion=2022-11-28#create-an-installation-access-token-for-an-app
  /^\/app\/installations\/[^/]+\/access_tokens$/.test(pathname) || // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
  pathname === "/login/oauth/access_token");
}

// pkg/dist-src/generated/triggers-notification-paths.js
var triggers_notification_paths_default = [
  "/orgs/{org}/invitations",
  "/orgs/{org}/invitations/{invitation_id}",
  "/orgs/{org}/teams/{team_slug}/discussions",
  "/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
  "/repos/{owner}/{repo}/collaborators/{username}",
  "/repos/{owner}/{repo}/commits/{commit_sha}/comments",
  "/repos/{owner}/{repo}/issues",
  "/repos/{owner}/{repo}/issues/{issue_number}/comments",
  "/repos/{owner}/{repo}/issues/{issue_number}/sub_issue",
  "/repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority",
  "/repos/{owner}/{repo}/pulls",
  "/repos/{owner}/{repo}/pulls/{pull_number}/comments",
  "/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
  "/repos/{owner}/{repo}/pulls/{pull_number}/merge",
  "/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
  "/repos/{owner}/{repo}/pulls/{pull_number}/reviews",
  "/repos/{owner}/{repo}/releases",
  "/teams/{team_id}/discussions",
  "/teams/{team_id}/discussions/{discussion_number}/comments"
];

// pkg/dist-src/route-matcher.js
function routeMatcher(paths) {
  const regexes = paths.map(
    (path) => path.split("/").map((c) => c.startsWith("{") ? "(?:.+?)" : c).join("/")
  );
  const regex2 = `^(?:${regexes.map((r) => `(?:${r})`).join("|")})[^/]*$`;
  return new RegExp(regex2, "i");
}

// pkg/dist-src/index.js
var regex = routeMatcher(triggers_notification_paths_default);
var triggersNotification = regex.test.bind(regex);
var groups = {};
var createGroups = function(Bottleneck, common) {
  groups.global = new Bottleneck.Group({
    id: "octokit-global",
    maxConcurrent: 10,
    ...common
  });
  groups.auth = new Bottleneck.Group({
    id: "octokit-auth",
    maxConcurrent: 1,
    ...common
  });
  groups.search = new Bottleneck.Group({
    id: "octokit-search",
    maxConcurrent: 1,
    minTime: 2e3,
    ...common
  });
  groups.write = new Bottleneck.Group({
    id: "octokit-write",
    maxConcurrent: 1,
    minTime: 1e3,
    ...common
  });
  groups.notifications = new Bottleneck.Group({
    id: "octokit-notifications",
    maxConcurrent: 1,
    minTime: 3e3,
    ...common
  });
};
function throttling(octokit, octokitOptions) {
  const {
    enabled = true,
    Bottleneck = light,
    id = "no-id",
    timeout = 1e3 * 60 * 2,
    // Redis TTL: 2 minutes
    connection
  } = octokitOptions.throttle || {};
  if (!enabled) {
    return {};
  }
  const common = { timeout };
  if (typeof connection !== "undefined") {
    common.connection = connection;
  }
  if (groups.global == null) {
    createGroups(Bottleneck, common);
  }
  const state = Object.assign(
    {
      clustering: connection != null,
      triggersNotification,
      fallbackSecondaryRateRetryAfter: 60,
      retryAfterBaseValue: 1e3,
      retryLimiter: new Bottleneck(),
      id,
      ...groups
    },
    octokitOptions.throttle
  );
  if (typeof state.onSecondaryRateLimit !== "function" || typeof state.onRateLimit !== "function") {
    throw new Error(`octokit/plugin-throttling error:
        You must pass the onSecondaryRateLimit and onRateLimit error handlers.
        See https://octokit.github.io/rest.js/#throttling

        const octokit = new Octokit({
          throttle: {
            onSecondaryRateLimit: (retryAfter, options) => {/* ... */},
            onRateLimit: (retryAfter, options) => {/* ... */}
          }
        })
    `);
  }
  const events = {};
  const emitter = new Bottleneck.Events(events);
  events.on("secondary-limit", state.onSecondaryRateLimit);
  events.on("rate-limit", state.onRateLimit);
  events.on(
    "error",
    (e) => octokit.log.warn("Error in throttling-plugin limit handler", e)
  );
  state.retryLimiter.on("failed", async function(error, info) {
    const [state2, request, options] = info.args;
    const { pathname } = new URL(options.url, "http://github.test");
    const shouldRetryGraphQL = pathname.startsWith("/graphql") && error.status !== 401;
    if (!(shouldRetryGraphQL || error.status === 403 || error.status === 429)) {
      return;
    }
    const retryCount = ~~request.retryCount;
    request.retryCount = retryCount;
    options.request.retryCount = retryCount;
    const { wantRetry, retryAfter = 0 } = await async function() {
      if (/\bsecondary rate\b/i.test(error.message)) {
        const retryAfter2 = Number(error.response.headers["retry-after"]) || state2.fallbackSecondaryRateRetryAfter;
        const wantRetry2 = await emitter.trigger(
          "secondary-limit",
          retryAfter2,
          options,
          octokit,
          retryCount
        );
        return { wantRetry: wantRetry2, retryAfter: retryAfter2 };
      }
      if (error.response.headers != null && error.response.headers["x-ratelimit-remaining"] === "0" || (error.response.data?.errors ?? []).some(
        (error2) => error2.type === "RATE_LIMITED"
      )) {
        const rateLimitReset = new Date(
          ~~error.response.headers["x-ratelimit-reset"] * 1e3
        ).getTime();
        const retryAfter2 = Math.max(
          // Add one second so we retry _after_ the reset time
          // https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#exceeding-the-rate-limit
          Math.ceil((rateLimitReset - Date.now()) / 1e3) + 1,
          0
        );
        const wantRetry2 = await emitter.trigger(
          "rate-limit",
          retryAfter2,
          options,
          octokit,
          retryCount
        );
        return { wantRetry: wantRetry2, retryAfter: retryAfter2 };
      }
      return {};
    }();
    if (wantRetry) {
      request.retryCount++;
      return retryAfter * state2.retryAfterBaseValue;
    }
  });
  octokit.hook.wrap("request", dist_bundle_wrapRequest.bind(null, state));
  return {};
}
throttling.VERSION = plugin_throttling_dist_bundle_VERSION;
throttling.triggersNotification = triggersNotification;


;// CONCATENATED MODULE: ./node_modules/@octokit/oauth-authorization-url/dist-src/index.js
function oauthAuthorizationUrl(options) {
  const clientType = options.clientType || "oauth-app";
  const baseUrl = options.baseUrl || "https://github.com";
  const result = {
    clientType,
    allowSignup: options.allowSignup === false ? false : true,
    clientId: options.clientId,
    login: options.login || null,
    redirectUrl: options.redirectUrl || null,
    state: options.state || Math.random().toString(36).substr(2),
    url: ""
  };
  if (clientType === "oauth-app") {
    const scopes = "scopes" in options ? options.scopes : [];
    result.scopes = typeof scopes === "string" ? scopes.split(/[,\s]+/).filter(Boolean) : scopes;
  }
  result.url = urlBuilderAuthorize(`${baseUrl}/login/oauth/authorize`, result);
  return result;
}
function urlBuilderAuthorize(base, options) {
  const map = {
    allowSignup: "allow_signup",
    clientId: "client_id",
    login: "login",
    redirectUrl: "redirect_uri",
    scopes: "scope",
    state: "state"
  };
  let url = base;
  Object.keys(map).filter((k) => options[k] !== null).filter((k) => {
    if (k !== "scopes")
      return true;
    if (options.clientType === "github-app")
      return false;
    return !Array.isArray(options[k]) || options[k].length > 0;
  }).map((key) => [map[key], `${options[key]}`]).forEach(([key, value], index) => {
    url += index === 0 ? `?` : "&";
    url += `${key}=${encodeURIComponent(value)}`;
  });
  return url;
}


;// CONCATENATED MODULE: ./node_modules/@octokit/oauth-methods/dist-bundle/index.js
// pkg/dist-src/version.js
var oauth_methods_dist_bundle_VERSION = "0.0.0-development";

// pkg/dist-src/get-web-flow-authorization-url.js



// pkg/dist-src/utils.js

function requestToOAuthBaseUrl(request) {
  const endpointDefaults = request.endpoint.DEFAULTS;
  return /^https:\/\/(api\.)?github\.com$/.test(endpointDefaults.baseUrl) ? "https://github.com" : endpointDefaults.baseUrl.replace("/api/v3", "");
}
async function oauthRequest(request, route, parameters) {
  const withOAuthParameters = {
    baseUrl: requestToOAuthBaseUrl(request),
    headers: {
      accept: "application/json"
    },
    ...parameters
  };
  const response = await request(route, withOAuthParameters);
  if ("error" in response.data) {
    const error = new RequestError(
      `${response.data.error_description} (${response.data.error}, ${response.data.error_uri})`,
      400,
      {
        request: request.endpoint.merge(
          route,
          withOAuthParameters
        )
      }
    );
    error.response = response;
    throw error;
  }
  return response;
}

// pkg/dist-src/get-web-flow-authorization-url.js
function getWebFlowAuthorizationUrl({
  request = dist_bundle_request,
  ...options
}) {
  const baseUrl = requestToOAuthBaseUrl(request);
  return oauthAuthorizationUrl({
    ...options,
    baseUrl
  });
}

// pkg/dist-src/exchange-web-flow-code.js

async function exchangeWebFlowCode(options) {
  const request = options.request || dist_bundle_request;
  const response = await oauthRequest(
    request,
    "POST /login/oauth/access_token",
    {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code: options.code,
      redirect_uri: options.redirectUrl
    }
  );
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean)
  };
  if (options.clientType === "github-app") {
    if ("refresh_token" in response.data) {
      const apiTimeInMs = new Date(response.headers.date).getTime();
      authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp(
        apiTimeInMs,
        response.data.expires_in
      ), authentication.refreshTokenExpiresAt = toTimestamp(
        apiTimeInMs,
        response.data.refresh_token_expires_in
      );
    }
    delete authentication.scopes;
  }
  return { ...response, authentication };
}
function toTimestamp(apiTimeInMs, expirationInSeconds) {
  return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
}

// pkg/dist-src/create-device-code.js

async function createDeviceCode(options) {
  const request = options.request || dist_bundle_request;
  const parameters = {
    client_id: options.clientId
  };
  if ("scopes" in options && Array.isArray(options.scopes)) {
    parameters.scope = options.scopes.join(" ");
  }
  return oauthRequest(request, "POST /login/device/code", parameters);
}

// pkg/dist-src/exchange-device-code.js

async function exchangeDeviceCode(options) {
  const request = options.request || dist_bundle_request;
  const response = await oauthRequest(
    request,
    "POST /login/oauth/access_token",
    {
      client_id: options.clientId,
      device_code: options.code,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    }
  );
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean)
  };
  if ("clientSecret" in options) {
    authentication.clientSecret = options.clientSecret;
  }
  if (options.clientType === "github-app") {
    if ("refresh_token" in response.data) {
      const apiTimeInMs = new Date(response.headers.date).getTime();
      authentication.refreshToken = response.data.refresh_token, authentication.expiresAt = toTimestamp2(
        apiTimeInMs,
        response.data.expires_in
      ), authentication.refreshTokenExpiresAt = toTimestamp2(
        apiTimeInMs,
        response.data.refresh_token_expires_in
      );
    }
    delete authentication.scopes;
  }
  return { ...response, authentication };
}
function toTimestamp2(apiTimeInMs, expirationInSeconds) {
  return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
}

// pkg/dist-src/check-token.js

async function checkToken(options) {
  const request = options.request || dist_bundle_request;
  const response = await request("POST /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${btoa(
        `${options.clientId}:${options.clientSecret}`
      )}`
    },
    client_id: options.clientId,
    access_token: options.token
  });
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: options.token,
    scopes: response.data.scopes
  };
  if (response.data.expires_at)
    authentication.expiresAt = response.data.expires_at;
  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }
  return { ...response, authentication };
}

// pkg/dist-src/refresh-token.js

async function refreshToken(options) {
  const request = options.request || dist_bundle_request;
  const response = await oauthRequest(
    request,
    "POST /login/oauth/access_token",
    {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      grant_type: "refresh_token",
      refresh_token: options.refreshToken
    }
  );
  const apiTimeInMs = new Date(response.headers.date).getTime();
  const authentication = {
    clientType: "github-app",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresAt: toTimestamp3(apiTimeInMs, response.data.expires_in),
    refreshTokenExpiresAt: toTimestamp3(
      apiTimeInMs,
      response.data.refresh_token_expires_in
    )
  };
  return { ...response, authentication };
}
function toTimestamp3(apiTimeInMs, expirationInSeconds) {
  return new Date(apiTimeInMs + expirationInSeconds * 1e3).toISOString();
}

// pkg/dist-src/scope-token.js

async function scopeToken(options) {
  const {
    request: optionsRequest,
    clientType,
    clientId,
    clientSecret,
    token,
    ...requestOptions
  } = options;
  const request = options.request || dist_bundle_request;
  const response = await request(
    "POST /applications/{client_id}/token/scoped",
    {
      headers: {
        authorization: `basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      client_id: clientId,
      access_token: token,
      ...requestOptions
    }
  );
  const authentication = Object.assign(
    {
      clientType,
      clientId,
      clientSecret,
      token: response.data.token
    },
    response.data.expires_at ? { expiresAt: response.data.expires_at } : {}
  );
  return { ...response, authentication };
}

// pkg/dist-src/reset-token.js

async function resetToken(options) {
  const request = options.request || dist_bundle_request;
  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  const response = await request(
    "PATCH /applications/{client_id}/token",
    {
      headers: {
        authorization: `basic ${auth}`
      },
      client_id: options.clientId,
      access_token: options.token
    }
  );
  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.token,
    scopes: response.data.scopes
  };
  if (response.data.expires_at)
    authentication.expiresAt = response.data.expires_at;
  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }
  return { ...response, authentication };
}

// pkg/dist-src/delete-token.js

async function deleteToken(options) {
  const request = options.request || dist_bundle_request;
  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  return request(
    "DELETE /applications/{client_id}/token",
    {
      headers: {
        authorization: `basic ${auth}`
      },
      client_id: options.clientId,
      access_token: options.token
    }
  );
}

// pkg/dist-src/delete-authorization.js

async function deleteAuthorization(options) {
  const request = options.request || dist_bundle_request;
  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  return request(
    "DELETE /applications/{client_id}/grant",
    {
      headers: {
        authorization: `basic ${auth}`
      },
      client_id: options.clientId,
      access_token: options.token
    }
  );
}


;// CONCATENATED MODULE: ./node_modules/@octokit/auth-oauth-device/dist-bundle/index.js
// pkg/dist-src/index.js



// pkg/dist-src/get-oauth-access-token.js

async function getOAuthAccessToken(state, options) {
  const cachedAuthentication = getCachedAuthentication(state, options.auth);
  if (cachedAuthentication) return cachedAuthentication;
  const { data: verification } = await createDeviceCode({
    clientType: state.clientType,
    clientId: state.clientId,
    request: options.request || state.request,
    // @ts-expect-error the extra code to make TS happy is not worth it
    scopes: options.auth.scopes || state.scopes
  });
  await state.onVerification(verification);
  const authentication = await waitForAccessToken(
    options.request || state.request,
    state.clientId,
    state.clientType,
    verification
  );
  state.authentication = authentication;
  return authentication;
}
function getCachedAuthentication(state, auth2) {
  if (auth2.refresh === true) return false;
  if (!state.authentication) return false;
  if (state.clientType === "github-app") {
    return state.authentication;
  }
  const authentication = state.authentication;
  const newScope = ("scopes" in auth2 && auth2.scopes || state.scopes).join(
    " "
  );
  const currentScope = authentication.scopes.join(" ");
  return newScope === currentScope ? authentication : false;
}
async function wait(seconds) {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
}
async function waitForAccessToken(request, clientId, clientType, verification) {
  try {
    const options = {
      clientId,
      request,
      code: verification.device_code
    };
    const { authentication } = clientType === "oauth-app" ? await exchangeDeviceCode({
      ...options,
      clientType: "oauth-app"
    }) : await exchangeDeviceCode({
      ...options,
      clientType: "github-app"
    });
    return {
      type: "token",
      tokenType: "oauth",
      ...authentication
    };
  } catch (error) {
    if (!error.response) throw error;
    const errorType = error.response.data.error;
    if (errorType === "authorization_pending") {
      await wait(verification.interval);
      return waitForAccessToken(request, clientId, clientType, verification);
    }
    if (errorType === "slow_down") {
      await wait(verification.interval + 7);
      return waitForAccessToken(request, clientId, clientType, verification);
    }
    throw error;
  }
}

// pkg/dist-src/auth.js
async function dist_bundle_auth(state, authOptions) {
  return getOAuthAccessToken(state, {
    auth: authOptions
  });
}

// pkg/dist-src/hook.js
async function dist_bundle_hook(state, request, route, parameters) {
  let endpoint = request.endpoint.merge(
    route,
    parameters
  );
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
    return request(endpoint);
  }
  const { token } = await getOAuthAccessToken(state, {
    request,
    auth: { type: "oauth" }
  });
  endpoint.headers.authorization = `token ${token}`;
  return request(endpoint);
}

// pkg/dist-src/version.js
var auth_oauth_device_dist_bundle_VERSION = "0.0.0-development";

// pkg/dist-src/index.js
function createOAuthDeviceAuth(options) {
  const requestWithDefaults = options.request || dist_bundle_request.defaults({
    headers: {
      "user-agent": `octokit-auth-oauth-device.js/${auth_oauth_device_dist_bundle_VERSION} ${getUserAgent()}`
    }
  });
  const { request = requestWithDefaults, ...otherOptions } = options;
  const state = options.clientType === "github-app" ? {
    ...otherOptions,
    clientType: "github-app",
    request
  } : {
    ...otherOptions,
    clientType: "oauth-app",
    request,
    scopes: options.scopes || []
  };
  if (!options.clientId) {
    throw new Error(
      '[@octokit/auth-oauth-device] "clientId" option must be set (https://github.com/octokit/auth-oauth-device.js#usage)'
    );
  }
  if (!options.onVerification) {
    throw new Error(
      '[@octokit/auth-oauth-device] "onVerification" option must be a function (https://github.com/octokit/auth-oauth-device.js#usage)'
    );
  }
  return Object.assign(dist_bundle_auth.bind(null, state), {
    hook: dist_bundle_hook.bind(null, state)
  });
}


;// CONCATENATED MODULE: ./node_modules/@octokit/auth-oauth-user/dist-bundle/index.js
// pkg/dist-src/index.js



// pkg/dist-src/version.js
var auth_oauth_user_dist_bundle_VERSION = "0.0.0-development";

// pkg/dist-src/get-authentication.js


async function getAuthentication(state) {
  if ("code" in state.strategyOptions) {
    const { authentication } = await exchangeWebFlowCode({
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      clientType: state.clientType,
      onTokenCreated: state.onTokenCreated,
      ...state.strategyOptions,
      request: state.request
    });
    return {
      type: "token",
      tokenType: "oauth",
      ...authentication
    };
  }
  if ("onVerification" in state.strategyOptions) {
    const deviceAuth = createOAuthDeviceAuth({
      clientType: state.clientType,
      clientId: state.clientId,
      onTokenCreated: state.onTokenCreated,
      ...state.strategyOptions,
      request: state.request
    });
    const authentication = await deviceAuth({
      type: "oauth"
    });
    return {
      clientSecret: state.clientSecret,
      ...authentication
    };
  }
  if ("token" in state.strategyOptions) {
    return {
      type: "token",
      tokenType: "oauth",
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      clientType: state.clientType,
      onTokenCreated: state.onTokenCreated,
      ...state.strategyOptions
    };
  }
  throw new Error("[@octokit/auth-oauth-user] Invalid strategy options");
}

// pkg/dist-src/auth.js

async function auth_oauth_user_dist_bundle_auth(state, options = {}) {
  if (!state.authentication) {
    state.authentication = state.clientType === "oauth-app" ? await getAuthentication(state) : await getAuthentication(state);
  }
  if (state.authentication.invalid) {
    throw new Error("[@octokit/auth-oauth-user] Token is invalid");
  }
  const currentAuthentication = state.authentication;
  if ("expiresAt" in currentAuthentication) {
    if (options.type === "refresh" || new Date(currentAuthentication.expiresAt) < /* @__PURE__ */ new Date()) {
      const { authentication } = await refreshToken({
        clientType: "github-app",
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        refreshToken: currentAuthentication.refreshToken,
        request: state.request
      });
      state.authentication = {
        tokenType: "oauth",
        type: "token",
        ...authentication
      };
    }
  }
  if (options.type === "refresh") {
    if (state.clientType === "oauth-app") {
      throw new Error(
        "[@octokit/auth-oauth-user] OAuth Apps do not support expiring tokens"
      );
    }
    if (!currentAuthentication.hasOwnProperty("expiresAt")) {
      throw new Error("[@octokit/auth-oauth-user] Refresh token missing");
    }
    await state.onTokenCreated?.(state.authentication, {
      type: options.type
    });
  }
  if (options.type === "check" || options.type === "reset") {
    const method = options.type === "check" ? checkToken : resetToken;
    try {
      const { authentication } = await method({
        // @ts-expect-error making TS happy would require unnecessary code so no
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: state.authentication.token,
        request: state.request
      });
      state.authentication = {
        tokenType: "oauth",
        type: "token",
        // @ts-expect-error TBD
        ...authentication
      };
      if (options.type === "reset") {
        await state.onTokenCreated?.(state.authentication, {
          type: options.type
        });
      }
      return state.authentication;
    } catch (error) {
      if (error.status === 404) {
        error.message = "[@octokit/auth-oauth-user] Token is invalid";
        state.authentication.invalid = true;
      }
      throw error;
    }
  }
  if (options.type === "delete" || options.type === "deleteAuthorization") {
    const method = options.type === "delete" ? deleteToken : deleteAuthorization;
    try {
      await method({
        // @ts-expect-error making TS happy would require unnecessary code so no
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: state.authentication.token,
        request: state.request
      });
    } catch (error) {
      if (error.status !== 404) throw error;
    }
    state.authentication.invalid = true;
    return state.authentication;
  }
  return state.authentication;
}

// pkg/dist-src/requires-basic-auth.js
var ROUTES_REQUIRING_BASIC_AUTH = /\/applications\/[^/]+\/(token|grant)s?/;
function requiresBasicAuth(url) {
  return url && ROUTES_REQUIRING_BASIC_AUTH.test(url);
}

// pkg/dist-src/hook.js
async function auth_oauth_user_dist_bundle_hook(state, request, route, parameters = {}) {
  const endpoint = request.endpoint.merge(
    route,
    parameters
  );
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
    return request(endpoint);
  }
  if (requiresBasicAuth(endpoint.url)) {
    const credentials = btoa(`${state.clientId}:${state.clientSecret}`);
    endpoint.headers.authorization = `basic ${credentials}`;
    return request(endpoint);
  }
  const { token } = state.clientType === "oauth-app" ? await auth_oauth_user_dist_bundle_auth({ ...state, request }) : await auth_oauth_user_dist_bundle_auth({ ...state, request });
  endpoint.headers.authorization = "token " + token;
  return request(endpoint);
}

// pkg/dist-src/index.js
function createOAuthUserAuth({
  clientId,
  clientSecret,
  clientType = "oauth-app",
  request = dist_bundle_request.defaults({
    headers: {
      "user-agent": `octokit-auth-oauth-app.js/${auth_oauth_user_dist_bundle_VERSION} ${getUserAgent()}`
    }
  }),
  onTokenCreated,
  ...strategyOptions
}) {
  const state = Object.assign({
    clientType,
    clientId,
    clientSecret,
    onTokenCreated,
    strategyOptions,
    request
  });
  return Object.assign(auth_oauth_user_dist_bundle_auth.bind(null, state), {
    // @ts-expect-error not worth the extra code needed to appease TS
    hook: auth_oauth_user_dist_bundle_hook.bind(null, state)
  });
}
createOAuthUserAuth.VERSION = auth_oauth_user_dist_bundle_VERSION;


;// CONCATENATED MODULE: ./node_modules/@octokit/auth-oauth-app/dist-bundle/index.js
// pkg/dist-src/index.js



// pkg/dist-src/auth.js

async function auth_oauth_app_dist_bundle_auth(state, authOptions) {
  if (authOptions.type === "oauth-app") {
    return {
      type: "oauth-app",
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      clientType: state.clientType,
      headers: {
        authorization: `basic ${btoa(
          `${state.clientId}:${state.clientSecret}`
        )}`
      }
    };
  }
  if ("factory" in authOptions) {
    const { type, ...options } = {
      ...authOptions,
      ...state
    };
    return authOptions.factory(options);
  }
  const common = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.request,
    ...authOptions
  };
  const userAuth = state.clientType === "oauth-app" ? await createOAuthUserAuth({
    ...common,
    clientType: state.clientType
  }) : await createOAuthUserAuth({
    ...common,
    clientType: state.clientType
  });
  return userAuth();
}

// pkg/dist-src/hook.js

async function auth_oauth_app_dist_bundle_hook(state, request2, route, parameters) {
  let endpoint = request2.endpoint.merge(
    route,
    parameters
  );
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
    return request2(endpoint);
  }
  if (state.clientType === "github-app" && !requiresBasicAuth(endpoint.url)) {
    throw new Error(
      `[@octokit/auth-oauth-app] GitHub Apps cannot use their client ID/secret for basic authentication for endpoints other than "/applications/{client_id}/**". "${endpoint.method} ${endpoint.url}" is not supported.`
    );
  }
  const credentials = btoa(`${state.clientId}:${state.clientSecret}`);
  endpoint.headers.authorization = `basic ${credentials}`;
  try {
    return await request2(endpoint);
  } catch (error) {
    if (error.status !== 401) throw error;
    error.message = `[@octokit/auth-oauth-app] "${endpoint.method} ${endpoint.url}" does not support clientId/clientSecret basic authentication.`;
    throw error;
  }
}

// pkg/dist-src/version.js
var auth_oauth_app_dist_bundle_VERSION = "0.0.0-development";

// pkg/dist-src/index.js

function createOAuthAppAuth(options) {
  const state = Object.assign(
    {
      request: dist_bundle_request.defaults({
        headers: {
          "user-agent": `octokit-auth-oauth-app.js/${auth_oauth_app_dist_bundle_VERSION} ${getUserAgent()}`
        }
      }),
      clientType: "oauth-app"
    },
    options
  );
  return Object.assign(auth_oauth_app_dist_bundle_auth.bind(null, state), {
    hook: auth_oauth_app_dist_bundle_hook.bind(null, state)
  });
}


;// CONCATENATED MODULE: ./node_modules/universal-github-app-jwt/lib/utils.js
// we don't @ts-check here because it chokes on atob and btoa which are available in all modern JS runtime environments

/**
 * @param {string} privateKey
 * @returns {boolean}
 */
function isPkcs1(privateKey) {
  return privateKey.includes("-----BEGIN RSA PRIVATE KEY-----");
}

/**
 * @param {string} privateKey
 * @returns {boolean}
 */
function isOpenSsh(privateKey) {
  return privateKey.includes("-----BEGIN OPENSSH PRIVATE KEY-----");
}

/**
 * @param {string} str
 * @returns {ArrayBuffer}
 */
function string2ArrayBuffer(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * @param {string} pem
 * @returns {ArrayBuffer}
 */
function getDERfromPEM(pem) {
  const pemB64 = pem
    .trim()
    .split("\n")
    .slice(1, -1) // Remove the --- BEGIN / END PRIVATE KEY ---
    .join("");

  const decoded = atob(pemB64);
  return string2ArrayBuffer(decoded);
}

/**
 * @param {import('../internals').Header} header
 * @param {import('../internals').Payload} payload
 * @returns {string}
 */
function getEncodedMessage(header, payload) {
  return `${base64encodeJSON(header)}.${base64encodeJSON(payload)}`;
}

/**
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function base64encode(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return fromBase64(btoa(binary));
}

/**
 * @param {string} base64
 * @returns {string}
 */
function fromBase64(base64) {
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * @param {Record<string,unknown>} obj
 * @returns {string}
 */
function base64encodeJSON(obj) {
  return fromBase64(btoa(JSON.stringify(obj)));
}

;// CONCATENATED MODULE: external "node:crypto"
const external_node_crypto_namespaceObject = require("node:crypto");
;// CONCATENATED MODULE: ./node_modules/universal-github-app-jwt/lib/crypto-node.js
// this can be removed once we only support Node 20+





// no-op, unfortunately there is no way to transform from PKCS8 or OpenSSH to PKCS1 with WebCrypto
function convertPrivateKey(privateKey) {
  if (!isPkcs1(privateKey)) return privateKey;

  return (0,external_node_crypto_namespaceObject.createPrivateKey)(privateKey).export({
    type: "pkcs8",
    format: "pem",
  });
}

;// CONCATENATED MODULE: ./node_modules/universal-github-app-jwt/lib/get-token.js
// we don't @ts-check here because it chokes crypto which is a global API in modern JS runtime environments





/**
 * @param {import('../internals').GetTokenOptions} options
 * @returns {Promise<string>}
 */
async function getToken({ privateKey, payload }) {
  const convertedPrivateKey = convertPrivateKey(privateKey);

  // WebCrypto only supports PKCS#8, unfortunately
  /* c8 ignore start */
  if (isPkcs1(convertedPrivateKey)) {
    throw new Error(
      "[universal-github-app-jwt] Private Key is in PKCS#1 format, but only PKCS#8 is supported. See https://github.com/gr2m/universal-github-app-jwt#private-key-formats"
    );
  }
  /* c8 ignore stop */

  // WebCrypto does not support OpenSSH, unfortunately
  if (isOpenSsh(convertedPrivateKey)) {
    throw new Error(
      "[universal-github-app-jwt] Private Key is in OpenSSH format, but only PKCS#8 is supported. See https://github.com/gr2m/universal-github-app-jwt#private-key-formats"
    );
  }

  const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" },
  };

  /** @type {import('../internals').Header} */
  const header = { alg: "RS256", typ: "JWT" };

  const privateKeyDER = getDERfromPEM(convertedPrivateKey);
  const importedKey = await external_node_crypto_namespaceObject.subtle.importKey(
    "pkcs8",
    privateKeyDER,
    algorithm,
    false,
    ["sign"]
  );

  const encodedMessage = getEncodedMessage(header, payload);
  const encodedMessageArrBuf = string2ArrayBuffer(encodedMessage);

  const signatureArrBuf = await external_node_crypto_namespaceObject.subtle.sign(
    algorithm.name,
    importedKey,
    encodedMessageArrBuf
  );

  const encodedSignature = base64encode(signatureArrBuf);

  return `${encodedMessage}.${encodedSignature}`;
}

;// CONCATENATED MODULE: ./node_modules/universal-github-app-jwt/index.js
// @ts-check

// @ts-ignore - #get-token is defined in "imports" in package.json


/**
 * @param {import(".").Options} options
 * @returns {Promise<import(".").Result>}
 */
async function githubAppJwt({
  id,
  privateKey,
  now = Math.floor(Date.now() / 1000),
}) {
  // Private keys are often times configured as environment variables, in which case line breaks are escaped using `\\n`.
  // Replace these here for convenience.
  const privateKeyWithNewlines = privateKey.replace(/\\n/g, '\n');

  // When creating a JSON Web Token, it sets the "issued at time" (iat) to 30s
  // in the past as we have seen people running situations where the GitHub API
  // claimed the iat would be in future. It turned out the clocks on the
  // different machine were not in sync.
  const nowWithSafetyMargin = now - 30;
  const expiration = nowWithSafetyMargin + 60 * 10; // JWT expiration time (10 minute maximum)

  const payload = {
    iat: nowWithSafetyMargin, // Issued at time
    exp: expiration,
    iss: id,
  };

  const token = await getToken({
    privateKey: privateKeyWithNewlines,
    payload,
  });

  return {
    appId: id,
    expiration,
    token,
  };
}

;// CONCATENATED MODULE: ./node_modules/toad-cache/dist/toad-cache.mjs
/**
 * toad-cache
 *
 * @copyright 2024 Igor Savin <kibertoad@gmail.com>
 * @license MIT
 * @version 3.7.0
 */
class FifoMap {
  constructor(max = 1000, ttlInMsecs = 0) {
    if (isNaN(max) || max < 0) {
      throw new Error('Invalid max value')
    }

    if (isNaN(ttlInMsecs) || ttlInMsecs < 0) {
      throw new Error('Invalid ttl value')
    }

    this.first = null;
    this.items = new Map();
    this.last = null;
    this.max = max;
    this.ttl = ttlInMsecs;
  }

  get size() {
    return this.items.size
  }

  clear() {
    this.items = new Map();
    this.first = null;
    this.last = null;
  }

  delete(key) {
    if (this.items.has(key)) {
      const deletedItem = this.items.get(key);

      this.items.delete(key);

      if (deletedItem.prev !== null) {
        deletedItem.prev.next = deletedItem.next;
      }

      if (deletedItem.next !== null) {
        deletedItem.next.prev = deletedItem.prev;
      }

      if (this.first === deletedItem) {
        this.first = deletedItem.next;
      }

      if (this.last === deletedItem) {
        this.last = deletedItem.prev;
      }
    }
  }

  deleteMany(keys) {
    for (var i = 0; i < keys.length; i++) {
      this.delete(keys[i]);
    }
  }

  evict() {
    if (this.size > 0) {
      const item = this.first;

      this.items.delete(item.key);

      if (this.size === 0) {
        this.first = null;
        this.last = null;
      } else {
        this.first = item.next;
        this.first.prev = null;
      }
    }
  }

  expiresAt(key) {
    if (this.items.has(key)) {
      return this.items.get(key).expiry
    }
  }

  get(key) {
    if (this.items.has(key)) {
      const item = this.items.get(key);

      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key);
        return
      }

      return item.value
    }
  }

  getMany(keys) {
    const result = [];

    for (var i = 0; i < keys.length; i++) {
      result.push(this.get(keys[i]));
    }

    return result
  }

  keys() {
    return this.items.keys()
  }

  set(key, value) {
    // Replace existing item
    if (this.items.has(key)) {
      const item = this.items.get(key);
      item.value = value;

      item.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl;

      return
    }

    // Add new item
    if (this.max > 0 && this.size === this.max) {
      this.evict();
    }

    const item = {
      expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
      key: key,
      prev: this.last,
      next: null,
      value,
    };
    this.items.set(key, item);

    if (this.size === 1) {
      this.first = item;
    } else {
      this.last.next = item;
    }

    this.last = item;
  }
}class LruMap {
  constructor(max = 1000, ttlInMsecs = 0) {
    if (isNaN(max) || max < 0) {
      throw new Error('Invalid max value')
    }

    if (isNaN(ttlInMsecs) || ttlInMsecs < 0) {
      throw new Error('Invalid ttl value')
    }

    this.first = null;
    this.items = new Map();
    this.last = null;
    this.max = max;
    this.ttl = ttlInMsecs;
  }

  get size() {
    return this.items.size
  }

  bumpLru(item) {
    if (this.last === item) {
      return // Item is already the last one, no need to bump
    }

    const last = this.last;
    const next = item.next;
    const prev = item.prev;

    if (this.first === item) {
      this.first = next;
    }

    item.next = null;
    item.prev = last;
    last.next = item;

    if (prev !== null) {
      prev.next = next;
    }

    if (next !== null) {
      next.prev = prev;
    }

    this.last = item;
  }

  clear() {
    this.items = new Map();
    this.first = null;
    this.last = null;
  }

  delete(key) {
    if (this.items.has(key)) {
      const item = this.items.get(key);

      this.items.delete(key);

      if (item.prev !== null) {
        item.prev.next = item.next;
      }

      if (item.next !== null) {
        item.next.prev = item.prev;
      }

      if (this.first === item) {
        this.first = item.next;
      }

      if (this.last === item) {
        this.last = item.prev;
      }
    }
  }

  deleteMany(keys) {
    for (var i = 0; i < keys.length; i++) {
      this.delete(keys[i]);
    }
  }

  evict() {
    if (this.size > 0) {
      const item = this.first;

      this.items.delete(item.key);

      if (this.size === 0) {
        this.first = null;
        this.last = null;
      } else {
        this.first = item.next;
        this.first.prev = null;
      }
    }
  }

  expiresAt(key) {
    if (this.items.has(key)) {
      return this.items.get(key).expiry
    }
  }

  get(key) {
    if (this.items.has(key)) {
      const item = this.items.get(key);

      // Item has already expired
      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key);
        return
      }

      // Item is still fresh
      this.bumpLru(item);
      return item.value
    }
  }

  getMany(keys) {
    const result = [];

    for (var i = 0; i < keys.length; i++) {
      result.push(this.get(keys[i]));
    }

    return result
  }

  keys() {
    return this.items.keys()
  }

  set(key, value) {
    // Replace existing item
    if (this.items.has(key)) {
      const item = this.items.get(key);
      item.value = value;

      item.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl;

      if (this.last !== item) {
        this.bumpLru(item);
      }

      return
    }

    // Add new item
    if (this.max > 0 && this.size === this.max) {
      this.evict();
    }

    const item = {
      expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
      key: key,
      prev: this.last,
      next: null,
      value,
    };
    this.items.set(key, item);

    if (this.size === 1) {
      this.first = item;
    } else {
      this.last.next = item;
    }

    this.last = item;
  }
}class LruObject {
  constructor(max = 1000, ttlInMsecs = 0) {
    if (isNaN(max) || max < 0) {
      throw new Error('Invalid max value')
    }

    if (isNaN(ttlInMsecs) || ttlInMsecs < 0) {
      throw new Error('Invalid ttl value')
    }

    this.first = null;
    this.items = Object.create(null);
    this.last = null;
    this.size = 0;
    this.max = max;
    this.ttl = ttlInMsecs;
  }

  bumpLru(item) {
    if (this.last === item) {
      return // Item is already the last one, no need to bump
    }

    const last = this.last;
    const next = item.next;
    const prev = item.prev;

    if (this.first === item) {
      this.first = next;
    }

    item.next = null;
    item.prev = last;
    last.next = item;

    if (prev !== null) {
      prev.next = next;
    }

    if (next !== null) {
      next.prev = prev;
    }

    this.last = item;
  }

  clear() {
    this.items = Object.create(null);
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  delete(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key];

      delete this.items[key];
      this.size--;

      if (item.prev !== null) {
        item.prev.next = item.next;
      }

      if (item.next !== null) {
        item.next.prev = item.prev;
      }

      if (this.first === item) {
        this.first = item.next;
      }

      if (this.last === item) {
        this.last = item.prev;
      }
    }
  }

  deleteMany(keys) {
    for (var i = 0; i < keys.length; i++) {
      this.delete(keys[i]);
    }
  }

  evict() {
    if (this.size > 0) {
      const item = this.first;

      delete this.items[item.key];

      if (--this.size === 0) {
        this.first = null;
        this.last = null;
      } else {
        this.first = item.next;
        this.first.prev = null;
      }
    }
  }

  expiresAt(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      return this.items[key].expiry
    }
  }

  get(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key];

      // Item has already expired
      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key);
        return
      }

      // Item is still fresh
      this.bumpLru(item);
      return item.value
    }
  }

  getMany(keys) {
    const result = [];

    for (var i = 0; i < keys.length; i++) {
      result.push(this.get(keys[i]));
    }

    return result
  }

  keys() {
    return Object.keys(this.items)
  }

  set(key, value) {
    // Replace existing item
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key];
      item.value = value;

      item.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl;

      if (this.last !== item) {
        this.bumpLru(item);
      }

      return
    }

    // Add new item
    if (this.max > 0 && this.size === this.max) {
      this.evict();
    }

    const item = {
      expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
      key: key,
      prev: this.last,
      next: null,
      value,
    };
    this.items[key] = item;

    if (++this.size === 1) {
      this.first = item;
    } else {
      this.last.next = item;
    }

    this.last = item;
  }
}class HitStatisticsRecord {
  constructor() {
    this.records = {};
  }

  initForCache(cacheId, currentTimeStamp) {
    this.records[cacheId] = {
      [currentTimeStamp]: {
        cacheSize: 0,
        hits: 0,
        falsyHits: 0,
        emptyHits: 0,
        misses: 0,
        expirations: 0,
        evictions: 0,
        invalidateOne: 0,
        invalidateAll: 0,
        sets: 0,
      },
    };
  }

  resetForCache(cacheId) {
    for (let key of Object.keys(this.records[cacheId])) {
      this.records[cacheId][key] = {
        cacheSize: 0,
        hits: 0,
        falsyHits: 0,
        emptyHits: 0,
        misses: 0,
        expirations: 0,
        evictions: 0,
        invalidateOne: 0,
        invalidateAll: 0,
        sets: 0,
      };
    }
  }

  getStatistics() {
    return this.records
  }
}/**
 *
 * @param {Date} date
 * @returns {string}
 */
function getTimestamp(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`
}class HitStatistics {
  constructor(cacheId, statisticTtlInHours, globalStatisticsRecord) {
    this.cacheId = cacheId;
    this.statisticTtlInHours = statisticTtlInHours;

    this.collectionStart = new Date();
    this.currentTimeStamp = getTimestamp(this.collectionStart);

    this.records = globalStatisticsRecord || new HitStatisticsRecord();
    this.records.initForCache(this.cacheId, this.currentTimeStamp);
  }

  get currentRecord() {
    // safety net
    /* c8 ignore next 14 */
    if (!this.records.records[this.cacheId][this.currentTimeStamp]) {
      this.records.records[this.cacheId][this.currentTimeStamp] = {
        cacheSize: 0,
        hits: 0,
        falsyHits: 0,
        emptyHits: 0,
        misses: 0,
        expirations: 0,
        evictions: 0,
        sets: 0,
        invalidateOne: 0,
        invalidateAll: 0,
      };
    }

    return this.records.records[this.cacheId][this.currentTimeStamp]
  }

  hoursPassed() {
    return (Date.now() - this.collectionStart) / 1000 / 60 / 60
  }

  addHit() {
    this.archiveIfNeeded();
    this.currentRecord.hits++;
  }
  addFalsyHit() {
    this.archiveIfNeeded();
    this.currentRecord.falsyHits++;
  }

  addEmptyHit() {
    this.archiveIfNeeded();
    this.currentRecord.emptyHits++;
  }

  addMiss() {
    this.archiveIfNeeded();
    this.currentRecord.misses++;
  }

  addEviction() {
    this.archiveIfNeeded();
    this.currentRecord.evictions++;
  }

  setCacheSize(currentSize) {
    this.archiveIfNeeded();
    this.currentRecord.cacheSize = currentSize;
  }

  addExpiration() {
    this.archiveIfNeeded();
    this.currentRecord.expirations++;
  }

  addSet() {
    this.archiveIfNeeded();
    this.currentRecord.sets++;
  }

  addInvalidateOne() {
    this.archiveIfNeeded();
    this.currentRecord.invalidateOne++;
  }

  addInvalidateAll() {
    this.archiveIfNeeded();
    this.currentRecord.invalidateAll++;
  }

  getStatistics() {
    return this.records.getStatistics()
  }

  archiveIfNeeded() {
    if (this.hoursPassed() >= this.statisticTtlInHours) {
      this.collectionStart = new Date();
      this.currentTimeStamp = getTimestamp(this.collectionStart);
      this.records.initForCache(this.cacheId, this.currentTimeStamp);
    }
  }
}class LruObjectHitStatistics extends LruObject {
  constructor(max, ttlInMsecs, cacheId, globalStatisticsRecord, statisticTtlInHours) {
    super(max || 1000, ttlInMsecs || 0);

    if (!cacheId) {
      throw new Error('Cache id is mandatory')
    }

    this.hitStatistics = new HitStatistics(
      cacheId,
      statisticTtlInHours !== undefined ? statisticTtlInHours : 24,
      globalStatisticsRecord,
    );
  }

  getStatistics() {
    return this.hitStatistics.getStatistics()
  }

  set(key, value) {
    super.set(key, value);
    this.hitStatistics.addSet();
    this.hitStatistics.setCacheSize(this.size);
  }

  evict() {
    super.evict();
    this.hitStatistics.addEviction();
    this.hitStatistics.setCacheSize(this.size);
  }

  delete(key, isExpiration = false) {
    super.delete(key);

    if (!isExpiration) {
      this.hitStatistics.addInvalidateOne();
    }
    this.hitStatistics.setCacheSize(this.size);
  }

  clear() {
    super.clear();

    this.hitStatistics.addInvalidateAll();
    this.hitStatistics.setCacheSize(this.size);
  }

  get(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key];

      // Item has already expired
      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key, true);
        this.hitStatistics.addExpiration();
        return
      }

      // Item is still fresh
      this.bumpLru(item);
      if (!item.value) {
        this.hitStatistics.addFalsyHit();
      }
      if (item.value === undefined || item.value === null || item.value === '') {
        this.hitStatistics.addEmptyHit();
      }
      this.hitStatistics.addHit();
      return item.value
    }
    this.hitStatistics.addMiss();
  }
}class FifoObject {
  constructor(max = 1000, ttlInMsecs = 0) {
    if (isNaN(max) || max < 0) {
      throw new Error('Invalid max value')
    }

    if (isNaN(ttlInMsecs) || ttlInMsecs < 0) {
      throw new Error('Invalid ttl value')
    }

    this.first = null;
    this.items = Object.create(null);
    this.last = null;
    this.size = 0;
    this.max = max;
    this.ttl = ttlInMsecs;
  }

  clear() {
    this.items = Object.create(null);
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  delete(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const deletedItem = this.items[key];

      delete this.items[key];
      this.size--;

      if (deletedItem.prev !== null) {
        deletedItem.prev.next = deletedItem.next;
      }

      if (deletedItem.next !== null) {
        deletedItem.next.prev = deletedItem.prev;
      }

      if (this.first === deletedItem) {
        this.first = deletedItem.next;
      }

      if (this.last === deletedItem) {
        this.last = deletedItem.prev;
      }
    }
  }

  deleteMany(keys) {
    for (var i = 0; i < keys.length; i++) {
      this.delete(keys[i]);
    }
  }

  evict() {
    if (this.size > 0) {
      const item = this.first;

      delete this.items[item.key];

      if (--this.size === 0) {
        this.first = null;
        this.last = null;
      } else {
        this.first = item.next;
        this.first.prev = null;
      }
    }
  }

  expiresAt(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      return this.items[key].expiry
    }
  }

  get(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key];

      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key);
        return
      }

      return item.value
    }
  }

  getMany(keys) {
    const result = [];

    for (var i = 0; i < keys.length; i++) {
      result.push(this.get(keys[i]));
    }

    return result
  }

  keys() {
    return Object.keys(this.items)
  }

  set(key, value) {
    // Replace existing item
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key];
      item.value = value;

      item.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl;

      return
    }

    // Add new item
    if (this.max > 0 && this.size === this.max) {
      this.evict();
    }

    const item = {
      expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
      key: key,
      prev: this.last,
      next: null,
      value,
    };
    this.items[key] = item;

    if (++this.size === 1) {
      this.first = item;
    } else {
      this.last.next = item;
    }

    this.last = item;
  }
}
;// CONCATENATED MODULE: ./node_modules/@octokit/auth-app/dist-node/index.js
// pkg/dist-src/index.js




// pkg/dist-src/get-app-authentication.js

async function getAppAuthentication({
  appId,
  privateKey,
  timeDifference
}) {
  try {
    const authOptions = {
      id: appId,
      privateKey
    };
    if (timeDifference) {
      Object.assign(authOptions, {
        now: Math.floor(Date.now() / 1e3) + timeDifference
      });
    }
    const appAuthentication = await githubAppJwt(authOptions);
    return {
      type: "app",
      token: appAuthentication.token,
      appId: appAuthentication.appId,
      expiresAt: new Date(appAuthentication.expiration * 1e3).toISOString()
    };
  } catch (error) {
    if (privateKey === "-----BEGIN RSA PRIVATE KEY-----") {
      throw new Error(
        "The 'privateKey` option contains only the first line '-----BEGIN RSA PRIVATE KEY-----'. If you are setting it using a `.env` file, make sure it is set on a single line with newlines replaced by '\n'"
      );
    } else {
      throw error;
    }
  }
}

// pkg/dist-src/cache.js

function getCache() {
  return new LruObject(
    // cache max. 15000 tokens, that will use less than 10mb memory
    15e3,
    // Cache for 1 minute less than GitHub expiry
    1e3 * 60 * 59
  );
}
async function dist_node_get(cache, options) {
  const cacheKey = optionsToCacheKey(options);
  const result = await cache.get(cacheKey);
  if (!result) {
    return;
  }
  const [
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissionsString,
    singleFileName
  ] = result.split("|");
  const permissions = options.permissions || permissionsString.split(/,/).reduce((permissions2, string) => {
    if (/!$/.test(string)) {
      permissions2[string.slice(0, -1)] = "write";
    } else {
      permissions2[string] = "read";
    }
    return permissions2;
  }, {});
  return {
    token,
    createdAt,
    expiresAt,
    permissions,
    repositoryIds: options.repositoryIds,
    repositoryNames: options.repositoryNames,
    singleFileName,
    repositorySelection
  };
}
async function dist_node_set(cache, options, data) {
  const key = optionsToCacheKey(options);
  const permissionsString = options.permissions ? "" : Object.keys(data.permissions).map(
    (name) => `${name}${data.permissions[name] === "write" ? "!" : ""}`
  ).join(",");
  const value = [
    data.token,
    data.createdAt,
    data.expiresAt,
    data.repositorySelection,
    permissionsString,
    data.singleFileName
  ].join("|");
  await cache.set(key, value);
}
function optionsToCacheKey({
  installationId,
  permissions = {},
  repositoryIds = [],
  repositoryNames = []
}) {
  const permissionsString = Object.keys(permissions).sort().map((name) => permissions[name] === "read" ? name : `${name}!`).join(",");
  const repositoryIdsString = repositoryIds.sort().join(",");
  const repositoryNamesString = repositoryNames.join(",");
  return [
    installationId,
    repositoryIdsString,
    repositoryNamesString,
    permissionsString
  ].filter(Boolean).join("|");
}

// pkg/dist-src/to-token-authentication.js
function toTokenAuthentication({
  installationId,
  token,
  createdAt,
  expiresAt,
  repositorySelection,
  permissions,
  repositoryIds,
  repositoryNames,
  singleFileName
}) {
  return Object.assign(
    {
      type: "token",
      tokenType: "installation",
      token,
      installationId,
      permissions,
      createdAt,
      expiresAt,
      repositorySelection
    },
    repositoryIds ? { repositoryIds } : null,
    repositoryNames ? { repositoryNames } : null,
    singleFileName ? { singleFileName } : null
  );
}

// pkg/dist-src/get-installation-authentication.js
async function getInstallationAuthentication(state, options, customRequest) {
  const installationId = Number(options.installationId || state.installationId);
  if (!installationId) {
    throw new Error(
      "[@octokit/auth-app] installationId option is required for installation authentication."
    );
  }
  if (options.factory) {
    const { type, factory, oauthApp, ...factoryAuthOptions } = {
      ...state,
      ...options
    };
    return factory(factoryAuthOptions);
  }
  const request = customRequest || state.request;
  return getInstallationAuthenticationConcurrently(
    state,
    { ...options, installationId },
    request
  );
}
var pendingPromises = /* @__PURE__ */ new Map();
function getInstallationAuthenticationConcurrently(state, options, request) {
  const cacheKey = optionsToCacheKey(options);
  if (pendingPromises.has(cacheKey)) {
    return pendingPromises.get(cacheKey);
  }
  const promise = getInstallationAuthenticationImpl(
    state,
    options,
    request
  ).finally(() => pendingPromises.delete(cacheKey));
  pendingPromises.set(cacheKey, promise);
  return promise;
}
async function getInstallationAuthenticationImpl(state, options, request) {
  if (!options.refresh) {
    const result = await dist_node_get(state.cache, options);
    if (result) {
      const {
        token: token2,
        createdAt: createdAt2,
        expiresAt: expiresAt2,
        permissions: permissions2,
        repositoryIds: repositoryIds2,
        repositoryNames: repositoryNames2,
        singleFileName: singleFileName2,
        repositorySelection: repositorySelection2
      } = result;
      return toTokenAuthentication({
        installationId: options.installationId,
        token: token2,
        createdAt: createdAt2,
        expiresAt: expiresAt2,
        permissions: permissions2,
        repositorySelection: repositorySelection2,
        repositoryIds: repositoryIds2,
        repositoryNames: repositoryNames2,
        singleFileName: singleFileName2
      });
    }
  }
  const appAuthentication = await getAppAuthentication(state);
  const payload = {
    installation_id: options.installationId,
    mediaType: {
      previews: ["machine-man"]
    },
    headers: {
      authorization: `bearer ${appAuthentication.token}`
    }
  };
  if (options.repositoryIds) {
    Object.assign(payload, { repository_ids: options.repositoryIds });
  }
  if (options.repositoryNames) {
    Object.assign(payload, {
      repositories: options.repositoryNames
    });
  }
  if (options.permissions) {
    Object.assign(payload, { permissions: options.permissions });
  }
  const {
    data: {
      token,
      expires_at: expiresAt,
      repositories,
      permissions: permissionsOptional,
      repository_selection: repositorySelectionOptional,
      single_file: singleFileName
    }
  } = await request(
    "POST /app/installations/{installation_id}/access_tokens",
    payload
  );
  const permissions = permissionsOptional || {};
  const repositorySelection = repositorySelectionOptional || "all";
  const repositoryIds = repositories ? repositories.map((r) => r.id) : void 0;
  const repositoryNames = repositories ? repositories.map((repo) => repo.name) : void 0;
  const createdAt = (/* @__PURE__ */ new Date()).toISOString();
  const cacheOptions = {
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    repositoryNames
  };
  if (singleFileName) {
    Object.assign(payload, { singleFileName });
  }
  await dist_node_set(state.cache, options, cacheOptions);
  const cacheData = {
    installationId: options.installationId,
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    repositoryNames
  };
  if (singleFileName) {
    Object.assign(cacheData, { singleFileName });
  }
  return toTokenAuthentication(cacheData);
}

// pkg/dist-src/auth.js
async function dist_node_auth(state, authOptions) {
  switch (authOptions.type) {
    case "app":
      return getAppAuthentication(state);
    case "oauth-app":
      return state.oauthApp({ type: "oauth-app" });
    case "installation":
      authOptions;
      return getInstallationAuthentication(state, {
        ...authOptions,
        type: "installation"
      });
    case "oauth-user":
      return state.oauthApp(authOptions);
    default:
      throw new Error(`Invalid auth type: ${authOptions.type}`);
  }
}

// pkg/dist-src/hook.js



// pkg/dist-src/requires-app-auth.js
var PATHS = [
  "/app",
  "/app/hook/config",
  "/app/hook/deliveries",
  "/app/hook/deliveries/{delivery_id}",
  "/app/hook/deliveries/{delivery_id}/attempts",
  "/app/installations",
  "/app/installations/{installation_id}",
  "/app/installations/{installation_id}/access_tokens",
  "/app/installations/{installation_id}/suspended",
  "/app/installation-requests",
  "/marketplace_listing/accounts/{account_id}",
  "/marketplace_listing/plan",
  "/marketplace_listing/plans",
  "/marketplace_listing/plans/{plan_id}/accounts",
  "/marketplace_listing/stubbed/accounts/{account_id}",
  "/marketplace_listing/stubbed/plan",
  "/marketplace_listing/stubbed/plans",
  "/marketplace_listing/stubbed/plans/{plan_id}/accounts",
  "/orgs/{org}/installation",
  "/repos/{owner}/{repo}/installation",
  "/users/{username}/installation"
];
function dist_node_routeMatcher(paths) {
  const regexes = paths.map(
    (p) => p.split("/").map((c) => c.startsWith("{") ? "(?:.+?)" : c).join("/")
  );
  const regex = `^(?:${regexes.map((r) => `(?:${r})`).join("|")})$`;
  return new RegExp(regex, "i");
}
var REGEX = dist_node_routeMatcher(PATHS);
function requiresAppAuth(url) {
  return !!url && REGEX.test(url.split("?")[0]);
}

// pkg/dist-src/hook.js
var FIVE_SECONDS_IN_MS = 5 * 1e3;
function isNotTimeSkewError(error) {
  return !(error.message.match(
    /'Expiration time' claim \('exp'\) must be a numeric value representing the future time at which the assertion expires/
  ) || error.message.match(
    /'Issued at' claim \('iat'\) must be an Integer representing the time that the assertion was issued/
  ));
}
async function dist_node_hook(state, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  const url = endpoint.url;
  if (/\/login\/oauth\/access_token$/.test(url)) {
    return request(endpoint);
  }
  if (requiresAppAuth(url.replace(request.endpoint.DEFAULTS.baseUrl, ""))) {
    const { token: token2 } = await getAppAuthentication(state);
    endpoint.headers.authorization = `bearer ${token2}`;
    let response;
    try {
      response = await request(endpoint);
    } catch (error) {
      if (isNotTimeSkewError(error)) {
        throw error;
      }
      if (typeof error.response.headers.date === "undefined") {
        throw error;
      }
      const diff = Math.floor(
        (Date.parse(error.response.headers.date) - Date.parse((/* @__PURE__ */ new Date()).toString())) / 1e3
      );
      state.log.warn(error.message);
      state.log.warn(
        `[@octokit/auth-app] GitHub API time and system time are different by ${diff} seconds. Retrying request with the difference accounted for.`
      );
      const { token: token3 } = await getAppAuthentication({
        ...state,
        timeDifference: diff
      });
      endpoint.headers.authorization = `bearer ${token3}`;
      return request(endpoint);
    }
    return response;
  }
  if (requiresBasicAuth(url)) {
    const authentication = await state.oauthApp({ type: "oauth-app" });
    endpoint.headers.authorization = authentication.headers.authorization;
    return request(endpoint);
  }
  const { token, createdAt } = await getInstallationAuthentication(
    state,
    // @ts-expect-error TBD
    {},
    request.defaults({ baseUrl: endpoint.baseUrl })
  );
  endpoint.headers.authorization = `token ${token}`;
  return sendRequestWithRetries(
    state,
    request,
    endpoint,
    createdAt
  );
}
async function sendRequestWithRetries(state, request, options, createdAt, retries = 0) {
  const timeSinceTokenCreationInMs = +/* @__PURE__ */ new Date() - +new Date(createdAt);
  try {
    return await request(options);
  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }
    if (timeSinceTokenCreationInMs >= FIVE_SECONDS_IN_MS) {
      if (retries > 0) {
        error.message = `After ${retries} retries within ${timeSinceTokenCreationInMs / 1e3}s of creating the installation access token, the response remains 401. At this point, the cause may be an authentication problem or a system outage. Please check https://www.githubstatus.com for status information`;
      }
      throw error;
    }
    ++retries;
    const awaitTime = retries * 1e3;
    state.log.warn(
      `[@octokit/auth-app] Retrying after 401 response to account for token replication delay (retry: ${retries}, wait: ${awaitTime / 1e3}s)`
    );
    await new Promise((resolve) => setTimeout(resolve, awaitTime));
    return sendRequestWithRetries(state, request, options, createdAt, retries);
  }
}

// pkg/dist-src/version.js
var dist_node_VERSION = "7.2.2";

// pkg/dist-src/index.js

function createAppAuth(options) {
  if (!options.appId) {
    throw new Error("[@octokit/auth-app] appId option is required");
  }
  if (!options.privateKey) {
    throw new Error("[@octokit/auth-app] privateKey option is required");
  }
  if ("installationId" in options && !options.installationId) {
    throw new Error(
      "[@octokit/auth-app] installationId is set to a falsy value"
    );
  }
  const log = options.log || {};
  if (typeof log.warn !== "function") {
    log.warn = console.warn.bind(console);
  }
  const request = options.request || dist_bundle_request.defaults({
    headers: {
      "user-agent": `octokit-auth-app.js/${dist_node_VERSION} ${getUserAgent()}`
    }
  });
  const state = Object.assign(
    {
      request,
      cache: getCache()
    },
    options,
    options.installationId ? { installationId: Number(options.installationId) } : {},
    {
      log,
      oauthApp: createOAuthAppAuth({
        clientType: "github-app",
        clientId: options.clientId || "",
        clientSecret: options.clientSecret || "",
        request
      })
    }
  );
  return Object.assign(dist_node_auth.bind(null, state), {
    hook: dist_node_hook.bind(null, state)
  });
}


;// CONCATENATED MODULE: ./node_modules/@octokit/auth-unauthenticated/dist-node/index.js
// pkg/dist-src/auth.js
async function auth_unauthenticated_dist_node_auth(reason) {
  return {
    type: "unauthenticated",
    reason
  };
}

// pkg/dist-src/is-rate-limit-error.js
function isRateLimitError(error) {
  if (error.status !== 403) {
    return false;
  }
  if (!error.response) {
    return false;
  }
  return error.response.headers["x-ratelimit-remaining"] === "0";
}

// pkg/dist-src/is-abuse-limit-error.js
var REGEX_ABUSE_LIMIT_MESSAGE = /\babuse\b/i;
function isAbuseLimitError(error) {
  if (error.status !== 403) {
    return false;
  }
  return REGEX_ABUSE_LIMIT_MESSAGE.test(error.message);
}

// pkg/dist-src/hook.js
async function auth_unauthenticated_dist_node_hook(reason, request, route, parameters) {
  const endpoint = request.endpoint.merge(
    route,
    parameters
  );
  return request(endpoint).catch((error) => {
    if (error.status === 404) {
      error.message = `Not found. May be due to lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (isRateLimitError(error)) {
      error.message = `API rate limit exceeded. This maybe caused by the lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (isAbuseLimitError(error)) {
      error.message = `You have triggered an abuse detection mechanism. This maybe caused by the lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (error.status === 401) {
      error.message = `Unauthorized. "${endpoint.method} ${endpoint.url}" failed most likely due to lack of authentication. Reason: ${reason}`;
      throw error;
    }
    if (error.status >= 400 && error.status < 500) {
      error.message = error.message.replace(
        /\.?$/,
        `. May be caused by lack of authentication (${reason}).`
      );
    }
    throw error;
  });
}

// pkg/dist-src/index.js
var createUnauthenticatedAuth = function createUnauthenticatedAuth2(options) {
  if (!options || !options.reason) {
    throw new Error(
      "[@octokit/auth-unauthenticated] No reason passed to createUnauthenticatedAuth"
    );
  }
  return Object.assign(auth_unauthenticated_dist_node_auth.bind(null, options.reason), {
    hook: auth_unauthenticated_dist_node_hook.bind(null, options.reason)
  });
};


;// CONCATENATED MODULE: ./node_modules/@octokit/oauth-app/dist-node/index.js
// pkg/dist-src/index.js


// pkg/dist-src/version.js
var oauth_app_dist_node_VERSION = "7.1.6";

// pkg/dist-src/add-event-handler.js
function addEventHandler(state, eventName, eventHandler) {
  if (Array.isArray(eventName)) {
    for (const singleEventName of eventName) {
      addEventHandler(state, singleEventName, eventHandler);
    }
    return;
  }
  if (!state.eventHandlers[eventName]) {
    state.eventHandlers[eventName] = [];
  }
  state.eventHandlers[eventName].push(eventHandler);
}

// pkg/dist-src/oauth-app-octokit.js


var OAuthAppOctokit = dist_src_Octokit.defaults({
  userAgent: `octokit-oauth-app.js/${oauth_app_dist_node_VERSION} ${getUserAgent()}`
});

// pkg/dist-src/methods/get-user-octokit.js


// pkg/dist-src/emit-event.js
async function emitEvent(state, context) {
  const { name, action } = context;
  if (state.eventHandlers[`${name}.${action}`]) {
    for (const eventHandler of state.eventHandlers[`${name}.${action}`]) {
      await eventHandler(context);
    }
  }
  if (state.eventHandlers[name]) {
    for (const eventHandler of state.eventHandlers[name]) {
      await eventHandler(context);
    }
  }
}

// pkg/dist-src/methods/get-user-octokit.js
async function getUserOctokitWithState(state, options) {
  return state.octokit.auth({
    type: "oauth-user",
    ...options,
    async factory(options2) {
      const octokit = new state.Octokit({
        authStrategy: createOAuthUserAuth,
        auth: options2
      });
      const authentication = await octokit.auth({
        type: "get"
      });
      await emitEvent(state, {
        name: "token",
        action: "created",
        token: authentication.token,
        scopes: authentication.scopes,
        authentication,
        octokit
      });
      return octokit;
    }
  });
}

// pkg/dist-src/methods/get-web-flow-authorization-url.js

function getWebFlowAuthorizationUrlWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    request: state.octokit.request,
    ...options,
    allowSignup: state.allowSignup ?? options.allowSignup,
    redirectUrl: options.redirectUrl ?? state.redirectUrl,
    scopes: options.scopes ?? state.defaultScopes
  };
  return getWebFlowAuthorizationUrl({
    clientType: state.clientType,
    ...optionsWithDefaults
  });
}

// pkg/dist-src/methods/create-token.js

async function createTokenWithState(state, options) {
  const authentication = await state.octokit.auth({
    type: "oauth-user",
    ...options
  });
  await emitEvent(state, {
    name: "token",
    action: "created",
    token: authentication.token,
    scopes: authentication.scopes,
    authentication,
    octokit: new state.Octokit({
      authStrategy: createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: authentication.token,
        scopes: authentication.scopes,
        refreshToken: authentication.refreshToken,
        expiresAt: authentication.expiresAt,
        refreshTokenExpiresAt: authentication.refreshTokenExpiresAt
      }
    })
  });
  return { authentication };
}

// pkg/dist-src/methods/check-token.js

async function checkTokenWithState(state, options) {
  const result = await checkToken({
    // @ts-expect-error not worth the extra code to appease TS
    clientType: state.clientType,
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  });
  Object.assign(result.authentication, { type: "token", tokenType: "oauth" });
  return result;
}

// pkg/dist-src/methods/reset-token.js


async function resetTokenWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  };
  if (state.clientType === "oauth-app") {
    const response2 = await resetToken({
      clientType: "oauth-app",
      ...optionsWithDefaults
    });
    const authentication2 = Object.assign(response2.authentication, {
      type: "token",
      tokenType: "oauth"
    });
    await emitEvent(state, {
      name: "token",
      action: "reset",
      token: response2.authentication.token,
      scopes: response2.authentication.scopes || void 0,
      authentication: authentication2,
      octokit: new state.Octokit({
        authStrategy: createOAuthUserAuth,
        auth: {
          clientType: state.clientType,
          clientId: state.clientId,
          clientSecret: state.clientSecret,
          token: response2.authentication.token,
          scopes: response2.authentication.scopes
        }
      })
    });
    return { ...response2, authentication: authentication2 };
  }
  const response = await resetToken({
    clientType: "github-app",
    ...optionsWithDefaults
  });
  const authentication = Object.assign(response.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  await emitEvent(state, {
    name: "token",
    action: "reset",
    token: response.authentication.token,
    authentication,
    octokit: new state.Octokit({
      authStrategy: createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: response.authentication.token
      }
    })
  });
  return { ...response, authentication };
}

// pkg/dist-src/methods/refresh-token.js


async function refreshTokenWithState(state, options) {
  if (state.clientType === "oauth-app") {
    throw new Error(
      "[@octokit/oauth-app] app.refreshToken() is not supported for OAuth Apps"
    );
  }
  const response = await refreshToken({
    clientType: "github-app",
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    refreshToken: options.refreshToken
  });
  const authentication = Object.assign(response.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  await emitEvent(state, {
    name: "token",
    action: "refreshed",
    token: response.authentication.token,
    authentication,
    octokit: new state.Octokit({
      authStrategy: createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: response.authentication.token
      }
    })
  });
  return { ...response, authentication };
}

// pkg/dist-src/methods/scope-token.js


async function scopeTokenWithState(state, options) {
  if (state.clientType === "oauth-app") {
    throw new Error(
      "[@octokit/oauth-app] app.scopeToken() is not supported for OAuth Apps"
    );
  }
  const response = await scopeToken({
    clientType: "github-app",
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  });
  const authentication = Object.assign(response.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  await emitEvent(state, {
    name: "token",
    action: "scoped",
    token: response.authentication.token,
    authentication,
    octokit: new state.Octokit({
      authStrategy: createOAuthUserAuth,
      auth: {
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        token: response.authentication.token
      }
    })
  });
  return { ...response, authentication };
}

// pkg/dist-src/methods/delete-token.js


async function deleteTokenWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  };
  const response = state.clientType === "oauth-app" ? await deleteToken({
    clientType: "oauth-app",
    ...optionsWithDefaults
  }) : (
    /* v8 ignore next 4 */
    await deleteToken({
      clientType: "github-app",
      ...optionsWithDefaults
    })
  );
  await emitEvent(state, {
    name: "token",
    action: "deleted",
    token: options.token,
    octokit: new state.Octokit({
      authStrategy: createUnauthenticatedAuth,
      auth: {
        reason: `Handling "token.deleted" event. The access for the token has been revoked.`
      }
    })
  });
  return response;
}

// pkg/dist-src/methods/delete-authorization.js


async function deleteAuthorizationWithState(state, options) {
  const optionsWithDefaults = {
    clientId: state.clientId,
    clientSecret: state.clientSecret,
    request: state.octokit.request,
    ...options
  };
  const response = state.clientType === "oauth-app" ? await deleteAuthorization({
    clientType: "oauth-app",
    ...optionsWithDefaults
  }) : (
    /* v8 ignore next 4 */
    await deleteAuthorization({
      clientType: "github-app",
      ...optionsWithDefaults
    })
  );
  await emitEvent(state, {
    name: "token",
    action: "deleted",
    token: options.token,
    octokit: new state.Octokit({
      authStrategy: createUnauthenticatedAuth,
      auth: {
        reason: `Handling "token.deleted" event. The access for the token has been revoked.`
      }
    })
  });
  await emitEvent(state, {
    name: "authorization",
    action: "deleted",
    token: options.token,
    octokit: new state.Octokit({
      authStrategy: createUnauthenticatedAuth,
      auth: {
        reason: `Handling "authorization.deleted" event. The access for the app has been revoked.`
      }
    })
  });
  return response;
}

// pkg/dist-src/middleware/unknown-route-response.js
function unknownRouteResponse(request) {
  return {
    status: 404,
    headers: { "content-type": "application/json" },
    text: JSON.stringify({
      error: `Unknown route: ${request.method} ${request.url}`
    })
  };
}

// pkg/dist-src/middleware/handle-request.js
async function handleRequest(app, { pathPrefix = "/api/github/oauth" }, request) {
  let { pathname } = new URL(request.url, "http://localhost");
  if (!pathname.startsWith(`${pathPrefix}/`)) {
    return void 0;
  }
  if (request.method === "OPTIONS") {
    return {
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "*",
        "access-control-allow-headers": "Content-Type, User-Agent, Authorization"
      }
    };
  }
  pathname = pathname.slice(pathPrefix.length + 1);
  const route = [request.method, pathname].join(" ");
  const routes = {
    getLogin: `GET login`,
    getCallback: `GET callback`,
    createToken: `POST token`,
    getToken: `GET token`,
    patchToken: `PATCH token`,
    patchRefreshToken: `PATCH refresh-token`,
    scopeToken: `POST token/scoped`,
    deleteToken: `DELETE token`,
    deleteGrant: `DELETE grant`
  };
  if (!Object.values(routes).includes(route)) {
    return unknownRouteResponse(request);
  }
  let json;
  try {
    const text = await request.text();
    json = text ? JSON.parse(text) : {};
  } catch (error) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      text: JSON.stringify({
        error: "[@octokit/oauth-app] request error"
      })
    };
  }
  const { searchParams } = new URL(request.url, "http://localhost");
  const query = Object.fromEntries(searchParams);
  const headers = request.headers;
  try {
    if (route === routes.getLogin) {
      const authOptions = {};
      if (query.state) {
        Object.assign(authOptions, { state: query.state });
      }
      if (query.scopes) {
        Object.assign(authOptions, { scopes: query.scopes.split(",") });
      }
      if (query.allowSignup) {
        Object.assign(authOptions, {
          allowSignup: query.allowSignup === "true"
        });
      }
      if (query.redirectUrl) {
        Object.assign(authOptions, { redirectUrl: query.redirectUrl });
      }
      const { url } = app.getWebFlowAuthorizationUrl(authOptions);
      return { status: 302, headers: { location: url } };
    }
    if (route === routes.getCallback) {
      if (query.error) {
        throw new Error(
          `[@octokit/oauth-app] ${query.error} ${query.error_description}`
        );
      }
      if (!query.code) {
        throw new Error('[@octokit/oauth-app] "code" parameter is required');
      }
      const {
        authentication: { token: token2 }
      } = await app.createToken({
        code: query.code
      });
      return {
        status: 200,
        headers: {
          "content-type": "text/html"
        },
        text: `<h1>Token created successfully</h1>

<p>Your token is: <strong>${token2}</strong>. Copy it now as it cannot be shown again.</p>`
      };
    }
    if (route === routes.createToken) {
      const { code, redirectUrl } = json;
      if (!code) {
        throw new Error('[@octokit/oauth-app] "code" parameter is required');
      }
      const result = await app.createToken({
        code,
        redirectUrl
      });
      delete result.authentication.clientSecret;
      return {
        status: 201,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(result)
      };
    }
    if (route === routes.getToken) {
      const token2 = headers.authorization?.substr("token ".length);
      if (!token2) {
        throw new Error(
          '[@octokit/oauth-app] "Authorization" header is required'
        );
      }
      const result = await app.checkToken({
        token: token2
      });
      delete result.authentication.clientSecret;
      return {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(result)
      };
    }
    if (route === routes.patchToken) {
      const token2 = headers.authorization?.substr("token ".length);
      if (!token2) {
        throw new Error(
          '[@octokit/oauth-app] "Authorization" header is required'
        );
      }
      const result = await app.resetToken({ token: token2 });
      delete result.authentication.clientSecret;
      return {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(result)
      };
    }
    if (route === routes.patchRefreshToken) {
      const token2 = headers.authorization?.substr("token ".length);
      if (!token2) {
        throw new Error(
          '[@octokit/oauth-app] "Authorization" header is required'
        );
      }
      const { refreshToken: refreshToken2 } = json;
      if (!refreshToken2) {
        throw new Error(
          "[@octokit/oauth-app] refreshToken must be sent in request body"
        );
      }
      const result = await app.refreshToken({ refreshToken: refreshToken2 });
      delete result.authentication.clientSecret;
      return {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(result)
      };
    }
    if (route === routes.scopeToken) {
      const token2 = headers.authorization?.substr("token ".length);
      if (!token2) {
        throw new Error(
          '[@octokit/oauth-app] "Authorization" header is required'
        );
      }
      const result = await app.scopeToken({
        token: token2,
        ...json
      });
      delete result.authentication.clientSecret;
      return {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(result)
      };
    }
    if (route === routes.deleteToken) {
      const token2 = headers.authorization?.substr("token ".length);
      if (!token2) {
        throw new Error(
          '[@octokit/oauth-app] "Authorization" header is required'
        );
      }
      await app.deleteToken({
        token: token2
      });
      return {
        status: 204,
        headers: { "access-control-allow-origin": "*" }
      };
    }
    const token = headers.authorization?.substr("token ".length);
    if (!token) {
      throw new Error(
        '[@octokit/oauth-app] "Authorization" header is required'
      );
    }
    await app.deleteAuthorization({
      token
    });
    return {
      status: 204,
      headers: { "access-control-allow-origin": "*" }
    };
  } catch (error) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      text: JSON.stringify({ error: error.message })
    };
  }
}

// pkg/dist-src/middleware/node/parse-request.js
function parseRequest(request) {
  const { method, url, headers } = request;
  async function text() {
    const text2 = await new Promise((resolve, reject) => {
      let bodyChunks = [];
      request.on("error", reject).on("data", (chunk) => bodyChunks.push(chunk)).on("end", () => resolve(Buffer.concat(bodyChunks).toString()));
    });
    return text2;
  }
  return { method, url, headers, text };
}

// pkg/dist-src/middleware/node/send-response.js
function sendResponse(octokitResponse, response) {
  response.writeHead(octokitResponse.status, octokitResponse.headers);
  response.end(octokitResponse.text);
}

// pkg/dist-src/middleware/node/index.js
function createNodeMiddleware(app, options = {}) {
  return async function(request, response, next) {
    const octokitRequest = await parseRequest(request);
    const octokitResponse = await handleRequest(app, options, octokitRequest);
    if (octokitResponse) {
      sendResponse(octokitResponse, response);
      return true;
    } else {
      next?.();
      return false;
    }
  };
}

// pkg/dist-src/middleware/web-worker/parse-request.js
function parseRequest2(request) {
  const headers = Object.fromEntries(request.headers.entries());
  return {
    method: request.method,
    url: request.url,
    headers,
    text: () => request.text()
  };
}

// pkg/dist-src/middleware/web-worker/send-response.js
function sendResponse2(octokitResponse) {
  const responseOptions = {
    status: octokitResponse.status
  };
  if (octokitResponse.headers) {
    Object.assign(responseOptions, { headers: octokitResponse.headers });
  }
  return new Response(octokitResponse.text, responseOptions);
}

// pkg/dist-src/middleware/web-worker/index.js
function createWebWorkerHandler(app, options = {}) {
  return async function(request) {
    const octokitRequest = await parseRequest2(request);
    const octokitResponse = await handleRequest(app, options, octokitRequest);
    return octokitResponse ? sendResponse2(octokitResponse) : void 0;
  };
}

// pkg/dist-src/middleware/aws-lambda/api-gateway-v2-parse-request.js
function parseRequest3(request) {
  const { method } = request.requestContext.http;
  let url = request.rawPath;
  const { stage } = request.requestContext;
  if (url.startsWith("/" + stage)) url = url.substring(stage.length + 1);
  if (request.rawQueryString) url += "?" + request.rawQueryString;
  const headers = request.headers;
  const text = async () => request.body || "";
  return { method, url, headers, text };
}

// pkg/dist-src/middleware/aws-lambda/api-gateway-v2-send-response.js
function sendResponse3(octokitResponse) {
  return {
    statusCode: octokitResponse.status,
    headers: octokitResponse.headers,
    body: octokitResponse.text
  };
}

// pkg/dist-src/middleware/aws-lambda/api-gateway-v2.js
function createAWSLambdaAPIGatewayV2Handler(app, options = {}) {
  return async function(event) {
    const request = parseRequest3(event);
    const response = await handleRequest(app, options, request);
    return response ? sendResponse3(response) : void 0;
  };
}

// pkg/dist-src/index.js
var OAuthApp = class {
  static VERSION = oauth_app_dist_node_VERSION;
  static defaults(defaults) {
    const OAuthAppWithDefaults = class extends this {
      constructor(...args) {
        super({
          ...defaults,
          ...args[0]
        });
      }
    };
    return OAuthAppWithDefaults;
  }
  constructor(options) {
    const Octokit2 = options.Octokit || OAuthAppOctokit;
    this.type = options.clientType || "oauth-app";
    const octokit = new Octokit2({
      authStrategy: createOAuthAppAuth,
      auth: {
        clientType: this.type,
        clientId: options.clientId,
        clientSecret: options.clientSecret
      }
    });
    const state = {
      clientType: this.type,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      // @ts-expect-error defaultScopes not permitted for GitHub Apps
      defaultScopes: options.defaultScopes || [],
      allowSignup: options.allowSignup,
      baseUrl: options.baseUrl,
      redirectUrl: options.redirectUrl,
      log: options.log,
      Octokit: Octokit2,
      octokit,
      eventHandlers: {}
    };
    this.on = addEventHandler.bind(null, state);
    this.octokit = octokit;
    this.getUserOctokit = getUserOctokitWithState.bind(null, state);
    this.getWebFlowAuthorizationUrl = getWebFlowAuthorizationUrlWithState.bind(
      null,
      state
    );
    this.createToken = createTokenWithState.bind(
      null,
      state
    );
    this.checkToken = checkTokenWithState.bind(
      null,
      state
    );
    this.resetToken = resetTokenWithState.bind(
      null,
      state
    );
    this.refreshToken = refreshTokenWithState.bind(
      null,
      state
    );
    this.scopeToken = scopeTokenWithState.bind(
      null,
      state
    );
    this.deleteToken = deleteTokenWithState.bind(null, state);
    this.deleteAuthorization = deleteAuthorizationWithState.bind(null, state);
  }
  // assigned during constructor
  type;
  on;
  octokit;
  getUserOctokit;
  getWebFlowAuthorizationUrl;
  createToken;
  checkToken;
  resetToken;
  refreshToken;
  scopeToken;
  deleteToken;
  deleteAuthorization;
};


;// CONCATENATED MODULE: external "node:buffer"
const external_node_buffer_namespaceObject = require("node:buffer");
;// CONCATENATED MODULE: ./node_modules/@octokit/webhooks-methods/dist-node/index.js
// pkg/dist-src/node/sign.js


// pkg/dist-src/version.js
var webhooks_methods_dist_node_VERSION = "5.1.1";

// pkg/dist-src/node/sign.js
async function sign(secret, payload) {
  if (!secret || !payload) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret & payload required for sign()"
    );
  }
  if (typeof payload !== "string") {
    throw new TypeError("[@octokit/webhooks-methods] payload must be a string");
  }
  const algorithm = "sha256";
  return `${algorithm}=${(0,external_node_crypto_namespaceObject.createHmac)(algorithm, secret).update(payload).digest("hex")}`;
}
sign.VERSION = webhooks_methods_dist_node_VERSION;

// pkg/dist-src/node/verify.js


async function verify(secret, eventPayload, signature) {
  if (!secret || !eventPayload || !signature) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required"
    );
  }
  if (typeof eventPayload !== "string") {
    throw new TypeError(
      "[@octokit/webhooks-methods] eventPayload must be a string"
    );
  }
  const signatureBuffer = external_node_buffer_namespaceObject.Buffer.from(signature);
  const verificationBuffer = external_node_buffer_namespaceObject.Buffer.from(await sign(secret, eventPayload));
  if (signatureBuffer.length !== verificationBuffer.length) {
    return false;
  }
  return (0,external_node_crypto_namespaceObject.timingSafeEqual)(signatureBuffer, verificationBuffer);
}
verify.VERSION = webhooks_methods_dist_node_VERSION;

// pkg/dist-src/index.js
async function verifyWithFallback(secret, payload, signature, additionalSecrets) {
  const firstPass = await verify(secret, payload, signature);
  if (firstPass) {
    return true;
  }
  if (additionalSecrets !== void 0) {
    for (const s of additionalSecrets) {
      const v = await verify(s, payload, signature);
      if (v) {
        return v;
      }
    }
  }
  return false;
}


;// CONCATENATED MODULE: ./node_modules/@octokit/webhooks/dist-bundle/index.js
// pkg/dist-src/create-logger.js
var dist_bundle_createLogger = (logger = {}) => {
  if (typeof logger.debug !== "function") {
    logger.debug = () => {
    };
  }
  if (typeof logger.info !== "function") {
    logger.info = () => {
    };
  }
  if (typeof logger.warn !== "function") {
    logger.warn = console.warn.bind(console);
  }
  if (typeof logger.error !== "function") {
    logger.error = console.error.bind(console);
  }
  return logger;
};

// pkg/dist-src/generated/webhook-names.js
var emitterEventNames = [
  "branch_protection_configuration",
  "branch_protection_configuration.disabled",
  "branch_protection_configuration.enabled",
  "branch_protection_rule",
  "branch_protection_rule.created",
  "branch_protection_rule.deleted",
  "branch_protection_rule.edited",
  "check_run",
  "check_run.completed",
  "check_run.created",
  "check_run.requested_action",
  "check_run.rerequested",
  "check_suite",
  "check_suite.completed",
  "check_suite.requested",
  "check_suite.rerequested",
  "code_scanning_alert",
  "code_scanning_alert.appeared_in_branch",
  "code_scanning_alert.closed_by_user",
  "code_scanning_alert.created",
  "code_scanning_alert.fixed",
  "code_scanning_alert.reopened",
  "code_scanning_alert.reopened_by_user",
  "commit_comment",
  "commit_comment.created",
  "create",
  "custom_property",
  "custom_property.created",
  "custom_property.deleted",
  "custom_property.promote_to_enterprise",
  "custom_property.updated",
  "custom_property_values",
  "custom_property_values.updated",
  "delete",
  "dependabot_alert",
  "dependabot_alert.auto_dismissed",
  "dependabot_alert.auto_reopened",
  "dependabot_alert.created",
  "dependabot_alert.dismissed",
  "dependabot_alert.fixed",
  "dependabot_alert.reintroduced",
  "dependabot_alert.reopened",
  "deploy_key",
  "deploy_key.created",
  "deploy_key.deleted",
  "deployment",
  "deployment.created",
  "deployment_protection_rule",
  "deployment_protection_rule.requested",
  "deployment_review",
  "deployment_review.approved",
  "deployment_review.rejected",
  "deployment_review.requested",
  "deployment_status",
  "deployment_status.created",
  "discussion",
  "discussion.answered",
  "discussion.category_changed",
  "discussion.closed",
  "discussion.created",
  "discussion.deleted",
  "discussion.edited",
  "discussion.labeled",
  "discussion.locked",
  "discussion.pinned",
  "discussion.reopened",
  "discussion.transferred",
  "discussion.unanswered",
  "discussion.unlabeled",
  "discussion.unlocked",
  "discussion.unpinned",
  "discussion_comment",
  "discussion_comment.created",
  "discussion_comment.deleted",
  "discussion_comment.edited",
  "fork",
  "github_app_authorization",
  "github_app_authorization.revoked",
  "gollum",
  "installation",
  "installation.created",
  "installation.deleted",
  "installation.new_permissions_accepted",
  "installation.suspend",
  "installation.unsuspend",
  "installation_repositories",
  "installation_repositories.added",
  "installation_repositories.removed",
  "installation_target",
  "installation_target.renamed",
  "issue_comment",
  "issue_comment.created",
  "issue_comment.deleted",
  "issue_comment.edited",
  "issues",
  "issues.assigned",
  "issues.closed",
  "issues.deleted",
  "issues.demilestoned",
  "issues.edited",
  "issues.labeled",
  "issues.locked",
  "issues.milestoned",
  "issues.opened",
  "issues.pinned",
  "issues.reopened",
  "issues.transferred",
  "issues.typed",
  "issues.unassigned",
  "issues.unlabeled",
  "issues.unlocked",
  "issues.unpinned",
  "issues.untyped",
  "label",
  "label.created",
  "label.deleted",
  "label.edited",
  "marketplace_purchase",
  "marketplace_purchase.cancelled",
  "marketplace_purchase.changed",
  "marketplace_purchase.pending_change",
  "marketplace_purchase.pending_change_cancelled",
  "marketplace_purchase.purchased",
  "member",
  "member.added",
  "member.edited",
  "member.removed",
  "membership",
  "membership.added",
  "membership.removed",
  "merge_group",
  "merge_group.checks_requested",
  "merge_group.destroyed",
  "meta",
  "meta.deleted",
  "milestone",
  "milestone.closed",
  "milestone.created",
  "milestone.deleted",
  "milestone.edited",
  "milestone.opened",
  "org_block",
  "org_block.blocked",
  "org_block.unblocked",
  "organization",
  "organization.deleted",
  "organization.member_added",
  "organization.member_invited",
  "organization.member_removed",
  "organization.renamed",
  "package",
  "package.published",
  "package.updated",
  "page_build",
  "personal_access_token_request",
  "personal_access_token_request.approved",
  "personal_access_token_request.cancelled",
  "personal_access_token_request.created",
  "personal_access_token_request.denied",
  "ping",
  "project",
  "project.closed",
  "project.created",
  "project.deleted",
  "project.edited",
  "project.reopened",
  "project_card",
  "project_card.converted",
  "project_card.created",
  "project_card.deleted",
  "project_card.edited",
  "project_card.moved",
  "project_column",
  "project_column.created",
  "project_column.deleted",
  "project_column.edited",
  "project_column.moved",
  "projects_v2",
  "projects_v2.closed",
  "projects_v2.created",
  "projects_v2.deleted",
  "projects_v2.edited",
  "projects_v2.reopened",
  "projects_v2_item",
  "projects_v2_item.archived",
  "projects_v2_item.converted",
  "projects_v2_item.created",
  "projects_v2_item.deleted",
  "projects_v2_item.edited",
  "projects_v2_item.reordered",
  "projects_v2_item.restored",
  "projects_v2_status_update",
  "projects_v2_status_update.created",
  "projects_v2_status_update.deleted",
  "projects_v2_status_update.edited",
  "public",
  "pull_request",
  "pull_request.assigned",
  "pull_request.auto_merge_disabled",
  "pull_request.auto_merge_enabled",
  "pull_request.closed",
  "pull_request.converted_to_draft",
  "pull_request.demilestoned",
  "pull_request.dequeued",
  "pull_request.edited",
  "pull_request.enqueued",
  "pull_request.labeled",
  "pull_request.locked",
  "pull_request.milestoned",
  "pull_request.opened",
  "pull_request.ready_for_review",
  "pull_request.reopened",
  "pull_request.review_request_removed",
  "pull_request.review_requested",
  "pull_request.synchronize",
  "pull_request.unassigned",
  "pull_request.unlabeled",
  "pull_request.unlocked",
  "pull_request_review",
  "pull_request_review.dismissed",
  "pull_request_review.edited",
  "pull_request_review.submitted",
  "pull_request_review_comment",
  "pull_request_review_comment.created",
  "pull_request_review_comment.deleted",
  "pull_request_review_comment.edited",
  "pull_request_review_thread",
  "pull_request_review_thread.resolved",
  "pull_request_review_thread.unresolved",
  "push",
  "registry_package",
  "registry_package.published",
  "registry_package.updated",
  "release",
  "release.created",
  "release.deleted",
  "release.edited",
  "release.prereleased",
  "release.published",
  "release.released",
  "release.unpublished",
  "repository",
  "repository.archived",
  "repository.created",
  "repository.deleted",
  "repository.edited",
  "repository.privatized",
  "repository.publicized",
  "repository.renamed",
  "repository.transferred",
  "repository.unarchived",
  "repository_advisory",
  "repository_advisory.published",
  "repository_advisory.reported",
  "repository_dispatch",
  "repository_dispatch.sample.collected",
  "repository_import",
  "repository_ruleset",
  "repository_ruleset.created",
  "repository_ruleset.deleted",
  "repository_ruleset.edited",
  "repository_vulnerability_alert",
  "repository_vulnerability_alert.create",
  "repository_vulnerability_alert.dismiss",
  "repository_vulnerability_alert.reopen",
  "repository_vulnerability_alert.resolve",
  "secret_scanning_alert",
  "secret_scanning_alert.created",
  "secret_scanning_alert.publicly_leaked",
  "secret_scanning_alert.reopened",
  "secret_scanning_alert.resolved",
  "secret_scanning_alert.validated",
  "secret_scanning_alert_location",
  "secret_scanning_alert_location.created",
  "secret_scanning_scan",
  "secret_scanning_scan.completed",
  "security_advisory",
  "security_advisory.published",
  "security_advisory.updated",
  "security_advisory.withdrawn",
  "security_and_analysis",
  "sponsorship",
  "sponsorship.cancelled",
  "sponsorship.created",
  "sponsorship.edited",
  "sponsorship.pending_cancellation",
  "sponsorship.pending_tier_change",
  "sponsorship.tier_changed",
  "star",
  "star.created",
  "star.deleted",
  "status",
  "sub_issues",
  "sub_issues.parent_issue_added",
  "sub_issues.parent_issue_removed",
  "sub_issues.sub_issue_added",
  "sub_issues.sub_issue_removed",
  "team",
  "team.added_to_repository",
  "team.created",
  "team.deleted",
  "team.edited",
  "team.removed_from_repository",
  "team_add",
  "watch",
  "watch.started",
  "workflow_dispatch",
  "workflow_job",
  "workflow_job.completed",
  "workflow_job.in_progress",
  "workflow_job.queued",
  "workflow_job.waiting",
  "workflow_run",
  "workflow_run.completed",
  "workflow_run.in_progress",
  "workflow_run.requested"
];

// pkg/dist-src/event-handler/on.js
function handleEventHandlers(state, webhookName, handler) {
  if (!state.hooks[webhookName]) {
    state.hooks[webhookName] = [];
  }
  state.hooks[webhookName].push(handler);
}
function receiverOn(state, webhookNameOrNames, handler) {
  if (Array.isArray(webhookNameOrNames)) {
    webhookNameOrNames.forEach(
      (webhookName) => receiverOn(state, webhookName, handler)
    );
    return;
  }
  if (["*", "error"].includes(webhookNameOrNames)) {
    const webhookName = webhookNameOrNames === "*" ? "any" : webhookNameOrNames;
    const message = `Using the "${webhookNameOrNames}" event with the regular Webhooks.on() function is not supported. Please use the Webhooks.on${webhookName.charAt(0).toUpperCase() + webhookName.slice(1)}() method instead`;
    throw new Error(message);
  }
  if (!emitterEventNames.includes(webhookNameOrNames)) {
    state.log.warn(
      `"${webhookNameOrNames}" is not a known webhook name (https://developer.github.com/v3/activity/events/types/)`
    );
  }
  handleEventHandlers(state, webhookNameOrNames, handler);
}
function receiverOnAny(state, handler) {
  handleEventHandlers(state, "*", handler);
}
function receiverOnError(state, handler) {
  handleEventHandlers(state, "error", handler);
}

// pkg/dist-src/event-handler/wrap-error-handler.js
function wrapErrorHandler(handler, error) {
  let returnValue;
  try {
    returnValue = handler(error);
  } catch (error2) {
    console.log('FATAL: Error occurred in "error" event handler');
    console.log(error2);
  }
  if (returnValue && returnValue.catch) {
    returnValue.catch((error2) => {
      console.log('FATAL: Error occurred in "error" event handler');
      console.log(error2);
    });
  }
}

// pkg/dist-src/event-handler/receive.js
function getHooks(state, eventPayloadAction, eventName) {
  const hooks = [state.hooks[eventName], state.hooks["*"]];
  if (eventPayloadAction) {
    hooks.unshift(state.hooks[`${eventName}.${eventPayloadAction}`]);
  }
  return [].concat(...hooks.filter(Boolean));
}
function receiverHandle(state, event) {
  const errorHandlers = state.hooks.error || [];
  if (event instanceof Error) {
    const error = Object.assign(new AggregateError([event], event.message), {
      event
    });
    errorHandlers.forEach((handler) => wrapErrorHandler(handler, error));
    return Promise.reject(error);
  }
  if (!event || !event.name) {
    const error = new Error("Event name not passed");
    throw new AggregateError([error], error.message);
  }
  if (!event.payload) {
    const error = new Error("Event name not passed");
    throw new AggregateError([error], error.message);
  }
  const hooks = getHooks(
    state,
    "action" in event.payload ? event.payload.action : null,
    event.name
  );
  if (hooks.length === 0) {
    return Promise.resolve();
  }
  const errors = [];
  const promises = hooks.map((handler) => {
    let promise = Promise.resolve(event);
    if (state.transform) {
      promise = promise.then(state.transform);
    }
    return promise.then((event2) => {
      return handler(event2);
    }).catch((error) => errors.push(Object.assign(error, { event })));
  });
  return Promise.all(promises).then(() => {
    if (errors.length === 0) {
      return;
    }
    const error = new AggregateError(
      errors,
      errors.map((error2) => error2.message).join("\n")
    );
    Object.assign(error, {
      event
    });
    errorHandlers.forEach((handler) => wrapErrorHandler(handler, error));
    throw error;
  });
}

// pkg/dist-src/event-handler/remove-listener.js
function removeListener(state, webhookNameOrNames, handler) {
  if (Array.isArray(webhookNameOrNames)) {
    webhookNameOrNames.forEach(
      (webhookName) => removeListener(state, webhookName, handler)
    );
    return;
  }
  if (!state.hooks[webhookNameOrNames]) {
    return;
  }
  for (let i = state.hooks[webhookNameOrNames].length - 1; i >= 0; i--) {
    if (state.hooks[webhookNameOrNames][i] === handler) {
      state.hooks[webhookNameOrNames].splice(i, 1);
      return;
    }
  }
}

// pkg/dist-src/event-handler/index.js
function createEventHandler(options) {
  const state = {
    hooks: {},
    log: dist_bundle_createLogger(options && options.log)
  };
  if (options && options.transform) {
    state.transform = options.transform;
  }
  return {
    on: receiverOn.bind(null, state),
    onAny: receiverOnAny.bind(null, state),
    onError: receiverOnError.bind(null, state),
    removeListener: removeListener.bind(null, state),
    receive: receiverHandle.bind(null, state)
  };
}

// pkg/dist-src/index.js


// pkg/dist-src/verify-and-receive.js

async function verifyAndReceive(state, event) {
  const matchesSignature = await verifyWithFallback(
    state.secret,
    event.payload,
    event.signature,
    state.additionalSecrets
  ).catch(() => false);
  if (!matchesSignature) {
    const error = new Error(
      "[@octokit/webhooks] signature does not match event payload and secret"
    );
    return state.eventHandler.receive(
      Object.assign(error, { event, status: 400 })
    );
  }
  let payload;
  try {
    payload = JSON.parse(event.payload);
  } catch (error) {
    error.message = "Invalid JSON";
    error.status = 400;
    throw new AggregateError([error], error.message);
  }
  return state.eventHandler.receive({
    id: event.id,
    name: event.name,
    payload
  });
}

// pkg/dist-src/middleware/create-middleware.js
var isApplicationJsonRE = /^\s*(application\/json)\s*(?:;|$)/u;
var WEBHOOK_HEADERS = [
  "x-github-event",
  "x-hub-signature-256",
  "x-github-delivery"
];
function createMiddleware(options) {
  const { handleResponse: handleResponse3, getRequestHeader: getRequestHeader3, getPayload: getPayload3 } = options;
  return function middleware(webhooks, options2) {
    return async function octokitWebhooksMiddleware(request, response, next) {
      let pathname;
      try {
        pathname = new URL(request.url, "http://localhost").pathname;
      } catch (error) {
        return handleResponse3(
          JSON.stringify({
            error: `Request URL could not be parsed: ${request.url}`
          }),
          422,
          {
            "content-type": "application/json"
          },
          response
        );
      }
      if (pathname !== options2.path) {
        next?.();
        return handleResponse3(null);
      } else if (request.method !== "POST") {
        return handleResponse3(
          JSON.stringify({
            error: `Unknown route: ${request.method} ${pathname}`
          }),
          404,
          {
            "content-type": "application/json"
          },
          response
        );
      }
      const contentType = getRequestHeader3(request, "content-type");
      if (typeof contentType !== "string" || !isApplicationJsonRE.test(contentType)) {
        return handleResponse3(
          JSON.stringify({
            error: `Unsupported "Content-Type" header value. Must be "application/json"`
          }),
          415,
          {
            "content-type": "application/json",
            accept: "application/json"
          },
          response
        );
      }
      const missingHeaders = WEBHOOK_HEADERS.filter((header) => {
        return getRequestHeader3(request, header) == void 0;
      }).join(", ");
      if (missingHeaders) {
        return handleResponse3(
          JSON.stringify({
            error: `Required headers missing: ${missingHeaders}`
          }),
          400,
          {
            "content-type": "application/json",
            accept: "application/json"
          },
          response
        );
      }
      const eventName = getRequestHeader3(
        request,
        "x-github-event"
      );
      const signature = getRequestHeader3(request, "x-hub-signature-256");
      const id = getRequestHeader3(request, "x-github-delivery");
      options2.log.debug(`${eventName} event received (id: ${id})`);
      let didTimeout = false;
      let timeout;
      const timeoutPromise = new Promise((resolve) => {
        timeout = setTimeout(() => {
          didTimeout = true;
          resolve(
            handleResponse3(
              "still processing\n",
              202,
              {
                "Content-Type": "text/plain",
                accept: "application/json"
              },
              response
            )
          );
        }, options2.timeout);
      });
      const processWebhook = async () => {
        try {
          const payload = await getPayload3(request);
          await webhooks.verifyAndReceive({
            id,
            name: eventName,
            payload,
            signature
          });
          clearTimeout(timeout);
          if (didTimeout) return handleResponse3(null);
          return handleResponse3(
            "ok\n",
            200,
            {
              "content-type": "text/plain",
              accept: "application/json"
            },
            response
          );
        } catch (error) {
          clearTimeout(timeout);
          if (didTimeout) return handleResponse3(null);
          const err = Array.from(error.errors)[0];
          const errorMessage = err.message ? `${err.name}: ${err.message}` : "Error: An Unspecified error occurred";
          const statusCode = typeof err.status !== "undefined" ? err.status : 500;
          options2.log.error(error);
          return handleResponse3(
            JSON.stringify({
              error: errorMessage
            }),
            statusCode,
            {
              "content-type": "application/json",
              accept: "application/json"
            },
            response
          );
        }
      };
      return await Promise.race([timeoutPromise, processWebhook()]);
    };
  };
}

// pkg/dist-src/middleware/node/handle-response.js
function handleResponse(body, status = 200, headers = {}, response) {
  if (body === null) {
    return false;
  }
  headers["content-length"] = body.length.toString();
  response.writeHead(status, headers).end(body);
  return true;
}

// pkg/dist-src/middleware/node/get-request-header.js
function getRequestHeader(request, key) {
  return request.headers[key];
}

// pkg/dist-src/concat-uint8array.js
function concatUint8Array(data) {
  if (data.length === 0) {
    return new Uint8Array(0);
  }
  let totalLength = 0;
  for (let i = 0; i < data.length; i++) {
    totalLength += data[i].length;
  }
  if (totalLength === 0) {
    return new Uint8Array(0);
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (let i = 0; i < data.length; i++) {
    result.set(data[i], offset);
    offset += data[i].length;
  }
  return result;
}

// pkg/dist-src/middleware/node/get-payload.js
var textDecoder = new TextDecoder("utf-8", { fatal: false });
var decode = textDecoder.decode.bind(textDecoder);
async function getPayload(request) {
  if (typeof request.body === "object" && "rawBody" in request && request.rawBody instanceof Uint8Array) {
    return decode(request.rawBody);
  } else if (typeof request.body === "string") {
    return request.body;
  }
  const payload = await getPayloadFromRequestStream(request);
  return decode(payload);
}
function getPayloadFromRequestStream(request) {
  return new Promise((resolve, reject) => {
    let data = [];
    request.on(
      "error",
      (error) => reject(new AggregateError([error], error.message))
    );
    request.on("data", data.push.bind(data));
    request.on("end", () => {
      const result = concatUint8Array(data);
      queueMicrotask(() => resolve(result));
    });
  });
}

// pkg/dist-src/middleware/node/index.js
function dist_bundle_createNodeMiddleware(webhooks, {
  path = "/api/github/webhooks",
  log = dist_bundle_createLogger(),
  timeout = 9e3
} = {}) {
  return createMiddleware({
    handleResponse,
    getRequestHeader,
    getPayload
  })(webhooks, {
    path,
    log,
    timeout
  });
}

// pkg/dist-src/middleware/web/get-payload.js
function getPayload2(request) {
  return request.text();
}

// pkg/dist-src/middleware/web/get-request-header.js
function getRequestHeader2(request, key) {
  return request.headers.get(key);
}

// pkg/dist-src/middleware/web/handle-response.js
function handleResponse2(body, status = 200, headers = {}) {
  if (body !== null) {
    headers["content-length"] = body.length.toString();
  }
  return new Response(body, {
    status,
    headers
  });
}

// pkg/dist-src/middleware/web/index.js
function createWebMiddleware(webhooks, {
  path = "/api/github/webhooks",
  log = dist_bundle_createLogger(),
  timeout = 9e3
} = {}) {
  return createMiddleware({
    handleResponse: handleResponse2,
    getRequestHeader: getRequestHeader2,
    getPayload: getPayload2
  })(webhooks, {
    path,
    log,
    timeout
  });
}

// pkg/dist-src/index.js
var Webhooks = class {
  sign;
  verify;
  on;
  onAny;
  onError;
  removeListener;
  receive;
  verifyAndReceive;
  constructor(options) {
    if (!options || !options.secret) {
      throw new Error("[@octokit/webhooks] options.secret required");
    }
    const state = {
      eventHandler: createEventHandler(options),
      secret: options.secret,
      additionalSecrets: options.additionalSecrets,
      hooks: {},
      log: dist_bundle_createLogger(options.log)
    };
    this.sign = sign.bind(null, options.secret);
    this.verify = verify.bind(null, options.secret);
    this.on = state.eventHandler.on;
    this.onAny = state.eventHandler.onAny;
    this.onError = state.eventHandler.onError;
    this.removeListener = state.eventHandler.removeListener;
    this.receive = state.eventHandler.receive;
    this.verifyAndReceive = verifyAndReceive.bind(null, state);
  }
};


;// CONCATENATED MODULE: ./node_modules/@octokit/app/dist-node/index.js
// pkg/dist-src/index.js




// pkg/dist-src/version.js
var app_dist_node_VERSION = "15.1.6";

// pkg/dist-src/webhooks.js



function webhooks(appOctokit, options) {
  return new Webhooks({
    secret: options.secret,
    transform: async (event) => {
      if (!("installation" in event.payload) || typeof event.payload.installation !== "object") {
        const octokit2 = new appOctokit.constructor({
          authStrategy: createUnauthenticatedAuth,
          auth: {
            reason: `"installation" key missing in webhook event payload`
          }
        });
        return {
          ...event,
          octokit: octokit2
        };
      }
      const installationId = event.payload.installation.id;
      const octokit = await appOctokit.auth({
        type: "installation",
        installationId,
        factory(auth) {
          return new auth.octokit.constructor({
            ...auth.octokitOptions,
            authStrategy: createAppAuth,
            ...{
              auth: {
                ...auth,
                installationId
              }
            }
          });
        }
      });
      octokit.hook.before("request", (options2) => {
        options2.headers["x-github-delivery"] = event.id;
      });
      return {
        ...event,
        octokit
      };
    }
  });
}

// pkg/dist-src/each-installation.js


// pkg/dist-src/get-installation-octokit.js

async function getInstallationOctokit(app, installationId) {
  return app.octokit.auth({
    type: "installation",
    installationId,
    factory(auth) {
      const options = {
        ...auth.octokitOptions,
        authStrategy: createAppAuth,
        ...{ auth: { ...auth, installationId } }
      };
      return new auth.octokit.constructor(options);
    }
  });
}

// pkg/dist-src/each-installation.js
function eachInstallationFactory(app) {
  return Object.assign(eachInstallation.bind(null, app), {
    iterator: eachInstallationIterator.bind(null, app)
  });
}
async function eachInstallation(app, callback) {
  const i = eachInstallationIterator(app)[Symbol.asyncIterator]();
  let result = await i.next();
  while (!result.done) {
    await callback(result.value);
    result = await i.next();
  }
}
function eachInstallationIterator(app) {
  return {
    async *[Symbol.asyncIterator]() {
      const iterator = composePaginateRest.iterator(
        app.octokit,
        "GET /app/installations"
      );
      for await (const { data: installations } of iterator) {
        for (const installation of installations) {
          const installationOctokit = await getInstallationOctokit(
            app,
            installation.id
          );
          yield { octokit: installationOctokit, installation };
        }
      }
    }
  };
}

// pkg/dist-src/each-repository.js

function eachRepositoryFactory(app) {
  return Object.assign(eachRepository.bind(null, app), {
    iterator: eachRepositoryIterator.bind(null, app)
  });
}
async function eachRepository(app, queryOrCallback, callback) {
  const i = eachRepositoryIterator(
    app,
    callback ? queryOrCallback : void 0
  )[Symbol.asyncIterator]();
  let result = await i.next();
  while (!result.done) {
    if (callback) {
      await callback(result.value);
    } else {
      await queryOrCallback(result.value);
    }
    result = await i.next();
  }
}
function singleInstallationIterator(app, installationId) {
  return {
    async *[Symbol.asyncIterator]() {
      yield {
        octokit: await app.getInstallationOctokit(installationId)
      };
    }
  };
}
function eachRepositoryIterator(app, query) {
  return {
    async *[Symbol.asyncIterator]() {
      const iterator = query ? singleInstallationIterator(app, query.installationId) : app.eachInstallation.iterator();
      for await (const { octokit } of iterator) {
        const repositoriesIterator = composePaginateRest.iterator(
          octokit,
          "GET /installation/repositories"
        );
        for await (const { data: repositories } of repositoriesIterator) {
          for (const repository of repositories) {
            yield { octokit, repository };
          }
        }
      }
    }
  };
}

// pkg/dist-src/get-installation-url.js
function getInstallationUrlFactory(app) {
  let installationUrlBasePromise;
  return async function getInstallationUrl(options = {}) {
    if (!installationUrlBasePromise) {
      installationUrlBasePromise = getInstallationUrlBase(app);
    }
    const installationUrlBase = await installationUrlBasePromise;
    const installationUrl = new URL(installationUrlBase);
    if (options.target_id !== void 0) {
      installationUrl.pathname += "/permissions";
      installationUrl.searchParams.append(
        "target_id",
        options.target_id.toFixed()
      );
    }
    if (options.state !== void 0) {
      installationUrl.searchParams.append("state", options.state);
    }
    return installationUrl.href;
  };
}
async function getInstallationUrlBase(app) {
  const { data: appInfo } = await app.octokit.request("GET /app");
  if (!appInfo) {
    throw new Error("[@octokit/app] unable to fetch metadata for app");
  }
  return `${appInfo.html_url}/installations/new`;
}

// pkg/dist-src/middleware/node/index.js


function dist_node_noop() {
}
function dist_node_createNodeMiddleware(app, options = {}) {
  const log = Object.assign(
    {
      debug: dist_node_noop,
      info: dist_node_noop,
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    },
    options.log
  );
  const optionsWithDefaults = {
    pathPrefix: "/api/github",
    ...options,
    log
  };
  const webhooksMiddleware = dist_bundle_createNodeMiddleware(app.webhooks, {
    path: optionsWithDefaults.pathPrefix + "/webhooks",
    log
  });
  const oauthMiddleware = createNodeMiddleware(app.oauth, {
    pathPrefix: optionsWithDefaults.pathPrefix + "/oauth"
  });
  return middleware.bind(
    null,
    optionsWithDefaults.pathPrefix,
    webhooksMiddleware,
    oauthMiddleware
  );
}
async function middleware(pathPrefix, webhooksMiddleware, oauthMiddleware, request, response, next) {
  const { pathname } = new URL(request.url, "http://localhost");
  if (pathname.startsWith(`${pathPrefix}/`)) {
    if (pathname === `${pathPrefix}/webhooks`) {
      webhooksMiddleware(request, response);
    } else if (pathname.startsWith(`${pathPrefix}/oauth/`)) {
      oauthMiddleware(request, response);
    } else {
      sendResponse(unknownRouteResponse(request), response);
    }
    return true;
  } else {
    next?.();
    return false;
  }
}

// pkg/dist-src/index.js
var App = class {
  static VERSION = app_dist_node_VERSION;
  static defaults(defaults) {
    const AppWithDefaults = class extends this {
      constructor(...args) {
        super({
          ...defaults,
          ...args[0]
        });
      }
    };
    return AppWithDefaults;
  }
  octokit;
  // @ts-ignore calling app.webhooks will throw a helpful error when options.webhooks is not set
  webhooks;
  // @ts-ignore calling app.oauth will throw a helpful error when options.oauth is not set
  oauth;
  getInstallationOctokit;
  eachInstallation;
  eachRepository;
  getInstallationUrl;
  log;
  constructor(options) {
    const Octokit = options.Octokit || dist_src_Octokit;
    const authOptions = Object.assign(
      {
        appId: options.appId,
        privateKey: options.privateKey
      },
      options.oauth ? {
        clientId: options.oauth.clientId,
        clientSecret: options.oauth.clientSecret
      } : {}
    );
    const octokitOptions = {
      authStrategy: createAppAuth,
      auth: authOptions
    };
    if ("log" in options && typeof options.log !== "undefined") {
      octokitOptions.log = options.log;
    }
    this.octokit = new Octokit(octokitOptions);
    this.log = Object.assign(
      {
        debug: () => {
        },
        info: () => {
        },
        warn: console.warn.bind(console),
        error: console.error.bind(console)
      },
      options.log
    );
    if (options.webhooks) {
      this.webhooks = webhooks(this.octokit, options.webhooks);
    } else {
      Object.defineProperty(this, "webhooks", {
        get() {
          throw new Error("[@octokit/app] webhooks option not set");
        }
      });
    }
    if (options.oauth) {
      this.oauth = new OAuthApp({
        ...options.oauth,
        clientType: "github-app",
        Octokit
      });
    } else {
      Object.defineProperty(this, "oauth", {
        get() {
          throw new Error(
            "[@octokit/app] oauth.clientId / oauth.clientSecret options are not set"
          );
        }
      });
    }
    this.getInstallationOctokit = getInstallationOctokit.bind(
      null,
      this
    );
    this.eachInstallation = eachInstallationFactory(
      this
    );
    this.eachRepository = eachRepositoryFactory(
      this
    );
    this.getInstallationUrl = getInstallationUrlFactory(this);
  }
};


;// CONCATENATED MODULE: ./node_modules/octokit/dist-bundle/index.js
// pkg/dist-src/octokit.js







// pkg/dist-src/version.js
var octokit_dist_bundle_VERSION = "0.0.0-development";

// pkg/dist-src/octokit.js

var Octokit = dist_src_Octokit.plugin(
  restEndpointMethods,
  paginateRest,
  paginateGraphQL,
  retry,
  throttling
).defaults({
  userAgent: `octokit.js/${octokit_dist_bundle_VERSION}`,
  throttle: {
    onRateLimit,
    onSecondaryRateLimit
  }
});
function onRateLimit(retryAfter, options, octokit) {
  octokit.log.warn(
    `Request quota exhausted for request ${options.method} ${options.url}`
  );
  if (options.request.retryCount === 0) {
    octokit.log.info(`Retrying after ${retryAfter} seconds!`);
    return true;
  }
}
function onSecondaryRateLimit(retryAfter, options, octokit) {
  octokit.log.warn(
    `SecondaryRateLimit detected for request ${options.method} ${options.url}`
  );
  if (options.request.retryCount === 0) {
    octokit.log.info(`Retrying after ${retryAfter} seconds!`);
    return true;
  }
}

// pkg/dist-src/app.js



var dist_bundle_App = App.defaults({ Octokit });
var dist_bundle_OAuthApp = OAuthApp.defaults({ Octokit });



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_fs_1 = __nccwpck_require__(24);
const app_1 = __nccwpck_require__(168);
const buckets_1 = __nccwpck_require__(140);
const buckets_2 = __nccwpck_require__(140);
function printHelp() {
    // Minimal help; keep dependencies at zero.
    process.stdout.write([
        "split-by-codeowners",
        "",
        "Usage:",
        "  npx split-by-codeowners [options]",
        "",
        "Common options:",
        "  --codeowners <path>           Path to CODEOWNERS (default: CODEOWNERS)",
        "  --exclude <file|->            File with newline-separated globs, or '-' to read stdin",
        "  --include-unowned <true|false> (default: true)",
        "  --max-buckets <n>             (default: 30)",
        "  --patch-dir <dir>             (default: bucket-patches)",
        "  --bucket-prefix <prefix>      (default: bucket)",
        "  --dry-run                     Compute buckets, don't write patches",
        "",
        "PR creation:",
        "  --create-prs                  Push branches + create/update PRs (requires token)",
        "  --token <token>               GitHub token (or env GITHUB_TOKEN / GH_TOKEN)",
        "  --base-branch <branch>        Base branch for PRs (default: repo default)",
        "  --branch-prefix <prefix>      (default: codemods/)",
        "  --commit-message <msg>        (default: chore: automated changes)",
        "  --pr-title <tpl>              Supports {owners} and {bucket_key}",
        "  --pr-body <tpl>               Supports {owners}, {bucket_key}, {files}",
        "  --draft <true|false>          (default: false)",
        "",
        "Examples:",
        "  npx split-by-codeowners --exclude - < excludes.txt",
        "  npx split-by-codeowners --create-prs --token $GH_TOKEN --base-branch main",
        ""
    ].join("\n"));
}
function takeArg(argv, i, name) {
    const v = argv[i + 1];
    if (!v)
        throw new Error(`Missing value for ${name}`);
    return v;
}
async function readStdin() {
    const chunks = [];
    for await (const c of process.stdin)
        chunks.push(Buffer.from(c));
    return Buffer.concat(chunks).toString("utf8");
}
async function main() {
    const argv = process.argv.slice(2);
    if (argv.includes("-h") || argv.includes("--help")) {
        printHelp();
        return;
    }
    const logger = {
        info: (m) => process.stdout.write(m + "\n"),
        warn: (m) => process.stderr.write(m + "\n"),
        error: (m) => process.stderr.write(m + "\n")
    };
    // defaults
    let codeownersPath = "CODEOWNERS";
    let includeUnowned = true;
    let unownedBucketKey = "__UNOWNED__";
    let maxBuckets = 30;
    let excludePatterns = [];
    let patchDir = "bucket-patches";
    let bucketPrefix = "bucket";
    let dryRun = false;
    let cleanupPatches = true;
    let createPrs = false;
    let githubToken = "";
    let baseBranch = "";
    let branchPrefix = "codemods/";
    let commitMessage = "chore: automated changes";
    let prTitle = "chore: automated changes ({owners})";
    let prBody = "Automated changes bucketed by CODEOWNERS.\n\nOwners: {owners}\nBucket key: {bucket_key}\n\nFiles:\n{files}\n";
    let draft = false;
    // parse args
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--codeowners")
            codeownersPath = takeArg(argv, i++, a);
        else if (a === "--include-unowned")
            includeUnowned = (0, buckets_2.parseBool)(takeArg(argv, i++, a));
        else if (a === "--unowned-bucket-key")
            unownedBucketKey = takeArg(argv, i++, a);
        else if (a === "--max-buckets")
            maxBuckets = Number(takeArg(argv, i++, a));
        else if (a === "--exclude") {
            const v = takeArg(argv, i++, a);
            const raw = v === "-" ? await readStdin() : (0, node_fs_1.readFileSync)(v, "utf8");
            excludePatterns = (0, buckets_1.readMultiline)(raw);
        }
        else if (a === "--patch-dir")
            patchDir = takeArg(argv, i++, a);
        else if (a === "--bucket-prefix")
            bucketPrefix = takeArg(argv, i++, a);
        else if (a === "--dry-run")
            dryRun = true;
        else if (a === "--cleanup-patches")
            cleanupPatches = true;
        else if (a === "--create-prs")
            createPrs = true;
        else if (a === "--token")
            githubToken = takeArg(argv, i++, a);
        else if (a === "--base-branch")
            baseBranch = takeArg(argv, i++, a);
        else if (a === "--branch-prefix")
            branchPrefix = takeArg(argv, i++, a);
        else if (a === "--commit-message")
            commitMessage = takeArg(argv, i++, a);
        else if (a === "--pr-title")
            prTitle = takeArg(argv, i++, a);
        else if (a === "--pr-body")
            prBody = takeArg(argv, i++, a);
        else if (a === "--draft")
            draft = (0, buckets_2.parseBool)(takeArg(argv, i++, a));
        else if (a.startsWith("-"))
            throw new Error(`Unknown arg: ${a}`);
    }
    const cfg = {
        codeownersPath,
        includeUnowned,
        unownedBucketKey,
        maxBuckets,
        excludePatterns,
        patchDir,
        bucketPrefix,
        dryRun,
        cleanupPatches,
        baseRef: "",
        createPrs,
        githubToken,
        baseBranch,
        branchPrefix,
        commitMessage,
        prTitle,
        prBody,
        draft,
        remoteName: "origin"
    };
    const res = await (0, app_1.runSplit)(cfg, logger);
    logger.info(JSON.stringify({ buckets: res.buckets, prs: res.prs ?? [] }, null, 2));
}
main().catch((e) => {
    process.stderr.write((e?.message ?? String(e)) + "\n");
    process.exitCode = 1;
});

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map