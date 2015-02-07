define(["jquery",
        "backbone",
        "marionette",
        "editor/models/texteditor",
        "editor/behaviours/process",
        "editor/behaviours/editorOptions"],
function($, Backbone, Marionette, TextEditorModel, ProcessText, EditorOptions) {
  var View = Backbone.Marionette.ItemView.extend({
    __name__: 'TextEditorView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    id: 'editor',
    template : function(json_model) {
      return _.template('<textarea id="text" style="height: 900px;overflow: visible;width:100%"></textarea>')({});
    },
    behaviors: {
      Preview: {
        behaviorClass: ProcessText,
        app: this.app
      },
      EditorOptions: {
        behaviorClass: EditorOptions,
        app: this.app
      }
    },
    initialize: function(options) {
      this.app = options.app;
    },
    onShow: function() {
      var me = this;
      this.update = function(changes) {
        var text = this.textEditor.getValue();
        this.model.set("text", text);
      }.bind(this);

      require(['cm/codemirror', 'cm/markdown'], function(CodeMirror){
        var textElement = $('#text').get()[0];
        me.textEditor = CodeMirror.fromTextArea(textElement,{
          mode: "markdown",
          viewportMargin: Infinity,
        });

        for(attr in me.model.attributes){
          console.log("Setting editor " + attr + " to: ", me.model.attributes[attr]);
          me.model.trigger("change:"+attr);
        }

        me.textEditor.on("changes", me.update);

        me.textEditor.getWrapperElement().setAttribute("style", "width:100%;height:100%");
      });
    },
    setText: function(text){
      if (this.textEditor) {
        this.textEditor.setValue(text);
        this.model.set("text", text);
      }
    },
    setOption: function(name, key) {
      this.textEditor.setOption(name, key);
    }
  });

  return View;
});
