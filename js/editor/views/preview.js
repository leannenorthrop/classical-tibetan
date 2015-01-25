define(["jquery",
        "backbone",
        "marionette",
        "editor/models/document"],
function($, Backbone, Marionette, DocumentModel) {
  var PreviewView = Backbone.Marionette.ItemView.extend({
    model: new DocumentModel(),
    template: false,
    id: "preview",
    modelEvents: {
      "change:text": function() {
        var text = this.model.get("text");
        this.$el.html(text);
        this.$el.find('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
      },
    }
  });

  return PreviewView;
});
