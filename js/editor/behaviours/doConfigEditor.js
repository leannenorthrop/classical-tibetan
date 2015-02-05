define(['jquery', 'bootstrap', 'marionette', "editor/views/configEditor"],
  function(Jquery, Bootstrap, Marionette, ConfigEditorView){
  var ConfigEditorBehavior = Backbone.Marionette.Behavior.extend({
    onConfig: function() {
      console.log("Do editor config");
      var modalView = new ConfigEditorView({model:this.view.model});
        modalView.render();
        $('#editorConfigModal').modal({
          show: true,
          keyboard: true
        });
    }
  });

  return ConfigEditorBehavior;
});
