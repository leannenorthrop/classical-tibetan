define(["jquery",
        "backbone",
        "marionette"],
function($, Backbone, Marionette) {
  var PreviewView = Backbone.Marionette.LayoutView.extend({
    __name__: 'PreviewView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    template: false,
    id: 'preview-area',
    // Events
    modelEvents: {
      "change:text": "onTextChange",
      "change:format": "onFormatChange",
    },
    onFormatChange: function() {
      this.getRegion('toolbar').currentView.updateFormat(this.model.get("format"));
    },
    onTextChange: function() {
      var text = this.model.get("text");
      $('#preview-area').html(text);
      $('#preview-area').find('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
      });
    },
    onShow: function() {
      var view = this;
      view.addRegions({preview:{el: $("#preview-area")}});
      require(["editor/views/previewToolbar"], function(ToolbarView){
        view.addRegions({toolbar:{el: $("#preview-toolbar")}});
        view.getRegion('toolbar').show(new ToolbarView({parent: view}));
      });
    },

    format: function(name) {
      if (this.model) {
        this.model.set("format", name);
      }
    },
    initialize: function(options) {
      if (!this.model) {
        var view = this;
        require(["editor/models/document"], function(DocumentModel){
          view.model = new DocumentModel();
          view.listenTo(view.model, "change:text", view.onTextChange);
          view.listenTo(view.model, "change:format", view.onFormatChange);
        });
      }
    }
  });

  return PreviewView;
});
