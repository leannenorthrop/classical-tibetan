define([
  "jquery",
  "underscore",
  "backbone",
  "ace/ace",
  "editor/models/editor",
  "text!templates/editor.html",
  "bootstrap",
  "bootstrap-select",
  "text!templates/editor_select_options.html",
], function($, _, Backbone, Ace, EditorModel, Template, Bootstrap, BootstrapSelect, SelectOptionTemplate){
  var ace = Ace;

  var EditorView = Backbone.View.extend({
    initialize: function(options){
      if (!options.model) {
        this.model = new EditorModel();
        this.model.set("mode", "plain-mixed");
        this.model.set("state", "help-gettingstarted");
        this.model.set("ace_theme", options.theme ? options.theme : "ace/theme/monokai");
        this.model.set("ace_mode", options.mode ? options.mode : "ace/mode/markdown");
        this.model.set("ace_wrap", options.wrap ? options.wrap : true);
        this.model.set("ace_showMargin", options.showMargin ? options.showMargin : false);
      } else {
        this.model = options.model;
      }

      // Help Pages
      var me = this;
      this.help = {};
      $.ajax({url: "../js/content/help/options.json",
              cache: true,
              type: "GET",
              dataType: "json",}).done(function( data ) {
        me.help = data;
        var helpOptionGroup = me.$el.find("#editor_help_options");
        helpOptionGroup.html(me.optionsTemplate({options:data}));
        if (me.model.get("state").indexOf("help") === 0) {
          $('#modeSelector').selectpicker('val', me.model.get("state"));
          me.onModeChange();
        }
      }).fail(function( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
      });
    },
    events: {
        "change #modeSelector": "onModeChange"
    },
    onModeChange: function(){
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
    },
    template: _.template(Template),
    optionsTemplate: _.template(SelectOptionTemplate),
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.markdownEditor = Ace.edit("editor");
      this.markdownEditor.setTheme(this.model.get("ace_theme"));
      this.markdownEditor.getSession().setMode(this.model.get("ace_mode"));
      this.markdownEditor.getSession().setUseWrapMode(this.model.get("ace_wrap"));
      this.markdownEditor.setShowPrintMargin(this.model.get("ace_showMargin"));
      this.markdownEditor.$blockScrolling = Infinity
      this.update = function(e) {
        var text = this.markdownEditor.getValue();
        this.model.set("text", text);
      }.bind(this);
      this.markdownEditor.getSession().on('change', this.update);
      this.$el.find('.selectpicker').selectpicker({
        style: 'btn-default btn-sm ',
        size: 7,
        mobile: true,
        showSubtext: true
      });
      return this;
    }
  });

  return EditorView;
});
