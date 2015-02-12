define(["jquery",
        "backbone",
        "marionette",
        "text!templates/editor_app_layout.html"],

function($, Backbone, Marionette, Template) {
  var template = Template;
  var Layout = Backbone.Marionette.LayoutView.extend({
    __name__: 'ApplicationLayout',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    className: "editor-app",
    id: "content",
    getTemplate: function(){
      return template;
    },
    regions: {
      leftColumn: "#left-col",
      rightColumn: "#right-col"
    }
  });

  return Layout;
});
