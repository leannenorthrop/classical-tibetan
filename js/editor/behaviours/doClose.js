define(['jquery',
        'bootstrap',
        'marionette',
        'cookies',
        'editor/models/document',
        'underscore',
        'github',
        'editor/views/configDocument'],
function(Jquery, Bootstrap, Marionette, Cookies, DocumentModel, _, GitHub, ConfigDocumentView){

  var OnCloseBehavior = Backbone.Marionette.Behavior.extend({
    onClose: function(event) {
      console.log("Do editor close");
      if (event.save) {
        var modalView = new ConfigDocumentView({model:this.view.model, onSave: this.doSave});
        modalView.render();
      } else {
        model.set("currentDocument", new DocumentModel({name: "New"}));
        view.getRegion('editor').currentView.setText(model.get("currentDocument").get("text"));
      }
    },
    doSave: function(doc) {
      var options = {onSave: function() {
        Backbone.Wreqr.radio.commands.execute( 'editor', 'update-index');
      }};
      Backbone.Wreqr.radio.commands.execute( 'editor', 'save', doc, options);
    }
  });

  return OnCloseBehavior;
});
