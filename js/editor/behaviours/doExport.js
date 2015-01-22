define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var ExportBehavior = Backbone.Marionette.Behavior.extend({
    onExport: function() {
      console.log("Do editor export");
    }
  });

  return ExportBehavior;
});
