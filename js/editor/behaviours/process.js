define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){

  var ProcessBehavior = Backbone.Marionette.Behavior.extend({
    modelEvents: {
      "change:text": "onTextChange"
    },
    onTextChange: function(e) {
      Backbone.Wreqr.radio.commands.execute( 'editor', 'preview-doc');
    }
  });

  return ProcessBehavior;
});
