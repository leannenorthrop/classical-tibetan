define(["jquery",
        "backbone",
        "marionette",
        "editor/models/ace",
        "ace/ace"],
function($, Backbone, Marionette, AceModel, Ace) {
  var AceView = Backbone.Marionette.ItemView.extend({
    model: new AceModel(),
    id: 'editor',
    template: false,
    onRender: function() {
      this.$el.attr("style", "background:black;font-size:12pt");
    },
    onShow: function() {
      this.markdownEditor = Ace.edit('editor');
      this.markdownEditor.setTheme(this.model.get("theme"));
      this.markdownEditor.getSession().setMode(this.model.get("mode"));
      this.markdownEditor.getSession().setUseWrapMode(this.model.get("wrap"));
      this.markdownEditor.setShowPrintMargin(this.model.get("showMargin"));
      this.markdownEditor.$blockScrolling = Infinity
      this.update = function(e) {
        var text = this.markdownEditor.getValue();
        this.model.set("text", text);
        console.log(text);
      }.bind(this);
      this.markdownEditor.getSession().on('change', this.update);
    }
  });

  return AceView;
});
