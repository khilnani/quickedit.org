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

function passwordsMatch () {
  console.log("passwordsMatch()");
  
  if( $('#password').val() == $('#password2').val() ) {

    $('#passGroup').removeClass("has-error");
    $('#passwordError').addClass("hidden");

    return true;
  }

  $('#passGroup').addClass("has-error");
  $('#passwordError').removeClass("hidden");
  
  $("html, body").animate({ scrollTop: 0 }, "slow");

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
  
  onMessageChange();

  console.log('Page loaded');
});
