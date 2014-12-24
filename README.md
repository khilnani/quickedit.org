quick encrypt
================

> SHA1 and AES powered web based text encryption for mobile and desktop with Dropbox integration.

To use, go to http://quickencrypt.org . Feel free to create defect/suggestion tickets in Github.

## Recent Changes

- Integrated the CodeMirror editor that supports themes, syntax highlighting and editor modes (eg Vim).
  - Available on Desktop browsers only. Mobile support has a wierd double cursor issue.
  - Editor preferences are now saved in the browser and retained across browser sessions. 
    - *Note* - Message/file content is not saved in the browser.
- Improved Dropbox file browsing experience:
  - File browser remembers last directory a file was opened from.
    - *Note* - Not saved across page refresh/reloads or browser sessions.
  - Editor displays the file path for a file opened or saved to via Dropbox.
  - Overwriting files is now supported - click a file name to get confirmation popup prior to saving.
  - Directory creation support added.
  - Files larger than 1mb are disabled for reading for performance reasons.

See [Github Issues](https://github.com/khilnani/quickencrypt/issues?q=is%3Aissue+is%3Aclosed) for more info.

## Developer Notes 

Please note that this branch includes both traditional web site code as well as PhoneGap/Cordova configuration files. For more info, please take a look at the `master` branch.


### Screenshots

#### Cordova iOS Applicaton

<img src="https://raw.githubusercontent.com/khilnani/quickencrypt/gh-pages/docs/screenshots/ios4-1.png" width="40%" /> <img src="https://raw.githubusercontent.com/khilnani/quickencrypt/gh-pages/docs/screenshots/ios4-2.png" width="40%" />

<img src="https://raw.githubusercontent.com/khilnani/quickencrypt/gh-pages/docs/screenshots/ios4-3.png" width="40%" /> <img src="https://raw.githubusercontent.com/khilnani/quickencrypt/gh-pages/docs/screenshots/ipad-2.png" width="40%" />

#### Web Applicaton

<img src="https://raw.githubusercontent.com/khilnani/quickencrypt/gh-pages/docs/screenshots/web1-ios.jpg" width="40%" /> <img src="https://raw.githubusercontent.com/khilnani/quickencrypt/gh-pages/docs/screenshots/web2-ios.jpg" width="40%" />

<img src="https://raw.githubusercontent.com/khilnani/quickencrypt/gh-pages/docs/screenshots/web3-desktop.jpg" width="40%" /> <img src="https://raw.githubusercontent.com/khilnani/quickencrypt/gh-pages/docs/screenshots/web4-dropbox.jpg" width="40%" />

<img src="https://raw.githubusercontent.com/khilnani/quickencrypt/gh-pages/docs/screenshots/web5-encrypted.jpg" width="40%" /> <img src="https://raw.githubusercontent.com/khilnani/quickencrypt/gh-pages/docs/screenshots/web6-about.jpg" width="40%" />
