define([
  'backbone',
  'editor/models/help'
], function(Backbone, Help){

  var AllHelpFiles = Backbone.Collection.extend({
    model: Help,
    url: "../js/content/help/options.json"
  });

  return AllHelpFiles;
});
