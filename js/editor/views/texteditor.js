define(["jquery",
        "backbone",
        "marionette"],
function($, Backbone, Marionette) {
  var View = Backbone.Marionette.ItemView.extend({
    __name__: 'TextEditorView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    id: 'editor',
    template : function(json_model) {
      return _.template('<textarea id="text" style="height: 900px;overflow: visible;width:100%"></textarea>')({});
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
    getText: function(text){
      if (this.textEditor) {
        return this.textEditor.getValue();
      }
      return "";
    },
    setText: function(text){
      if (this.textEditor) {
        this.textEditor.setValue(text);
        this.model.set("text", text);
      }
    },
    setOption: function(name, key) {
      if (this.textEditor) {
        this.textEditor.setOption(name, key);
      }
    },
    modelEvents: {
      "change:theme": "onThemeChange",
      "change:wrap": "onWrapChange",
      "change:mode": "onModeChange",
      "change:showGutter" : "onGutterChange",
    },
    onThemeChange: function() {
      this.config("theme", "theme");
    },
    onWrapChange: function() {
      this.config("lineWrapping", "wrap");
    },
    onModeChange: function() {
      this.config("mode", "mode");
    },
    onGutterChange: function() {
      this.config("lineNumbers", "showGutter");
    },
    config: function(name, key) {
      Backbone.Wreqr.radio.commands.execute( 'editor', 'config', name, this.model.get(key));
    }
  });

  return View;
});
