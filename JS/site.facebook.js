/**
 * Objet de gestion de fonctionnalités facebook.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>, Dorian Yahouédéou <dorian.yahouedeou@finemedia.fr>
 * @copyright	© 2012, Fine Media
 */
site.facebook = new function() {
	/** Numéro de l'appli facebook */
	this._appId = '315262248492929'; // prod
	// this._appId = '119499098210742'; // test
	/** Current Domain */
	this._domain = '.ooreka.fr'; // prod
	// this._domain = '.finemedia.fr'; // test
	/** Sdk défini ou non */
	this._isFbSdkSetted = false;
	/** Autorisations nécessaires à l'application */
	this._appScope = {scope: 'email'};
	/** URL de la page à publier */
	this._url = null;
	/** Label du cookie de proposition d'ajout de l'application facebook */
	this._appSubmittedCookieName = 'facebookAppSubmitted';
	/** Label du cookie de validation des conditions de partage */
	this._pendingPublicationCookieName = 'facebookPendingPublication';
	/** Label du cookie contenant le token Facebook d'un utilisateur connecté */
	this._authTokenCookieName = 'facebookAuthToken';
	/** Status de la connexion facebook. */
	this._fbConnectionStatus = null;
	/** Identifant du compte facebook de l'utilisateur. */
	this._fbUserId = null;
	/** Numéro de session du compte facebook. */
	this._fbToken = null;
	/** Date de fin de session facebook. */
	this._expiresIn = null;

	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		// initialisation du sdk facebook
		this._initFbSdk(function() {
			site.facebook._isFbSdkSetted = true;
			if (controller == "tableauDeBord" && action == "param") {
				// initialisation de l'onglet d'accès au paramétrage facebook
				site.facebook.initDashboardFacebookTab();
			}
		});
	};
	/**
	 * Récupère les informations d'un utilisateur loggué sur facebook.
	 * @param	function	callback	Fonction a appeler avec la réponse facebook.
	 */
	this.getUserData = function(callback) {
		FB.api('/me', callback);
	};
	/** Initialiser l'onglet Facebook pour un utilisateur comprendrechoisir qui est connecté à l'application facebook */
	this.initDashboardFacebookTab = function() {
		if (this._fbConnectionStatus != 'connected')
			return;
		$('#_facebookDashboardTab').show();
	};

	/* ************************************ Authentification et habilitation ****************************************** */
	/**
	 * Retourne le status de la connexion facebook de l'utiisateur (action passive pour l'utilisateur).
	 * @param	function(string, int, string, int)	(optionnel) Fonction callback à appeler.
	 */
	this.getLoginStatus = function(getLogInStatusCallback) {
		if (this._fbConnectionStatus == 'connected') {
			if (getLogInStatusCallback)
				getLogInStatusCallback(this._fbConnectionStatus, this._fbUserId, this._fbToken, this._expiresIn);
			return;
		}
		FB.getLoginStatus(function(response) {
			site.facebook._fbConnectionStatus = response.status;
			if (response.status === 'connected') {
				site.facebook._fbUserId = response.authResponse.userID;
				site.facebook._fbToken = response.authResponse.accessToken;
				site.facebook._expiresIn = response.authResponse.expiresIn;
				// positionner le token de l'utilisateur en cookie
				site.facebook._setAuthTokenCookie(site.facebook._fbToken);
				// var expire = response.authResponse.expiresIn;
				// var signedRequest = response.authResponse.signedRequest;
			} else /* if (response.status === 'not_authorized' || response.status === 'not_logged_in') */ {
				site.facebook._fbUserId = null;
				site.facebook._fbToken = null;
				site.facebook._expiresIn = null;
			}
			if (getLogInStatusCallback) {
				getLogInStatusCallback(site.facebook._fbConnectionStatus, site.facebook._fbUserId, site.facebook._fbToken, site.facebook._expiresIn);
			}
		}, this._appScope);
	};
	/**
	 * Retourne le statut de la connexion facebook de l'utiisateur (action active pour l'utilisateur).
	 * @param	function(string, int, string, int)	(optionnel) Fonction callback à appeler.
	 */
	this.login = function(callbackFunction) {
		FB.login(function(response) {
			site.facebook._fbConnectionStatus = response.status;
			if (response.status === 'connected') {
				// connected
				site.facebook._fbUserId = response.authResponse.userID;
				site.facebook._fbToken = response.authResponse.accessToken;
				site.facebook._expiresIn = response.authResponse.expiresIn;
				// positionner le token de l'utilisateur en cookie
				site.facebook._setAuthTokenCookie(site.facebook._fbToken);
			} else {
				site.facebook._fbUserId = null;
				site.facebook._fbToken = null;
				site.facebook._expiresIn = null;
			}
			// indique que l'application a été proposée à l'utilisateur
			site.facebook._setAppSubmittedCookie();
			if (callbackFunction) {
				callbackFunction(site.facebook._fbConnectionStatus, site.facebook._fbUserId, site.facebook._fbToken, site.facebook._expiresIn);
			}
		}, this._appScope);
	};

	/* ************************************ Fonctions privées ****************************************** */
	/**
	 * Initialise le sdk facebook et retrouve le status de la connexion utilisateur sur facebook.
	 * @param	function	callback	Fonction appelée quand le framework est initialisé.
	 */
	this._initFbSdk = function(initFbSdkCallback) {
		if (this._isFbSdkSetted)
			return;
		// Insertion du script facebook.
		var js;
		var id = 'facebook-jssdk'
		var ref = document.getElementsByTagName('script')[0];
		if (document.getElementById(id))
			return;
		js = document.createElement('script');
		js.id = id;
		js.async = true;
		js.src = "https://connect.facebook.net/en_US/all.js";
		js.onload = function() {
			FB.init({
				appId:		site.facebook._appId,	// App ID
		//		channelUrl:	'/fbChannel.html',	// Channel File
				status:		true,			// check login status
				cookie:		true,			// enable cookies to allow the server to access the session
				xfbml:		true			// parse XFBML

			});
			site.facebook.getLoginStatus(initFbSdkCallback);
		};
		ref.parentNode.insertBefore(js, ref);
	};
	/** Mettre à jour le cookie de proposition de l'application */
	this._setAppSubmittedCookie = function() {
		var cookieOptions = {
			expires: 30,
			path: '/',
			domain: this._domain
		};
		$.cookie(this._appSubmittedCookieName, 'true', cookieOptions);
	};
	/** Définir le cookie avec le authtoken facebook de l'utilisateur connecté */
	this._setAuthTokenCookie = function(fbToken) {
		var cookieOptions = {
			expires: 30,
			path: '/',
			domain: this._domain
		}
		$.cookie(this._authTokenCookieName, fbToken, cookieOptions);
	};
	/**
	 * Vérifier si on peut proposer l'application a un utilisateur sur la base de son cookie. Durée de vie de 30 jours. Proposer l'application tous les 30 jours.
	 * @return	bool	false: l'application n'a pas été proposée, true: elle a été proposée il  y a moins de 30 jours.
	 */
	this._appSubmitted = function() {
		if ($.cookie(this._appSubmittedCookieName))
			return (true);
		return (false);
	};
};

