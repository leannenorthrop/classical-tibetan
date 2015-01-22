define(["jquery",
        "backbone",
        "marionette",
        "bootstrap",
        "bootstrap.select",
        "text!templates/editor_toolbar.html",
        "editor/collections/options",
        "editor/collections/help"],

function($, Backbone, Marionette, Bootstrap, BootstrapSelect,
         Template, Options, HelpFiles) {
  var template = Template;
  var EditorToolbarView = Backbone.Marionette.ItemView.extend({
    getTemplate: function(){
      return _.template(template);
    },
    initialize: function(options){
        var selectOptions = [{value: "mode-plain-wylie",icon: "glyphicon-pencil",name: "Wylie",cmd: {name: "setEditorMode", options: {mode: "plain-wylie"}}},
                             {value: "mode-plain-mixed",icon: "glyphicon-pencil",name: "Mixed Wylie/English/etc..",cmd: {name: "setEditorMode", options: {mode: "plain-mixed"}}}];
        this.collection = new Options(selectOptions);
        this.parentView = options.parent;
        this.help = new HelpFiles();
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "change", this.render);
        this.editorModel = options.editorModel;
        this.fetchHelpModes();
      },
      fetchHelpModes: function() {
        var me = this;
        this.help.fetch({
          success: function(collection, response, options) {
            collection.forEach(function(model,index){
              if (model.get("categories").indexOf("help") >= 0) {
                me.collection.add({value: "help-"+model.get("name"),
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
      onShow: function () {
        this.$el.find('.selectpicker').selectpicker({
          style: 'btn-default btn-sm ',
          size: 7,
          mobile: true,
          showSubtext: true
        });
        try {
          var isFileSaverSupported = !!new Blob;
          if (isFileSaverSupported) {
            $("button.export").addClass("disabled");
          }
        } catch (e) {}
        //if (this.editorModel.get("state").indexOf("help") === 0) {
        //  $('#modeSelector').selectpicker('val', this.model.get("state"));
        //  this.onModeChange();
        //}
      },
      onRender: function() {
        this.$el.find('.selectpicker').selectpicker({
          style: 'btn-default btn-sm ',
          size: 7,
          mobile: true,
          showSubtext: true
        });
      },
      currentMode: function() {
          var modeSelect = $("#modeSelector option:selected");
          var selectedMode = modeSelect.val();
          var modeModel = this.collection.find(function(model) { return model.get('value') === selectedMode; });;
          return modeModel ? modeModel.toJSON() : modeModel;
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
        "change @ui.exportBtn": function() {
          this.fire("Export", {file: $(".export input[type=file]")[0].files[0]});
        },
        "click @ui.openBtn": function() {
          var file = "";
          this.fire("Open", {file: file});
        },
        "click @ui.saveBtn": function() {
          var file = "";
          this.fire("Close", {file: file, save: true});
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
        "exportBtn": "#exportFile",
        "openBtn": ".open",
        "saveBtn": ".save",
        "deleteBtn": ".delete",
        "configBtn": ".config",
        "descriptionBtn": ".description",
        "tagsBtn": ".tags",
        "screenBtn": ".screen",
      }
  });

  return EditorToolbarView;
});
