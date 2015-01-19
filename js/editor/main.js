define(["jquery",
        "backbone",
        "marionette",
        "editor/views/preview",
        "editor/views/editor",
        "editor/commands/init",
        "editor/app"],

  function($, Backbone, Marionette, PreviewView, EditorView, Commands, App) {
    /*var commands = Commands;
    $(function() {
      var preview = new PreviewView({el: $("#content")});
      var editor = new EditorView({el: $("#left-col"), cmds: commands});
      editor.render();
      preview.model.listenTo(editor.model, "change", preview.process);
    });*/

  $(function(){
    App.start({});
  });
});
