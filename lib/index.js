'use strict';

const slack = require('@slack/client');
const RtmClient = slack.RtmClient;
const events = slack.RTM_EVENTS;
const util = require('util');
const wrap = require('wrap-fn');
const router = require('./router');
const plugin = require('./plugin');
const middleware = require('./middleware');

function Bot (token, options) {
  if (!token) {
    throw new Error('A slack token is required!');
  }

  RtmClient.apply(this, arguments);

  // Create instance variables
  this.middleware = [];
  this.listeners = [];

  // Register `listen` handler
  this.on(events.MESSAGE, (message) => {
    const route = this.route(message.text);
    if (!route) return;
    route.callback.call(this, route, message, (response) => {
      this.sendMessage(response, message.channel);
    });
  });
}

util.inherits(Bot, RtmClient);

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

Object.assign(Bot.prototype, router, middleware, plugin);

module.exports = Bot;
