define(["jquery",
        "backbone",
        "marionette",
        "text!templates/editor_layout.html"],
function($, Backbone, Marionette, Template) {

  var template = Template;

  var EditorView = Backbone.Marionette.LayoutView.extend({
    __name__: 'EditorView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },

    // Layout UI Regions
    regions: {
      toolbar: "#editor-toolbar",
      editor: "#editor-area"
    },

    // Events
    onDocumentChange: function () {
      var doc = this.model.get("currentDocument");
      this.listenTo(doc, "change:text", function() {
        var shownText = this.getRegion('editor').currentView.getText();
        var currentText = doc.get("text");
        if (shownText != currentText) {
          this.text(currentText);
        }
        Backbone.Wreqr.radio.commands.execute( 'editor', 'preview-doc');
      });
    },
    onTextEditorChange: function () {
      var model = this.model;
      var textModel = model.get("editor");
      this.listenTo(textModel, "change:text", function() {
        var doc = model.get("currentDocument");
        doc.set("text", textModel.get("text"));
      });
    },
    onModeUpdate: function() {
      Backbone.Wreqr.radio.commands.execute( 'editor', 'update-mode');
    },
    onShow: function() {
      var me = this;
      require(["editor/models/texteditor", "editor/views/texteditor","editor/views/editorToolbar"],
        function(CodeMirrorModel, CodeMirrorView, ToolbarView){
          me.model.set("editor", new CodeMirrorModel());
          me.getRegion('toolbar').show(new ToolbarView({editorModel: me.model, parent: me}));
          me.getRegion('editor').show(new CodeMirrorView({model: me.model.get("editor")}));

          me.__editorView = me.getRegion('editor').currentView;
      });
    },

    initialize: function(options) {
      if (!this.model) {
        var view = this;
        require(["editor/models/document", "editor/models/editor"],
          function(DocumentModel, EditorModel){
            var model = new EditorModel({currentDocument: new DocumentModel()});
            view.listenTo(model, "change:editor", view.onTextEditorChange);
            view.listenTo(model, "change:currentDocument", view.onDocumentChange);
            view.listenTo(model, "change:mode", view.onModeUpdate);
            view.model = model;

            // Init
            if (view.__modename) {
              view.mode(view.__modename);
              delete view.__modename;
            }
            view.onDocumentChange();
        });
      }
    },
    getTemplate: function(){
      return template;
    },
    mode: function(name) {
      if (this.model) {
        var vals = name.split("-");
        var state = vals.shift();
        var mode = vals.join("-");
        this.model.set("state", state);
        this.model.set("mode", mode);
      } else {
        this.__modename = name;
      }
    },
    option: function(name, key) {
      if (this.__editorView)
        this.__editorView.setOption(name, key);
    },
    text: function(text) {
      if (this.__editorView)
        this.__editorView.setText(text);
    }
  });

  return EditorView;
});
