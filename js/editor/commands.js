define(['backbone.wreqr',
         'editor/app',
         "editor/commands/alert",
         "editor/commands/updatePreview",
         "editor/commands/process",
         "editor/commands/updateIndex",
         "editor/commands/save"],
function(Wreqr,
         App) {
  App.commands.setHandler("alert", function(msg, type, heading){
    App.alert(msg, type, heading);
  });

  App.commands.setHandler("update-preview", function(text){
    App.preview.update(text);
  });

  App.commands.setHandler("preview-doc", function(){
    App.process();
  });

  App.commands.setHandler("update-index", function(){
    App.updateIndex();
  });

  App.commands.setHandler("save", function(doc, options){
    App.save(doc, options);
  });

});
