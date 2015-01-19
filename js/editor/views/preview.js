define(["jquery",
        "backbone",
        "marionette",
        "editor/models/preview"],
function($, Backbone, Marionette, PreviewModel) {
  var PreviewView = Backbone.Marionette.ItemView.extend({
    model: new PreviewModel(),
    template: false,
    id: "preview",
    initialize: function(options) {
      this.listenTo(this.model, "change", this.updatePreview);
    },
    updatePreview: function() {
      var text = this.model.get("text");
      this.$el.html(text);
    }
  });

  return PreviewView;
});
