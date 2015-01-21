define(["jquery",
        "backbone",
        "marionette",
        "editor/views/layout",
        "editor/views/editor",
        "editor/views/preview"],

  function($, Backbone, Marionette, Layout,
           EditorView, PreviewView) {
    var EditorApp = new Backbone.Marionette.Application({});
    EditorApp.behaviours = {};
    Marionette.Behaviors.behaviorsLookup = function() {
        return EditorApp.behaviours;
    }

    EditorApp.addInitializer(function(options){
      /*
      EditorApp.alert = new AlertView();
      EditorApp.alert.render();
      $("body").append(EditorApp.alert.el);
define(['jquery', 'bootstrap'], function(Jquery, Bootstrap){
  var Alert = (function(jq, bs){
    return function(options) {
      return {
        execute: function() {
          if (!options.mode) {
            options.mode = "info";
          }
          jq("div.modal-content").attr( "class", "modal-content panel-" + options.mode);
          jq("div.modal-body").html(options.msg);
          if (options.title) {
            jq("h4.modal-title").html(options.title);
          }
          jq("div.modal").modal(options);
          jq("div.modal").modal('show');
        }
      }
    };
  })(Jquery, Bootstrap);

  return Alert;
});

      */

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

      // This kicks off the rest of the app, through the router
      /*layoutRender.done(function(){
        Backbone.history.start();
      });*/
    });

    return EditorApp;
});
