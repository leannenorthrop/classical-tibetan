define([
  'jquery',
  'underscore',
  'backbone',
  'editor/models/preview'
], function($, _, Backbone, PreviewModel){
  var PreviewView = Backbone.View.extend({
    initialize: function(options){
      if (!options.model) {
        this.model = new PreviewModel();
      }

      this.listenTo(this.model, "change", this.render);
    },
    render: function() {
      this.$el.html(this.model.attributes.text);
      return this;
    },
    process: function(model) {
      var text = model.get("text");
      var tree = markdown.parse(text, "ExtendedWylie");
      var jsonml = markdown.toHTMLTree( tree );
      var html = markdown.renderJsonML( jsonml );
      this.set("text", html);
    }
  });

  return PreviewView;
});
