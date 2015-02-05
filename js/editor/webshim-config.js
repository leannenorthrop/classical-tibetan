require(['jquery.webshim'], function(WebShim) {

  webshim.setOptions({
    basePath: '../js/lib/webshim/shims/',
    waitReady: false,
    forms: {
      lazyCustomMessages: true,
      addValidators: true,
      iVal: {
            sel: '.ws-validate',
            handleBubble: 'hide', // hide error bubble

            //add bootstrap specific classes
            errorMessageClass: 'help-block',
            successWrapperClass: 'has-success',
            errorWrapperClass: 'has-error',

            //add config to find right wrapper
            fieldWrapper: '.form-group'
        }
    },
  });

  webshim.polyfill('filereader forms');
});
