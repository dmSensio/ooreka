/**
 * Objet de gestion de l'authentification.
 * @author	Dorian Yahouédéou	<dorian.yahouedeou@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
site.authentication = new function() {
	/** URL courante. */
	this._url = null;
	/** Controller courant. */
	this._controller = null;
	/** Origine de l'autentification ('library','partners','lead','qr','direct', 'other', 'contact'). */
	this._origin = null;
	/** Action courante. */
	this._action = null;
	/** Identifiant du formulaire d'authenfication */
	this._authFormId = '';
	/** Statut de connexion de l'utilisateur. */
	this.isConnected = null;

	/* ******************** INITIALISATIONS ***************** */
	/**
	 * Initialisation de l'objet.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 * @param	bool	isConnected	Indique si l'utilisateur est connecté ou non.
	 */
	this.init = function(url, controller, action, isConnected) {
		this._url = url;
		this._controller = controller;
		this._origin = controller;
		this._action = action;
		this.isConnected = isConnected;
		urlVars = this._getUrlVars();
		// popin login.
		$('#_authenticationPopup').dialog({
			disabled:	true,
			width:		680,
			height:		'auto',
			position:	[site.dialogPositionX],
			modal:		true,
			draggable:      false,
			resizable:      false,
			closeText:      'Fermer'
		});
		$('#_authenticationPopup').dialog('close');
		// initialisation des popups liées
		site.authentication.lostPassword.init(url, controller, action);
		site.authentication.linkAccountsPopup.init(url, controller, action);
		if (controller == 'identification' || controller == 'tableauDeBord' || controller == 'ugc') {
			site.authentication.ugcSkill.init(url, controller, action);
		}
		var qrAction = ["repondre", "reagir", "commenter", "memeProbleme", "voter", "question"];
		var actionCode = urlVars['action'];
		var formActionCode = this.getActionCode('#_authForm-');
		if (qrAction.indexOf(actionCode) > 0)
			this._origin = 'qr';
		else if (actionCode == 'newsletter' || formActionCode == 'newsletter')
			this._origin = 'newsletter';
		else if (actionCode == "telecharger")
			this._origin = 'library';
		else if (actionCode == "contactMembre")
			this._origin = 'contact';
		else if (actionCode == "inscrire" || actionCode == "inscription")
			this._origin = 'direct';
		else if (this._controller == 'identification')
			this._origin = 'direct';
		else
			this._origin = 'other';
	};
	/**
	 * Initialisation du formulaire d'authentification.
	 * @param	string	authType	Type d'authentification.
	 * @param	string	userType	Type d'utilisateur (pro, part).
	 * @param	int	authFormId	Identifiant du formulaire d'authentification à afficher.
	 */
	this.initializeAuthForm = function(authType, userType, authFormId) {
		// définition du contexte
		this._authFormId = authFormId;
		var authFormSelector = this._getAuthFormSelector(authFormId);
		if (!authType)
			authType = 'login';
		if (!userType)
			userType = 'part';
		// cacher les messages d'erreurs
		this._hideErrors();
		// on cache tous les encarts
		$(authFormSelector + ' ._authForm_loginForm, ' + authFormSelector + ' ._authForm_registerForm').hide();
		// réinitialisation des erreurs
		$(authFormSelector + ' ._authForm_registerForm ._error').hide();
		// ouverture de l'onglet demandé dans la popup
		$(authFormSelector).attr('data-auth-type', authType);
		$(authFormSelector).attr('data-user-type', userType);
		var qrAction = ["repondre", "reagir", "commenter", "memeProbleme", "voter", "question"];
		var actionCode = urlVars['action'];
		if (actionCode == undefined || actionCode == '')
			actionCode = this.getActionCode(authFormId);
		if (qrAction.indexOf(actionCode) > 0)
			this._origin = 'qr';
		else if (actionCode == 'newsletter')
			this._origin = 'newsletter';
		else if (actionCode == "telecharger")
			this._origin = 'library';
		else if (actionCode == "contactMembre")
			this._origin = 'contact';
		else if (this._controller == 'identification')
			this._origin = 'direct';
		else if (actionCode == "inscrire" || actionCode == "inscription")
			this._origin = 'direct';
		else
			this._origin = 'other';
		if (authType == 'login') {
			// gestion UI
			$(authFormSelector + ' ._authForm_loginTab').removeClass('unselected').addClass('selected');
			$(authFormSelector + ' ._authForm_registerTab').removeClass('selected').addClass('unselected');
			$(authFormSelector + ' ._authForm_loginForm').show();
			$(authFormSelector + ' ._authForm_submitLabel').text('Connexion');
		} else if (authType == 'register') {
			// gestion UI
			$(authFormSelector + ' ._authForm_registerTab').removeClass('unselected').addClass('selected');
			$(authFormSelector + ' ._authForm_loginTab').removeClass('selected').addClass('unselected');
			$(authFormSelector + ' ._authForm_registerForm').show();
			$(authFormSelector + ' ._authForm_submitLabel').text('Valider');
		}
		if (typeof xt_med != 'undefined') {
			var xtUserType = (userType == 'part' ? 'particulier' : 'expert');
			var xtAuthType = (authType == 'login' ? 'connexion' : 'inscription');
			if (authType == 'login') {
				xt_med('F', xtn2, 'identification::' + xtAuthType + '::' + xtAuthType + '::' + xtAuthType + '&f1=' + this._origin);
			} else {
				xt_med('F', xtn2, 'identification::' + xtAuthType + '::' + xtAuthType + '_' + xtUserType + '::' + xtAuthType + '_' + xtUserType + '&f1=' + this._origin);
			}
		}
		this.keySubmit(authFormId);
	};
	/**
	 * S'authentifier auprès du serveur
	 * @param	int		authFormId	Identifiant du formulaire d'authentification.
	 * @param	function	callback	Closure à exécuter après l'authentification.
	 */
	this.authenticate = function(authFormId, callback) {
		var authFormSelector = "#_authForm-" + authFormId;
		// ne pas tenter l'authentification si elle consécutive à une tentative échouée et non traitée par l'utilisateur ou si l'utilisateur est déjà connecté
		if (this.isAuthenticated() || $(authFormSelector + ' ._authForm_error_registerAccountExists').is(':visible'))
			return;
		if (this.getAuthType(authFormId) == 'login') {
			// connexion
			this._login(authFormId, callback);
		} else if (this.getAuthType(authFormId) == 'register') {
			site.authentication._registerPart(authFormId, callback);
		}

	};
	/**
	 * Se connecter au serveur cc pour logguer/inscrire le gars en utilisant une connexion facebook.
	 * @param	int		authFormId	Identifiant du formulaire d'authentification.
	 * @param	function	callback	Fonction à exécuter en fin de connexion de l'utilisateur.
	 */
	this.authenticateByFacebook = function(authFormId, callback, lastStep) {
		this._hideErrors();
		var authFormSelector = "#_authForm-" + authFormId;
		// login facebook
		site.facebook.login(function(status, fbUserId, fbToken, expiresIn) {
			if (status != 'connected') {
				$(authFormSelector + ' ._authForm_error_loginNoFbaccount, ' + authFormSelector + ' ._authForm_error_registerNoFbaccount').show();
				return;
			}
			// utilisateur loggué : on onvoie la requête d'inscription/login au serveur
			site.authentication._fbRegister(fbUserId, fbToken, 1, authFormId, callback, lastStep);
		});
	};
	/** Quand le serveur a detécté un email déja utilisé dans la base, propose a l'internaute de s'identifier. (registerPart -> loginPart). */
	this.registerToLogin = function() {
		var authFormSelector = this._getAuthFormSelector(this._authFormId);
		// on cache les messages d'erreur
		this._hideErrors();
		// transfert de l'email
		var email = $.trim($(authFormSelector + ' ._authForm-registerEmail').val());
		$(authFormSelector + ' ._authForm-loginEmail').val(email);
		// modification de l'affichage
		this.initializeAuthForm('login', 'part', this._authFormId);
	};
	/**
	 * Définir le type d'authentification effectuée par l'utilisateur.
	 * @param	int	authFormId	Identifiant du formulaire d'authentification.
	 * @param	string	authType	Type d'authenficication effectuée ('login', 'register').
	 */
	this.setAuthType = function(authFormId, authType) {
		var authFormSelector = this._getAuthFormSelector(authFormId);
		return $(authFormSelector).attr('data-auth-type', authType);
	};
	/**
	 * Récupérer le type d'authentification effectuée par l'utilisateur.
	 * @param	int	authFormId	Identifiant du formulaire d'authentification.
	 * @return	string	Type d'authentification en cours (register, login).
	 */
	this.getAuthType = function(authFormId) {
		var authFormSelector = this._getAuthFormSelector(authFormId);
		return $(authFormSelector).attr('data-auth-type');
	};
	/**
	 * Récupérer le type d'utilisateur qui s'est authentifié.
	 * @param	int	authFormId	Identifiant du formulaire d'authentification.
	 * @return	string	Type de l'utilisateur cherchant à s'authentifier ('part', 'pro').
	 */
	this.getUserType = function(authFormId) {
		var authFormSelector = this._getAuthFormSelector(authFormId);
		return $(authFormSelector).attr('data-user-type');
	};
	/**
	 * Récupérer le code de l'action en cours.
	 * @param	int	authFormId	Identifiant du formulaire d'authentification.
	 * @return
	 */
	this.getActionCode = function(authFormId) {
		var authFormSelector = this._getAuthFormSelector(authFormId);
		return $(authFormSelector).attr('data-action-code');
	};
	/**
	 * Récupérer le mode d'authentification (page, integré, popup).
	 * @param	int	authFormId	Identifiant du formulaire d'authentification.
	 * @return	string	Mode d'authentification.
	 */
	this.getAuthMode = function(authFormId) {
		var authFormSelector = this._getAuthFormSelector(authFormId);
		return $(authFormSelector).attr('data-auth-mode');
	}
	/**
	 * Ouvrir la popup d'authenfification.
	 * @param	string	authType	Type d'authentification.
	 * @param	string	userType	Type d'utilisateur.
	 * @param	int	authFormId	Identifiant.
	 * @param	string	actionCode	(optionnel) Code de l'action à effectuer.
	 * @param	mixed	callback	Callback à exécuter.
	 */
	this.openAuthenticationPopup = function(authType, userType, authFormId, actionCode, callback) {
		// continuer si et seulement si l'utilisateur est déconnecté
		if (this.isAuthenticated())
			return;
		var authFormSelector = this._getAuthFormSelector(authFormId);
		this.setAuthFormTitle(authFormId, actionCode, 'popup');
		// préparer l'authentification effective : définir la callback associée
		$(authFormSelector + ' ._authForm_submit').click(function() {
			// exécuter la callback
			site.authentication.authenticate(authFormId, callback);
		});
		// préparer l'authentification par Facebook : associer une callback
		$(authFormSelector + ' ._fbAuthButton').click(function() {
			site.authentication.authenticateByFacebook(authFormId, callback);
		});
		// initialiser le formulaire d'authentification
		this.initializeAuthForm(authType, userType, authFormId);
		// afficher la popup d'authentification
		$('#_authenticationPopup').dialog('open');
	};
	/**
	 * Ouvrir le formulaire d'authentification intégré.
	 * @param	string		authType	Type d'authentification.
	 * @param	string		userType	Type d'utilisateur.
	 * @param	int		authFormId	Identifiant.
	 * @param	string		actionCode	(optionnel) Code de l'action à effectuer.
	 * @param	function	callback	Callback à exécuter.
	 */
	this.openIntegratedAuthentication = function(authType, userType, authFormId, actionCode, callback) {
		var authFormSelector = this._getAuthFormSelector(authFormId);
		// interrompre si et seulement si l'utilisateur est connecté ou si le formulaire d'authentification est déjà affiché
		if (this.isAuthenticated() || $(authFormSelector).is(':visible'))
			return;
		// préparer l'authentification effective : définir la callback associée
		$(authFormSelector + ' ._authForm_submit').click(function() {
			// exécuter la callback
			site.authentication.authenticate(authFormId, callback);
		});

		// préparer l'authentification par Facebook : associer une callback
		$(authFormSelector + ' ._fbAuthButton').click(function() {
			site.authentication.authenticateByFacebook(authFormId, callback);
		});
		// afficher le formulaire d'authentification s'il est caché
		if (!$(authFormSelector).is(':visible')) {

			if (actionCode == 'question')
				$(authFormSelector).show();
			else
				$(authFormSelector).slideDown();
			this.setAuthFormTitle(authFormId, actionCode, 'integrated');
			// initialiser le formulaire d'authentification
			this.initializeAuthForm('register', 'part', authFormId);
			// cacher les boutons d'envoi du formulaire de données
			$('#_sendAnswer-' + authFormId).hide();
			$('#_sendComment-' + authFormId).hide();
			$('#_sendEbibLead-' + authFormId).hide();
			$('#_sendQr-' + authFormId).hide();
		}
	};
	/**
	 * Ouvre la popup de mot de passe oublié.
	 * @param	int	Identifiant du formulaire d'authentification.
	 * @param	string	Identifiant du champ contenant l'email.
	 */
	this.openLostPasswordPopup = function(authFormId, fieldName) {
		var authFormSelector = this._getAuthFormSelector(authFormId);
		var lostPasswordFormSelector = "#_lostPassword";
		this._hideErrors();
		// prise de l'email
		var email = $(authFormSelector + " ." + fieldName).val();
		$(lostPasswordFormSelector + ' ._authForm_lostPassword-email').val(email);
		var popupAuthMode = 0;
		if ($(authFormSelector).attr('data-auth-mode') == "popup") {
			popupAuthMode = 1;
			// fermeture formulaire d'authentification
			$('#_authenticationPopup').dialog('close');
		}
		this.lostPasswordPopup.open(authFormId, function() {
			// popup lostpassword fermée
			// prise de l'email
			var email = $(lostPasswordFormSelector + ' ._authForm_lostPassword-email').val();
			$(authFormSelector + ' .' + fieldName).val(email);
			// ré-ouverture popup
			if (popupAuthMode)
				$('#_authenticationPopup').dialog('open');
		});
	};
	/**
	 * Exécuter une action nécessitant une authentification.
	 * @param	int		authFormId		Identifiant du formulaire d'authentification.
	 * @param	function	postAuthCallBack	(optionnel) Closure à exécuter après l'authentification.
	 */
	this.triggerAuthenticatedAction = function(postAuthCallBack) {
		// vérifier si l'utilisateur est connecté
		if (!this.isAuthenticated()) {
			// récupérer les données du contexte
			var authFormSelector = "#_authForm-" + this._authFormId;
			var authType = $(authFormSelector).attr('data-auth-type');
			var authMode = $(authFormSelector).attr('data-auth-mode');
			var userType = $(authFormSelector).attr('data-user-type');
			var actionCode = $(authFormSelector).attr('data-action-code');
			// soumettre la demande d'authentification suivant le mode requis
			if (authMode == 'integrated')
				this.openIntegratedAuthentication(authType, userType, this._authFormId, actionCode, postAuthCallBack);
			else if (authMode == 'popup') {
				this.openAuthenticationPopup(authType, userType, this._authFormId, actionCode, postAuthCallBack);
			}
		} else
			postAuthCallBack();
	};
	/**
	 * Gérer l'accès au tableau de bord.
	 * @param	string		authType	Type d'accès.
	 * @param	string		userType	Type d'utilisateur.
	 * @param	string		email		Email de l'utilisateur.
	 * @param	bool		isFacebook	Indique si la connexion se fait avec un identifiant facebook.
	 * @param	string		loginRediUrl	URL de redirection.
	 */
	this.handleDashboardAccess = function(authType, userType, email, isFacebook, loginRedirUrl) {
		if (loginRedirUrl != undefined && loginRedirUrl != '')
			window.location.href = loginRedirUrl;
		else
			window.location.href = '/tableauDeBord';
	};
	/**
	 * Gestion de l'interface du formulaire d'inscription : adapter selon le type d'utilisateur.
	 * @param	int	authFormId	Identifiant du formulaire d'authentification.
	 * @param	string	userType	Type d'utilisateur (pro, part).
	 */
	this.setUiByRegisterUserType = function(authFormId, userType) {
		var authFormSelector = this._getAuthFormSelector(authFormId);
		// réinitialiser l'interface
		$(authFormSelector + ' ._authForm-optinPart, ' + authFormSelector + ' ._authForm-optinPro').hide();
		// cas de la popup d'authentification
		if ($('#_authenticationPopup').length)
			$('._authenticationReassurancePro, ._authenticationReassurancePart').hide();
		// 1. case à cocher de sélection, 2. gestion des placeholders, 3. gestion de l'optin, 4. gestion du bloc de réassurance
		if (userType == 'part') {
			$(authFormSelector + ' ._authForm-authType-part').attr('checked', 'checked');
			$(authFormSelector + ' ._authForm-authType-part-label').addClass('selected');
			$(authFormSelector + ' ._authForm-authType-pro-label').removeClass('selected');
			$(authFormSelector + ' ._authForm-registerPseudo').attr('placeholder', 'Pseudo');
			$(authFormSelector + ' ._authForm-optinPart').show();
			if ($('#_authenticationPopup').length)
				$('._authenticationReassurancePart').show();
		} else if (userType == 'pro') {
			$(authFormSelector + ' ._authForm-authType-pro').attr('checked', 'checked');
			$(authFormSelector + ' ._authForm-authType-pro-label').addClass('selected');
			$(authFormSelector + ' ._authForm-authType-part-label').removeClass('selected');
			$(authFormSelector + ' ._authForm-registerPseudo').attr('placeholder', 'Nom de votre entreprise');
			$(authFormSelector + ' ._authForm-optinPro').show();
			if ($('#_authenticationPopup').length)
				$('._authenticationReassurancePro').show();
		}
	};
	/**
	 * Déterminer le titre de la popup d'authentification en fonction du code de l'action en cours.
	 * @param	int	authFormId		Identifiant du formulaire d'authentification.
	 * @param	string	actionCode		Code de l'action.
	 * @param	string	authenticationMode	Mode d'authentification (popup, integrated).
	 */
	this.setAuthFormTitle = function(authFormId, actionCode, authenticationMode) {
		// contexte
		var authFormSelector = this._getAuthFormSelector(authFormId);
		if (actionCode == null)
			return
		var title = "";
		// détermination
		switch (actionCode) {
			case "repondre" :
				title = "Pour répondre, vous devez être membre Ooreka :";
				break;
			case "commenter" :
				title = "Pour commenter, vous devez être membre Ooreka :";
				break;
			case "inscrire" :
				title = "";
				break;
			case "contactMembre" :
				title = "Pour envoyer un message à un membre, vous devez être connecté";
				break;
			case "memeProbleme" :
				title = "Pour vous abonner à cette question, vous devez être connecté";
				break;
			case "vote" :
				title = "";
				break;
			case "telecharger" :
				title = "Pour recevoir votre document, vous devez être membre Ooreka :";
				break;
			case "question" :
				title = "Pour poser une question, vous devez être membre Ooreka :";
				break;
			default:
				title = "";
				break;
		}
		// adaptation d'interface sous condition
		if (authenticationMode == 'popup')
			$('#ui-dialog-title-_authenticationPopup').text(title);
		else
			$(authFormSelector + ' ._authFormTitle').text(title);
	};
	/**
	 * Définir le contexte d'authentification d'une action donnée.
	 * @param	int	authFormId	Identifiant du formulaire d'authentification.
	 * @param	string	actionCode	Code de l'action à effectuer.
	 * @param	string	authType	Type d'authentification.
	 * @param	string	userType	Type d'utilisateur.
	 * @param	string	authMode	Mode d'authentification (popup, integrated).
	 */
	this.setContext = function(authFormId, actionCode, authType, userType, authMode) {
		if (authFormId == null)
			authFormId = '';
		var authFormSelector = this._getAuthFormSelector(authFormId);
		$(authFormSelector).attr('data-auth-type', authType);
		$(authFormSelector).attr('data-user-type', userType);
		$(authFormSelector).attr('data-action-code', actionCode);
		$(authFormSelector).attr('data-auth-mode', authMode);
		this._authFormId = authFormId;
		return this;
	};
	/**
	 * Vérifier si l'utilisateur est authentifié sur le site.
	 * @return	bool	True si l'utilisateur est connecté, false sinon.
	 */
	this.isAuthenticated = function() {
		// vérifier si le tag <body> porte un attribut @data-connected à "true"
		if ($('body').attr('data-connected') === 'true')
			return (true);
		return (false);
	};
	/**
	 * Effectuer une simple vérification de syntaxte sur l'adresse email saisie.
	 * @param	DOMElement	obj	Objet de représentation du champ email.
	 */
	this.quickCheckEmail = function(obj) {
		var authFormSelector = this._getAuthFormSelector(this._authFormId);
		var email = $(obj).val();
		var error = false;
		$('._quest-email').removeClass('valide').removeClass('invalide').removeClass('erreur');
		$(authFormSelector + ' ._authForm_error_loginNoEmail').hide();
		$(authFormSelector + ' ._authForm_error_loginBlacklisted').hide();
		if (email.indexOf('@') === -1 || email.indexOf('@') === 0 || ((parseInt(email.indexOf('@')) + 1) === email.length))
			$('._quest-email').addClass('invalide');
		else
			$('._quest-email').addClass('valide');
	};
	/**
	 * Effectuer des verification sur l'adresse email (validité de la syntaxe, existence préalable de l'email, validité du domaine associé).
	 * @param	string		callback	(optionnel) Fonction de callback à effectuer après la vérification de l'adresse email.
	 */
	this.checkEmail = function(callback) {
		var email = this._getFieldValue('email');
		var authFormSelector = this._getAuthFormSelector(this._authFormId);
		var error = false;
		if (email.length) {
			// cacher les messages d'erreur
			$('._quest-email').removeClass('valide').removeClass('invalide').removeClass('erreur').removeClass('manquant').removeClass('blacklisted');
			// test de la syntaxe de l'email
			var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
			if (!regEmail.test(email)) {
				$('._quest-email').addClass('invalide');
				error = true;
				return;
			}
			$.getJSON("/identification/checkEmail/"+ email, function(data) {
				if (!data.success) {
					if (data.code == 'accountExists') {
						$('._quest-email').addClass('erreur');
					} else if (data.code == 'bad syntax' || data.code == 'no mx list') {
						$('._quest-email').addClass('invalide');
					} else if (data.code == 'accountBlacklisted') {
						$('._quest-email').addClass('blacklisted');
					}
					error = true;
				} else {
					$('._quest-email').addClass('valide');
					error = false;
				}
				if (callback)
					callback(!error);
			});
		} else {
			$('._quest-email').addClass('manquant');
			if (typeof callback == 'function' && callback)
				callback(!error);
		}
	};
	/**
	 * Envoi le formulaire en appuyant sur la touche entree.
	 * @param	obj	element		Element appelant la fonction.
	 * @param	int	authFormId	Identifiant du formulaire d'authentification.
	 */
	this.keySubmit = function(element, authFormId) {
		var authFormSelector = this._getAuthFormSelector(authFormId);
		$(element).keyup(function (event) {
			//touche entree
			if (event.which != 13)
				return;
			$(authFormSelector + ' ._authForm_submit').click();
		});
	}

	/* ******************** METHODES PRIVEES ********** */
	/**
	 * Composer le nom du formulaire d'authentification.
	 * @param	int	authFormId	Identifiant du formulaire d'authentification.
	 */
	this._getAuthFormSelector = function(authFormId) {
		return ('#_authForm-' + (typeof(authFormId) == 'undefined' ? '' : authFormId));
	};
	/**
	 * Termine une identification réussie (-> track la stat + appelle la callback).
	 * Appeler cette fonction quand le serveur à répondu ok à l'inscription ou l'identification.
	 * @param	int		authFormId	Identifiant du formulaire d'authentification.
	 * @param	string		authType	Type d'inscription ('register', 'login', 'link'). Link = liaison du compte cc avec un compte facebook.
	 * @param	string		userType	Type d'utilisateur ('private', 'professional', 'brand').
	 * @param	string		email		Email utilisée.
	 * @param	function	callback	Fonction à exécuter en fin d'authentification.
	 * @param	bool		isFacebook	(optionnel) Mettre true pour un enregistrement/login via facebook.
	 * @param	string		loginRedirUrl	URL de redirection après login.
	 */
	this._endRegister = function(authFormId, authType, userType, email, callbackEndRegister, isFacebook, loginRedirUrl) {
		var authFormSelector = this._getAuthFormSelector(authFormId);
		// Traitements d'interface post-authentification
		if (this.getAuthMode(authFormId) == 'integrated') {
			// ré-afficher les boutons de validation du contenu
			$('#_sendAnswer-' + authFormId).show();
			$('#_sendComment-' + authFormId).show();
			$('#_sendEbibLead-' + authFormId).show();
			$('#_sendQr-' + authFormId).show();
			// cacher le formulaire d'authentification intégré
			if (this._authFormId != 'qr-form')
				$(authFormSelector).hide();
		}
		// tracking
		var stat = "Authentification-" + this._controller + "::" + (isFacebook ? 'facebook-' : '') + authType + "::" + userType;
		if (typeof xt_med != 'undefined') {
			if ($(this._getAuthFormSelector(authFormId)).attr('data-action-code') == 'newsletter')
				site.tracking.trackClic(null, 'inscriptionNL::InscriptionConfirme', 'A');
			xt_med('C', xtn2, stat, 'A');
			var xtAuthType = (authType == 'register' ? 'inscription' : 'connexion');
			var xtUserType = (userType == 'private' ? 'particulier' : 'expert');
			xt_med('F', xtn2, 'identification::' + xtAuthType + '::' + xtAuthType + '_' + xtUserType + '::confirmation_' + xtAuthType + '_' + xtUserType + '&f1=' + loginRedirUrl);

		}
		// indiquer dans le tag <body> que l'utilisateur est connecté
		$('body').attr('data-connected', 'true');
		//appel de la callback
		setTimeout(function () {
			if (callbackEndRegister)
				callbackEndRegister(authType, userType, email, isFacebook, loginRedirUrl);
		}, 100);

	};
	/** Cacher les messages d'erreurs du formulaire */
	this._hideErrors = function() {
		var authFormSelector = this._getAuthFormSelector(this._authFormId);
		$(authFormSelector).find('fieldset').removeClass('erreur').removeClass('valide');
		$('._authForm_error_loginPassword').hide();
		$('._authForm_manquant_loginPassword').hide();
	};
	/**
	 * Récupérer la valeur d'un champ depuis le dom.
	 * @param	string	f	Nom du champ.
	 */
	this._getFieldValue = function(f) {
		var authFormSelector = this._getAuthFormSelector(this._authFormId);
		if (f == 'pseudo')
			return ($.trim($(authFormSelector + ' ._authForm-registerPseudo').val()));
		else if (f == 'email') {

			return ($.trim($(authFormSelector + ' ._authForm-registerEmail').val()));
		}
		else if (f == 'optin')
			return ($(authFormSelector + ' ._authForm-optinPartners-oui:checked').length > 0 ? 'oui': ($(authFormSelector + ' ._authForm-optinPartners-non:checked').length > 0 ? 'non' : null));
		else if (f == 'password')
			return ($(authFormSelector + ' ._authForm-password').val());
		else if (f == 'title')
			return ($(authFormSelector + ' ._authForm-title-mme:checked').length > 0 ? 'woman': ($(authFormSelector + ' ._authForm-title-mr:checked').length > 0 ? 'man' : null));
		else if (f == 'country')
			return ($(authFormSelector + ' ._authForm-country').val());
		else if (f == 'zip')
			return ($(authFormSelector + ' ._authForm-zip').val());
		else if (f == 'cgu')
			return ($(authFormSelector + ' ._authForm-cgu').is(':checked'));
		else if (f == 'leadChannel')
			return ($(authFormSelector + ' ._authForm-leadChannel').val());
		else
			return null;
	};
	/**
	 * Vérifier le pseudonyme.
	 * @return	bool Résultat de la vérification.
	 */
	this.checkPseudo = function() {
		var error = false;
		$('#_quest-pseudo').removeClass('valide').removeClass('erreur');
		var pseudo = this._getFieldValue('pseudo');
		if ($.trim(pseudo) == "") {
			error = true;
			$('#_quest-pseudo').addClass('erreur');
		} else
			$('#_quest-pseudo').addClass('valide');
		return (!error);
	};
	/**
	 * Vérifier le mot de passe.
	 * @return	bool 	Résultat de la vérification.
	 */
	this.checkPassword = function() {
		var error = false;
		$('#_quest-password').removeClass('valide').removeClass('erreur').removeClass('manquant');
		var password = this._getFieldValue('password');
		if (password.length == 0)
			$('#_quest-password').addClass('manquant');
		else if (password.length > 7 && !(/\s/g.test(password))) {
			$('#_quest-password').addClass('valide');
		} else {
			$('#_quest-password').addClass('erreur');
			error = true;
		}
		return (!error);
	};
	/**
	 * Vérifier le code postal
	 * @return	bool 	Résulat de la vérification.
	 */
	this._checkZip = function() {
		var error = false;
		$('#_quest-codePostal').removeClass('valide').removeClass('erreur');
		var zip = this._getFieldValue('zip');
		var pays = this._getFieldValue('country');
		if (zip.length == 0 || (pays == 'FR' && !(/^\d{5}$/.test(zip)))) {
			$('#_quest-codePostal').addClass('erreur');
			error = true;
		}
		return (!error);
	};
	/**
	 * Vérifier la civilité
	 * @return	bool	Résultat de la vérification.
	 */
	this._checkTitle = function() {
		var error = false;
		$('#_quest-civilite').removeClass('valide').removeClass('erreur');
		var title = this._getFieldValue('title');
		if (title == null) {
			$('#_quest-civilite').addClass('erreur');
			error = true;
		}
		return (!error);
	};
	/**
	 * Vérifier les cgu
	 * @return	bool	Résutlat de la vérification.
	 */
	this._checkCgu = function() {
		var error = false;
		$('#_quest-cgu').removeClass('valide').removeClass('erreur');
		var cgu = this._getFieldValue('cgu');
		if (!cgu) {
			error = true;
			$('#_quest-cgu').addClass('erreur');
		}
		return (!error);
	};
	/**
	 * Vérifier l'optin.
	 * @return	bool	Résultat de la vérification.
	 */
	this._checkOptin = function() {
		var error = false;
		$('#_quest-partnersInfo').removeClass('valide').removeClass('erreur');
		var optin = this._getFieldValue('optin');
		if (optin == null) {
			error = true;
			$('#_quest-partnersInfo').addClass('erreur');
		} else {
			$('#_quest-partnersInfo').addClass('valide');
		}
		return (!error);
	};
	/**
	 * Essai d'inscrire un utilisateur privé.
	 * @param	int		authFormId	Identifiant du formulaire d'authentification.
	 * @param	function	callback	Fonction à exécuter en fin de connexion de l'utilisateur.
	 */
	this._registerPart = function(authFormId, callback) {
		// récupérer le contexte
		var authFormSelector = this._getAuthFormSelector(authFormId);
		// suppression des messages d'erreur
		this._hideErrors();
		// récupération des données
		var email = this._getFieldValue('email');
		var pseudo = this._getFieldValue('pseudo');
		var optin = this._getFieldValue('optin');
		var password = this._getFieldValue('password');
		var title = this._getFieldValue('title');
		var country = this._getFieldValue('country');
		var zip = this._getFieldValue('zip');
		var cgu = this._getFieldValue('cgu');
		var origin = this._origin;
		var leadChannel = this._getFieldValue('leadChannel');
		// vérifications
		this.checkEmail(function(isEmailValid) {
			var error = false;
			var actionCode = $('#_authForm-' + authFormId).attr('data-action-code');
			var isPseudoValid = (actionCode == 'question') ? site.authentication.checkPseudo() : true;
			var isPasswordValid = site.authentication.checkPassword();
			var isZipValid = site.authentication._checkZip();
			var isTitleValid = site.authentication._checkTitle();
			var isOptinValid = site.authentication._checkOptin();
			var isCguValid = site.authentication._checkCgu();
			// envoi de la requête au serveur
			var formData = {
				'ugcId':		authFormId,
				'name':			pseudo,
				'email':		email,
				'password':		password,
				'zip':			zip,
				'country':		country,
				'title':		title,
				'lead':			'',
				'partnersInfo':		optin,
				'cgu':			cgu,
				'type':			'private',
				'view':			'json',
				'from':			origin,
				'leadChannel':		leadChannel,
				'actionCode': 		actionCode
			};
			if (!isEmailValid || !isPseudoValid || !isPasswordValid || !isZipValid || !isTitleValid || !isOptinValid || !isCguValid) {
				return;
			}
			var url = '/identification/enregistrer';
			$.post(url, formData, function(data) {
				if (!data) {
					alert("Problème de communication avec le serveur.");
				} else if (!data.success || data.success == 'false') {
					// Cas d'erreur
					// compte déjà existant
					if (data.code == 'accountAlreadyExists')
						$('._quest-email').addClass('error');
				} else {
					// Succès de l'identification
					var loginRedirUrl = null;
					if (data['loginRedirUrl'])
						loginRedirUrl = data['loginRedirUrl'];
					site.authentication._endRegister(authFormId, data['registerType'], data['userType'], data['email'], callback, false, loginRedirUrl);
				}
			});
		});
	};
	/**
	 * Essai d'inscrire un utilisateur pro.
	 * @param	int		authFormId	Identifiant du formulaire d'authentification.
	 * @param	function	callback	Fonction à exécuter en fin de connexion de l'utilisateur.
	 */
	this._registerPro = function(authFormId, callback) {
		// récupérer le contexte
		var authFormSelector = this._getAuthFormSelector(authFormId);
		// suppression des messages d'erreur
		this._hideErrors();
		// vérification des données
		var error = false;
		var email = $.trim($(authFormSelector + ' ._authForm-registerEmail').val());
		var pseudo = $.trim($(authFormSelector + ' ._authForm-registerPseudo').val());
		var optin = $(authFormSelector + ' ._authForm-optinLead:checked').length > 0 ? '1' : '0';
		var origin = this._origin;
		var leadChannel = $(authFormSelector + ' ._authForm-leadChannel').val();
		if (email == "" || !site.authentication._verifyEmail(email)) {
			error = true;
			$(authFormSelector + ' ._authForm_error_registerEmail').show();
		}
		if (pseudo == "") {
			error = true;
			$(authFormSelector + ' ._authForm_error_registerPseudo').show();
		}
		if (error)
			return;
		// envoi de la requête au serveur
		var formData = {
			'nom':			pseudo,
			'email':		email,
			'email2':		email,
			'partnersInfo':		'',
			'lead':			optin,
			'type':			'professional',
			'view':			'json',
			'from':			origin,
			'leadChannel':		leadChannel
		};
		var url = '/identification/enregistrer';
		$.post(url, formData, function(data) {
			if (!data || data == 'false') {
				alert("Problème de communication avec le serveur.");
			} else if (data == 'accountAlreadyExists') {
				// compte déja existant
				$(authFormSelector + ' ._authForm_error_registerAccountExists').show();
			} else {
				// identification ok
				var loginRedirUrl = null;
				if (data['loginRedirUrl'])
					loginRedirUrl = data['loginRedirUrl'];
				site.authentication._endRegister(authFormId, data['registerType'], data['userType'], data['email'], callback, false, loginRedirUrl);
			}
		});
	};
	/**
	 * Essayer d'authentifier un utilisateur ayant déjà un compte.
	 * @param	int		authFormId	Identifiant du formulaire d'authentification.
	 * @param	function	callback	Fonction à exécuter en fin de connexion de l'utilisateur.
	 */
	this._login = function(authFormId, callback) {
		// récupérer le contexte
		var authFormSelector = this._getAuthFormSelector(authFormId);
		// suppression des messages d'erreur
		this._hideErrors();
		// vérification des données
		var error = false;
		var email = $(authFormSelector + ' ._authForm-loginEmail').val();
		var password = $(authFormSelector + ' ._authForm_loginPassword').val();
		if (email == "" || !site.authentication._verifyEmail(email)) {
			error = true;
			$(authFormSelector + ' ._authForm_error_loginEmail').show();
		}
		if (password.length == 0) {
			error = true;
			$(authFormSelector + ' ._authForm_manquant_loginPassword').show();
		}
		if (error)
			return;
		// envoi de la requête au serveur
		var formData = {
			'origin'  : 	this._origin,
			'email'	  :	email,
			'password':	password
		};
		var url = '/identification/login/json';
		$.post(url, formData, function(data) {
			if (!data || data == 'false') {
				$(authFormSelector + ' ._authForm_error_loginNoEmail').show();
				$(authFormSelector + ' ._authForm_error_loginBlacklisted').hide();
			} else if (data == 'blacklisted'){
				$(authFormSelector + ' ._authForm_error_loginBlacklisted').show();
			} else {
				// identification ok
				var loginRedirUrl = null;
				if (data['loginRedirUrl'])
					loginRedirUrl = data['loginRedirUrl'];
				site.authentication._endRegister(authFormId, data['registerType'], data['userType'], data['email'], callback, false, loginRedirUrl);
			}
		});
	};
	/**
	 * Demande au serveur comprendre choisir d'inscrire ou logguer un utilisateur à partir de son compte facebook.
	 * Si l'adresse mail fb est déja utilisée sur un compte cc, il liera les deux comptes.
	 * @param	int		userId		Identifiant de l'utilisateur sur facebook.
	 * @param	string		token		Numéro de session facebook.
	 * @param	bool		linkAccounts	Si l'utilisateur à un compte facebook, un compte cc avec la même adresse email,
	 *						et que ces comptes  ne sont pas liés, que faire ?
	 *						true pour lier les compte, false pour retourner une erreur 'emailUsed'.
	 * @param	int		authFormId	Identification du formulaire d'authentification.
	 * @param	function	callback	Fonction à exécuter en fin de connexion de l'utilisateur.
	 */
	this._fbRegister = function(userId, token, linkAccounts, authFormId, callbackFbRegister, lastStep) {
		// récupérer le contexte
		var authFormSelector = this._getAuthFormSelector(authFormId);
		var authType = $(authFormSelector).attr('data-auth-type');
		var authMode = $(authFormSelector).attr('data-auth-mode');
		var userType = $(authFormSelector).attr('data-user-type');
		// prise des données
		var formData = {
			userId:		userId,
			token:		token,
			leadChannel:	$(authFormSelector + ' ._authForm-leadChannel').val(),
			controller:	this._controller,
			from:		this._origin,
			linkAccounts:	linkAccounts
		};
		// appel du serveur pour se logguer
		var url = '/identification/fbLogin';
		$.post(url, formData, function(data) {
			if (!data || data == false || data == 'false') {
				alert('Problème de communication avec le serveur.');
			} else if (data == 'badUserEmailInFacebook') {
				alert('Facebook a retourné une adresse email incorrecte vous concernant.');
			} else if (data == 'emailUsed') {
				// email déja utilisé => on demande si on veut lier les comptes facebook et cc.
				if (authMode == 'popup')
					$('#_authenticationPopup').dialog('close');
				// ouverture de la popup de liaison des comptes
				site.authentication.linkAccountsPopup.open(function(response) {
					if (response) {
						// on lie les 2 comptes
						site.authentication._fbRegister(userId, token, 1, authFormId, callbackFbRegister);
					} else {
						// remise de la popup sur login part
						$(authFormSelector + ' ._authForm-loginEmail').val('');
						$(authFormSelector + ' ._authForm-loginPasswordPart').val('');
						site.authentication.initializeAuthForm('login', 'part', authFormId);
						if (authMode == 'popup')
							$('#_authenticationPopup').dialog('open');
						// on récupère l'email et on le pré-rempli
						site.facebook.getUserData(function(fbResponse) {
							$(authFormSelector + ' ._authForm-loginEmail').val(fbResponse['email']);
						});
					}
				});
			} else {
				// identification ok
				var loginRedirUrl = false;
				if (data['loginRedirUrl'])
					loginRedirUrl = data['loginRedirUrl'];
				site.auth.endRegister(authFormId, data['registerType'], data['userType'], data['email'], callbackFbRegister, loginRedirUrl, 1, lastStep);
				if (site.authentication._origin == 'library')
					site.eBibliotheque.downloadForm._verifyForm();
			}
		}, 'json');
	};
	/**
	 * Vérifie qu'une chaine est un email.
	 * @param	string	value	Chaine de caractère à vérifier.
	 * @return	bool	Retourne true si la chaine est un email, false sinon.
	 */
	this._verifyEmail = function(value) {
		return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value));
	};
	/**
	 * Retourne un tableau des variables en GET
	 * @return	array	tableau des variables GET
	 */
	this._getUrlVars = function() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
		function(m,key,value) {vars[key] = value;});
		return (vars);
	}
	/**
	 * Simulation du click pour ne pas afficher l'étape avec les documents complémentaires
	 */
	this.simulDocumentComplementaire = function(){
		if ($("._telechargement_form").find("input:radio").length > 0) {
			$("._telechargement_form").find("input:radio").each(function(index, element){
				if ($(element).val() == '0'){
					$(element).attr('checked', 'checked');
				}
			});
		}
		var userConnected = setInterval(function() {
			if (site.authentication.isAuthenticated()) {
				if ($(".description_telechargement .spinner").length == 0) {
					$(".description_telechargement").append(
						'<div class="spinner">' +
						'<div class="bounce1"></div>' +
						'<div class="bounce2"></div>' +
						'<div class="bounce3"></div>' +
						'</div>'
					)
				}
				$("._telechargement_form").hide();
				$(".description_telechargement").addClass('cache_tick');
				site.eBibliotheque.downloadForm._verifyForm();
				clearInterval(userConnected);
			}
		},500);
	};
};
