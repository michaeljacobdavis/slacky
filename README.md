## Slacky - A minimalistic slackbot.

### API

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
