function encrypt(text, pass) {
  //console.log('pass:' + pass + ' encrypt IN:' + text);
  var key = str_sha1(pass);  
  var encrypted = Aes.Ctr.encrypt(text, key, 256);
  //console.log('encrypt OUT:' + encrypted);
  return encrypted;
}

function decrypt (text, pass) {
  //console.log('pass:' + pass + ' decrypt IN:' + text);
  var key = str_sha1(pass);  
  var decrypted = Aes.Ctr.decrypt(text, key, 256);
  //console.log('decrypt OUT:' + decrypted);
  return decrypted;
}

function pageEncrypt() {
  $('#message').val( encrypt( $('#message').val(), $('#password').val() ) );
}

function pageDecrypt () {
  $('#message').val( decrypt( $('#message').val(), $('#password').val() ) );
}

$( function () {
  
  $('#encrypt').click( pageEncrypt );
  $('#decrypt').click( pageDecrypt );

  console.log('Page loaded');
});

