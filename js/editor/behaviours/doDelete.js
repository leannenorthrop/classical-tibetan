define(['jquery', 'bootstrap', 'marionette'], function(Jquery, Bootstrap, Marionette){
  var DeleteBehavior = Backbone.Marionette.Behavior.extend({
    __name__: 'DeleteBehaviour',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    onDelete: function() {
      console.log("Do editor delete");
      Backbone.Wreqr.radio.commands.execute( 'editor', 'clear');
    }
  });

  return DeleteBehavior;
});
