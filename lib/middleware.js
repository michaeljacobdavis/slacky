'use strict';

/**
 * `use`
 * Middleware should have the function signature of `next, event, data`.
 * Example:
 *   bot.use(function (next, event, data) {
 *     next();
 *   });
 */
exports.use = function(fn){
  this.middleware.push(fn);
  return this;
};

exports.run = function () {
  let i = 0;
  const bot = this;
  const done = arguments[arguments.length - 1];
  const args = [].slice.call(arguments, 0, arguments.length - 1);

  function next (err) {
    const fn = bot.middleware[i++];

    if (!fn) {
      return done.apply(bot, args.slice(1));
    }

    fn.apply(bot, [next].concat(args.slice()));
  }

  next();

  return this;
};
