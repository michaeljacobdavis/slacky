'use strict';

const Code = require('code');
const Lab = require('lab');
const middleware = require('../lib/middleware');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const expect = Code.expect;

let bot;

describe('middleware', () => {
  beforeEach(done => {
    bot = Object.assign({
      middleware: []
    }, middleware);

    done();
  });

  describe('use', () => {
    it('returns the bot instance', done => {
      expect(bot.use(() => {})).to.equal(bot);
      done();
    });

    it('adds the listener to the listeners array', done => {
      expect(bot.middleware.length).to.equal(0);
      bot.use(() => {});
      expect(bot.middleware.length).to.equal(1);

      done();
    });
  });

  describe('run', () => {
    it('middleware is called with a `next` function and arguments', done => {
      const event = 'test';
      const data = {};
      bot.use((next, event, data) => {
        expect(next).to.be.a.function();
        expect(event).to.equal(event);
        expect(data).to.equal(data);

        done();
      });
      bot.run(event, data, () => {});
    });

    it('middleware is bound to the bot if possible', done => {
      const event = 'test';
      const data = {};
      bot.use(function (next, event, data) {
        expect(this).to.equal(bot);

        done();
      });
      bot.run(event, data, () => {});
    });

    it('middleware can continue by calling next', done => {
      const event = 'test';
      bot.use(function (next) {
        next();
      });
      bot.run(event, () => { done(); });
    });

    it('middleware can exit by not calling next', done => {
      const event = 'test';
      bot.use(function (next) {
        // Not calling next stops the chain

        // Wait for the chain to stop before finishing
        setTimeout(done);
      });
      bot.run(event, () => { throw new Error('I should not be called')});
    });
  });

});
