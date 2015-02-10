define(['backbone.wreqr',
         'editor/app'],
function(Wreqr,
         App) {
  App.commands.setHandler("alert", function(msg, type, heading){
    require(["editor/commands/alert"], function(){
      App.alert(msg, type, heading);
    });
  });

  App.commands.setHandler("update-preview", function(text){
    require(["editor/commands/updatePreview"], function() {
      App.preview.update(text);
    });
  });

  App.commands.setHandler("preview-doc", function(){
    require(["editor/commands/process"], function() {
      App.process();
    });
  });

  App.commands.setHandler("update-index", function(){
    require(["editor/commands/updateIndex"], function() {
      App.updateIndex();
    });
  });

  App.commands.setHandler("save", function(doc, options){
    require(["editor/commands/save"], function() {
      App.save(doc, options);
    });
  });

  App.commands.setHandler("config", function(name, value){
    require(["editor/commands/configEditor"], function() {
      App.editor.setOption(name, value);
    });
  });

  App.commands.setHandler("clear", function(name, value){
    require(["editor/commands/clear"], function() {
      App.editor.clear();
    });
  });

  App.commands.setHandler("update-editor", function(text){
    require(["editor/commands/updateEditor"], function() {
      App.editor.update(text);
    });
  });

  App.commands.setHandler("export-editor", function(text){
    require (["editor/commands/export"], function() {
      var doc = App.editor.model.get("currentDocument");
      App.export(doc);
    });
  });

  App.commands.setHandler("export-preview", function(text){
    require(["editor/commands/export"], function() {
      var doc = App.preview.model;
      App.export(doc);
    });
  });

  App.commands.setHandler("import-editor", function(file){
    require(["editor/commands/import","editor/commands/updateEditor"], function() {
      App.read(file, function(text, err) {
        if (!err) {
          App.editor.update(text);
        }
      });
    });
  });

  App.commands.setHandler("open-file", function(file){
    require(["editor/commands/open"], function() {
      App.editor.open(file);
    });
  });

  App.commands.setHandler("open", function(){
    require(["editor/commands/open"], function() {
      App.editor.openDlg();
    });
  });

  App.commands.setHandler("new", function(){
    require(["editor/commands/newfile"], function() {
      App.editor.newfile();
    });
  });

  App.commands.setHandler("update-mode", function(){
    require(['editor/commands/setMode'],function() {
      App.editor.setMode();
    });
  });

  App.commands.setHandler("config-editor-doc", function(){
    require(["editor/commands/configDocument","editor/commands/save"], function() {
      App.configureDocument(App.editor.model.get("currentDocument"), function(doc) {
        App.save(doc, {onSave: App.updateIndex});
      });
    });
  });

  App.commands.setHandler("editor-fullsize", function() {
    require(["editor/commands/columnSize"],function() {
      App.editor.fullSize();
    });
  });

  App.commands.setHandler("editor-normalsize", function() {
    require(["editor/commands/columnSize"],function() {
      App.editor.halfSize();
    });
  });

  App.commands.setHandler("preview-fullsize", function() {
    require(["editor/commands/columnSize"],function() {
      App.preview.fullSize();
    });
  });

  App.commands.setHandler("preview-normalsize", function() {
    require(["editor/commands/columnSize"],function() {
      App.preview.halfSize();
    });
  });
});
