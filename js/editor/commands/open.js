define(['editor/app', "editor/models/document"],
function(App, DocumentModel) {

  App.editor.open = function(file) {
      var doc = new DocumentModel({file: file});
      // Set new current document for triggering ui changes after opening
      App.editor.model.set("currentDocument", doc);

      // Open document
      doc.open();
  };

});
