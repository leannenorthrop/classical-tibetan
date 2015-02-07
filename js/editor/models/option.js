define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var OptionModel = Backbone.Model.extend({
    __name__: 'OptionModel',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    defaults: {
      value: "",
      icon: "",
      name: "",
      cmd: {name: "", options: {}}
    }
  });

  return OptionModel;
});
