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
      next(err);
    }

    plugin.log(["hoknob-client"], "Hobknob initialized");
    next();

  });
};

exports.register.attributes = {
  pkg: require('./package.json')
};
