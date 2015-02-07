define(['jquery', 'bootstrap', 'marionette', "editor/views/configEditor"],
  function(Jquery, Bootstrap, Marionette, ConfigEditorView){
  var ConfigEditorBehavior = Backbone.Marionette.Behavior.extend({
    __name__: 'ConfigEditorBehaviour',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
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
