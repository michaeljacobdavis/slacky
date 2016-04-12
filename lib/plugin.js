'use strict';
const items = require('items');

/**
Plugins add many different pieces of functionality to a bot without having to manage everything in one repository.

The function signature for plugins is `options`, `expose`, `next`, where `options` is an object,
`expose` is a function to expose functionality to other plugins, and `next` is called when registration is complete.

@example
const plugin {
  register: function (options, expose, next) {
    next();
  },
  name: 'myPlugin'
};
bot.register(plugin);

@example <caption>Alternatively you can just `require` the package.json and export it as `pkg`</caption>
const plugin {
  register: function (options, expose, next) {
    next();
  },
  pkg: require('package.json')
};
bot.register(plugin);

@example <caption>You can also pass options to plugins by specifiying a `register` function (the plugin) and an `options` object.</caption>
const plugin =
  register: function (options, expose, next) {
    console.log(options.players); // 4
    next();
  },
  name: 'myPlugin'
};
bot.register({ register: plugin.register, options: { players: 4 }, name: plugin.name });

@example <caption>`register` also can take an array of plugins.</caption>
bot.register([require('plugin1'), { register: require('plugin2'), options: { players: 4 }, name: 'myPlugin' }]);

@module plugin
*/

/**
`Register`
@description  Register plugins to the bot.
@param  {Array|Object}    plugins            One or more plugins to register.
@param  {Object}                   plugins.options    Options to pass to the plugin
@param  {String}                   plugins.name       Options to pass to the plugin
@param  {Function} callback
*/
exports.register = function(plugins, callback){
  if (typeof callback !== 'function') throw new Error('Provide a callback to `register`');

  plugins = [].concat(plugins);
  items.serial(plugins, (plugin, next) => {
    plugin.name = plugin.name || plugin.pkg.name;

    if (typeof plugin.register !== 'function') throw new Error('`plugin.register` must be a function');
    if (typeof plugin.name !== 'string') throw new Error('`name` is required for plugins');
    if (plugin.name in this.plugins) throw new Error(`Plugin ${plugin.name} has already been registered.`);

    this.plugins[plugin.name] = {};

    plugin.register.call(this, plugin.options || {}, this.expose.bind(this, plugin.name), next);

  }, callback);
};

/**
`expose`
@description  Register plugins to the bot.
@param  {String}          namespace
@param  {String|Object}   key
@param  {*}               value
*/
exports.expose = function (namespace, key, value) {
  if (typeof key === 'string') {
    this.plugins[namespace][key] = value;
  } else if (typeof key === 'object') {
    // Just merge in the object
    Object.assign(this.plugins[namespace], key);
  }
};
