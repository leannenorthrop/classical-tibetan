define(['editor/app'],
function(App) {
  var halfsize = function(c) {
    require(['jquery'], function($){
      var col = c === "editor" ? "left-col" : "right-col";
      var otherCol = c === "editor" ? "right-col" : "left-col";
      var $otherCol = $("#"+otherCol);
      var $col = $("#" + col);

      $col.animate({
        width: "50%"
      }, 1000, function() {
        $otherCol.attr("style", "display: table-cell; visibility: visible; width:50%");
        $("#editor_btns button.screen").attr("aria-label", "Normal Screen");
        $("#editor_btns button.screen span.glyphicon").removeClass("glyphicon-resize-small").addClass("glyphicon glyphicon-resize-full");
      });
    });
  };

  var fullsize = function(c) {
    require(['jquery'], function($){
      var col = c === "editor" ? "left-col" : "right-col";
      var otherCol = c === "editor" ? "right-col" : "left-col";
      var $otherCol = $("#"+otherCol);
      var $col = $("#" + col);

      $otherCol.animate({width: "0%"}, 5, function() {
        $otherCol.attr("style", "display: none; width: 0%; visibility: hidden");
        $col.animate({
          width: "100%"
        }, 1000, function() {
          $("#editor_btns button.screen").attr("aria-label", "Full Screen");
          $("#editor_btns button.screen span.glyphicon").removeClass("glyphicon-resize-full").addClass("glyphicon glyphicon-resize-small");
        });
      });
    });
  };

  App.editor.fullSize = function() {
    fullsize("editor");
  }

  App.editor.halfSize = function() {
    halfsize("editor");
  }

  App.preview.fullSize = function() {
    fullsize("preview");
  }

  App.preview.halfSize = function() {
    halfsize("preview");
  }
});
