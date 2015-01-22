define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var DeleteBehavior = Backbone.Marionette.Behavior.extend({
    onDelete: function() {
      console.log("Do editor delete");
      var view = this.view;
      var doc = this.view.model.get("currentDocument");
      this.listenToOnce(doc, "change:text", function() {
        var ace = view.getRegion('editor').currentView.markdownEditor;
        ace.setValue(doc.get("text"));
      });
      doc.set("text", "");
    }
  });

  return DeleteBehavior;
});
