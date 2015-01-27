define(['jquery', 'bootstrap', 'marionette', "editor/models/document", "fileSaver"],
  function(Jquery, Bootstrap, Marionette, DocumentModel, FileSaver){
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

  OpenDocumentBehavior.write = function(name, text) {
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    new FileSaver(blob, name);
  };

  OpenDocumentBehavior.open = function() {
    this.load().open();
  };

  OpenDocumentBehavior.import = function() {
    this.load();
    this.read(this.options.doc.get("file"));
  };

  OpenDocumentBehavior.load = function() {
    var doc = this.options.doc;
    var view = this.options.view;
    if (doc) {
      this.listenToOnce(doc, "change:text", function() {
        view.getRegion('editor').currentView.setText(doc.get("text"));
      });
      return doc;
    } else {
      console.log("Expecting view, model and doc in options.")
    }
    return undefined;
  };

  return OpenDocumentBehavior;
});
