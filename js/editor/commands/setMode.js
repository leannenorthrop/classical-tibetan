define(['editor/app'], function(App) {
  App.editor.setMode = function() {
    var view = App.editor;
    var model = view.model;
    var editorState = model.get("state");
    var editorMode = model.get("mode");

    if (editorState === "help") {
      var file = editorMode.substr(5);
      Backbone.Wreqr.radio.commands.execute( 'editor', 'open-file', file);
    } else {
      Backbone.Wreqr.radio.commands.execute( 'editor', 'new');
    }
  };
});
