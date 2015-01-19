define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var AceModel = Backbone.Model.extend({
    defaults: {
      theme: "ace/theme/monokai",
      wrap: true,
      showMargin: false,
      mode: "ace/mode/markdown",
      text: ""
    }
  });

  return AceModel;
});
