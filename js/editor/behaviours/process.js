define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var ProcessBehavior = Backbone.Marionette.Behavior.extend({
    modelEvents: {
      "change:text": "onTextChange"
    },

    onTextChange: function() {
      if (this.view.app) {
        var editorView = this.view.app.editor;
        var previewView = this.view.app.preview;
        var editorModel = editorView.model.get("editor");
        var previewModel = previewView.model;

        var text = editorModel.get("text");
        editorView.model.get("currentDocument").set("text", text);

        //if (model.get("mode") === "plain-wylie") {
        //  text = "~~\n" + text + "\n~~";
        //}
        var tree = markdown.parse(text, "ExtendedWylie");
        var jsonml = markdown.toHTMLTree( tree );
        var html = markdown.renderJsonML( jsonml );
        previewModel.set("text", html);
      }
    }
  });

  return ProcessBehavior;
});