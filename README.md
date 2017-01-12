
# hapi-hobknob-client
> Hapi plugin for returning an initialised [hobknob client](https://github.com/opentable/hobknob-client-nodejs).

[![Build Status](https://travis-ci.org/opentable/hapi-hobknob-client.svg?branch=master)](https://travis-ci.org/opentable/hapi-hobknob-client)
[![Dependency Status](https://david-dm.org/opentable/hapi-hobknob-client.svg)](https://david-dm.org/opentable/hapi-hobknob-client)
[![devDependency Status](https://david-dm.org/opentable/hapi-hobknob-client/dev-status.svg)](https://david-dm.org/opentable/hapi-hobknob-client#info=devDependencies)
[![npm version](https://badge.fury.io/js/hapi-hobknob-client.svg)](https://badge.fury.io/js/hapi-hobknob-client)

## Usage
```bash
$ npm i hapi-hobknob-client --save
```


```javascript
var server = new (require('hapi').Server)();
server.connection({ port: 3000 });

server.register([
    {
        register: require('hapi-hobknob-client'),
        options = {
          applicationName: 'the-name-of-your-app-in-hobknob',
          Hobknob : {
            etcdPort: 4001,
            cacheIntervalMs: 30000,
            etcdHost: 'your-etcd-host-here'
          }
        }
    }
], function (err) {
    if (err) {
        console.error('Failed to load plugin:', err);
    }

    server.start();
});

//server can be found on the request object if you don't have server in the current function
const testToggleEnabled = server.plugins['hapi-hobknob-client'].getOrDefault('testToggle', true);

```

## Configuration

All config values are unchanged as per [hobknob client](https://github.com/opentable/hobknob-client-nodejs).

## Release History

v2.0.0 - Richard Wright 04-01-2017
 
