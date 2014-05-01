/*!
 * Add to Homescreen v2.0.11 ~ Copyright (c) 2013 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
var addToHome = (function (w) {
	var nav = w.navigator,
		isIDevice = 'platform' in nav && (/iphone|ipod|ipad/gi).test(nav.platform),
		isIPad,
		isRetina,
		isSafari,
		isStandalone,
		OSVersion,
		startX = 0,
		startY = 0,
		lastVisit = 0,
		isExpired,
		isSessionActive,
		isReturningVisitor,
		balloon,
		overrideChecks,

		positionInterval,
		closeTimeout,

		options = {
			autostart: true,			// Automatically open the balloon
			returningVisitor: false,	// Show the balloon to returning visitors only (setting this to true is highly recommended)
			animationIn: 'drop',		// drop || bubble || fade
			animationOut: 'fade',		// drop || bubble || fade
			startDelay: 2000,			// 2 seconds from page load before the balloon appears
			lifespan: 15000,			// 15 seconds before it is automatically destroyed
			bottomOffset: 14,			// Distance of the balloon from bottom
			expire: 0,					// Minutes to wait before showing the popup again (0 = always displayed)
			message: '',				// Customize your message or force a language ('' = automatic)
			touchIcon: false,			// Display the touch icon
			arrow: true,				// Display the balloon arrow
			hookOnLoad: true,			// Should we hook to onload event? (really advanced usage)
			closeButton: true,			// Let the user close the balloon
			iterations: 100				// Internal/debug use
		},

		intl = {
			ar:    '<span dir="rtl">Ù‚Ù… Ø¨ØªØ«Ø¨ÙŠØª Ù‡Ø°Ø§ Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ Ø¹Ù„Ù‰ <span dir="ltr">%device:</span>Ø§Ù†Ù‚Ø±<span dir="ltr">%icon</span> ØŒ<strong>Ø«Ù… Ø§Ø¶ÙÙ‡ Ø§Ù„Ù‰ Ø§Ù„Ø´Ø§Ø´Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©.</strong></span>',
			ca_es: 'Per instalÂ·lar aquesta aplicaciÃ³ al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d\'inici</strong>.',
			cs_cz: 'Pro instalaci aplikace na VÃ¡Å¡ %device, stisknÄ›te %icon a v nabÃ­dce <strong>PÅ™idat na plochu</strong>.',
			da_dk: 'TilfÃ¸j denne side til din %device: tryk pÃ¥ %icon og derefter <strong>FÃ¸j til hjemmeskÃ¦rm</strong>.',
			de_de: 'Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.',
			el_gr: 'Î•Î³ÎºÎ±Ï„Î±ÏƒÏ„Î®ÏƒÎµÏ„Îµ Î±Ï…Ï„Î®Î½ Ï„Î·Î½ Î•Ï†Î±ÏÎ¼Î¿Î³Î® ÏƒÏ„Î®Î½ ÏƒÏ…ÏƒÎºÎµÏ…Î® ÏƒÎ±Ï‚ %device: %icon Î¼ÎµÏ„Î¬ Ï€Î±Ï„Î¬Ï„Îµ <strong>Î ÏÎ¿ÏƒÎ¸Î®ÎºÎ· ÏƒÎµ Î‘Ï†ÎµÏ„Î·ÏÎ¯Î±</strong>.',
			en_us: 'Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.',
			es_es: 'Para instalar esta app en su %device, pulse %icon y seleccione <strong>AÃ±adir a pantalla de inicio</strong>.',
			fi_fi: 'Asenna tÃ¤mÃ¤ web-sovellus laitteeseesi %device: paina %icon ja sen jÃ¤lkeen valitse <strong>LisÃ¤Ã¤ Koti-valikkoon</strong>.',
			fr_fr: 'Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Ajouter Ã  l\'Ã©cran d\'accueil</strong>.',
			he_il: '<span dir="rtl">×”×ª×§×Ÿ ××¤×œ×™×§×¦×™×” ×–×• ×¢×œ ×”-%device ×©×œ×š: ×”×§×© %icon ×•××– <strong>×”×•×¡×£ ×œ×ž×¡×š ×”×‘×™×ª</strong>.</span>',
			hr_hr: 'Instaliraj ovu aplikaciju na svoj %device: klikni na %icon i odaberi <strong>Dodaj u poÄetni zaslon</strong>.',
			hu_hu: 'TelepÃ­tse ezt a web-alkalmazÃ¡st az Ã–n %device-jÃ¡ra: nyomjon a %icon-ra majd a <strong>FÅ‘kÃ©pernyÅ‘hÃ¶z adÃ¡s</strong> gombra.',
			it_it: 'Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.',
			ja_jp: 'ã“ã®ã‚¦ã‚§ãƒ–ã‚¢ãƒ—ãƒªã‚’ã‚ãªãŸã®%deviceã«ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«ã™ã‚‹ã«ã¯%iconã‚’ã‚¿ãƒƒãƒ—ã—ã¦<strong>ãƒ›ãƒ¼ãƒ ç”»é¢ã«è¿½åŠ </strong>ã‚’é¸ã‚“ã§ãã ã•ã„ã€‚',
			ko_kr: '%deviceì— ì›¹ì•±ì„ ì„¤ì¹˜í•˜ë ¤ë©´ %iconì„ í„°ì¹˜ í›„ "í™ˆí™”ë©´ì— ì¶”ê°€"ë¥¼ ì„ íƒí•˜ì„¸ìš”',
			nb_no: 'Installer denne appen pÃ¥ din %device: trykk pÃ¥ %icon og deretter <strong>Legg til pÃ¥ Hjem-skjerm</strong>',
			nl_nl: 'Installeer deze webapp op uw %device: tik %icon en dan <strong>Voeg toe aan beginscherm</strong>.',
			pl_pl: 'Aby zainstalowaÄ‡ tÄ™ aplikacje na %device: naciÅ›nij %icon a nastÄ™pnie <strong>Dodaj jako ikonÄ™</strong>.',
			pt_br: 'Instale este aplicativo em seu %device: aperte %icon e selecione <strong>Adicionar Ã  Tela Inicio</strong>.',
			pt_pt: 'Para instalar esta aplicaÃ§Ã£o no seu %device, prima o %icon e depois em <strong>Adicionar ao ecrÃ£ principal</strong>.',
			ru_ru: 'Ð£ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚Ðµ ÑÑ‚Ð¾ Ð²ÐµÐ±-Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð½Ð° Ð²Ð°Ñˆ %device: Ð½Ð°Ð¶Ð¼Ð¸Ñ‚Ðµ %icon, Ð·Ð°Ñ‚ÐµÐ¼ <strong>Ð”Ð¾Ð±Ð°Ð²Ð¸Ñ‚ÑŒ Ð² Â«Ð”Ð¾Ð¼Ð¾Ð¹Â»</strong>.',
			sv_se: 'LÃ¤gg till denna webbapplikation pÃ¥ din %device: tryck pÃ¥ %icon och dÃ¤refter <strong>LÃ¤gg till pÃ¥ hemskÃ¤rmen</strong>.',
			th_th: 'à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡à¹€à¸§à¹‡à¸šà¹à¸­à¸žà¸¯ à¸™à¸µà¹‰à¸šà¸™ %device à¸‚à¸­à¸‡à¸„à¸¸à¸“: à¹à¸•à¸° %icon à¹à¸¥à¸° <strong>à¹€à¸žà¸´à¹ˆà¸¡à¸—à¸µà¹ˆà¸«à¸™à¹‰à¸²à¸ˆà¸­à¹‚à¸®à¸¡</strong>',
			tr_tr: 'Bu uygulamayÄ± %device\'a eklemek iÃ§in %icon simgesine sonrasÄ±nda <strong>Ana Ekrana Ekle</strong> dÃ¼ÄŸmesine basÄ±n.',
			uk_ua: 'Ð’ÑÑ‚Ð°Ð½Ð¾Ð²Ñ–Ñ‚ÑŒ Ñ†ÐµÐ¹ Ð²ÐµÐ± ÑÐ°Ð¹Ñ‚ Ð½Ð° Ð’Ð°Ñˆ %device: Ð½Ð°Ñ‚Ð¸ÑÐ½Ñ–Ñ‚ÑŒ %icon, Ð° Ð¿Ð¾Ñ‚Ñ–Ð¼ <strong>ÐÐ° Ð¿Ð¾Ñ‡Ð°Ñ‚ÐºÐ¾Ð²Ð¸Ð¹ ÐµÐºÑ€Ð°Ð½</strong>.',
			zh_cn: 'æ‚¨å¯ä»¥å°†æ­¤åº”ç”¨å®‰è£…åˆ°æ‚¨çš„ %device ä¸Šã€‚è¯·æŒ‰ %icon ç„¶åŽé€‰æ‹©<strong>æ·»åŠ è‡³ä¸»å±å¹•</strong>ã€‚',
			zh_tw: 'æ‚¨å¯ä»¥å°‡æ­¤æ‡‰ç”¨ç¨‹å¼å®‰è£åˆ°æ‚¨çš„ %device ä¸Šã€‚è«‹æŒ‰ %icon ç„¶å¾Œé»žé¸<strong>åŠ å…¥ä¸»ç•«é¢èž¢å¹•</strong>ã€‚'
		};

	function init () {
		// Preliminary check, all further checks are performed on iDevices only
		if ( !isIDevice ) return;

		var now = Date.now(),
			i;

		// Merge local with global options
		if ( w.addToHomeConfig ) {
			for ( i in w.addToHomeConfig ) {
				options[i] = w.addToHomeConfig[i];
			}
		}
		if ( !options.autostart ) options.hookOnLoad = false;

		isIPad = (/ipad/gi).test(nav.platform);
		isRetina = w.devicePixelRatio && w.devicePixelRatio > 1;
		isSafari = (/Safari/i).test(nav.appVersion) && !(/CriOS/i).test(nav.appVersion);
		isStandalone = nav.standalone;
		OSVersion = nav.appVersion.match(/OS (\d+_\d+)/i);
		OSVersion = OSVersion && OSVersion[1] ? +OSVersion[1].replace('_', '.') : 0;

		lastVisit = +w.localStorage.getItem('addToHome');

		isSessionActive = w.sessionStorage.getItem('addToHomeSession');
		isReturningVisitor = options.returningVisitor ? lastVisit && lastVisit + 28*24*60*60*1000 > now : true;

		if ( !lastVisit ) lastVisit = now;

		// If it is expired we need to reissue a new balloon
		isExpired = isReturningVisitor && lastVisit <= now;

		if ( options.hookOnLoad ) w.addEventListener('load', loaded, false);
		else if ( !options.hookOnLoad && options.autostart ) loaded();
	}

	function loaded () {
		w.removeEventListener('load', loaded, false);

		if ( !isReturningVisitor ) w.localStorage.setItem('addToHome', Date.now());
		else if ( options.expire && isExpired ) w.localStorage.setItem('addToHome', Date.now() + options.expire * 60000);

		if ( !overrideChecks && ( !isSafari || !isExpired || isSessionActive || isStandalone || !isReturningVisitor ) ) return;

		var touchIcon = '',
			platform = nav.platform.split(' ')[0],
			language = nav.language.replace('-', '_');

		balloon = document.createElement('div');
		balloon.id = 'addToHomeScreen';
		balloon.style.cssText += 'left:-9999px;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);position:' + (OSVersion < 5 ? 'absolute' : 'fixed');

		// Localize message
		if ( options.message in intl ) {		// You may force a language despite the user's locale
			language = options.message;
			options.message = '';
		}
		if ( options.message === '' ) {			// We look for a suitable language (defaulted to en_us)
			options.message = language in intl ? intl[language] : intl['en_us'];
		}

		if ( options.touchIcon ) {
			touchIcon = isRetina ?
				document.querySelector('head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon]') :
				document.querySelector('head link[rel^=apple-touch-icon][sizes="57x57"],head link[rel^=apple-touch-icon]');

			if ( touchIcon ) {
				touchIcon = '<span style="background-image:url(' + touchIcon.href + ')" class="addToHomeTouchIcon"></span>';
			}
		}

		balloon.className = (OSVersion >=7 ? 'addToHomeIOS7 ' : '') + (isIPad ? 'addToHomeIpad' : 'addToHomeIphone') + (touchIcon ? ' addToHomeWide' : '');
		balloon.innerHTML = touchIcon +
			options.message.replace('%device', platform).replace('%icon', OSVersion >= 4.2 ? '<span class="addToHomeShare"></span>' : '<span class="addToHomePlus">+</span>') +
			(options.arrow ? '<span class="addToHomeArrow"' + (OSVersion >= 7 && isIPad && touchIcon ? ' style="margin-left:-32px"' : '') + '></span>' : '') +
			(options.closeButton ? '<span class="addToHomeClose">\u00D7</span>' : '');

		document.body.appendChild(balloon);

		// Add the close action
		if ( options.closeButton ) balloon.addEventListener('click', clicked, false);

		if ( !isIPad && OSVersion >= 6 ) window.addEventListener('orientationchange', orientationCheck, false);

		setTimeout(show, options.startDelay);
	}

	function show () {
		var duration,
			iPadXShift = 208;

		// Set the initial position
		if ( isIPad ) {
			if ( OSVersion < 5 ) {
				startY = w.scrollY;
				startX = w.scrollX;
			} else if ( OSVersion < 6 ) {
				iPadXShift = 160;
			} else if ( OSVersion >= 7 ) {
				iPadXShift = 143;
			}

			balloon.style.top = startY + options.bottomOffset + 'px';
			balloon.style.left = Math.max(startX + iPadXShift - Math.round(balloon.offsetWidth / 2), 9) + 'px';

			switch ( options.animationIn ) {
				case 'drop':
					duration = '0.6s';
					balloon.style.webkitTransform = 'translate3d(0,' + -(w.scrollY + options.bottomOffset + balloon.offsetHeight) + 'px,0)';
					break;
				case 'bubble':
					duration = '0.6s';
					balloon.style.opacity = '0';
					balloon.style.webkitTransform = 'translate3d(0,' + (startY + 50) + 'px,0)';
					break;
				default:
					duration = '1s';
					balloon.style.opacity = '0';
			}
		} else {
			startY = w.innerHeight + w.scrollY;

			if ( OSVersion < 5 ) {
				startX = Math.round((w.innerWidth - balloon.offsetWidth) / 2) + w.scrollX;
				balloon.style.left = startX + 'px';
				balloon.style.top = startY - balloon.offsetHeight - options.bottomOffset + 'px';
			} else {
				balloon.style.left = '50%';
				balloon.style.marginLeft = -Math.round(balloon.offsetWidth / 2) - ( w.orientation%180 && OSVersion >= 6 && OSVersion < 7 ? 40 : 0 ) + 'px';
				balloon.style.bottom = options.bottomOffset + 'px';
			}

			switch (options.animationIn) {
				case 'drop':
					duration = '1s';
					balloon.style.webkitTransform = 'translate3d(0,' + -(startY + options.bottomOffset) + 'px,0)';
					break;
				case 'bubble':
					duration = '0.6s';
					balloon.style.webkitTransform = 'translate3d(0,' + (balloon.offsetHeight + options.bottomOffset + 50) + 'px,0)';
					break;
				default:
					duration = '1s';
					balloon.style.opacity = '0';
			}
		}

		balloon.offsetHeight;	// repaint trick
		balloon.style.webkitTransitionDuration = duration;
		balloon.style.opacity = '1';
		balloon.style.webkitTransform = 'translate3d(0,0,0)';
		balloon.addEventListener('webkitTransitionEnd', transitionEnd, false);

		closeTimeout = setTimeout(close, options.lifespan);
	}

	function manualShow (override) {
		if ( !isIDevice || balloon ) return;

		overrideChecks = override;
		loaded();
	}

	function close () {
		clearInterval( positionInterval );
		clearTimeout( closeTimeout );
		closeTimeout = null;

		// check if the popup is displayed and prevent errors
		if ( !balloon ) return;

		var posY = 0,
			posX = 0,
			opacity = '1',
			duration = '0';

		if ( options.closeButton ) balloon.removeEventListener('click', clicked, false);
		if ( !isIPad && OSVersion >= 6 ) window.removeEventListener('orientationchange', orientationCheck, false);

		if ( OSVersion < 5 ) {
			posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY;
			posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth)/2) - startX;
		}

		balloon.style.webkitTransitionProperty = '-webkit-transform,opacity';

		switch ( options.animationOut ) {
			case 'drop':
				if ( isIPad ) {
					duration = '0.4s';
					opacity = '0';
					posY += 50;
				} else {
					duration = '0.6s';
					posY += balloon.offsetHeight + options.bottomOffset + 50;
				}
				break;
			case 'bubble':
				if ( isIPad ) {
					duration = '0.8s';
					posY -= balloon.offsetHeight + options.bottomOffset + 50;
				} else {
					duration = '0.4s';
					opacity = '0';
					posY -= 50;
				}
				break;
			default:
				duration = '0.8s';
				opacity = '0';
		}

		balloon.addEventListener('webkitTransitionEnd', transitionEnd, false);
		balloon.style.opacity = opacity;
		balloon.style.webkitTransitionDuration = duration;
		balloon.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}


	function clicked () {
		w.sessionStorage.setItem('addToHomeSession', '1');
		isSessionActive = true;
		close();
	}

	function transitionEnd () {
		balloon.removeEventListener('webkitTransitionEnd', transitionEnd, false);

		balloon.style.webkitTransitionProperty = '-webkit-transform';
		balloon.style.webkitTransitionDuration = '0.2s';

		// We reached the end!
		if ( !closeTimeout ) {
			balloon.parentNode.removeChild(balloon);
			balloon = null;
			return;
		}

		// On iOS 4 we start checking the element position
		if ( OSVersion < 5 && closeTimeout ) positionInterval = setInterval(setPosition, options.iterations);
	}

	function setPosition () {
		var matrix = new WebKitCSSMatrix(w.getComputedStyle(balloon, null).webkitTransform),
			posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY,
			posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth) / 2) - startX;

		// Screen didn't move
		if ( posY == matrix.m42 && posX == matrix.m41 ) return;

		balloon.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}

	// Clear local and session storages (this is useful primarily in development)
	function reset () {
		w.localStorage.removeItem('addToHome');
		w.sessionStorage.removeItem('addToHomeSession');
	}

	function orientationCheck () {
		balloon.style.marginLeft = -Math.round(balloon.offsetWidth / 2) - ( w.orientation%180 && OSVersion >= 6 && OSVersion < 7 ? 40 : 0 ) + 'px';
	}

	// Bootstrap!
	init();

	return {
		show: manualShow,
		close: close,
		reset: reset
	};
})(window);
