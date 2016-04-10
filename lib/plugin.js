'use strict';
const items = require('items');

/**
 * `Register`
 * Register plugins to the bot.
 *
 * @param  {Array|Object|Function}    plugins           One or more plugins to register.
 * @param  {Function}                 plugins.register  Options to pass to the plugin
 * @param  {Object}                   plugins.options   Options to pass to the plugin
 * @param  {Function} callback
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
