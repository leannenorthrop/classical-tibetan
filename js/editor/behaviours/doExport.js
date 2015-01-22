define(['jquery', 'bootstrap', 'marionette', 'editor/behaviours/openDocument'],
  function(Jquery, Bootstrap, Marionette, OpenDocument){
  var ExportBehavior = Backbone.Marionette.Behavior.extend({
    onExport: function() {
      console.log("Do editor export");
      var doc = this.view.model.get("currentDocument");
      var name = doc.get("name");
      if (name.indexOf("/") >= 0) {
        name = name.substr(name.lastIndexOf("/")+1);
      }
      this.write(name, doc.get("text"));
    }
  });

  _.extend(ExportBehavior.prototype, OpenDocument);

  return ExportBehavior;
});
