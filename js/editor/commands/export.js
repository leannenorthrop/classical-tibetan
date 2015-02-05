define(['editor/app','editor/behaviours/openDocument'],
function(App, DocumentHandler) {
  App.export = function(doc) {
    var name = doc.get("name");
    if (name.lastIndexOf("/") >= 0) {
      name = name.substr(name.lastIndexOf("/")+1);
    }

    DocumentHandler.write(name, doc.get("text"));
  };

});
