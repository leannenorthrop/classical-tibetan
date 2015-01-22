define(['jquery', 'bootstrap', 'marionette', 'editor/behaviours/openDocument'],
        function(Jquery, Bootstrap, Marionette, OpenDocument){
  var OnOpenBehavior = Backbone.Marionette.Behavior.extend({
    onOpen: function(event) {
      console.log("Do editor open");
      this.options.view = this.view;
      this.options.model = this.view.model;
      this.options.doc = this.view.model.currentDocument;
      this.options.doc.set("file", this.options.file);
      this.loadDocument(this.options.file).open();
    }
  });

  _.extend( OnOpenBehavior.prototype, OpenDocument);

  return OnOpenBehavior;
});
