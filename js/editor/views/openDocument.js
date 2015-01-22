define(["jquery",
        "backbone",
        "marionette",
        "text!templates/open_document.html"],

function($, Backbone, Marionette, Template) {
  var template = Template;
  var OpenDocumentModalView = Backbone.Marionette.ItemView.extend({
    getTemplate: function(){
      return _.template(template);;
    }
  });

  return OpenDocumentModalView;
});
