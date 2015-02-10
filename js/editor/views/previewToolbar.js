define(["jquery",
        "backbone",
        "marionette",
        "bootstrap",
        "bootstrap.select",
        "text!templates/preview_toolbar.html"],

function($, Backbone, Marionette, Bootstrap, BootstrapSelect, Template) {
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
      var formatPicker = this.$el.find('.selectpicker');
      formatPicker.selectpicker({
        style: 'btn-default btn-sm',
        size: 7,
        mobile: true,
        showSubtext: true
      });
      /*try {
        var isFileSaverSupported = !!new Blob;
        if (isFileSaverSupported) {
          $("button.export").addClass("disabled");
        }
      } catch (e) {}
      this.updateFormat(this.parentView.model.get("format"));*/
    },
    currentFormat: function() {
        var formatSelect = $("#formatSelector option:selected");
        var selectedFormat = formatSelect.val();
        return selectedFormat;
    },
    updateFormat: function(format) {
      var formatSelect = $("#formatSelector option:selected");
      var selectedFormat = formatSelect.val();
      if (selectedFormat != format) {
        $('#formatSelector').selectpicker('val', format);
        $('#formatSelector').selectpicker('render');
        this.parentView.model.set("format", format);
      }
    },
    events: {
      "change @ui.formatSelector": function(){
        var formatSelect = $("#formatSelector option:selected");
        this.parentView.model.set("format", formatSelect.val());
      },
      "change @ui.saveBtn": function() {
        //Backbone.Wreqr.radio.commands.execute( 'editor', 'config-editor-doc');
      },
      "click @ui.exportBtn": function() {
        Backbone.Wreqr.radio.commands.execute( 'editor', 'export-preview');
      },
      "click @ui.screenBtn": function() {
        if ($("#left-col").width() === 0) {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'preview-normalsize');
        } else {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'preview-fullsize');
        }
      },
    },
    ui: {
      "formatSelector": "#formatSelector",
      "exportBtn": ".export",
      "saveBtn": ".save",
      "screenBtn": ".screen"
    }
  });

  return PreviewToolbarView;
});
