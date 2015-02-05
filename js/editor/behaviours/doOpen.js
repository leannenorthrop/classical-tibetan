define(['jquery',
        'bootstrap',
        'marionette',
        'editor/views/openDocument',
        'editor/models/document',
        'editor/collections/help'],
function($, Bootstrap, Marionette, OpenDocumentView, DocumentModel, HelpFiles){
  var OnOpenBehavior = Backbone.Marionette.Behavior.extend({
    onOpen: function(event) {
      console.log("Do editor open");

      this.options.view = this.view;
      this.options.model = this.view.model;
      this.options.doc = new DocumentModel({file: 'post_index.json'});

      var me = this;
      this.options.onSuccess = function() {
        var model = me.options.doc;
        var jsonObj = $.parseJSON(model.get("text"));
        var collection = new HelpFiles(jsonObj);
        var modalView = new OpenDocumentView({collection:collection, options: me.options});
        modalView.render();
        $("body").append(modalView.el);
        $(modalView.elId).on('show.bs.modal', {}, modalView.onDisplay);
        $(modalView.elId).modal({show: true,keyboard: true});
      };
      this.options.onError = function() {
        if (window && window.editorApp) {
          window.editorApp.alert("Unable to retrieve file list from GitHub. Lost internet connection?", "danger", "Error");
        }
      };
      this.options.doc.open(this.options);
    }
  });

  return OnOpenBehavior;
});
