define(["jquery",
        "backbone",
        "marionette",
        "text!templates/document_details_modal.html"],
function($, Backbone, Marionette, Template) {
  var template = Template;
  var ConfigDocumentModalView = Backbone.Marionette.ItemView.extend({
    ui: {
      cancelBtn: '#documentConfigModal button.btn-default',
      saveBtn: '#documentConfigModal button.btn-primary'
    },
    events: {
      'click @ui.saveBtn': 'onSave'
    },
    getTemplate: function(){
      return _.template(template);
    },
    onDisplay: function(event) {
      try {
        var view = event.data.view;
        var model = view.model;
        $('#documentConfigModal').on('hidden.bs.modal', {view: view}, view.onHidden);
        $("#documentName").val(model.get("name"));
        $("#documentDetails").val(model.get("description"));
      }catch(e){
        console.log(e);
      }
    },
    onHidden: function(event) {
      event.data.view.destroy();
    },
    onSave: function(e) {
      try {
        var model = this.model;
        model.set("name", $("#documentName").val());
        model.set("description", $("#documentDetails").val());
      } catch(e) {
        console.log(e);
      }
      finally {
        $('#editorConfigModal').modal('hide');
        this.destroy();
      }
    }
  });

  return ConfigDocumentModalView;
});
