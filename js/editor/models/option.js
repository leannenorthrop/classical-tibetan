define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var OptionModel = Backbone.Model.extend({
    defaults: {
      value: "",
      icon: "",
      name: "",
      cmd: {name: "", options: {}}
    }
  });

  return OptionModel;
});
