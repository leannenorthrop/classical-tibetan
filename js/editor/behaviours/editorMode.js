define(['jquery',
        'bootstrap',
        'marionette'],
  function(Jquery, Bootstrap, Marionette){
  var EditorModeChangeBehavior = Backbone.Marionette.Behavior.extend({
    __name__: 'EditorModeChangeBehaviour',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    modelEvents: {
      "change:mode": "onModeChange"
    },

    onModeChange: function() {
      if (this.view) {
        var view = this.view;
        var model = this.view.model;
        var editorState = model.get("state");
        var editorMode = model.get("mode");

        if (editorState === "help") {
          var file = editorMode.substr(5);
          Backbone.Wreqr.radio.commands.execute( 'editor', 'open', file);
        } else {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'new');
        }
      }
    }
  });

  return EditorModeChangeBehavior;
});
