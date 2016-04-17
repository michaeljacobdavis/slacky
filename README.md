## Slacky - A minimalistic slackbot.

### API

<a name="module_middleware"></a>

## middleware
Middleware should have the function signature of `next, event, data`.

**Example** *(**Tip**: Don&#x27;t want your middleware to run on *all* events?)*  
```js
bot.use(function (next, event, data) {
 const eventsICareAbout = ['message', 'something'];
 if(eventsICareAbout.indexOf(event) == -1) {
   next();
 }
 ... Deal with your event ...
});
```

* [middleware](#module_middleware)
    * [.use(fn)](#module_middleware.use) ⇒ <code>this</code>
    * [.run(done)](#module_middleware.run) ⇒ <code>this</code>

<a name="module_middleware.use"></a>

### middleware.use(fn) ⇒ <code>this</code>
Add middleware to the bot.

**Kind**: static method of <code>[middleware](#module_middleware)</code>  
**Returns**: <code>this</code> - Current bot  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Middleware function |

**Example**  
```js
bot.use(function (next, event, data) {
  next();
});
```
<a name="module_middleware.run"></a>

### middleware.run(done) ⇒ <code>this</code>
Execute middleware

**Kind**: static method of <code>[middleware](#module_middleware)</code>  
**Returns**: <code>this</code> - Current bot  

| Param | Type | Description |
| --- | --- | --- |
| ... | <code>Any</code> | Arguments to be passed to middleware |
| done | <code>function</code> | Function to be called after middleware has executed |

<a name="module_plugin"></a>

## plugin
Plugins add many different pieces of functionality to a bot without having to manage everything in one repository.

**Example**  
```js
const plugin = function (options, next) {
  ... Add listeners or functionality ...
  next();
};
bot.register(plugin);
```
**Example** *(You can also pass options to plugins by specifiying a &#x60;register&#x60; function (the plugin) and an &#x60;options&#x60; object.)*  
```js
const plugin = function (options, next) {
  console.log(options.players); // 4
  next();
};
bot.register({ register: plugin, options: { players: 4 });
```
**Example** *(&#x60;register&#x60; also can take an array of plugins.)*  
```js
bot.register([require('plugin1'), { register: require('plugin2'), options: { players: 4 }]);
```
<a name="module_plugin.register"></a>

### plugin.register(plugins, callback)
Register plugins to the bot.

**Kind**: static method of <code>[plugin](#module_plugin)</code>  

| Param | Type | Description |
| --- | --- | --- |
| plugins | <code>Array</code> &#124; <code>Object</code> &#124; <code>function</code> | One or more plugins to register. |
| plugins.register | <code>function</code> | Options to pass to the plugin |
| plugins.options | <code>Object</code> | Options to pass to the plugin |
| callback | <code>function</code> |  |

<a name="module_router"></a>

## router

* [router](#module_router)
    * [.listen(pattern, callback)](#module_router.listen)
    * [.route(path)](#module_router.route)

<a name="module_router.listen"></a>

### router.listen(pattern, callback)
`Listen`

**Kind**: static method of <code>[router](#module_router)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>RegExp</code> &#124; <code>String</code> | Pattern to match incoming messages to. |
| callback | <code>function</code> |  |

**Example** *(Listen takes either a string or regular expression and a callback. The callback is called whenever a message matching that string/regexp is seen. The callback is called with the route, message body, and a respond function to reply.)*  
```js
bot.listen('hello', function (route, message, respond) {
  respond('world');
});
```
**Example** *(You can also use capture groups in a regular expression. They are returned as &#x60;route.matches&#x60;.)*  
```js
bot.listen('hello (.*)', function (route, message, respond) {
  console.log(route.matches);
});
```
<a name="module_router.route"></a>

### router.route(path)
Given a message, trigger the first applicable listener.

**Kind**: static method of <code>[router](#module_router)</code>  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | Message to match. |

