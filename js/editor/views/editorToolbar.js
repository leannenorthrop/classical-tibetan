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
        this.cmds = options.commands;

        var me = this;
        this.help = new HelpFiles();
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
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "change", this.render);
        this.editorModel = options.editorModel;
      },
      onShow: function () {
        this.$el.find('.selectpicker').selectpicker({
          style: 'btn-default btn-sm ',
          size: 7,
          mobile: true,
          showSubtext: true
        });
        /*if (me.model.get("state").indexOf("help") === 0) {
        $('#modeSelector').selectpicker('val', me.model.get("state"));
        me.onModeChange();
        }*/
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
      events: {
          "change #modeSelector": function(){
            var modeSelect = $("#modeSelector option:selected");
            var selectedMode = modeSelect.val();
            var modes = selectedMode.split("-");
            this.editorModel.set("state", modes[0]);
            this.editorModel.set("mode", modes.slice(1).join("-"));
          }
      },
  });

  return EditorToolbarView;
});
