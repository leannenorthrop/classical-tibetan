define(['editor/app', "editor/models/document"],
function(App, DocumentModel) {

  App.editor.newfile = function() {
      var doc = new DocumentModel();
      // Set new current document for triggering ui changes after opening
      App.editor.model.set("currentDocument", doc);

      // Open document
      doc.trigger("change:text");
  };

});
