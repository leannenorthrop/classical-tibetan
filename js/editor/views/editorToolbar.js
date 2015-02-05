define(["jquery",
        "backbone",
        "marionette",
        "bootstrap",
        "bootstrap.select",
        "text!templates/editor_toolbar.html",
        "text!templates/editor_mode_options.html",
        "editor/collections/options",
        "editor/collections/help"],

function($, Backbone, Marionette, Bootstrap, BootstrapSelect,
         Template, ModesTemplate, Options, HelpFiles) {
  var template = Template;
  var modeTemplate = ModesTemplate;
  var selectOptions = [{value: "mode-plain-wylie",icon: "glyphicon-pencil",name: "Wylie",cmd: {name: "setEditorMode", options: {mode: "plain-wylie"}}},
                       {value: "mode-plain-mixed",icon: "glyphicon-pencil",name: "Mixed Wylie/English/etc..",cmd: {name: "setEditorMode", options: {mode: "plain-mixed"}}}];

  var EditorToolbarView = Backbone.Marionette.ItemView.extend({
    getTemplate: function(){
      return _.template(template);
    },
    getModeTemplate: function() {
      return _.template(modeTemplate);
    },
    initialize: function(options){
        this.parentView = options.parent;
        this.editorModel = options.editorModel;

        // modes
        this.collection = new Options(selectOptions);
        this.listenTo(this.collection, "add", this.renderSelect);
        this.listenTo(this.collection, "change", this.renderSelect);
        this.listenTo(this.editorModel, "change:mode", this.updateMode);
        this.fetchHelpModes();
      },
      fetchHelpModes: function() {
        if (!this.help) {
          this.help = new HelpFiles();
        }
        var me = this;
        this.help.fetch({
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
      fire: function(name, options) {
        console.log("Editor toolbar trigger " + name + " " + options);
        this.parentView.triggerMethod(name, options);
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
          this.fire("Import", {file: $(".import input[type=file]")[0].files[0]});
        },
        "click @ui.exportBtn": function() {
          this.fire("Export", {});
        },
        "click @ui.openBtn": function() {
          var file = "";
          this.fire("Open", {file: file});
        },
        "click @ui.saveBtn": function() {
          var file = "";
          this.fire("Close", {file: file, save: true, preview: false});
        },
        "click @ui.deleteBtn": function() {
          this.fire("Delete", {});
        },
        "click @ui.configBtn": function() {
          this.fire("Config", {});
        },
        "click @ui.descriptionBtn": function() {
          this.fire("SetDescription", {});
        },
        "click @ui.tagsBtn": function() {
          this.fire("SetTags", {});
        },
        "click @ui.screenBtn": function() {
          this.fire("ToggleColumnSize", {col: "leftColumn"});
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
      }
  });

  return EditorToolbarView;
});
