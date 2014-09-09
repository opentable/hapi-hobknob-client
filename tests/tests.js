describe('Hobknob initialisation tests', function(){

  var should = require('should');

  it('should initilise a Hobknob client', function(done){

    var p = require('../index.js'),
      plugin = {
        log: function(){}
      },
      isInitialised = false,
      client = {
        initialise: function(callback){
          isInitialised = true;
          callback();
        }
      };

    p.register(plugin, {
      client: client
    }, function(err){
      isInitialised.should.equal(true);
      done(err);
    });
  });

});