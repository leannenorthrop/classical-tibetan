define([
  'jquery',
  'underscore',
  'backbone',
  "ace/ace",
  "editor/models/editor"
], function($, _, Backbone, Ace, EditorModel){
  var ace = Ace;

  var EditorView = Backbone.View.extend({
    initialize: function(options){
      if (!options.model) {
        this.model = new EditorModel();
      }

      this.markdownEditor = Ace.edit(this.el);
      this.markdownEditor.setTheme(options.theme ? options.theme : "ace/theme/monokai");
      this.markdownEditor.getSession().setMode(options.mode ? options.mode : "ace/mode/markdown");
      this.markdownEditor.getSession().setUseWrapMode(options.wrap ? options.wrap : true);
      this.markdownEditor.setShowPrintMargin(options.showMargin ? options.showMargin : false);

      this.update = function(e) {
        var text = this.markdownEditor.getValue();
        this.model.set("text", text);
      }.bind(this);
      this.markdownEditor.getSession().on('change', this.update);
    }
  });

  return EditorView;
});
