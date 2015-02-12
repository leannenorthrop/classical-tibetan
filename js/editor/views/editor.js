define(["jquery",
        "backbone",
        "marionette"],
function($, Backbone, Marionette) {

  var EditorView = Backbone.Marionette.LayoutView.extend({
    __name__: 'EditorView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    template: false,
    id: 'editor-area',

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
      var view = this;
      require(["editor/models/texteditor", "editor/views/texteditor","editor/models/document", "editor/models/editor"],
        function(CodeMirrorModel, CodeMirrorView){
          view.addRegions({editor:{el: $("#editor-area")}});
          view.model.set("editor", new CodeMirrorModel());
          view.getRegion('editor').show(new CodeMirrorView({model: view.model.get("editor")}));

          view.__editorView = view.getRegion('editor').currentView;
      });
      require(["editor/views/editorToolbar","editor/models/document", "editor/models/editor"],
        function(ToolbarView){
          view.addRegions({toolbar:{el: $("#editor-toolbar")}});
          view.getRegion('toolbar').show(new ToolbarView({editorModel: view.model, parent: view}));
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
