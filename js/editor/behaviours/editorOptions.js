define(['jquery', 'bootstrap', 'marionette'],
function($, Bootstrap, Marionette, Markdown){
  var ChangeThemeBehavior = Backbone.Marionette.Behavior.extend({
    modelEvents: {
      "change:theme": "onThemeChange",
      "change:wrap": "onWrapChange",
      "change:hightlightActiveLine": "onHightlightActiveLineChange",
      "change:showMargin": "onShowMarginChange",
      "change:fontSize": "onFontSizeChange",
      "change:mode": "onModeChange",
      "change:blockScrolling" : "onBlockScrollingChange",
      "change:showGutter" : "onGutterChange"
    },

    onThemeChange: function() {
      if (this.view.markdownEditor) {
        var ace = this.view.markdownEditor;
        var model = this.view.model;
        ace.setTheme(model.get("theme"));
      }
    },
    onWrapChange: function() {
      if (this.view.markdownEditor) {
        var ace = this.view.markdownEditor;
        var model = this.view.model;
        ace.getSession().setUseWrapMode(model.get("wrap"));
      }
    },
    onHightlightActiveLineChange: function() {
      if (this.view.markdownEditor) {
        var ace = this.view.markdownEditor;
        var model = this.view.model;
        ace.setHighlightActiveLine(model.get("hightlightActiveLine"));
      }
    },
    onShowMarginChange: function() {
      if (this.view.markdownEditor) {
        var ace = this.view.markdownEditor;
        var model = this.view.model;
        ace.setShowPrintMargin(model.get("showMargin"));
      }
    },
    onShowMarginChange: function() {
      if (this.view.markdownEditor) {
        var ace = this.view.markdownEditor;
        var model = this.view.model;
        ace.setShowPrintMargin(model.get("showMargin"));
      }
    },
    onFontSizeChange: function() {
      if (this.view.markdownEditor) {
        var ace = this.view.markdownEditor;
        var model = this.view.model;
        //ace.setFontSize(Number size);
        $('#editor').attr("style", "font-size:"+model.get("fontSize"));
      }
    },
    onModeChange: function() {
      if (this.view.markdownEditor) {
        var ace = this.view.markdownEditor;
        var model = this.view.model;
        var session = ace.getSession();
        session.setMode(model.get("mode"));
      }
    },
    onBlockScrollingChange: function() {
      if (this.view.markdownEditor) {
        var ace = this.view.markdownEditor;
        var model = this.view.model;
        ace.$blockScrolling = model.get("blockScrolling");
      }
    },
    onGutterChange: function() {
      if (this.view.markdownEditor) {
        var ace = this.view.markdownEditor;
        var model = this.view.model;
        ace.renderer.setShowGutter(model.get("showGutter"));
      }
    }
  });

  return ChangeThemeBehavior;
});
