require(["editor/app", "markdown"], function(App, markdown) {
  window.editorApp = App;

  $(function(){
    var options = {
      embed: $("title").html().indexOf("Tibetan") > -1
    };

    App.start(options);

    $.getJSON("http://leannenorthrop.github.io/classical-tibetan/words.json").success(function(data){
      var dictionary = markdown.Markdown.dialects.ExtendedWylie.dictionary;
      dictionary.addAll(data[0]);
      console.log("Dictionary initialised.");
    }).error(function(data){
      console.log("Failed to initialise dictionary.");
    });
  });

});
