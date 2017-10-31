/**
 * Objet de gestion de l'authentification.
 * @author	Dorian Yahouédéou	<dorian.yahouedeou@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
mvpAuthentication = new function() {
	/** Controller courant. */
	this._controller = null;
	/** Origine de l'autentification ('library','partners','lead','qr','direct', 'other', 'contact'). */
	this._origin = null;
	/* id projet */
	this._projectId = null;

	/**
	 * Initialisation de l'objet.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	projectId	id du projet.
	 */
	this.init = function(controller, projectId) {
		this._controller = controller;
		this._origin = controller;
		this._projectId = projectId;
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

	/** Cacher les messages d'erreurs du formulaire */
	this._hideErrors = function() {
		var authFormSelector = this._getAuthFormSelector(this._authFormId);
		$(authFormSelector).find('fieldset').removeClass('erreur').removeClass('valide');
		$('._authForm_error_loginPassword').hide();
		$('._authForm_manquant_loginPassword').hide();
	};

	/**
	 * Composer le nom du formulaire d'authentification.
	 * @param	int	authFormId	Identifiant du formulaire d'authentification.
	 */
	this._getAuthFormSelector = function(authFormId) {
		return ('#_authForm-' + (typeof(authFormId) == 'undefined' ? '' : authFormId));
	};

	/**
	 * Se connecter au serveur cc pour logguer/inscrire le gars en utilisant une connexion facebook.
	 * @param	int		authFormId	Identifiant du formulaire d'authentification.
	 * @param	function	callback	Fonction à exécuter en fin de connexion de l'utilisateur.
	 */
	this.authenticateByFacebook = function(authFormId, callback, typeLogin, lastStep) {
		this._hideErrors();
		var authFormSelector = "#_authForm-" + authFormId;
		// login facebook
		if (typeLogin == 'connexion')
			mvpTracking.trackClicPage(null, 'direct::identification::se_connecter_avec_facebook', 6);
		else if (typeLogin == 'inscription')
			mvpTracking.trackClicPage(null, 'direct::identification::s_inscrire_avec_facebook', 6);
		mvpFacebook.login(function(status, fbUserId, fbToken, expiresIn) {
			if (status != 'connected') {
				$(authFormSelector + ' ._authForm_error_loginNoFbaccount, ' + authFormSelector + ' ._authForm_error_registerNoFbaccount').show();
				return;
			}
			// utilisateur loggué : on onvoie la requête d'inscription/login au serveur
			mvpAuthentication._fbRegister(fbUserId, fbToken, 1, authFormId, callback, lastStep);
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
			linkAccounts:	linkAccounts,
			projectId:	this._projectId
		};
		// appel du serveur pour se logguer
		var url = '/identificationMVP/fbLogin';
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
				mvpAuthentication.linkAccountsPopup.open(function(response) {
					if (response) {
						// on lie les 2 comptes
						mvpAuthentication._fbRegister(userId, token, 1, authFormId, callbackFbRegister);
					} else {
						// remise de la popup sur login part
						$(authFormSelector + ' ._authForm-loginEmail').val('');
						$(authFormSelector + ' ._authForm-loginPasswordPart').val('');
						mvpAuthentication.initializeAuthForm('login', 'part', authFormId);
						if (authMode == 'popup')
							$('#_authenticationPopup').dialog('open');
						// on récupère l'email et on le pré-rempli
						mvpFacebook.getUserData(function(fbResponse) {
							$(authFormSelector + ' ._authForm-loginEmail').val(fbResponse['email']);
						});
					}
				});
			} else {
				// identification ok
				var loginRedirUrl = false;
				if (data['loginRedirUrl'])
					loginRedirUrl = data['loginRedirUrl'];

				mvpAuth.endRegister(authFormId, data['registerType'], data['userType'], data['email'], callbackFbRegister, loginRedirUrl, 1, lastStep);
				// if (mvpAuthentication._origin == 'library')
				// 	site.eBibliotheque.downloadForm._verifyForm();
			}
		}, 'json');
	};
	/**
	 * Vérification que le mot de passe et la confirmation ont la même valeur
	 */
	this.checkNewPassword = function (input) {
		var pwd = $('#_password').val();
		var confirmPwd = $(input).val();
		$(input).parent().removeClass('actif');
		hasError = false;
		if (confirmPwd == ''){
			if (pwd != '') {
				mvpAuth.errorInput(input, 'vide');
			}
			hasError = true;
		}
		else if (confirmPwd != pwd){
			mvpAuth.errorInput(input, 'invalide');
			hasError = true;
		}
		else {
		 	mvpAuth.validateInput(input);
		}
		return(hasError);
	};
	this.validateFormConfirmPwd = function(){
		var errorPwd = mvpAuth.verifyPassword($('._inputPw'), '', true);
		var errorConfirm = this.checkNewPassword($('._inputConfirm'));
		if (!errorConfirm && !errorPwd) {
			$('#_formNewPassword').submit();
		}
	};
};
