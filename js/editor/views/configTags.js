define(["jquery",
        "backbone",
        "marionette",
        "text!templates/document_tags_modal.html"],
function($, Backbone, Marionette, Template) {
  var template = Template;
  var TagDocumentModalView = Backbone.Marionette.ItemView.extend({
    ui: {
      cancelBtn: '#documentTagsModal button.btn-default',
      saveBtn: '#documentTagsModal button.btn-primary'
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
        var model = view.model.get("currentDocument");
        $('#documentTagsModal').on('hidden.bs.modal', {view: view}, view.onHidden);
        $('#documentTags').tagsinput({trimValue: true, tagClass: 'label label-primary'});
        $('#documentTags').tagsinput('focus');
        _.each(model.get("tags"), function(tag){$('#documentTags').tagsinput('add', tag);});
      }catch(e){
        console.log(e);
      }
    },
    onHidden: function(event) {
      $('#documentTags').tagsinput('destroy');
      event.data.view.destroy();
    },
    onSave: function(e) {
      try {
        var model = this.model.get("currentDocument");
        model.set("tags", $("#documentTags").val().split(","));
      } catch(e) {
        console.log(e);
      }
      finally {
        $('#documentTagsModal').modal('hide');
        this.destroy();
      }
    }
  });

  return TagDocumentModalView;
});
