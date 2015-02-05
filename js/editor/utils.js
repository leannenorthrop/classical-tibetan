define(['editor/app'],
function(App) {
  App.utils = {};
  App.utils.loadCss = function(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
});
