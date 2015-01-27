define(["jquery",
        "backbone",
        "marionette",
        "editor/views/ace",
        "editor/views/editorToolbar",
        "editor/models/editor",
        "editor/models/ace",
        "editor/models/document",
        "text!templates/editor_layout.html",
        "editor/behaviours/editorToolbar",
        "editor/behaviours/process",
        ],

function($, Backbone, Marionette, AceView, ToolbarView,
         EditorModel, AceModel, DocumentModel, Template,
         Behaviours, Process) {
  var template = Template;
  var EditorView = Backbone.Marionette.LayoutView.extend({
    modelEvents: {
      "change:editor": function() {
        var aceModel = this.model.get("editor");
        this.listenTo(aceModel, "change:text", function() {
          this.model.get("currentDocument").set("text", this.model.get("editor").get("text"));
        });
      },
      "change:currentDocument": function() {
        var options = {view: this};
        this.triggerMethod("TextChange", options);
      }
    },
    initialize: function(options) {
      if (!this.model) {
        this.model = new EditorModel({currentDocument: new DocumentModel({name: "New.md"})});
      }
      this.app = options.app;
    },
    getTemplate: function(){
      return template;
    },
    regions: {
      toolbar: "#editor-toolbar",
      editor: "#editor-area"
    },
    onShow: function() {
      this.model.set("editor", new AceModel());
      this.getRegion('toolbar').show(new ToolbarView({editorModel: this.model, parent: this}));
      this.getRegion('editor').show(new AceView({model: this.model.get("editor"), app: this.app}));
    },
    mode: function(name) {
      var vals = name.split("-");
      var state = vals.shift();
      var mode = vals.join("-");
      this.model.set("state", state);
      this.model.set("mode", mode);
    }
  });

  _.extend( EditorView.prototype, Behaviours);
  _.extend( EditorView.prototype, Process);

  return EditorView;
});
