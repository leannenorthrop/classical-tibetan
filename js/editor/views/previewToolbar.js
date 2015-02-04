define(["jquery",
        "backbone",
        "marionette",
        "bootstrap",
        "bootstrap.select",
        "text!templates/preview_toolbar.html"],

function($, Backbone, Marionette, Bootstrap, BootstrapSelect, Template) {
  var template = Template;

  var PreviewToolbarView = Backbone.Marionette.ItemView.extend({
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
      try {
        var isFileSaverSupported = !!new Blob;
        if (isFileSaverSupported) {
          $("button.export").addClass("disabled");
        }
      } catch (e) {}
      this.updateFormat(this.parentView.model.get("format"));
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
    fire: function(name, options) {
      console.log("Preview toolbar trigger " + name + " " + options);
      this.parentView.triggerMethod(name, options);
    },
    events: {
      "change @ui.formatSelector": function(){
        var formatSelect = $("#formatSelector option:selected");
        this.parentView.model.set("format", formatSelect.val());
      },
      "change @ui.saveBtn": function() {
        this.fire("Close", {preview: true, save: true});
      },
      "click @ui.exportBtn": function() {
        this.fire("Export", {});
      },
      "click @ui.screenBtn": function() {
        this.fire("ToggleColumnSize", {col: "rightColumn"});
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
