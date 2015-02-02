define(["jquery",
        "backbone",
        "marionette",
        "text!templates/open_document.html",
        "bootstrap",
        "bootstrap.select",
        'editor/behaviours/openDocument',
        'editor/models/document'],
function($, Backbone, Marionette, Template, Bootstrap, BootstrapSelect, OpenDocument, DocumentModel) {
  var template = Template;
  var OpenDocumentModalView = Backbone.Marionette.ItemView.extend({
    elId: "#openDocumentModal",
    ui: {
      cancelBtn: '#openDocumentModal button.btn-default',
      saveBtn: '#openDocumentModal button.btn-primary'
    },
    events: {
      'click @ui.cancelBtn': 'onCancel',
      'click @ui.saveBtn': 'onSave'
    },
    initialize: function(options) {
      this.options = options.options;
    },
    getTemplate: function(){
      return _.template(template)
    },
    onDisplay: function(event) {
      try {
        $("#documentSelector").selectpicker({
          style: 'btn-default',
          size: 7,
          mobile: true,
          showSubtext: true
        });
      }catch(e){
        console.log(e);
      }
    },
    onHidden: function(event) {
      event.data.view.destroy();
    },
    onSave: function(e) {
      try {
        var selected = $("#documentSelector option:selected");
        var file = selected.val();
        var doc = new DocumentModel({file: file});
        this.options.model.set("currentDocument", doc);
        this.options.doc = doc;
        this.options.onError = function(err) {
          if (window && window.editorApp) {
            window.editorApp.alert("Unable to open file '" + file + "' from GitHub. Lost internet connection?<br/>(" + err + ")", "danger", "Error");
          }
        };
        this.open();
      } catch(e) {
        console.log(e);
      }
      finally {
        $(this.selector).modal('hide');
        this.destroy();
      }
    }
  });

  _.extend( OpenDocumentModalView.prototype, OpenDocument);

  return OpenDocumentModalView;
});
