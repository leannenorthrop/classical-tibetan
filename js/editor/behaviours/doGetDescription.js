define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var OnSetDescription = Backbone.Marionette.Behavior.extend({
    onSetDescription: function() {
      console.log("Do editor description");
    }
  });

  return OnSetDescription;
});
