'use strict';

exports.listen = function hear(pattern, callback) {
  if(!(typeof pattern === 'string' || pattern instanceof RegExp) || typeof callback !== 'function') {
    throw new Error('Listen should be called with a string/regexp pattern and a callback function');
  }
  this.listeners.push({
    matcher: pattern instanceof RegExp ? pattern : new RegExp(pattern),
    callback
  });
};

exports.route = function route(path) {
  let matches;
  const matchedListener = this.listeners.find((listener) => matches = path.match(listener.matcher));
  return Object.assign({ matches }, matchedListener);
};
