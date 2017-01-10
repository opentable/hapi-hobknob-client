'use strict';

const async = require('async');
let Client  = require('hobknob-client-nodejs');

const exposeFunction = function(server, client, initialised){
  server.expose('getOrDefault', function (name, defaultValue) {

    if(initialised){
        return client.getOrDefault(name, defaultValue);
    } else {
        return defaultValue;
    }
  });
};

const init = function(server, config, next){

    const client = new Client(config.applicationName, config.Hobknob);

    client.on('error', function(err){
        server.log(['hobknob', 'error'], err);
    });

    const retryInitWrapper = function(callback) {

      client.initialise(function(err){
        if(err){
            server.log(['hobknob', 'init','error'], err);
            exposeFunction(server, client, false);
            callback(err);
        } else {
            server.log(['hobknob', 'init'], 'hobknob now initialised');
            exposeFunction(server, client, true);
            callback(null, 'hobknob now initialised');
        }
      });
    };

    async.retry({
        //will retry for two weeks
        times: 14400,
        interval: function(retryCount) {
          const initialInterval = 250; // msec
          const maxInterval = 128000; // msec
          const jitter = Math.random() * (1.1 - 0.9) + 0.9; // [0.9 - 1.1]

          const interval = Math.min(maxInterval, initialInterval * Math.pow(2, retryCount - 1)) * jitter;

          server.log(['hobknob', 'init'], `retrying hobknob init no: ${retryCount}, interval: ${interval}`);

          return interval;
        }
      }, retryInitWrapper, function(err, result) {
        console.log('retry error:' + err);
        console.log('result: ' + result);
    });

    next();
};

module.exports.register = function(server, config, next){

  if(config.Hobknob){
      return init(server, config, next);
  }

  server.log(['hobknob', 'error'], 'hobknob config not found');

  next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
