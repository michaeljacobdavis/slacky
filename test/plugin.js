'use strict';

const Code = require('code');
const Lab = require('lab');
const plugin = require('../lib/plugin');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const expect = Code.expect;

let bot;

describe('plugin', () => {
  beforeEach(done => {
    bot = Object.assign({}, plugin);

    done();
  });

  describe('register', () => {
    it('throws an error if `callback` is not a function', done => {
      expect(() => bot.register({})).to.throw();

      done();
    });

    describe('single plugin', () => {
      it('throws an error if `plugin.register` is not a function', done => {
        expect(() => bot.register({}, () => {})).to.throw();

        done();
      });

      it('calls the plugin with options and a callback', done => {
        bot.register(function (options, next) {
          expect(options).to.be.an.object();
          expect(next).to.be.a.function();

          done();
        }, () => {});
      });

      it('binds the bot instance to this', done => {
        bot.register(function (options, next) {
          expect(this).to.equal(bot);

          done();
        }, () => {});
      });

      it('accepts an object where `register` is the plugin function', done => {
        bot.register({
          register: function (options, next) {
            done();
          }
        }, () => {});
      });

      it('calls `register` with the provided `options` if available', done => {
        const plugin = {
          options: {
            hello: 'world'
          },
          register: function (options, next) {
            expect(options).to.equal(plugin.options);

            done();
          }
        };
        bot.register(plugin, () => {});
      });
    });

    describe('multiple plugins', () => {
      it('accepts an array of plugins', done => {
        let count = 0;
        const plugin = {
          register: function (options, next) {
            count++;
            next();
          }
        };
        const plugins = [plugin, plugin.register];
        debugger;
        bot.register(plugins, () => {
          expect(count).to.equal(plugins.length);

          done();
        });
      });
    });
  });
});
