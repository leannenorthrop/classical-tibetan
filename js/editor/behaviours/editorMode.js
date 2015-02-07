define(['jquery',
        'bootstrap',
        'marionette',
        "editor/models/document",
        "editor/behaviours/openDocument"],
  function(Jquery, Bootstrap, Marionette, DocumentModel, OpenDocument){
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
          model.set("currentDocument", new DocumentModel({name: file, file: file, category: "help"}));
          this.options.model = model;
          this.options.view = view;
          this.options.doc = model.get("currentDocument");
          this.open();
        } else {
          model.set("currentDocument", new DocumentModel());
          view.getRegion('editor').currentView.setText(model.get("currentDocument").get("text"));
        }
      }
    }
  });

  _.extend( EditorModeChangeBehavior.prototype, OpenDocument);

  return EditorModeChangeBehavior;
});
