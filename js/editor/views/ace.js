define(["jquery",
        "backbone",
        "marionette",
        "editor/models/ace",
        "ace/ace",
        "editor/behaviours/process",
        "editor/behaviours/editorOptions"],
function($, Backbone, Marionette, AceModel, Ace,
         ProcessText, EditorOptions) {
  var AceView = Backbone.Marionette.ItemView.extend({
    id: 'editor',
    template: false,
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
      this.markdownEditor = Ace.edit('editor');
      for(attr in this.model.attributes){
        console.log("Setting editor " + attr + " to: ", this.model.attributes[attr]);
        this.model.trigger("change:"+attr);
      }

      this.update = function(e) {
        var text = this.markdownEditor.getValue();
        this.model.set("text", text);
      }.bind(this);
      this.markdownEditor.getSession().on('change', this.update);
    },
    setText: function(text){
      this.markdownEditor.setValue(text);
      this.markdownEditor.clearSelection();
      this.markdownEditor.gotoLine(0, 0, false);
    }
  });

  return AceView;
});
