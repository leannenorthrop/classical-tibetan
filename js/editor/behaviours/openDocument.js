define(['jquery', 'bootstrap', 'marionette', "editor/models/document"],
  function(Jquery, Bootstrap, Marionette, DocumentModel){
  var OpenDocumentBehavior = Backbone.Marionette.Behavior.extend({});
  OpenDocumentBehavior.open = function() {
    if (this.view && this.view.model && this.view.model.currentDocument) {
      var view = this.view;
      var model = view.model;
      this.listenToOnce(model.currentDocument, "change:text", function() {
        var ace = view.getRegion('editor').currentView.markdownEditor;
        ace.setValue(model.currentDocument.get("text"));
      });
      model.currentDocument.open();
    } else {
      console.log("Expecting a view model with defined currentDocument BackBone model.")
    }
  }

  return OpenDocumentBehavior;
});
