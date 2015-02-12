define(['editor/app'], function(App) {

  var doc = null;
  require(["editor/models/document"], function(DocumentModel) {
    doc = new DocumentModel({file: 'post_index.json'});
  });

  var openDialog = function() {
    require(['editor/collections/help','editor/views/openDocument'],
      function(HelpFiles,OpenDocumentView){
        var jsonObj = $.parseJSON(doc.get("text"));
        var modalView = new OpenDocumentView({collection:new HelpFiles(jsonObj)});
        modalView.render();
      });
  };

  var showError = function() {
     Backbone.Wreqr.radio.commands.execute( 'editor', 'alert', "Unable to retrieve file list from GitHub. Lost internet connection?", "danger", "Error!" );
  };

  App.editor.open = function(file) {
    require(["editor/models/document"], function(DocumentModel) {
      var doc = new DocumentModel({file: file});
      // Set new current document for triggering ui changes after opening
      App.editor.model.set("currentDocument", doc);
      App.preview.format("html");

      // Open document
      doc.open();
    });
  };

  App.editor.openDlg = function() {
    require(["editor/models/document"], function(DocumentModel) {
      // Get fresh list of posts from GitHub to populate
      // dialog collection and display if no error
      doc.open({onSuccess: openDialog, onError: showError});
    });
  };

});
