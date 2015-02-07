define([
  'backbone'
], function(Backbone){

  var PostModel = Backbone.Model.extend({
    __name__: 'PostModel',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    }
  });

  return PostModel;
});
