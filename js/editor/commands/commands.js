define(['jquery'],

function($){

  var commands = {};
  var Commands = function() {
    return {
      register: function(name, Command) {
        if ($.isFunction(Command)) {
          commands[name] = Command;
        }
      },
      unregister: function(name) {
        delete commands[name];
      },
      execute: function(name, options) {
        var cmd = new commands[name](options);
        if (options.context) {
          return $.proxy(cmd.execute, options.context)();
        } else {
          return $.proxy(cmd.execute, cmd)();
        }
      }
    }
  }

  return Commands;
});
