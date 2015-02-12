define(['editor/app'], function(App) {
  var EditorController = {
    help: function(file){
      App.editor.mode("help-file-_posts/"+file);
    },
    open: function(file){
      Backbone.Wreqr.radio.commands.execute( 'editor', 'open-file', '_posts/'+file);
    },
    newDocument: function(mode) {
      Backbone.Wreqr.radio.commands.execute( 'editor', 'new');
      App.editor.mode(mode);
    },
    contribute: function() {
      Backbone.Wreqr.radio.commands.execute( 'editor', 'layout', 'contribute');
    },
    personal: function() {
      Backbone.Wreqr.radio.commands.execute( 'editor', 'layout', 'private');
    }
  };
  return EditorController;
});
