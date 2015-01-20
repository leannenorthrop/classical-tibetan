define(["jquery",
        "backbone",
        "marionette",
        "editor/models/ace",
        "ace/ace",
        "editor/behaviours/process"],
function($, Backbone, Marionette, AceModel, Ace, ProcessText) {
  var AceView = Backbone.Marionette.ItemView.extend({
    id: 'editor',
    template: false,
    behaviors: {
      Preview: {
        behaviorClass: ProcessText,
        app: this.app
      }
    },
    initialize: function(options) {
      this.app = options.app;
    },
    onRender: function() {
      this.$el.attr("style", "background:black;font-size:12pt");
    },
    onShow: function() {
      this.markdownEditor = Ace.edit('editor');
      this.markdownEditor.setTheme(this.model.get("theme"));
      this.markdownEditor.setShowPrintMargin(this.model.get("showMargin"));
      this.markdownEditor.$blockScrolling = Infinity

      var session = this.markdownEditor.getSession();
      session.setMode(this.model.get("mode"));
      session.setUseWrapMode(this.model.get("wrap"));

      this.update = function(e) {
        var text = this.markdownEditor.getValue();
        this.model.set("text", text);
      }.bind(this);
      session.on('change', this.update);
    }
  });

  return AceView;
});
