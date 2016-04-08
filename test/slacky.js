'use strict';

const Code = require('code');
const Lab = require('lab');
const EventEmitter = require('eventemitter3');
const mockery = require('mockery');
const lab = exports.lab = Lab.script();
const modulePath = '../';

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const expect = Code.expect;
const RTM_EVENTS = {
  MESSAGE: 'MESSAGE'
};

describe('Bot', () => {
  let bot;

  beforeEach(done => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });
    mockery.registerMock('@slack/client', {
      RtmClient: EventEmitter,
      RTM_EVENTS
    });
    bot = new (require(modulePath))('123');

    done();
  });

  afterEach(done => {
    mockery.disable();

    done();
  });

  it('throws an error if no slack token is provided', done => {
    expect(() => new (require(modulePath))()).to.throw();
    done();
  });


  describe('listener', () => {
    it('adds a listener for messsages and routes to a listener', done => {
      bot.listen('test message', () => {
        done();
      });
      bot.emit(RTM_EVENTS.MESSAGE, { text: 'test message' });
    });

    it('does not call a route callback if none match', done => {
      bot.listen('not matching', () => {});
      bot.emit(RTM_EVENTS.MESSAGE, { text: 'test message' });
      setTimeout(done);
    });

    it('passes a response callback which sends a message when called', done => {
      bot.sendMessage = () => done();
      bot.listen('test message', (route, message, respond) => {
        respond('blah');
      });
      bot.emit(RTM_EVENTS.MESSAGE, { text: 'test message' });
    });
  });

  describe('middleware', () => {
    it('returns the bot instance', done => {
      expect(bot.use(() => {})).to.equal(bot);
      done();
    });

    it('excutes middleware when an event is emitted', done => {
      const event = 'test';
      bot.use(() => done());
      bot.on(event, () => {});
      bot.emit(event);
    });

    it('middleware is passed a `next` function, an `event` string and optionally data', done => {
      const event = 'test';
      const data = {};
      bot.use((next, event, data) => {
        expect(next).to.be.a.function();
        expect(event).to.equal(event);
        expect(data).to.equal(data);

        done();
      });
      bot.on(event, () => {});
      bot.emit(event, data);
    });

  });

  describe('on', done => {
    it('throws an error if no callback is provided', done => {
      const event = 'test';
      expect(() => bot.on(event)).to.throw();
      bot.emit(event);
      done();
    });
  });

});
