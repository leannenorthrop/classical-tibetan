define([
  'backbone',
  'editor/models/help'
], function(Backbone, Help){

  var AllHelpFiles = Backbone.Collection.extend({
    model: Help,
    url: "../post_index.json"
  });

  return AllHelpFiles;
});
