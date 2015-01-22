define(['jquery',
        'bootstrap',
        'marionette',
        'editor/behaviours/openDocument',
        'editor/views/openDocument',
        'editor/collections/help',
        "bootstrap",
        "bootstrap.select"],
function($, Bootstrap, Marionette, OpenDocument,
         OpenDocumentView, HelpFiles,
         Bootstrap, BootstrapSelect){
  var OnOpenBehavior = Backbone.Marionette.Behavior.extend({
    onOpen: function(event) {
      console.log("Do editor open");

      this.options.view = this.view;
      this.options.doc = this.view.model.get("currentDocument");

      var me = this;
      var help = new HelpFiles();
      help.fetch({
        success: function(collection, response, options) {
          var modalView = new OpenDocumentView({collection:collection});
          modalView.render();
          $("body").append(modalView.el);
          $("#documentSelector").selectpicker({
            style: 'btn-default',
            size: 7,
            mobile: true,
            showSubtext: true
          });

          $('#openDocumentModal').modal({
            show: true,
            keyboard: true
          });

          $('#openDocumentModal').on('hidden.bs.modal', function (e) {
            modalView.destroy();
          });

          $("#openDocumentModal button.btn-primary").on("click", function(e) {
            try {
              var selected = $("#documentSelector option:selected");
              var selectedDocumentFilePath = selected.val();
              me.options.doc.set("file", selectedDocumentFilePath);
              me.open();
            } catch(e) {}
            finally {
              modalView.destroy();
            }
          });
        },
        error: function(collection, response, options) {
          console.log(response);
          me.cmds.execute("showAlert", {msg: "Unable to find help files. Lost internet connection?", title: "alert"})
        }
      });
    }
  });

  _.extend( OnOpenBehavior.prototype, OpenDocument);

  return OnOpenBehavior;
});
