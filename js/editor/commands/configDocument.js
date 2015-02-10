define(['editor/app'],
function(App) {

  App.configureDocument = function(doc, onSave){
    require(['editor/views/configDocument'], function(ConfigDocumentView){
      var modalView = new ConfigDocumentView({model:doc, onSave: onSave});
      modalView.render();
    });
  }

});
