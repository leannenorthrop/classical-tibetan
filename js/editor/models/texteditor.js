define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var Model = Backbone.Model.extend({
    __name__: 'TextEditorModel',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    defaults: {
      theme: "solarized",
      wrap: true,
      mode: "markdown",
      text: "",
      showGutter: false
    }
  });

  return Model;
});
