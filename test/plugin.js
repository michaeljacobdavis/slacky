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
    bot = Object.assign({
      plugins: {}
    }, plugin);

    done();
  });

  describe('register', () => {
    it('throws an error if `callback` is not a function', done => {
      expect(() => bot.register({})).to.throw();

      done();
    });

    describe('single plugin', () => {
      it('throws an error if `plugin.register` is not a function', done => {
        expect(() => bot.register({
          name: 'name',
          register: {}
        }, () => {})).to.throw();

        done();
      });

      it('throws an error if `plugin.name` is not provided', done => {
        let plugin = {
          register: function () {}
        };
        expect(() => bot.register(plugin, () => {})).to.throw();

        done();
      });

      it('throws an error if `plugin.name` is not a string', done => {
        let plugin = {
          register: function () {},
          name: {}
        };
        debugger;
        expect(() => bot.register(plugin, () => {})).to.throw();

        done();
      });

      it('aliases `plugin.pkg.name` to `plugin.name`', done => {
        let plugin = {
          register: function (options, expose, next) { next() },
          pkg: {
            name: 'name'
          }
        };
        bot.register(plugin, () => done());
      });

      it('throws an error if the plugin has already been registered', done => {
        let plugin = {
          register: function (options, expose, next) { next(); },
          name: 'name'
        };
        expect(() => bot.register([plugin, plugin], () => {})).to.throw();

        done();
      });

      it('calls the plugin with options, an expose function and a callback', done => {
        let plugin = {
          register: function (options, expose, next) {
            expect(options).to.be.an.object();
            expect(expose).to.be.a.function();
            expect(next).to.be.a.function();

            done();
          },
          name: 'name'
        };
        bot.register(plugin, () => {});
      });

      it('binds the bot instance to this', done => {
        let plugin = {
          register: function (options, expose, next) {
            expect(this).to.equal(bot);

            done();
          },
          name: 'name'
        };
        bot.register(plugin, () => {});
      });

      it('accepts an object where `register` is the plugin function', done => {
        let plugin = {
          register: function (options, expose, next) {
            done();
          },
          name: 'name'
        };
        bot.register(plugin, () => {});
      });

      it('calls `register` with the provided `options` if available', done => {
        let plugin = {
          name: 'name',
          options: {
            hello: 'world'
          },
          register: function (options, expose, next) {
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
        let plugin1 = {
          name: 'plugin1',
          register: function (options, expose, next) {
            count++;
            next();
          }
        };

        let plugin2 = {
          name: 'plugin2',
          register: function (options, expose, next) {
            count++;
            next();
          }
        };

        const plugins = [plugin1, plugin2];
        bot.register(plugins, () => {
          expect(count).to.equal(plugins.length);

          done();
        });
      });
    });
  });

  describe('expose', () => {
    it('adds the given `value` to the `key` under the plugins namespace', done => {
      bot.plugins.name = {};
      bot.expose('name', 'test', 123);
      expect(bot.plugins.name.test).to.equal(123);

      done();
    });

    it('combines the current plugin namespace with the passed object when passed an object', done => {
      bot.plugins.name = {};
      bot.expose('name', {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz'
      });
      expect(bot.plugins.name.foo).to.equal('foo');
      expect(bot.plugins.name.bar).to.equal('bar');
      expect(bot.plugins.name.baz).to.equal('baz');

      done();
    });

    it('does nothing if passed something other than a `string` or `object` as `key`', done => {
      bot.plugins.name = {};
      bot.expose('name', function() {});
      expect(Object.keys(bot.plugins.name).length).to.equal(0);

      done();
    });
  });
});
