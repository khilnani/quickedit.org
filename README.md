QuickEdit
================

> Web based text/code editor with Passphrase based 256bit text encryption and Dropbox support.

To use, go to http://QuickEdit.org


## Developer Notes

_Please take a look at the `gh-pages` branch for website source code._

> If you have an iTunes Apple iOS Developer account, you can easily provision this app and install it on your own devices using a Team or AdHoc Provision. Submission to the Apple Store for mass distribution is a longer process.

To build the iOS app, 

- Install XCode
- Install PhonGap - `npm install -g phonegap`
- Install Cordova - `npm install -g cordova`
- Install the following for iOS
  - `npm install -g ios-sim`
  - `npm install -g ios-deploy`
- Clone the git repository
- Switch to the master branch - `git checkout master`
- Init the submodule - `git submodule update --init`
- Add the iOS platform - `cordova platforms add ios`
  - This will create the XCode Project at `platforms/ios`
- Build and Run - `phonegap run ios`

### Note

- The visual art for icons and splash screens in the XCode project does not re-use the art specified by Cordova's `www/config.xml`. 
- If you use the http://build.phonegap.com service, no need to worry. That uses the `www/config.xml`.
- if you plan to build the application yourself using XCode, you will need to update the graphics in the XCode project yourself.



