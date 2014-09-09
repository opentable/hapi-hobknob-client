hapi-hobknob-client
===================

A Hobknob client initialisation plugin for Hapi. This is used so the Hobknob client can be initialised as part of the plugin pipeline. 

[![Build Status](https://travis-ci.org/opentable/hapi-hobknob-client.svg)](https://travis-ci.org/opentable/hapi-hobknob-client)

[![NPM](https://nodei.co/npm/hapi-hobknob-client.png)](https://nodei.co/npm/hapi-hobknob-client)

Usage:

```javascript

var Client = require("hobknob-client-nodejs"), 
    server = hapi.createServer();

server.pack.register({
  plugin: require("hapi-hobknob-client"),
  options: {
    client: new Client("application-name", { etcdHost: "127.0.0.1", etcdPort: 4001 }),
    log: function(msg){}
  }
});

```