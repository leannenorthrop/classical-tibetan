requirejs.config({
    baseUrl: '../js/lib',
    paths: {
        editor: '../editor',
        jquery: 'jquery-1.11.2',
        underscore: 'underscore',
        backbone: 'backbone/backbone',
        templates: '../templates',
        content: '../content',
        bootstrap: 'bootstrap/bootstrap',
        marionette: 'backbone/marionette',
        'bootstrap.select': 'bootstrap/bootstrap-select',
        'backbone.wreqr': 'backbone/wreqr',
        'backbone.babysitter': 'backbone/babysitter',
        'cookies': 'jquery/cookies',
        'bootstrap.tagsinput': 'bootstrap/bootstrap-tagsinput'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'marionette': {
            deps: ['backbone', 'backbone.wreqr', 'backbone.babysitter'],
        },
        'markdown': {
            exports: 'markdown'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap.select': {
            deps: ['jquery', 'bootstrap']
        },
        'bootstrap.tagsinput': {
            deps: ['jquery', 'bootstrap']
        },
        'cookies': {
            deps: ['jquery']
        }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['../highlight.pack','editor/main']);
