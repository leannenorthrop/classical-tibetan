define(["jquery",
        "backbone",
        "marionette",
        "editor/views/previewToolbar",
        "editor/models/document",
        "text!templates/preview_layout.html",
        "editor/behaviours/editorToolbar"],
function($, Backbone, Marionette, ToolbarView, DocumentModel, Template, Behaviours) {
  var template = Template;
  var PreviewView = Backbone.Marionette.LayoutView.extend({
    __name__: 'PreviewView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    initialize: function(options) {
      if (!this.model) {
        this.model = new DocumentModel();
      }
      this.app = options.app;
    },
    getTemplate: function(){
      return template;
    },
    regions: {
      toolbar: "#preview-toolbar",
      preview: "#preview-area"
    },
    onShow: function() {
      this.getRegion('toolbar').show(new ToolbarView({parent: this}));
    },
    format: function(name) {
      this.model.set("format", name);
    },
    modelEvents: {
      "change:text": function() {
        var text = this.model.get("text");
        $('#preview-area').html(text);
        $('#preview-area').find('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
      },
      "change:format": function() {
        this.getRegion('toolbar').currentView.updateFormat(this.model.get("format"));
      }
    }
  });

  _.extend( PreviewView.prototype, Behaviours);

  return PreviewView;
});
