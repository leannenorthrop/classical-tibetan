define(["jquery",
        "backbone",
        "marionette",
        "editor/views/app",
        "editor/views/editor",
        "editor/views/preview",
        "editor/views/alert",
        "editor/commands/init",
        "markdown",
        "editor/models/editor",
        "editor/models/document"],

  function($, Backbone, Marionette, Layout,
           EditorView, PreviewView, AlertView,
           Commands, Markdown, EditorModel, DocumentModel) {
    var markdown = Markdown;

    var EditorApp = new Backbone.Marionette.Application({
      updatePreview: function() {
        var editorView = EditorApp.layout.getRegion('leftColumn').currentView;
        var previewView = EditorApp.layout.getRegion('rightColumn').currentView;
        var documentModel = editorView.model.get("currentDocument");
        var previewModel = previewView.model;

        //if (model.get("mode") === "plain-wylie") {
        //  text = "~~\n" + text + "\n~~";
        //}
        var tree = markdown.parse(documentModel.get("text"), "ExtendedWylie");
        var jsonml = markdown.toHTMLTree( tree );
        var html = markdown.renderJsonML( jsonml );
        previewModel.set("text", html);
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

      var preview = new PreviewView({app: EditorApp, model: new DocumentModel()});
      var editor = new EditorView({model: new EditorModel(), app:EditorApp});

      EditorApp.layout.getRegion('leftColumn').show(editor);
      EditorApp.layout.getRegion('rightColumn').show(preview);

      EditorApp.listenTo(editor.model.get("currentDocument"), "change", EditorApp.updatePreview);

      // This kicks off the rest of the app, through the router
      /*layoutRender.done(function(){
        Backbone.history.start();
      });*/
    });

    return EditorApp;
});
