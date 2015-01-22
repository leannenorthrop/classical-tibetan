define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var OnOpenBehavior = Backbone.Marionette.Behavior.extend({
    onOpen: function() {
      console.log("Do editor open");
    }
  });

  return OnOpenBehavior;
});
