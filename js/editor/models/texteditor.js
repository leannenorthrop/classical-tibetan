define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var Model = Backbone.Model.extend({
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
