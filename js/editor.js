requirejs.config({
    baseUrl: '../js/lib',
    paths: {
        editor: '../editor',
        jquery: 'jquery-1.11.2',
        underscore: 'underscore',
        backbone: 'backbone',
        templates: '../templates',
        content: '../content'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'markdown': {
            exports: 'markdown'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-select': {
            deps: ['jquery', 'bootstrap']
        }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['editor/main']);
