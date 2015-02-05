define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var DeleteBehavior = Backbone.Marionette.Behavior.extend({
    onDelete: function() {
      console.log("Do editor delete");
      Backbone.Wreqr.radio.commands.execute( 'editor', 'clear');
    }
  });

  return DeleteBehavior;
});
