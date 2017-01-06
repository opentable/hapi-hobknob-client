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

    const retryInitWrapper = function(callback, results) {

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
        times: 10,
        interval: function(retryCount) {
          let newInterval = 500 * Math.pow(3, retryCount);
          if(newInterval >= 120000) {
            newInterval = 120000;
          };
          return newInterval;
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
