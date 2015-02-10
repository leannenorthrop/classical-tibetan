define(['editor/app'],
function(App) {

  App.editor.newfile = function() {
    require(["editor/models/document"], function(DocumentModel) {
      var doc = new DocumentModel();
      // Set new current document for triggering ui changes after opening
      App.editor.model.set("currentDocument", doc);

      // Open document
      doc.trigger("change:text");
    });
  };

});
