require(["editor/app"], function(App) {
  window.editorApp = App;

  $(function(){
    var options = {
    };

    App.start(options);
  });

});
