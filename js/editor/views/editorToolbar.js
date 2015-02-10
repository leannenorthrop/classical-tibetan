define(["jquery",
        "backbone",
        "marionette",
        "bootstrap",
        "bootstrap.select",
        "text!templates/editor_toolbar.html",
        "text!templates/editor_mode_options.html"],

function($, Backbone, Marionette, Bootstrap, BootstrapSelect, Template, ModesTemplate) {
  var template = Template;
  var modeTemplate = ModesTemplate;
  var selectOptions = [{value: "mode-plain-wylie",icon: "glyphicon-pencil",name: "Wylie",cmd: {name: "setEditorMode", options: {mode: "plain-wylie"}}},
                       {value: "mode-plain-mixed",icon: "glyphicon-pencil",name: "Mixed Wylie/English/etc..",cmd: {name: "setEditorMode", options: {mode: "plain-mixed"}}}];

  var EditorToolbarView = Backbone.Marionette.ItemView.extend({
    __name__: 'EditorToolbarView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    getTemplate: function(){
      return _.template(template);
    },
    getModeTemplate: function() {
      return _.template(modeTemplate);
    },
    initialize: function(options){
        this.parentView = options.parent;
        this.editorModel = options.editorModel;

        var view = this;
        require(["editor/collections/options"], function(Options) {
          // modes
          var options = new Options(selectOptions);
          view.collection = options;
          view.listenTo(options, "add", view.renderSelect);
          view.listenTo(options, "change", view.renderSelect);
          view.listenTo(view.editorModel, "change:mode", view.updateMode);
          view.fetchHelpModes();
        });
      },
      fetchHelpModes: function() {
        var me = this;
        require(["editor/collections/help"], function(HelpFiles) {
          if (!me.help) {
            me.help = new HelpFiles();
          }
          me.help.fetch({
            success: function(collection, response, options) {
              collection.forEach(function(model,index){
                if (model.get("category") && model.get("category").indexOf("help") >= 0) {
                  me.collection.add({value: "help-file-"+model.get("gitFile"),
                                    name: model.get("title"),
                                    icon: "glyphicon-info-sign",
                                    file: model.get("name")});
                }
              });
            },
            error: function(collection, response, options) {
              console.log(response);
              me.cmds.execute("showAlert", {msg: "Unable to find help files. Lost internet connection?", title: "alert"})
            }
          });
        });
      },
      renderSelect: function() {
        var optionsHtml = this.getModeTemplate()({items:this.collection.toJSON()});
        this.$el.find('#modeSelector').html(optionsHtml);
        var mode = this.editorModel.get("state") + "-" + this.editorModel.get("mode");
        this.$el.find('.selectpicker').val(mode);
        this.$el.find('.selectpicker').selectpicker('render');
      },
      onRender: function() {
        this.$el.find('.selectpicker').selectpicker({
          style: 'btn-default btn-sm',
          size: 7,
          mobile: true,
          showSubtext: true
        });
        try {
          var isFileSaverSupported = !!new FileReader();
          if (isFileSaverSupported) {
            $("button.export").addClass("disabled");
          }
        } catch (e) {}
      },
      currentMode: function() {
          var modeSelect = $("#modeSelector option:selected");
          var selectedMode = modeSelect.val();
          var modeModel = this.collection.find(function(model) { return model.get('value') === selectedMode; });;
          return modeModel ? modeModel.toJSON() : modeModel;
      },
      updateMode: function() {
        $('#modeSelector').selectpicker('val', this.editorModel.get("state") + "-" + this.editorModel.get("mode"));
      },
      events: {
        "change @ui.modeSelector": function(){
          var modeSelect = $("#modeSelector option:selected");
          var selectedMode = modeSelect.val();
          var modes = selectedMode.split("-");
          this.editorModel.set("state", modes[0]);
          this.editorModel.set("mode", modes.slice(1).join("-"));
        },
        "change @ui.importBtn": function() {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'import-editor', $(".import input[type=file]")[0].files[0]);
        },
        "click @ui.exportBtn": function() {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'export-editor');
        },
        "click @ui.openBtn": function() {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'open');
        },
        "click @ui.saveBtn": function() {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'config-editor-doc');
        },
        "click @ui.deleteBtn": function() {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'clear');
        },
        "click @ui.configBtn": function() {
          var view = this;
          require(['editor/views/configEditor'], function(ConfigEditorView) {
            var modalView = new ConfigEditorView({model:view.editorModel});
            modalView.render();
          });
        },
        "click @ui.screenBtn": function() {
          if ($("#right-col").width() === 0) {
            Backbone.Wreqr.radio.commands.execute( 'editor', 'editor-normalsize');
          } else {
            Backbone.Wreqr.radio.commands.execute( 'editor', 'editor-fullsize');
          }
        },
      },
      ui: {
        "modeSelector": "#modeSelector",
        "importBtn": "#importFile",
        "exportBtn": ".export",
        "openBtn": ".open",
        "saveBtn": ".save",
        "deleteBtn": ".delete",
        "configBtn": ".config",
        "screenBtn": ".screen",
      },
      modelEvents: {
        "change:mode": function() {Backbone.Wreqr.radio.commands.execute( 'editor', 'update-mode');}
      }
  });

  return EditorToolbarView;
});
