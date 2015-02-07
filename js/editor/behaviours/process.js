define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){

  var ProcessBehavior = Backbone.Marionette.Behavior.extend({
    __name__: 'ProcessBehaviour',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    modelEvents: {
      "change:text": "onTextChange"
    },
    onTextChange: function(e) {
      Backbone.Wreqr.radio.commands.execute( 'editor', 'preview-doc');
    }
  });

  return ProcessBehavior;
});
