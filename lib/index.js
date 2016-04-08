'use strict';
const RtmClient = require('@slack/client').RtmClient;
const util = require('util');
const wrap = require('wrap-fn');

function Bot (token, options) {
  if (!token) {
    throw new Error('A slack token is required!');
  }
  RtmClient.apply(this, arguments);
  const middleware = [];

  /**
   * `use`
   * Middleware should have the function signature of `next, event, data`.
   * Example:
   *   bot.use(function (next, event, data) {
   *     next();
   *   });
   */
  this.use = function(fn){
    middleware.push(fn);
    return this;
  };

  this.run = function () {
    let i = 0;
    const bot = this;
    const done = arguments[arguments.length - 1];
    const args = [].slice.call(arguments, 0, arguments.length - 1);

    function next (err) {
      const fn = middleware[i++];

      if (!fn) {
        return done.apply(bot, args.slice(1));
      }

      fn.apply(bot, [next].concat(args.slice()));
    }

    next();

    return this;
  };
}

Bot.prototype.on = function (event, callback) {
  const bot = this;
  if (typeof callback !== 'function') {
    throw new Error('Last argument to `on` must be a callback.');
  }
  Bot.super_.prototype.on.call(this, event, function () {
    let args = [event]
      .concat(Array.prototype.slice.call(arguments))
      .concat([callback.bind(bot)]);
    bot.run.apply(bot, args);
  });
};

util.inherits(Bot, RtmClient);

module.exports = Bot;
