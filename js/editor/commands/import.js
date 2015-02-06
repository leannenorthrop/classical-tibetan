define(['editor/app','editor/behaviours/openDocument'],
function(App, DocumentHandler) {
  App.read = function(file, onRead) {
    DocumentHandler.read(file, onRead);
  };
});
