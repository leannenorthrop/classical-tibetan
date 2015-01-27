define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var OnCloseBehavior = Backbone.Marionette.Behavior.extend({
    onClose: function(event) {
      console.log("Do editor close");
      var view = this.view;
      var model = this.view.model;
      if (event.save) {
        var doc = model.get("currentDocument");
        doc.set("category", "lesson");
        doc.set("tags", ["stage0","something"]);

        var name = doc.get("created") + "-" + doc.get("name");
        doc.close({name: name, save:true});
      } else {
        model.set("currentDocument", new DocumentModel({name: "New"}));
        view.getRegion('editor').currentView.setText(model.get("currentDocument").get("text"));
      }
    }
  });

  return OnCloseBehavior;
});
