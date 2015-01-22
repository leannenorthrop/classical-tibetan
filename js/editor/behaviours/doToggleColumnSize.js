define(['jquery', 'bootstrap', 'marionette'], function($, Bootstrap, Marionette){
  var OnToggleColumnSizeBehavior = Backbone.Marionette.Behavior.extend({
    onToggleColumnSize: function(event) {
      console.log("Do editor toggle column size");
      var col = event.col === "leftColumn" ? "left-col" : "right-col";
      var otherCol = event.col === "leftColumn" ? "right-col" : "left-col";

      if ($("#"+otherCol).width() === 0) {
        $("#"+otherCol).animate({display: "table-cell", width: "50%"}, 5, function() {
         $( "#" + col).animate({
            width: "50%"
          }, 1000, function() {
            // Animation complete.
          });
        });
      } else {
        $("#"+otherCol).animate({display: "none", width: "0%"}, 5, function() {
         $( "#" + col).animate({
            width: "100%"
          }, 1000, function() {
            // Animation complete.
          });
        });
      }
    }
  });

  return OnToggleColumnSizeBehavior;
});
