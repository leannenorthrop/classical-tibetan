define(['jquery', 'bootstrap', 'marionette'],
  function(Jquery, Bootstrap, Marionette, OpenDocument){
  var ImportBehavior = Backbone.Marionette.Behavior.extend({
    onImport: function(event) {
      console.log("Do editor import");
      Backbone.Wreqr.radio.commands.execute( 'editor', 'import-editor', event.file);
    }
  });

  return ImportBehavior;
});
