define(['editor/app'],
function(App) {
  var halfsize = function(c) {
    require(['jquery'], function($){
      console.log('half');
      var col = c === "editor" ? "left-side" : "right-side";
      var otherCol = c === "editor" ? "right-side" : "left-side";
      var $otherCol = $("."+otherCol);
      var $col = $("." + col);

      $col.animate({
        width: "50%"
      }, 1000, function() {
        $otherCol.attr("style", "display: table-cell; visibility: visible; width:50%");
        $("." + col + " .glyphicon-resize-small").removeClass("glyphicon-resize-small").addClass("glyphicon-resize-full");
        $("." + col + " .glyphicon-resize-full").attr("aria-label", "Full Screen");
      });
    });
  };

  var fullsize = function(c) {
    require(['jquery'], function($){
      console.log('full');
      var col = c === "editor" ? "left-side" : "right-side";
      var otherCol = c === "editor" ? "right-side" : "left-side";
      var $otherCol = $("."+otherCol);
      var $col = $("." + col);

      $otherCol.animate({width: "0%"}, 5, function() {
        $otherCol.attr("style", "display: none; width: 0%; visibility: hidden");
        $col.animate({
          width: "100%"
        }, 1000, function() {
          $("." + col + " .glyphicon-resize-full").removeClass("glyphicon-resize-full").addClass("glyphicon-resize-small");
          $("." + col + " .glyphicon-resize-small").attr("aria-label", "Normal Screen");
        });
      });
    });
  };

  App.editor.fullSize = function() {
    $('.right-side nav').hide('slow');
    fullsize("editor");
  }

  App.editor.halfSize = function() {
    $('.right-side nav').show('slow');
    halfsize("editor");
  }

  App.preview.fullSize = function() {
    $('.left-side nav').hide('slow');
    fullsize("preview");
  }

  App.preview.halfSize = function() {
    $('.left-side nav').show('slow');
    halfsize("preview");
  }
});
