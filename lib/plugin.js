'use strict';
const items = require('items');

/**
Plugins add many different pieces of functionality to a bot without having to manage everything in one repository.
@example
const plugin = function (options, next) {
  ... Add listeners or functionality ...
  next();
};
bot.register(plugin);

@example <caption>You can also pass options to plugins by specifiying a `register` function (the plugin) and an `options` object.</caption>
const plugin = function (options, next) {
  console.log(options.players); // 4
  next();
};
bot.register({ register: plugin, options: { players: 4 });

@example <caption>`register` also can take an array of plugins.</caption>
bot.register([require('plugin1'), { register: require('plugin2'), options: { players: 4 }]);

@module plugin
*/

/**
`Register`
@description  Register plugins to the bot.
@param  {Array|Object|Function}    plugins           One or more plugins to register.
@param  {Function}                 plugins.register  Options to pass to the plugin
@param  {Object}                   plugins.options   Options to pass to the plugin
@param  {Function} callback
*/
exports.register = function(plugins, callback){
  if (typeof callback !== 'function') throw new Error('`plugin.register` must be a function');

  plugins = [].concat(plugins);
  items.serial(plugins, (plugin, next) => {
    // Function no options
    if (typeof plugin === 'function') {
      plugin = { register: plugin };
    } else if (typeof plugin.register !== 'function') throw new Error('`plugin.register` must be a function');

    plugin.register.call(this, plugin.options || {}, next);

  }, callback);
};
