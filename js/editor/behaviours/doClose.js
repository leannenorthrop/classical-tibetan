define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var OnCloseBehavior = Backbone.Marionette.Behavior.extend({
    onClose: function() {
      console.log("Do editor close");
    }
  });

  return OnCloseBehavior;
});
