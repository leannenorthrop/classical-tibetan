define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var AceModel = Backbone.Model.extend({
    defaults: {
      theme: "ace/theme/tomorrow",
      wrap: true,
      showMargin: false,
      hightlightActiveLine: false,
      fontSize: "12pt",
      mode: "ace/mode/markdown",
      text: "",
      blockScrolling: Infinity,
      showGutter: false
    }
  });

  return AceModel;
});
