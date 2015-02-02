define(['jquery',
        'bootstrap',
        'marionette',
        'editor/views/openDocument',
        'editor/collections/help'],
function($, Bootstrap, Marionette, OpenDocumentView, HelpFiles){
  var OnOpenBehavior = Backbone.Marionette.Behavior.extend({
    onOpen: function(event) {
      console.log("Do editor open");

      this.options.view = this.view;
      this.options.model = this.view.model;
      this.options.doc = this.view.model.get("currentDocument");

      var me = this;
      var help = new HelpFiles();
      help.fetch({cache: false,
        success: function(collection, response, options) {
          var modalView = new OpenDocumentView({collection:collection, options: me.options});
          modalView.render();
          $("body").append(modalView.el);
          $(modalView.elId).on('show.bs.modal', {}, modalView.onDisplay);
          $(modalView.elId).modal({show: true,keyboard: true});
        },
        error: function(collection, response, options) {
          console.log(response);
          if (window && window.editorApp) {
            window.editorApp.alert("Unable to retrieve file list from GitHub. Lost internet connection?<br/>(" + response + ")", "danger", "Error");
          }
        }
      });
    }
  });

  return OnOpenBehavior;
});
