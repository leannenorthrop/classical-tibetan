define(["jquery",
        "backbone",
        "marionette",
        "editor/views/layout",
        "editor/views/editor",
        "editor/views/preview"],

  function($, Backbone, Marionette, Layout,
           EditorView, PreviewView) {
    var EditorApp = new Backbone.Marionette.Application({channelName: "editor"});

    // Behaviours
    EditorApp.behaviours = {};
    Marionette.Behaviors.behaviorsLookup = function() {
        return EditorApp.behaviours;
    }

    EditorApp.on("start", function(options){
      // Render the layout and get it on the screen, first
      var layout = new Layout();
      EditorApp.layout = layout;
      var layoutRender = EditorApp.layout.render();
      $("body").append(EditorApp.layout.el);

      var preview = new PreviewView({app: EditorApp});
      var editor = new EditorView({app:EditorApp});
      EditorApp.preview = preview;
      EditorApp.editor = editor;
      layout.getRegion('leftColumn').show(editor);
      layout.getRegion('rightColumn').show(preview);
      editor.mode("help-file-_posts/2015-01-01-markdown.md");
      preview.format("html");

      if (Backbone.history){
        Backbone.history.start();
      }
    });

    require(['editor/commands'], function(Commands){});

    return EditorApp;
});
