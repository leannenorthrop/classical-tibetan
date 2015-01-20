define(["jquery",
        "backbone",
        "marionette",
        "editor/models/document"],
function($, Backbone, Marionette, DocumentModel) {
  var PreviewView = Backbone.Marionette.ItemView.extend({
    model: new DocumentModel(),
    template: false,
    id: "preview",
    initialize: function(options) {
      this.listenTo(this.model, "change", this.updatePreview);
    },
    updatePreview: function(event) {
      var text = this.model.get("text");
      this.$el.html(text);
    }
  });

  return PreviewView;
});
