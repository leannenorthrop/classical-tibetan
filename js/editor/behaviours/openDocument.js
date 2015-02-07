define(['jquery', 'bootstrap', 'marionette', "editor/models/document", "fileSaver"],
  function(Jquery, Bootstrap, Marionette, DocumentModel, FileSaver){
  var OpenDocumentBehavior = Backbone.Marionette.Behavior.extend({
    __name__: 'OpenDocumentBehaviour',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
  });

  OpenDocumentBehavior.read = function(file, cb) {
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();
      reader.onload = function(e) {
        cb(reader.result, null);
      }
      reader.readAsText(file);
    } else {
      cb(null, "File not supported!");
    }
  };

  OpenDocumentBehavior.write = function(name, text) {
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    new FileSaver(blob, name);
  };

  OpenDocumentBehavior.open = function() {
    this.load().open();
  };

  OpenDocumentBehavior.load = function(options) {
    var doc = this.options.doc;
    var view = this.options.view;
    if (doc) {
      if (options && options.refresh) {
        doc.set("text","");
      }
      doc.listenToOnce(doc, "change:text", function() {
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
