define(['jquery', 'bootstrap', 'marionette', "markdown"], function(Jquery, Bootstrap, Marionette, Markdown){
  var markdown = Markdown;
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
