'use strict';

/**
 * `Listen`
 * Add new message listeners.
 * @param  {RegExp|String}   pattern  Pattern to match incoming messages to.
 * @param  {Function}        callback
 */
exports.listen = function hear(pattern, callback) {
  if(!(typeof pattern === 'string' || pattern instanceof RegExp) || typeof callback !== 'function') {
    throw new Error('Listen should be called with a string/regexp pattern and a callback function');
  }
  this.listeners.push({
    matcher: pattern instanceof RegExp ? pattern : new RegExp(pattern),
    callback
  });
};

/**
 * `route`
 * Given a message, trigger the first applicable listener.
 * @param  {String} path  Message to match.
 */
exports.route = function route(path) {
  let matches;
  const matchedListener = this.listeners.find((listener) => matches = path.match(listener.matcher));
  if (!matchedListener) return;
  return Object.assign({ matches }, matchedListener);
};
