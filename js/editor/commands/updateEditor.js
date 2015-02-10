define(['editor/app'],
function(App) {

  App.editor.update = function(text) {
    try {
      App.editor.text(text);
    } catch (e) {
      console.log("Unable to update editor. Error:");
      console.log(e);
    }
  };

});
