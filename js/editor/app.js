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

    EditorApp.on("before:start", function(options){
      // Render the layout and get it on the screen, first
      var layout = new Layout();
      EditorApp.layout = layout;
      var layoutRender = EditorApp.layout.render();
      $("body").append(EditorApp.layout.el);

      var preview = new PreviewView({});
      var editor = new EditorView({});
      EditorApp.preview = preview;
      EditorApp.editor = editor;
      layout.getRegion('leftColumn').show(editor);
      layout.getRegion('rightColumn').show(preview);
    });

    EditorApp.on("start", function(options){
      if (Backbone.history){
        require(['editor/controller'], function(appController) {
          EditorApp.context = "";
          EditorApp.Router = new Marionette.AppRouter({
            controller: appController,
            appRoutes: {
              "help/:file": "help",
              "open/:file": "open",
              "new/:mode": "newDocument",
              "contribute": "contribute",
              "private": "personal"
            }});

          Backbone.history.start();
          Backbone.Wreqr.radio.commands.execute( 'editor', 'navigate', "help", "2015-01-01-gettingstarted.md" );

        });
      }
    });
    require(['editor/commands'], function(Commands){});

    return EditorApp;
});
