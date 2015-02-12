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
        $(".glyphicon-resize-small").removeClass("glyphicon-resize-small").addClass("glyphicon-resize-full");
        $(".glyphicon-resize-full").attr("aria-label", "Full Screen");
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
          $(".glyphicon-resize-full").removeClass("glyphicon-resize-full").addClass("glyphicon-resize-small");
          $(".glyphicon-resize-small").attr("aria-label", "Normal Screen");
        });
      });
    });
  };

  App.editor.fullSize = function() {
    $('#preview-toolbar').hide('slow');
    fullsize("editor");
  }

  App.editor.halfSize = function() {
    $('#preview-toolbar').show('slow');
    halfsize("editor");
  }

  App.preview.fullSize = function() {
    $('#editor-toolbar').hide('slow');
    fullsize("preview");
  }

  App.preview.halfSize = function() {
    $('#editor-toolbar').show('slow');
    halfsize("preview");
  }
});
