define(["jquery",
        "backbone",
        "marionette",
        "editor/views/layout",
        "editor/views/editor",
        "editor/views/preview",
        "editor/views/alert"],

  function($, Backbone, Marionette, Layout,
           EditorView, PreviewView, AlertView) {
    var EditorApp = new Backbone.Marionette.Application({});

    // Behaviours
    EditorApp.behaviours = {};
    Marionette.Behaviors.behaviorsLookup = function() {
        return EditorApp.behaviours;
    }

    // Utilities
    EditorApp.alert = function(msg, type, heading) {
      var c, strong;
      switch(type) {
        case "info": c = "alert-info"; strong = "Information"; break;
        case "warning": c = "alert-warning"; strong = "Warning!"; break;
        case "danger": c = "alert-danger"; strong = "Error!"; break;
        case "success": default: c = "alert-success";strong = "Success!";break;
      }
      var alertView = new AlertView({c: c, message: msg, title: (heading?heading:strong)});
      alertView.show();
    };

    // Initalizer
    EditorApp.addInitializer(function(options){
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

      // This kicks off the rest of the app, through the router
      /*layoutRender.done(function(){
        Backbone.history.start();
      });*/
    });

    return EditorApp;
});
