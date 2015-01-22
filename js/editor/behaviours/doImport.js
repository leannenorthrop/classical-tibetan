define(['jquery', 'bootstrap', 'marionette', 'editor/behaviours/openDocument'],
  function(Jquery, Bootstrap, Marionette, OpenDocument){
  var ImportBehavior = Backbone.Marionette.Behavior.extend({
    onImport: function(event) {
      console.log("Do editor import");
      this.options.view = this.view;
      this.options.model = this.view.model;
      this.options.doc = this.view.model.currentDocument;
      this.options.doc.set("file", event.file);
      this.import();
    }
  });

  _.extend(ImportBehavior.prototype, OpenDocument);

  return ImportBehavior;
});
