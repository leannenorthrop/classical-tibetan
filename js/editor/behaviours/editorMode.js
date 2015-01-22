define(['jquery',
        'bootstrap',
        'marionette',
        "editor/models/document",
        "editor/behaviours/openDocument"],
  function(Jquery, Bootstrap, Marionette, DocumentModel, OpenDocument){
  var EditorModeChangeBehavior = Backbone.Marionette.Behavior.extend({
    modelEvents: {
      "change:mode": "onModeChange"
    },

    onModeChange: function() {
      if (this.view) {
        var view = this.view;
        var model = this.view.model;
        var editorState = model.get("state");

        if (editorState === "help") {
          var toolbar = view.getRegion('toolbar').currentView;
          var mode = toolbar.currentMode();
          model.currentDocument = new DocumentModel({name: mode.file, category: "help"});
          this.options.model = model;
          this.options.view = view;
          this.options.doc = model.currentDocument;
          this.open();
        } else {
          if (model.currentDocument.category === "help") {
            model.currentDocument = new DocumentModel({name: "New"});
          } else {
            model.currentDocument = new DocumentModel({name: "New"});
          }
        }
      }
    }
  });

  _.extend( EditorModeChangeBehavior.prototype, OpenDocument);

  return EditorModeChangeBehavior;
});
