define(['editor/app', "editor/views/alert"],
function(App, AlertView) {

  App.editor.clear = function() {
    App.editor.text("");
  };

});
