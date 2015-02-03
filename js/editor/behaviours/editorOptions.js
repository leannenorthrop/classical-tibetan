define(['jquery', 'bootstrap', 'marionette'],
function($, Bootstrap, Marionette, Markdown){
  var ChangeThemeBehavior = Backbone.Marionette.Behavior.extend({
    modelEvents: {
      "change:theme": "onThemeChange",
      "change:wrap": "onWrapChange",
      "change:mode": "onModeChange",
      "change:showGutter" : "onGutterChange"
    },
    onThemeChange: function() {
      this.doChange("theme", "theme");
    },
    onWrapChange: function() {
      this.doChange("lineWrapping", "wrap");
    },
    onModeChange: function() {
      this.doChange("mode", "mode");
    },
    onGutterChange: function() {
      this.doChange("lineNumbers", "showGutter");
    },
    doChange: function(name, key) {
      if (this.view.textEditor) {
        var editor = this.view.textEditor;
        var model = this.view.model;
        editor.setOption(name, model.get(key));
        if (key === "theme")
          this.loadCss('../css/theme/'+model.get(key)+'.css');
      }
    },
   loadCss: function(url) {
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = url;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  });

  return ChangeThemeBehavior;
});
