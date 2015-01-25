define(["jquery",
        "backbone",
        "marionette",
        "text!templates/editor_config_modal.html",
        'cookies'],

function($, Backbone, Marionette, Template, Cookies) {
  var template = Template;
  var ConfigEditorModalView = Backbone.Marionette.ItemView.extend({
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
        var aceModel = view.model.get("editor");
        view.originalTheme = aceModel.get("theme");
        $('#themeSelector').selectpicker('val', view.originalTheme);
        $("#themeSelector").change(function(e){
          var selectedTheme = $('#themeSelector option:selected').val();
          aceModel.set("theme", selectedTheme);
        });
        $('#fontSize').selectpicker('val', aceModel.get("fontSize"));
        $('#wrap').prop('checked', aceModel.get("wrap"));
        $('#showMargin').prop('checked', aceModel.get("showMargin"));
        $('#showCurrentLine').prop('checked', aceModel.get("hightlightActiveLine"));

        $("#inputUserName").val($.cookie('gu'));
        $("#inputPassword").val($.cookie('gp'));
      }catch(e){
        console.log(e);
      }
    },
    onHidden: function(event) {
      event.data.view.destroy();
    },
    onCancel: function(e) {
      var aceModel = this.model.get("editor");
      aceModel.set("theme", this.originalTheme);
    },
    onSave: function(e) {
      try {
        var aceModel = this.model.get("editor");
        aceModel.set("theme", $('#themeSelector option:selected').val());
        aceModel.set("fontSize", $('#fontSize option:selected').val());
        aceModel.set("wrap", $('#wrap').is(':checked'));
        aceModel.set("showMargin", $('#showMargin').is(':checked'));
        aceModel.set("hightlightActiveLine", $('#showCurrentLine').is(':checked'));

        $.cookie('gu', $("#inputUserName").val(), { expires: 31 });
        $.cookie('gp', $("#inputPassword").val(), { expires: 1 });
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
