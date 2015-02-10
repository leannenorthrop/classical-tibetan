define(['editor/app'],
function(App) {

  App.preview.update = function(text) {
    try {
      var previewView = App.preview;
      var previewModel = previewView.model;
      previewModel.set("text", text);
    } catch (e) {
      console.log("Unable to update preview. Error:");
      console.log(e);
    }
  };

});
