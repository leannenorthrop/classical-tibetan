require(["editor/app"], function(App) {
  window.editorApp = App;

  $(function(){
    var options = {
      embed: $("title").html().indexOf("Tibetan Blog") > -1
    };

    App.start(options);
  });

});
