'use strict';

/**
@module router
*/

/**
`Listen`

@example <caption>Listen takes either a string or regular expression and a callback. The callback is called
whenever a message matching that string/regexp is seen. The callback is called with the route,
message body, and a respond function to reply.</caption>
bot.listen('hello', function (route, message, respond) {
  respond('world');
});

@example <caption>You can also use capture groups in a regular expression. They are returned as `route.matches`.</caption>
bot.listen('hello (.*)', function (route, message, respond) {
  console.log(route.matches);
});

@param  {RegExp|String}   pattern  Pattern to match incoming messages to.
@param  {Function}        callback
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
`route`
@description Given a message, trigger the first applicable listener.
@param  {String} path  Message to match.
*/
exports.route = function route(path) {
  let matches;
  const matchedListener = this.listeners.find((listener) => matches = path.match(listener.matcher));
  if (!matchedListener) return;
  return Object.assign({ matches }, matchedListener);
};

exports.register = function (options, expose, next) {
  // Register `listen` handler
  this.on(events.MESSAGE, (message) => {
    const route = this.route(message.text);
    if (!route) return;
    route.callback.call(this, route, message, (response) => {
      this.sendMessage(response, message.channel);
    });
  });


};
exports.name = 'router';
