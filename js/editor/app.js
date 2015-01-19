define(["jquery",
        "backbone",
        "marionette",
        "editor/views/app",
        "editor/views/editor",
        "editor/views/preview",
        "editor/views/alert",
        "editor/commands/init",
        "markdown"],

  function($, Backbone, Marionette, Layout, EditorView, PreviewView, AlertView, Commands, Markdown) {
    var markdown = Markdown;
    var EditorApp = new Backbone.Marionette.Application({
      updatePreview: function() {
        //if (model.get("mode") === "plain-wylie") {
        //  text = "~~\n" + text + "\n~~";
        //}
        var tree = markdown.parse(EditorApp.editorModel.get("text"), "ExtendedWylie");
        var jsonml = markdown.toHTMLTree( tree );
        var html = markdown.renderJsonML( jsonml );
        EditorApp.previewModel.set("text", html);
      }
    });

    EditorApp.addInitializer(function(options){
      // Init Commands
      EditorApp.commands = Commands;

      /*
      EditorApp.alert = new AlertView();
      EditorApp.alert.render();
      $("body").append(EditorApp.alert.el);
      */

      // Render the layout and get it on the screen, first
      EditorApp.layout = new Layout();
      var layoutRender = EditorApp.layout.render();
      $("body").append(EditorApp.layout.el);

      var editor = new EditorView({app:EditorApp});
      var preview = new PreviewView({app: EditorApp});

      EditorApp.layout.getRegion('leftColumn').show(editor);
      EditorApp.layout.getRegion('rightColumn').show(preview);

      EditorApp.editorModel = editor.model;
      EditorApp.previewModel = preview.model;
      EditorApp.listenTo(EditorApp.editorModel, "change", EditorApp.updatePreview);

      // This kicks off the rest of the app, through the router
      /*layoutRender.done(function(){
        Backbone.history.start();
      });*/
    });

    return EditorApp;
});
