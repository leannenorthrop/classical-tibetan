define(["jquery",
        "backbone",
        "marionette",
        "text!templates/alert.html"],

function($, Backbone, Marionette, Template) {
  var template = Template;
  var AlertView = Backbone.Marionette.ItemView.extend({
    getTemplate: function(){
      return template;
    }
  });

  return AlertView;
});
