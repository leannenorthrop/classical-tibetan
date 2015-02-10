define(["jquery",
        "backbone",
        "marionette",
        "text!templates/editor_config_modal.html"],
function($, Backbone, Marionette, Template) {
  var template = Template;
  var ConfigEditorModalView = Backbone.Marionette.ItemView.extend({
    __name__: 'ConfigEditorView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    ui: {
      cancelBtn: '#editorConfigModal button.btn-default',
      saveBtn: '#editorConfigModal button.btn-primary'
    },
    events: {
      'click @ui.cancelBtn': 'onCancel',
      'click @ui.saveBtn': 'onSave'
    },
    getTemplate: function(){
      return _.template(template);
    },
    onRender: function() {
      $("body").append(this.el);
      $('#editorConfigModal').on('show.bs.modal', {view: this}, this.onDisplay);
      $('#editorConfigModal').modal({
        show: true,
        keyboard: true
      });
    },
    onDisplay: function(event) {
      try {
        var view = event.data.view;
        $('#editorConfigModal').on('hidden.bs.modal', {view: view}, view.onHidden);
        $("#editorConfigModal .selectpicker").selectpicker({
          style: 'btn-default',
          size: 7,
          mobile: true,
          showSubtext: true
        });
        var editorModel = view.model.get("editor");
        view.originalTheme = editorModel.get("theme");
        $('#themeSelector').selectpicker('val', view.originalTheme);
        $("#themeSelector").change(function(e){
          var selectedTheme = $('#themeSelector option:selected').val();
          editorModel.set("theme", selectedTheme);
        });
        $('#wrap').prop('checked', editorModel.get("wrap"));
        $('#showGutter').prop('checked', editorModel.get("showGutter"));
      }catch(e){
        console.log(e);
      }
    },
    onHidden: function(event) {
      event.data.view.destroy();
    },
    onCancel: function(e) {
      var editorModel = this.model.get("editor");
      editorModel.set("theme", this.originalTheme);
    },
    onSave: function(e) {
      try {
        var editorModel = this.model.get("editor");
        editorModel.set("theme", $('#themeSelector option:selected').val());
        editorModel.set("wrap", $('#wrap').is(':checked'));
        editorModel.set("showGutter", $('#showGutter').is(':checked'));
      } catch(e) {
        console.log(e);
      }
      finally {
        $('#editorConfigModal').modal('hide');
        this.destroy();
      }
    }
  });

  return ConfigEditorModalView;
});
