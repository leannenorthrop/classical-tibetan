define(['editor/app'],
function(App) {
  App.read = function(file, onRead) {
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();
      reader.onload = function(e) {
        onRead(reader.result, null);
      }
      reader.readAsText(file);
    } else {
      onRead(null, "File not supported!");
    }
  };
});
