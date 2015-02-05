define(['editor/app', 'editor/utils'],
function(App) {

  App.editor.setOption = function(name, value) {
      if (name === "theme")
        App.utils.loadCss('../css/theme/'+value+'.css');

      var editor = App.editor;
      editor.option(name, value);
  };

});
