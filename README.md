## Slacky - A minimalistic slackbot.

### API

#### Events
You can use the [`on` method like `node-slack-client`](https://github.com/slackhq/node-slack-client#listen-to-messages) to add event listeners (that are run through middleware).

Alternatively, Slacky provides a special `listen` method specifically for messages.

#####`listen`
Listen takes either a string or regular expression and a callback. The callback is called
whenever a message matching that string/regexp is seen. The callback is called with the route,
message body, and a respond function to reply.

```
bot.listen('hello', function (route, message, respond) {
  respond('world');
});
```

You can also use capture groups in a regular expression. They are returned as `route.matches`.

```
bot.listen('hello (.*)', function (route, message, respond) {
  console.log(route.matches);
});
```

#### Middleware

#####`use`
Middleware should have the function signature of `next, event, data`.
Example:

```
 bot.use(function (next, event, data) {
   next();
 });
 ```

**Tip**: Don't want your middleware to run on *all* events?

```
 bot.use(function (next, event, data) {
   const eventsICareAbout = ['message', 'something'];
   if(eventsICareAbout.indexOf(event) == -1) {
     next();
   }
   ... Deal with your event ...
 });
 ```
