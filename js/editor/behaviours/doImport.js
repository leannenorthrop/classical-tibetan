define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var ImportBehavior = Backbone.Marionette.Behavior.extend({
    onImport: function() {
      console.log("Do editor import");
    }
  });

  return ImportBehavior;
});
