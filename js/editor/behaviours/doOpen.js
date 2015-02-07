define(['jquery',
        'bootstrap',
        'marionette',
        'editor/views/openDocument',
        'editor/models/document',
        'editor/collections/help'],
function($, Bootstrap, Marionette, OpenDocumentView, DocumentModel, HelpFiles){
  var openDialog = function() {
    var model = this.options.doc;
    var jsonObj = $.parseJSON(model.get("text"));
    var modalView = new OpenDocumentView({collection:new HelpFiles(jsonObj), options: this.options});
    modalView.render();
  };

  var showError = function() {
     Backbone.Wreqr.radio.commands.execute( 'editor', 'alert', "Unable to retrieve file list from GitHub. Lost internet connection?", "danger", "Error!" );
  };

  var OnOpenBehavior = Backbone.Marionette.Behavior.extend({
    __name__: 'OpenBehaviour',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    onOpen: function(event) {
      console.log("Do editor open");

      // Get fresh list of posts from GitHub to populate
      // dialog collection and display if no error
      var opts = this.options;
      opts.onSuccess = openDialog.bind(this);
      opts.onError = showError.bind(this);
      opts.view = this.view;
      opts.model = this.view.model;
      opts.doc = new DocumentModel({file: 'post_index.json'});
      opts.doc.open(opts);
    }
  });

  return OnOpenBehavior;
});
