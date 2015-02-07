define(['jquery', 'bootstrap', 'marionette'],
  function(Jquery, Bootstrap, Marionette){
  var ExportBehavior = Backbone.Marionette.Behavior.extend({
    __name__: 'ExportBehaviour',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    onExport: function() {
      console.log("Do editor export");
      Backbone.Wreqr.radio.commands.execute( 'editor', 'export-editor');
    }
  });

  return ExportBehavior;
});
