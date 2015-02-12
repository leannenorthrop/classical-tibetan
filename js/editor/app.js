define(["jquery",
        "backbone",
        "marionette",
        "editor/views/layout",
        "editor/views/editor",
        "editor/views/preview"],

  function($, Backbone, Marionette, Layout,
           EditorView, PreviewView) {
    var EditorApp = new Backbone.Marionette.Application({channelName: "editor"});

    require(['editor/utils'], function() {
      var gitHubCode = EditorApp.utils.getUrlParameter("code");
      if (gitHubCode) {
        $.ajaxSetup({
          'beforeSend': function(xhr) {
            xhr.setRequestHeader("Access-Control-Allow-Origin", "'*'");
          }
        });
        var jqxhr = $.post("https://github.com/login/oauth/access_token", {client_id:"a471bea0e772edefb748",client_secret:"42be7bfc553b8c95b1d8c94ec608fcb0366df10f",code:gitHubCode}).always(function () {
          console.log(jqxhr);
        });
      }
      EditorApp.trigger("change:style", EditorApp.utils.getUrlParameter("layout"));
    });

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
      editor.listenTo(this, "change:style", editor.onSetStyle);
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
              "new/:mode": "newDocument"
            }});

          Backbone.history.start();

          $(".site-wrapper").remove();
          $('link[rel=stylesheet][href~="../css/cover.css"]').remove();
          EditorApp.utils.loadCss("../css/editor.css");

          Backbone.Wreqr.radio.commands.execute( 'editor', 'wait', false);
          Backbone.Wreqr.radio.commands.execute( 'editor', 'navigate', "help", "2015-01-01-gettingstarted.md" );
        });
      }
    });
    require(['editor/commands'], function(Commands){});

    return EditorApp;
});
