exports.register = function(plugin, options, next) {
  plugin.log(["hoknob-client"], "Initializing Hobknob client");

  if (!options.client){
    next(new Error("Options.client does not exist"));
    return;
  }

  options.client.on("error", function(err) {
    plugin.log(["hobknob-client", "error"], err);
  });

  options.client.initialise(function(err){

    if (err){
        if (options.initFailsAreFatal) {
            next(err);
        } else {
            var highLevelError = new Error("The Hobknob client couldn't talk to the hobknob server, values will be the defaults until a sync successfully occurs");
            highLevelError.inner = err;
            plugin.log(["hoknob-client", "error"], highLevelError);
        }
    }

    plugin.log(["hoknob-client"], "Hobknob initialized");
    next();

  });
};

exports.register.attributes = {
  pkg: require('./package.json')
};
