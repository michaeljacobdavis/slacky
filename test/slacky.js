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

describe('Bot', () => {
  let bot;

  beforeEach(done => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });
    mockery.registerMock('@slack/client', { RtmClient: EventEmitter });
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

    it('middleware is bound to the bot if possible', done => {
      const event = 'test';
      bot.use(function (next, event, data) {
        expect(this).to.equal(bot);

        done();
      });
      bot.on(event, () => {});
      bot.emit(event);
    });

    it('middleware can continue by calling next', done => {
      const event = 'test';
      bot.use(function (next) {
        next();
      });
      bot.on(event, () => { done(); });
      bot.emit(event);
    });

    it('middleware can exit by not calling next', done => {
      const event = 'test';
      bot.use(function (next) {
        // Not calling next stops the chain

        // Wait for the chain to stop before finishing
        setTimeout(done);
      });
      bot.on(event, () => { throw new Error('I should not be called')});
      bot.emit(event);
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
