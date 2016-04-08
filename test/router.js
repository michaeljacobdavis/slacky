'use strict';

const Code = require('code');
const Lab = require('lab');
const router = require('../lib/router');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const expect = Code.expect;

let bot;

describe('router', () => {
  beforeEach(done => {
    bot = Object.assign({
      listeners: []
    }, router);

    done();
  });

  describe('listen', () => {
    it('throws an error if the first argument isn\'t a string or a regular expression', done => {
      expect(() => bot.listen(null, () => {})).to.throw();
      done();
    });

    it('throws an error if the second argument isn\'t a function', done => {
      expect(() => bot.listen('string', null)).to.throw();
      done();
    });

    it('adds the listener to the listeners array', done => {
      expect(bot.listeners.length).to.equal(0);
      bot.listen('test', () => {});
      expect(bot.listeners.length).to.equal(1);

      done();
    });
  });

  describe('route', () => {
    it('uses the first matching route', done => {
      bot.listen('123', () => {});
      bot.listen('hello', () => {});
      bot.listen(/hello (.*)/, () => {});

      expect(bot.route('hello 123').matches.length).to.equal(1);

      done();
    });

    it('returns the matches to route', done => {
      bot.listen(/hello (.*)/, () => {});

      expect(bot.route('hello 123').matches[1]).to.equal('123');

      done();
    });

    it('returns undefined if no route is matched', done => {
      bot.listen(/blah/, () => {});

      expect(bot.route('hello 123')).to.be.undefined();

      done();
    });

    it('returns the callback of the route', done => {
      const callback = function test() {};
      bot.listen(/hello (.*)/, callback);

      expect(bot.route('hello 123').callback).to.equal(callback);

      done();
    });
  });

});
