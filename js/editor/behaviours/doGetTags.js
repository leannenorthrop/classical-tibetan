define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var OnGetTagsBehavior = Backbone.Marionette.Behavior.extend({
    onSetTags: function() {
      console.log("Do editor tags");
    }
  });

  return OnGetTagsBehavior;
});
