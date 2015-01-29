define(['jquery', 'bootstrap', 'marionette', 'cookies'],
  function(Jquery, Bootstrap, Marionette, Cookies){
  var OnCloseBehavior = Backbone.Marionette.Behavior.extend({
    onClose: function(event) {
      console.log("Do editor close");
      var view = this.view;
      var model = this.view.model;
      if (event.save) {
        var doc = model.get("currentDocument");
        doc.save({name: doc.get("name"),
                  username: $.cookie('gu'),
                  password: $.cookie('gp'),
                  uname: "leannenorthrop",
                  repositoryName: "classical-tibetan",
                  format: "article"});
      } else {
        model.set("currentDocument", new DocumentModel({name: "New"}));
        view.getRegion('editor').currentView.setText(model.get("currentDocument").get("text"));
      }
    }
  });

  return OnCloseBehavior;
});
