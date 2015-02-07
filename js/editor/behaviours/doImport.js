define(['jquery', 'bootstrap', 'marionette'],
  function(Jquery, Bootstrap, Marionette){
  var ImportBehavior = Backbone.Marionette.Behavior.extend({
    __name__: 'ImportBehaviour',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    onImport: function(event) {
      console.log("Do editor import");
      Backbone.Wreqr.radio.commands.execute( 'editor', 'import-editor', event.file);
    }
  });

  return ImportBehavior;
});
