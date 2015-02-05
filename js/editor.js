/* global require */
require(['editor/require-config'], function() {

    require([
        '../highlight.pack',
        'editor/webshim-config',
        'editor/main'
    ],

    function(HighLight, WebShim, App) {});

});
