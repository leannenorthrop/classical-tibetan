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
      Backbone.Wreqr.radio.commands.execute( 'editor', 'config', name, this.view.model.get(key));
    }
  });

  return ChangeThemeBehavior;
});
