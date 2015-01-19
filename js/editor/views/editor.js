define(["jquery",
        "backbone",
        "marionette",
        "editor/views/ace",
        "editor/views/editorToolbar",
        "text!templates/editor_layout.html"],

function($, Backbone, Marionette, AceView, ToolbarView, Template) {
  var template = Template;
  var EditorView = Backbone.Marionette.LayoutView.extend({
    initialize: function(options) {
      this.app = options.app;
      this.commands = this.app.commands;
    },
    getTemplate: function(){
      return template;
    },
    regions: {
      toolbar: "#editor-toolbar",
      editor: "#editor-area"
    },
    onShow: function() {
      this.getRegion('toolbar').show(new ToolbarView({commands: this.commands}));
      this.getRegion('editor').show(new AceView());
      this.model = this.editor.currentView.model;
    }
  });

  return EditorView;
});
