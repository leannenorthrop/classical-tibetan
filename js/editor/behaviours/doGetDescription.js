define(['jquery', 'bootstrap', 'marionette', 'editor/views/configDocument'],
  function(Jquery, Bootstrap, Marionette, ConfigDocumentView){
  var OnSetDescription = Backbone.Marionette.Behavior.extend({
    onSetDescription: function() {
      console.log("Do editor description");
      var modalView = new ConfigDocumentView({model:this.view.model});
      modalView.render();
      $("body").append(modalView.el);
      $('#documentConfigModal').on('show.bs.modal', {view: modalView}, modalView.onDisplay);
      $('#documentConfigModal').modal({
        show: true,
        keyboard: true
      });
    }
  });

  return OnSetDescription;
});
