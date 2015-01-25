define(['jquery', 'bootstrap', 'marionette', 'bootstrap.tagsinput', 'editor/views/configTags'],
  function(Jquery, Bootstrap, Marionette, TagsInput, ConfigTagsModalView){
  var OnGetTagsBehavior = Backbone.Marionette.Behavior.extend({
    onSetTags: function() {
      console.log("Do editor tags");
      var modalView = new ConfigTagsModalView({model:this.view.model});
      modalView.render();
      $("body").append(modalView.el);
      $('#documentTagsModal').on('show.bs.modal', {view: modalView}, modalView.onDisplay);
      $('#documentTagsModal').modal({
        show: true,
        keyboard: true
      });
    }
  });

  return OnGetTagsBehavior;
});
