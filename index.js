'use strict';

let Client = require('hobknob-client-nodejs');

const init = function(server, config, next){

    const client = new Client(config.applicationName, config.Hobknob);

    let initialised = false;

    client.on('error', function(err){
        server.log(['hobknob', 'error'], err);

        initialised = false;
    });

    client.initialise(function(err){

      if(err){
        server.log(['hobknob', 'init','error'], err);
      } else {
        initialised = true;
      }

      server.expose('getOrDefault', function (name, defaultValue) {

        if(initialised){
          return client.getOrDefault(name, defaultValue);
        } else {
          return false;
        }
      });

      next();
    });
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
