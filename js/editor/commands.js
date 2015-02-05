define(['backbone.wreqr',
         'editor/app',
         "editor/commands/alert",
         "editor/commands/updatePreview",
         "editor/commands/process",
         "editor/commands/updateIndex",
         "editor/commands/save",
         "editor/commands/configEditor",
         "editor/commands/clear",
         "editor/commands/updateEditor",
         "editor/commands/export"],
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

  App.commands.setHandler("config", function(name, value){
    App.editor.setOption(name, value);
  });

  App.commands.setHandler("clear", function(name, value){
    App.editor.clear();
  });

  App.commands.setHandler("update-editor", function(text){
    App.editor.update(text);
  });

  App.commands.setHandler("export-editor", function(text){
    var doc = App.editor.model.get("currentDocument");
    App.export(doc);
  });

});
