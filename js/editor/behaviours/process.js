define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){

  var ProcessBehavior = Backbone.Marionette.Behavior.extend({
    modelEvents: {
      "change:text": "onTextChange"
    },
    onTextChange: function() {
      if (this.view.app) {
        var editorView = this.view.app.editor;
        var previewView = this.view.app.preview;
        var editorModel = editorView.model;
        var previewModel = previewView.model;

        var options = {};
        options.isWylieOnly = editorModel.get("mode") === "plain-wylie";
        if (editorModel.get("currentDocument")) {
          var html = editorModel.get("currentDocument").toHTML(options);
          previewModel.set("text", html);
        }
      }
    }
  });

  return ProcessBehavior;
});
