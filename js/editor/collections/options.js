define([
  'backbone',
  'editor/models/option'
], function(Backbone, OptionModel){

  var Options = Backbone.Collection.extend({
    model: OptionModel,
    __name__: 'Options',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    }
  });

  return Options;
});
