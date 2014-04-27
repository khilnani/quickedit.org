$( function() {
  
  var dbChooseOptions = {
    success: function(files) {
      // name, link, bytes, icon, thumbnailLink
      $('#message').load( files[0].link, function () {
        onMessageChange();
      });
    },
    cancel: function() {

    },
    linkType: "direct", // or "direct"
    multiselect: false, // or true
    extensions: ['.md', '.txt', '.markdown', '.rsa'],
  };
  
  $('#dbChooseFile').click( function () {
    if( Dropbox.isBrowserSupported() ) 
      Dropbox.choose( dbChooseOptions ); 
  });
  
  $('#dbSaveFile').click( function () {
    if( Dropbox.isBrowserSupported() ) 
      Dropbox.save("http://google.com", "google.txt");
  });

  console.log('Dropins loaded');
});
