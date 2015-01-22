define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var OnToggleColumnSizeBehavior = Backbone.Marionette.Behavior.extend({
    onToggleColumnSize: function() {
      console.log("Do editor toggle column size");
    }
  });

  return OnToggleColumnSizeBehavior;
});
