function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function encrypt(text, pass) {
  //console.log('pass:' + pass + ' encrypt IN:' + text);
  var key = Sha256.hash(pass);  
  var encrypted = Aes.Ctr.encrypt(text, key, 256);
  //console.log('encrypt OUT:' + encrypted);
  return encrypted;
}

function decrypt (text, pass) {
  //console.log('pass:' + pass + ' decrypt IN:' + text);
  var key = Sha256.hash(pass);  
  var decrypted = Aes.Ctr.decrypt(text, key, 256);
  //console.log('decrypt OUT:' + decrypted);
  return decrypted;
}

function backToTop() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
}

function passwordsMatch() {
  console.log("passwordsMatch()");
  
  if( $('#password').val() == $('#password2').val() ) {

    $('#passGroup').removeClass("has-error");
    $('#passwordError').addClass("hidden");

    return true;
  }

  $('#passGroup').addClass("has-error");
  $('#passwordError').removeClass("hidden");
  
  backToTop();

  return false;
}

function onMessageChange() {
    console.log("onMessageChange()");
    var m = $('#message');
    
    $("#count").text( m.val().length  );

    m.autosize({ append: '\n'});
    m.trigger('autosize.resize');
}

function messageUpdated() {
  $('#message').select();
  onMessageChange();
}

function clearMessage() {
  bootbox.confirm("Clear message?", function(result) {
    if(result == true) {
      $('#message').val('');
      onMessageChange();
    }
  });
}

function pageEncrypt() {
  console.log("pageEncrypt()");
  if ( passwordsMatch() ) {
    $('#message').val( encrypt( $('#message').val(), $('#password').val() ) );
    messageUpdated();
  }
}

function pageDecrypt() {
  console.log("pageDecrypt()");
  if( passwordsMatch() ) {  
    $('#message').val( decrypt( $('#message').val(), $('#password').val() ) );
    messageUpdated();
  }
}



$( function() {
  
  $("#message").change( onMessageChange );
  $("#message").keyup( onMessageChange );
  
  $('#encrypt').click( pageEncrypt );
  $('#decrypt').click( pageDecrypt );
  
  $('#backToTop').click( backToTop );
  $('#clearMessage').click( clearMessage );
  
  
  onMessageChange();
  
  $('#splashscreen').delay( 1000 ).fadeOut('slow');
  
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

  console.log('Page loaded');
});
