'use strict';

/**
Middleware should have the function signature of `next, event, data`.

@example <caption>**Tip**: Don't want your middleware to run on *all* events?</caption>
bot.use(function (next, event, data) {
 const eventsICareAbout = ['message', 'something'];
 if(eventsICareAbout.indexOf(event) == -1) {
   next();
 }
 ... Deal with your event ...
});

@module middleware
*/

/**
`use`
@description Add middleware to the bot.
@example
bot.use(function (next, event, data) {
  next();
});
@param  {Function} fn  Middleware function
@return {this}         Current bot
*/
exports.use = function(fn){
  this.middleware.push(fn);
  return this;
};

/**
`run`
@description Execute middleware
@param  {Any}       ...   Arguments to be passed to middleware
@param  {Function}  done  Function to be called after middleware has executed
@return {this}            Current bot
*/
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
