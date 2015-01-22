define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var ConfigEditorBehavior = Backbone.Marionette.Behavior.extend({
    onConfig: function() {
      console.log("Do editor config");
    }
  });

  return ConfigEditorBehavior;
});
