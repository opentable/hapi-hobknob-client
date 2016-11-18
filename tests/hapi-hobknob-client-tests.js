'use strict';

const expect = require('expect.js');
const rewire = require('rewire');

const plugin = rewire('../index');

describe('hobknob plugin ', () => {
    describe('-- happy path', () => {
        describe('plugin initialised ', () => {

            function hobknobMock (applicationName, config){};

            hobknobMock.prototype.on =  function (name, cb) {
            };

            hobknobMock.prototype.initialise = function (cb) {
              cb();
            };

            hobknobMock.prototype.getOrDefault = function (name, defaultValue) {
              return true;
            };

            plugin.__set__('Client', hobknobMock);

            const server = {
                log: function(){},
                plugins: {
                  'hapi-hobknob-client' : { }
                },
                expose: function(key, value){
                    this.plugins['hapi-hobknob-client'][key] = value;
                }
            };

            const Hobknob = {
              etcdPort: 4001,
              cacheIntervalMs: 30000,
              etcdHost: 'hobknob-etcd-qa.otenv.com'
            }

            const options = {
                applicationName: 'cuisine-test',
                Hobknob
            };

            before(next => {
              plugin.register(server, options, err => {
                  next(err);
                });
            });

            it('should expose client', () => {
              expect(server.plugins).to.have.property('hapi-hobknob-client');
              expect(server.plugins['hapi-hobknob-client'].getOrDefault).to.be.a('function');
              expect(server.plugins['hapi-hobknob-client'].getOrDefault('test', false)).to.be.true;
            });
        });
    });

    describe('-- unhappy path', () => {
        describe('plugin not initialised when hobknob config missing', () => {

            const server = {
                log: function(){},
                plugins: {
                  'hapi-hobknob-client' : { }
                },
                expose: function(key, value){
                    this.plugins[key] = value;
                }
            };

            const options = {
                applicationName: 'cuisine-test'
            };

            before(next => {
              plugin.register(server, options, err => {
                  next(err);
                });
            });

            it('should not have plugin with matching name', () => {
              expect(server.plugins).to.have.property('hapi-hobknob-client');
              expect(server.plugins['hapi-hobknob-client'].getOrDefault).to.be.null;
            });
        });
    });
});
