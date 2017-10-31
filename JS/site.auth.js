/**
 * Objet de gestion de l'authentification.
 * @author	David Marcos	<david.marcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
site.auth = new function() {
	/** URL courante. */
	this._url = null;
	/** Controller courant. */
	this._controller = null;
	/** Action courante. */
	this._action = null;
	/* Utiliser pour le tracking du tunnel de conversion des téléchargements*/
	this.atInternetReferer = '';

	/* ******************** INITIALISATIONS ***************** */
	/**
	 * Initialisation de l'objet.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		this._url = url;
		this._controller = controller;
		this._action = action;
		this.getUserCountryByIp();
		this.replaceDownloadUrl();
	};

	this.getXtn2AtInternet = function () {
		// Utilisation du xtn2 atTinternet pour les QR et inscription DIRECT/NL
		if (this._controller == 'qr' || this._controller == 'identification')
			return tc_vars.xtn2;
		// Inscription via le téléchargement
		else
			return 5


	}

	/**
	 * Vérifier si l'utilisateur est authentifié sur le site.
	 * @return	bool	True si l'utilisateur est connecté, false sinon.
	 */
	this.isAuthenticated = function() {
		if ($('body').attr('data-connected') === 'true') {
			return (true);
		}
		return (false);
	};
	/**
	 * Afficher le formulaire de connexion ou le formulaire d'inscription
	 * @param 	string 	authType 	Type d'authentification
	 */
	this.showAuthForm = function(authType, value){
		var valueInput = $(value).val();
		if(authType == 'login'){
			site.tracking.trackClicPage(null, 'identification::connexion::connexion::connexion', this.getXtn2AtInternet());
			$("#_registerForm").hide();
			$("#_loginForm").show();
			$('#_loginEmail').val(valueInput);
			$('._downloadRegister').hide();
			$('._downloadLogin').show();
		} else{
			site.tracking.trackClicPage(null, 'identification::inscription::inscription particulier::inscription particulier', this.getXtn2AtInternet());
			$("#_loginForm").hide();
			$("#_registerForm").show();
			$('#_registerEmail').val(valueInput);
			$('._downloadRegister').show();
			$('._downloadLogin').hide();
		}
	};
	/**
	 * Afficher ou masquer le mot de passe
	 * @param 	string 	elementClicked 	Attr type input
	 */
	this.showPassword = function(elementClicked){
		var input = $(elementClicked).parent().find('input');
		var type = input.attr('type');
		if (type == "text"){
			$(elementClicked).text('Afficher');
			input.get(0).type = 'password';
		} else{
			$(elementClicked).text('Masquer');
			input.get(0).type = 'text';
		}
	};
	/**
	 * Varification que le nom d'utilisateur est renseigné (seulement qr)
	 * @param  string	name 	Value du champ name
	 * @return {[type]}      [description]
	 */
	this.verifyName = function(name){
		hasError = false;
		if ($(name).val() == ''){
			this.errorInput(name, 'vide');
			hasError = true;
		} else {
			this.validateInput(name);
		}
		return(hasError);
	};
	/**
	 * Verification du mail
	 * @param 	string 	email 		Value du champ email
	 * @return 	booleen	hasError	Indique s'il y a ou pas une erreur
	 */
	this.verifyEmail = function(email){
		hasError = false;
		var myEmail = $(email).val();
		if ($(email).attr('id') == '_oublie' && myEmail.length == 0){
			this.errorInput(email, 'vide');
		}
		else if ($(email).attr('id') == '_oublie' && myEmail.length > 0){
			var url = "/identification/checkEmailForPassword/" + $(email).val();
			$.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				success: function(data) {
					if (data.code == 'bad syntax') {
						hasError = true;
						site.auth.errorInput(email, 'invalide');
					}
					else if (data.code == 'accountNotFound') {
						hasError = true;
						site.auth.errorInput(email, 'inexistant');
					} else{
						site.auth.validateInput(email);
					}
				},
				async: false
			});
		}
		else{
			var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
			if(myEmail == ''){
				this.errorInput(email, 'vide');
				hasError = true;
			} else if (regEmail.test(myEmail)) {
				if ($(email).attr('id') != '_loginEmail') {
					var url = "/identification/checkEmail/"+ myEmail;
					$.ajax({
						url: url,
						dataType: 'json',
						success: function(data) {
							if (!data.success) {
								if (data.code == 'accountExists' || data.code == 'accountBlacklisted') {
									$('#_registerForm').find('#_registerEmail').parent().addClass('erreur');
									site.auth.errorInput($('#_registerEmail'), 'existant');
									hasError = true;
								} else if (data.code == 'bad syntax' || data.code == 'no mx list') {
									$('#_registerForm').find('#_registerEmail').parent().addClass('erreur');
									site.auth.errorInput($('#_registerEmail'), 'invalide');
									hasError = true;
								}
							} else {
								site.auth.validateInput(email);
							}
						},
						async: false
					});
				} else {
					site.auth.validateInput(email);
				}
			} else {
				this.errorInput(email, 'invalide');
				hasError = true;
			}
		}
		return(hasError);
	};
	/**
	 * Verification du password
	 * @param 	string 	password	Value du champ password
	 * @return 	booleen	hasError	Indique s'il y a ou pas une erreur
	 */
	this.verifyPassword = function(password, login){
		hasError = false;
		var myPassWord = $(password).val();
		if (login){
			if(myPassWord == ''){
				this.errorInput(password, 'vide', $('._info'));
				hasError = true;
			}
			else{
				this.validateInput(password, $('._info'));
			}
		} else{
			if(myPassWord == ''){
				this.errorInput(password, 'vide', $('._info'));
				hasError = true;
			}
			else if(myPassWord.length < 8 ){
				this.errorInput(password, 'incomplet', $('._info'));
				hasError = true;
			}
			else {
				this.validateInput(password, $('._info'));
			}
		}
		return(hasError);
	};
	/**
	 * Verification des autres champs
	 */
	this.verifyContentForm = function(elementClicked){
		hasError = false;
		var elemId = $(elementClicked).attr('id');
		if ($(elementClicked).val() == ''){
		 	this.errorInput(elementClicked, 'vide');
		 	hasError = true;
		} else {
		 	this.validateInput(elementClicked);
		 }
		if (elemId == '_zipLogin') {
			hasError = site.auth.verifyZipOnBlur(hasError);
		}
		return(hasError);
	};
	/**
	 * Verification du code postal
	 * @param 	string 	zip		Value du champ zip
	 * @return 	booleen	hasError	Indique s'il y a ou pas une erreur
	 */
	this.verifyZip = function(zip){
		hasError = false;
		var zipCode = $(zip).val();
		if(zipCode == '' && $('#_country').val() == 'FR'){
			this.errorInput($('#_zipLogin'), 'vide');
			hasError = true;
		} else if(zipCode.length < 5 && $('#_country').val() == 'FR'){
			this.errorInput($('#_zipLogin'), 'invalide');
			hasError = true;
		} else {
			this.validateInput($('#_zipLogin'));
		}
		return(hasError);
	};
	/**
	 * Afficher les messages d'erreur
	 * @param 	string		element		Champ de form
	 * @param 	booleen		password 	Champ password du form
	 */
	this.errorInput = function(element, typeErreur, otherElement){
		var addModif = true;
		if (otherElement == undefined){
			addModif = false;
		}
		$(element).parent().addClass('erreur');
		if (typeErreur != undefined){
			$(element).parents('fieldset').find('.message_erreur').hide();
			$(element).parents('fieldset').find('.' + typeErreur).show();
		}
		else{
			$(element).parents('fieldset').find('.message_erreur').show();
		}
		if (addModif){
			$(element).parents('fieldset').find(otherElement).hide();
		}
	};
	/**
	 * Valider les champs
	 * @param 	string		element		Champ de form
	 * @param 	booleen		password 	Champ password du form
	 */
	this.validateInput = function(element, otherElement){
		var addModif = true;
		if (otherElement == undefined){
			addModif = false;
		}
		$(element).parent().removeClass('erreur');
		$(element).parents('fieldset').find('.message_erreur').hide();
		if (addModif){
			$(element).parents('fieldset').find(otherElement).show();
		}
	};

	this.selectCity = function(elementClicked){
		var city = $(elementClicked).attr('data-value');
		var zip = $(elementClicked).attr('data-zip');
		$(elementClicked).closest('#_registerForm').find('#_city').val(city);
		$(elementClicked).closest('#_registerForm').find('#_zipCode').val(zip);
		$(elementClicked).closest('#_registerForm').find('#_zipLogin').val(zip + ' ('+city+')');
		$(elementClicked).parent().hide();
	};

	/**
	 * Renseigner le code postal lors de l'inscription
	 * @param 	string 	zip		Champ zipCode du form
	 */
	this.informZipCode = function(zip){
		if ($(zip).val().length >= 2) {
			$('#_citySetPart').val($(zip).val());
			$.ajax({
				type: 'POST',
				url: '/annuaire/getCitiesByZip',
				data: {address: $(zip).val()},
				success: function(infos) {
					$(zip).prev('div#_list_cities').find('span').remove();
					if(infos && $(zip).val() != '') {
						obj = JSON.parse(infos);
						var citySetPart = $('#_citySetPart').val();
						for (var i = 0; i < obj.length; i++) {
							var cityBold = obj[i].tag.replace(citySetPart, '<b>'+citySetPart+'</b>');
							var zipBold = obj[i].zip.replace(citySetPart, '<b>'+citySetPart+'</b>');
							$(zip).prev('div#_list_cities').append('<span class="cityList" onmousedown="site.auth.selectCity(this);" data-value="'+obj[i].tag+'" data-zip="'+obj[i].zip+'">'+zipBold+' ('+cityBold+')</span>');
						}
						$(zip).prev('div#_list_cities').show();
					} else {
						$(zip).prev('div#_list_cities').hide();
					}
				}
			});
		} else {
			$('#_list_cities').hide();
			$('#_zipCode').val('');
			$('#_city').val('');
		}
	};
	/**
	 * Verification que l'optin cgu est coché
	 * @param  	booleen 	optin 		checkbox optin
	 * @return 	booleen		hasError	Indique s'il y a ou pas une erreur
	 */
	this.verifyCgu = function(optin){
		hasError = false;
		if($('#_optin').is(':checked')){
			this.validateInput(optin);
		} else{
			this.errorInput(optin);
			hasError = true;
		}
		return(hasError);
	};
	this.disableButton = function(disableButton) {
		// si le bouton est disable on quitte
		if (disableButton.attr('disabled') == 'disabled') {
			return true;
		}
		// sinon on disable le button
		else {
			disableButton.attr('disabled','disabled');
			return false;
		}
	};
	/**
	 * Validation du formulaire d'inscription
	 * @param 	string 	origin 	Origine de l'inscription
	 */
	this.register = function(origin, lastStep, disableButton){
		if (origin == "question" || $('#_actionOrigin').val() == "commenter"){
			var name = this.verifyName($('#_registerName'));
			var nameUser = $('#_registerName').val();
		} else{
			var name = false;
			var nameUser = 'Anonyme';
		}
		var email = this.verifyEmail($('#_registerEmail'));
		var password = this.verifyPassword($('#_registerPassword'), false);
		var zip = this.verifyZip($('#_zipCode'));
		var optin = this.verifyCgu($('#_optin'));

		var cgu = $('#_optin').is(':checked') ? true : false;
		var partners = $('#_partners').is(':checked') ? true : false;
		var ugcId = $('#_popinDownload').attr('data-ugc-id');
		if(!email && !password && !zip && !name && !optin) {
			var url = '/identification/enregistrer';
			var postData = {
				'name': 	nameUser,
				'email'	: 	$('#_registerEmail').val(),
				'password' : 	$('#_registerPassword').val(),
				'zip': 		$('#_registerForm').find('#_zipCode').val(),
				'city': 	$('#_registerForm').find('#_city').val(),
				'country': 	$('#_registerForm').find('#_country').val(),
				'ugcId': 	ugcId,
				'partnersInfo':	partners,
				'cgu':		cgu,
				'from': 	origin,
				'action': 	$('.form_inscription_connexion').find('#_actionOrigin').val(),
				'citySet': 	$('#_registerForm').find('#_citySetPart').val(),
			};
			// si le param disablebutton != de undefined
			if (typeof disableButton !== 'undefined' && this.disableButton(disableButton)) {
				return;
			}

			// Si l'origin du clic est newsletter, on déconnecte le currentUser si il existe
			if (origin == 'newsletter') {
				$.post('/identification/logoutUser', function(result) {
					site.auth.sendFormInscription(url, postData, ugcId, origin, lastStep);
				});
			} else {
				site.auth.sendFormInscription(url, postData, ugcId, origin, lastStep);
			}
		}
	};

	/**
	* Envoie du formulaire d'inscription
	* @param 	string url Url vers la méthode enregistrer
	* @param 	array postData Données post du formulaire d'inscription
	*/
	this.sendFormInscription = function(url, postData, ugcId, origin, lastStep) {
		$.post(url, postData, function(data) {
			if (!data) {
				$('body').addClass('animated');
				$('body').append(
					"<div class='_erreurServeur erreur_serveur zoomIn'>Erreur de communication avec le serveur</div>"
				);
				setTimeout(function(){
					$('._erreurServeur').remove();
				}, 4000);
			} else if ((!data.success || data.success == 'false') && data.code == 'accountAlreadyExists'){
				$('#_registerForm').find('#_registerEmail').parent().addClass('erreur');
				site.auth.errorInput($('#_registerEmail'), 'existant');
			} else if ((!data.success || data.success == 'false') && data.code == 'invalidEmail'){
				$('#_registerForm').find('#_registerEmail').parent().addClass('erreur');
				site.auth.errorInput($('#_registerEmail'), 'invalide');
			} else {
				var loginRedirUrl = null;
				if(data['loginRedirUrl']){
					loginRedirUrl = data['loginRedirUrl'];
				}
				site.auth.endRegister(ugcId, data['registerType'], data['userType'], data['email'], false, loginRedirUrl, origin, lastStep);
			}
		});
	};
	/**
	 * Validation du formulaire de connexion
	 * @param 	string 		origin 		Origine de l'inscription
	 */
	this.login = function(origin, lastStep, disableButton){
		var email = this.verifyEmail($('#_loginEmail'));
		var password = this.verifyPassword($('#_loginPassword'), true);
		var ugcId = $("#_ugcId").val();
		if(!email && !password) {
			var url = '/identification/login/json';
			var postData = {
				'email' : 	$('#_loginEmail').val(),
				'password' : 	$('#_loginPassword').val(),
				'origin':  	origin
			};
			$.post(url, postData, function(data) {
				if (!data) {
					$('body').addClass('animated');
					$('body').append(
						"<div class='_erreurServeur erreur_serveur zoomIn'>Erreur de communication avec le serveur</div>"
					);
					setTimeout(function(){
						$('._erreurServeur').remove();
					}, 4000);
				} else if ((!data.success || data.success == 'false') && data.code == 'accountDoesntExists') {
					$('#_loginForm').find('#_loginEmail').parent().addClass('erreur');
					site.auth.errorInput($('#_loginEmail'), 'inexistant');
				} else if ((!data.success || data.success == 'false') && data.code == 'wrongPassword') {
					$('#_loginForm').find('#_loginPassword').parent().addClass('erreur');
					site.auth.errorInput($('#_loginPassword'), 'invalide');
				} else if ((!data.success || data.success == 'false') && data.code == 'blacklisted') {
					$('#_loginForm').find('#_loginEmail').parent().addClass('erreur');
					$('#_loginForm').find('.blackliste').show();
				} else {
					// si le param disablebutton != de undefined
					if (typeof disableButton !== 'undefined' && site.auth.disableButton(disableButton)) {
						return;
					}
					var loginRedirUrl = null;
					if(data['loginRedirUrl']) {
						loginRedirUrl = data['loginRedirUrl'];
					}
					site.auth.endRegister(ugcId, data['registerType'], data['userType'], data['email'], false, loginRedirUrl, origin, lastStep);
				}
			});
		}
	};
	/**
	 * Finaliser la connexion/inscription
	 * @param  string 	ugcId 		ID du form
	 * @param  string 	authType 	Type d'authentification
	 * @param  string 	userType      	Type de user
	 * @param  string 	email         	Email
	 * @param  booleen 	isFacebook    	Connexion facebook
	 * @param  string 	loginRedirUrl 	Redirection
	 * @param  string 	origin 		Origine de l'authentification
	 */
	this.endRegister = function(ugcId, authType, userType, email, isFacebook, loginRedirUrl, origin, lastStep) {
		// tracking
		var stat = "Authentification-" + this._controller + "::" + (isFacebook ? 'facebook-' : '') + authType + "::" + userType;
		if (typeof xt_med != 'undefined') {
			if ($("#_origin").val() == 'newsletter'){
				site.tracking.trackClic(null, 'inscriptionNL::InscriptionConfirme', 'A');
			}
			xt_med('C', site.auth.getXtn2AtInternet(), stat, 'A');
			var xtAuthType = (authType == 'register' ? 'inscription' : 'connexion');
			var xtUserType = (userType == 'private' ? 'particulier' : 'expert');
			xt_med('F', site.auth.getXtn2AtInternet(), 'identification::' + xtAuthType + '::' + xtAuthType + '_' + xtUserType + '::confirmation_' + xtAuthType + '_' + xtUserType + '&f1=' + loginRedirUrl);

		}
		// indiquer que le user est connecté
		$('body').attr('data-connected', 'true');
		// Si c'est la derniere etape, il y a redirection
		if (lastStep){
			window.location.href = loginRedirUrl;
			return;
		}
		// sinon on affiche la derniere etape (ebibliotheque)
		else{
			$('#_popinDownload').find('._stepDownload_1').hide();
			$('#_popinDownload').find('._stepDownload_2').show();
			this.sendDoc(authType);
		}
		// si c'est une inscription/connexion apres question soumettre la question
		if (origin == 'question'){
			site.question.submitQrForm('qr-form');
		}
	};
	/**
	 * Envoi du doc pour le telechargement
	 * @param 	string 	authType 	Type d'authentification - Login ou Register
	 */
	this.sendDoc = function (authType) {
		var ugcID = $('#_popinDownload').attr('data-ugc-id');
		var url = "/ebibliotheque/telecharger/" + ugcID + "/true";
		if (authType == "register"){
			var formData = {
				'rqEmail'	: $('#_registerEmail').val(),
				'rqZip'		: $('#_zipCode').val(),
				'rqCity'	: $('#_city').val(),
			};
		}
		if (authType == "login"){
			var formData = {
				'rqEmail'	: $('#_loginEmail').val()
			};
		}
		$.post(url, formData, function(response) {
			if (response.status) {
				// Envoi du tracking concernant le choix sur les remonté
				site.tracking.doTRackingEbibliothequeTelechargement();
				xt_med('F', 5, 'ebibliotheque::telecharger::confirmation_telechargement'+'&f1='+response.nbDocuments+'&f2=['+response.docTitle+']&f3=['+response.niche+']&f4=['+response.univers+']&f5='+response.docId+'&f6=['+response.docType+']&f7=['+site.auth.atInternetReferer+']');
				// Téléchargement direct du document
				window.location.assign(response.wwwHost+'/tableauDeBord/telechargement/telecharger/' + response.confirmationParams.idDl);
			} else {
				$('body').addClass('animated');
				$('body').append(
					"<div class='_erreurServeur erreur_serveur zoomIn'>Erreur de communication avec le serveur</div>"
				);
				setTimeout(function(){
					$('._erreurServeur').remove();
				}, 4000);
			}
		});
		// On modifie le onclick dans le cas de l'inscription/connnexion pour reload la page à la
		$('#_popinContent span[class*="close"]').attr('onclick', 'site.auth.closePopin($(this), true)');

	};
	/**
	 * Vérifie le formulaire "mot de passe perdu" et envoie au serveur une requête de mot de passe perdu.
	 * @param 	string 		button 		Bouton d'envoi
	 */
	this.sendLostPassword = function(button) {
		var email = $('#_oublie').val();
		var errorMail = this.verifyEmail($('#_oublie'));
		if (!errorMail){
			// envoi de la requête au serveur
			var formData = {
				email:	email,
				view:	'json'
			};
			var url = '/identification/envoyerMotDePasse';
			$.post(url, formData, function(data) {
				if (data && data != 'unknownAccount'){
					$(button).parents('#_popinContent').find('#_step1').hide();
					$(button).parents('#_popinContent').find('#_step2').show();
				} else if (data == 'unknownAccount') {
					site.auth.errorInput($('#_oublie'), 'inexistant');
				} else{
					$('body').addClass('animated');
					$('body').append(
						"<div class='_erreurServeur erreur_serveur zoomIn'>Erreur de communication avec le serveur</div>"
					);
					setTimeout(function(){
						$('._erreurServeur').remove();
						$('body').removeClass('animated');
					}, 4000);
				}
			});
		}
		return false;
	};
	/**
	 * Ouverture d'une' popin - appel AJAX
	 * @param  string 	url 		URL du template à appeler
	 * @param  string 	origin        	Origine de l'authentification
	 * @param  booleen	clickPassword 	Action de l'ouverture de la popin
	 */
	this.showContentInPopUp = function(url, origin, clickPassword){
		if (typeof clickPassword == 'undefined'){
			clickPassword = false;
		}
		if ((this._controller != 'identification' && this._controller != 'identificationMVP') && !clickPassword){
			$('#_popinContent').find('#_redirPopin').val(url);
		}
		if (clickPassword){
			$('#_popinContent').find('#_infoPassword').val(origin);
			$('#_popinContent').find('#_fromResetPassword').val(1);
		}
		$.ajax({
			method : 'GET',
			url : url,
			dataType : 'html',
			beforeSend: function(){
				$('#_popinContent').show();
				$('#_popinContent > div').addClass('loading');
				$('#_popinContent > div').html('');
			},
			success: function(data){
				var isConnected = site.auth.isAuthenticated();
				if (isConnected == false) {
					site.auth.getUserCountryByIp();
				}
				$('#_popinContent > div').removeClass('loading');
				$('#_popinContent > div').html(data);
				if ($('#_popinContent').find('#_fromResetPassword').val() == 1) {
					site.auth.showAuthForm('login');
				} else {
					site.auth.showAuthForm('inscription');
				}
				site.auth.replaceDownloadUrl('#_popinContent > div');
				if (clickPassword == false || clickPassword == '') {
					site.auth.atInternetReferer = site.auth._controller;
					if (site.auth._controller == 'ebibliotheque') {
						site.auth.atInternetReferer += '/'+site.auth._action;
					}
					site.tracking.trackClicPage(null, 'ebibliotheque::telecharger::telecharger&f1='+site.auth.atInternetReferer, 5);
				}
			}
		});
	};
	/**
	 * Fermer la popin
	 * @param  string 	button 		Bouton de fermeture de la popin
	 */
	this.closePopin = function(button, reload){
		var redirect = $('#_popinContent').find('#_redirPopin').val();
		var origin = $('#_popinContent').find('#_infoPassword').val();
		if ((this._controller == 'identification' || this._controller == 'identificationMVP') || origin == ""){
			$(button).parents('#_popinContent').hide();
			$(button).parents('#_popinContent').find('#_step2').hide();
			$('#_popinContent > div').html('');
			$('#_popinContent').find('#_redirPopin').val('');
			$('#_popinContent').find('#_infoPassword').val('');
		} else{
			this.showContentInPopUp(redirect);
			$('#_popinContent').find('#_infoPassword').val('');
		}
		if(reload){
			location.reload();
		}
	};
	/**
	 *
	 */
	this.downloadMoreDoc = function(url, authType) {
		if (authType == "register"){
			var formData = {
				'rqEmail'	: $('#_registerEmail').val(),
				'rqZip'		: $('#_zipCode').val(),
				'rqCity'	: $('#_city').val(),
			};
		}
		if (authType == "login"){
			var formData = {
				'rqEmail'	: $('#_loginEmail').val()
			};
		}
		$.post(url, formData, function(response) {
			if (response.status) {
				// Envoi du tracking concernant le choix sur les remonté
				site.tracking.doTRackingEbibliothequeTelechargement();
				xt_med('F', 5, 'ebibliotheque::telecharger::confirmation_telechargement'+'&f1='+response.nbDocuments+'&f2=['+response.docTitle+']&f3=['+response.niche+']&f4=['+response.univers+']&f5='+response.docId+'&f6=['+response.docType+']&f7=['+site.auth.atInternetReferer+']');
				window.location.assign(response.wwwHost+'/tableauDeBord/telechargement/telecharger/' + response.confirmationParams.idDl);
			} else {
				$('body').addClass('animated');
				$('body').append(
					"<div class='_erreurServeur erreur_serveur zoomIn'>Erreur de communication avec le serveur</div>"
				);
				setTimeout(function(){
					$('._erreurServeur').remove();
				}, 4000);
			}
		});
	};

	this.getUserCountryByIp = function() {
		$.ajax({
			type: 'POST',
			url: '/annuaire/getUserCountryByIp',
			success: function(data) {
				if (data.success == false)
					$('#_registerForm').find('#_country').val('Hors France');
				else {
					$('#_registerForm').find('#_country').val('FR');
					$('#_registerForm').find('#_blocCity').show();
				}
			}
		});
	};

	// Remplace l'url lorsque l'on clic sur les boutons de téléchargement
	this.replaceDownloadUrl = function(conteneur) {
		var isConnected = site.auth.isAuthenticated();
		if (typeof conteneur == 'undefined')
			conteneur = '';
		$(conteneur + " a[data-download-id]").click(function() {
			var urlDownload = isConnected ? '/ebibliotheque/telecharger/' : '/ebibliotheque/telechargement/';
			urlDownload += $(this).attr('data-download-id');
			// ajout du tracking de page
			if (isConnected == true) {
				site.auth.infosTrackingPage('/ebibliotheque/infosDownloadTracking/'+$(this).attr('data-download-id'));
			}
			site.auth.showContentInPopUp(urlDownload);
		});
		$(conteneur + " span[data-download-id]").click(function() {
			var urlDownload = isConnected ? '/ebibliotheque/telecharger/' : '/ebibliotheque/telechargement/';
			urlDownload += $(this).attr('data-download-id')+'/true';
			site.auth.downloadMoreDoc(urlDownload);
		});
	};

	// Sur le onblur du champ Ville(_zip), on affiche ou non un message d'erreur en fonction de
	// a. Pas de contenu dans ZIP => erreur
	// b. Contenu mais pas de liste autocomplete affiche => VIDE + erreur
	// C. Contenu + liste autocomplete affiche avec + de 1 élem + pas de ville/zip dans le champs hidden  => VIDE + erreur
	// D. Contenu + liste autocomplete affiche avec 1 élem + pas de ville/zip dans le champs hidden  => Select auto du seul contenu dans la liste
	this.verifyZipOnBlur = function(hasError) {
		var zipCode = $('#_zipCode').val();
	 	if (zipCode == '') {
	 		if ($('span.cityList').length > 1 && $('#_zipLogin').val() != '') {
	 			site.auth.errorInput($('#_zipLogin'), 'chooseCity');
			 	$('#_zipLogin').val('');
			 	$('#_citySetPart').val('');
	 			$('#_zipLogin').prev('div#_list_cities').hide();
	 			return true;
	 		} else if ($('span.cityList').length == 1 && $('#_zipLogin').val() != '') {
 				site.auth.selectCity($('span.cityList').first());
 				return true;
	 		} else if ($('span.cityList').length == 0 && $('#_zipLogin').val() != '') {
	 			site.auth.errorInput($('#_zipLogin'), 'invalide');
	 			return true;
	 		}
	 	}
	 	return hasError;
	}

	// Récupére les infos pour le tracking de page d'un téléchargement en mode connecté
	this.infosTrackingPage = function(url) {
		$.post(url, function(response) {
			if (response.status) {
				// Envoi du tracking concernant le choix sur les remonté
				site.tracking.doTRackingEbibliothequeTelechargement();
				xt_med('F', 5, 'ebibliotheque::telecharger::confirmation_telechargement'+'&f1='+response.nbDocuments+'&f2=['+response.docTitle+']&f3=['+response.niche+']&f4=['+response.univers+']&f5='+response.docId+'&f6=['+response.docType+']&f7=['+site.auth.atInternetReferer+']');
			}
		});
	}
};