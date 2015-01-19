define(['jquery', 'bootstrap', 'underscore'], function(jQuery, Bootstrap, Underscore){
  var MarkdownModeChange = (function($, _){
    return function(options) {
      return {
        execute: function() {
          if (!this.$el) return;
          var modeSelect = this.$el.find("#modeSelector");
          var selectedMode = modeSelect.find("option:selected").val();
          if (selectedMode) {
            var modeOptions = selectedMode.split("-");
            if (modeOptions[0] === "help") {
              var details = _.find(this.help, function(item) {
                return item.file.indexOf("/"+modeOptions[1]) >= 0;
              });
              var me = this;
              $.get(details.file, function( data ) {
                if (me.model.get("state") === "write") {
                  me.model.set("textBuffer", me.markdownEditor.getValue());
                }
                me.model.set("state", "help");
                me.model.set("text", data);
                me.model.set("mode", "plain-mixed");
                me.markdownEditor.setValue(data);
                me.markdownEditor.gotoLine(0);
              });
            } else {
              var text = "";
              if (this.model.get("textBuffer").length > 0) {
                text = this.model.get("textBuffer");
                this.model.set("textBuffer", "");
              }
              this.model.set("state", "write");
              this.model.set("text", text);
              this.model.set("mode", selectedMode.replace("mode-", ""));
              this.markdownEditor.setValue(text);
              this.markdownEditor.gotoLine(0);
            }
          }
        }
      }
    };
  })(jQuery, Underscore);

  return MarkdownModeChange;
});
