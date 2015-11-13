define(["jquery",
        "backbone",
        "marionette",
        "bootstrap",
        "text!templates/preview_toolbar.html"],

function($, Backbone, Marionette, Bootstrap, Template) {
  var template = Template;

  var PreviewToolbarView = Backbone.Marionette.ItemView.extend({
    __name__: 'PreviewToolbarView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    getTemplate: function(){
      return _.template(template);
    },
    initialize: function(options){
      this.parentView = options.parent;
    },
    onRender: function() {
      $('.dropdown-toggle').dropdown();
    },
    currentFormat: function() {
        var selectedFormat = this.$el.find('#currentFormatLabel').attr("data-value");
        return selectedFormat;
    },
    updateFormat: function(format) {
      try {
        var selectedFormat = this.parentView.model.get("format");
        var selectedText = this.$el.find('.dropdown-menu-item[data-value="'+selectedFormat+'"]').text().trim();
        this.$el.find('#currentFormatLabel').html(selectedText).attr("data-value", selectedFormat);
      } catch(e){console.log(e);}
    },
    events: {
      "click .dropdown-menu-item": function(e){
        var formatMenu = $(e.currentTarget);
        var selectedFormat = formatMenu.attr("data-value");
        this.parentView.model.set("format", selectedFormat);
        Backbone.Wreqr.radio.commands.execute( 'editor', 'preview-doc');
      },
      "click @ui.saveBtn": function() {
        Backbone.Wreqr.radio.commands.execute( 'editor', 'save', this.model);
      },
      "click @ui.exportBtn": function() {
        Backbone.Wreqr.radio.commands.execute( 'editor', 'export-preview');
      },
      "click @ui.screenBtn": function() {
        if ($(".left-side").width() === 0) {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'preview-normalsize');
        } else {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'preview-fullsize');
        }
      },
    },
    ui: {
      "formatSelector": "#format-menu",
      "exportBtn": "#preview-export",
      "saveBtn": "#preview-save",
      "screenBtn": "#preview-resize"
    }
  });

  return PreviewToolbarView;
});
