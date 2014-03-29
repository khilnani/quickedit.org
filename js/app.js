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
  if( $('#password').val() == $('#password2').val() ) {

    $('#passGroup').removeClass("has-error");
    $('#passwordError').addClass("hidden");

    return true;
  }

  $('#passGroup').addClass("has-error");
  $('#passwordError').addClass("show");

  return false;
}

function pageEncrypt() {
  if ( passwordsMatch() ) {
    $('#message').val( encrypt( $('#message').val(), $('#password').val() ) );
    $('#message').select();
  }
}

function pageDecrypt () {
  if( passwordsMatch() ) {  
    $('#message').val( decrypt( $('#message').val(), $('#password').val() ) );
    $('#message').select();
  }
}

$( function () {
  
  $('#encrypt').click( pageEncrypt );
  $('#decrypt').click( pageDecrypt );

  console.log('Page loaded');
});

