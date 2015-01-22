define(['jquery', 'bootstrap', 'marionette', "editor/models/document"],
  function(Jquery, Bootstrap, Marionette, DocumentModel){
  var OpenDocumentBehavior = Backbone.Marionette.Behavior.extend({});

  OpenDocumentBehavior.read = function(file) {
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();
      var me = this;
      reader.onload = function(e) {
        var txt = reader.result;
        // should save current document but for now simply overwrite
        me.options.doc.load(txt);
      }

      reader.readAsText(file);
    } else {
      fileDisplayArea.innerText = "File not supported!"
    }
  };

  OpenDocumentBehavior.open = function() {
    this.loadDocument().open();
  };

  OpenDocumentBehavior.import = function() {
    this.loadDocument();
    this.read(this.options.doc.get("file"));
  };

  OpenDocumentBehavior.loadDocument = function() {
    var doc = this.options.doc;
    var view = this.options.view;
    if (doc) {
      this.listenToOnce(doc, "change:text", function() {
        var ace = view.getRegion('editor').currentView.markdownEditor;
        ace.setValue(doc.get("text"));
      });
      return doc;
    } else {
      console.log("Expecting view, model and doc in options.")
    }
    return undefined;
  };

  return OpenDocumentBehavior;
});
