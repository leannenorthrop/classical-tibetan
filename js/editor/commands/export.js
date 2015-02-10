define(['editor/app'],
function(App) {
  App.export = function(doc) {
    require(['fileSaver'], function(FileSaver){
      var name = doc.get("name");
      if (name.lastIndexOf("/") >= 0) {
        name = name.substr(name.lastIndexOf("/")+1);
      }
      var blob = new Blob([doc.get("text")], {type: "text/plain;charset=utf-8"});
      new FileSaver(blob, name);
    });
  };

});
