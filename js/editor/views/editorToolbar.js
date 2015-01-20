define(["jquery",
        "backbone",
        "marionette",
        "bootstrap",
        "bootstrap.select",
        "text!templates/editor_toolbar.html",
        "editor/collections/options",
        "editor/collections/help"],

function($, Backbone, Marionette, Bootstrap, BootstrapSelect, Template, Options, HelpFiles) {
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
              me.collection.add({value: model.get("select_value"),
                                name: model.get("select_name"),
                                icon: model.get("select_icon"),
                                cmd: {name: "showHelp", options: {file: model.get("file")}}});
            });
          },
          error: function(collection, response, options) {
            me.cmds.execute("showAlert", {msg: "Unable to find help files. Lost internet connection?", title: "alert"})
          }
        });
        //this.listenTo(this.optionsCollection, "change", this.render);
        this.editorModel = options.editorModel;
      },
      onShow: function () {
        console.log("hi");
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
    events: {
        "change #modeSelector": "onModeChange"
    },
    onModeChange: function(){
      var modeSelect = $("#modeSelector option:selected");
      var selectedMode = modeSelect.val();
      var model = this.optionsCollection.detect(function(model){return model.get("value")===selectedMode;})
      var cmd = model.get("cmd");
      cmd.options.context = this;
      this.cmds.execute(cmd.name, cmd.options);
    },
  });

  return EditorToolbarView;
});
