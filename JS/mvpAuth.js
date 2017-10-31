/**
 * Objet de gestion de l'authentification.
 * @author	David Marcos	<david.marcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
mvpAuth = new function() {
	/** URL courante. */
	this._url = null;
	/** Controller courant. */
	this._controller = null;
	/** Action courante. */
	this._action = null;
	/** L'article fait-il partie d'un projet. */
	this._projectId = null;
	/* Utiliser pour le tracking du tunnel de conversion des téléchargements*/
	this.atInternetReferer = '';

	/* ******************** INITIALISATIONS ***************** */
	/**
	 * Initialisation de l'objet.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 * @param	string	projectId	id du projet.
	 */
	this.init = function(url, controller, action, projectId) {
		this._url = url;
		this._controller = controller;
		this._action = action;
		this._projectId = projectId;
		this.checkUserConnected();
		this.getUserCountryByIp();
		this.bind();
	};
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
		var isPopin = $('#_popinDownload').length;
		if(authType == 'login'){
			mvpTracking.trackClicPage(null, (isPopin == 1 ? 'telechargement' : 'direct') + '::identification::connexion', (isPopin == 1 ? 5 : 6));
			$("#_registerForm").hide();
			$("#_loginForm").show();
			$('#_loginEmail').val(valueInput);
			$('._downloadRegister').hide();
			$('._downloadLogin').show();
		} else{
			mvpTracking.trackClicPage(null, (isPopin == 1 ? 'telechargement' : 'direct') + '::identification::inscription_particulier', (isPopin == 1 ? 5 : 6));
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
		$(elementClicked).toggleClass('visible');
		if (type == "text"){
			input.get(0).type = 'password';
		} else{
			input.get(0).type = 'text';
		}
	};
	this.bind = function(){
		if ($('#_registerEmail').length && $('#_registerEmail').val().length > 0) {
			this.verifyEmail($('#_registerEmail'));
		}
		if ($('#_registerPassword').length && $('#_registerPassword').val().length > 0) {
			this.verifyPassword($('#_registerPassword'), false);
		}
		var input = $('form input');
		input.bind('focus', function(){
			mvpAuth.focusInput(this);
		});
		var inputCommon = $('._input');
		inputCommon.bind('blur', function(){
			mvpAuth.verifyContentForm(this);
		});
		var inputMail = $('._inputMail');
		inputMail.bind('blur', function(){
			mvpAuth.verifyEmail(this, true);
		});
		var inputPw = $('._inputPw');
		inputPw.bind('blur', function(){
			mvpAuth.verifyPassword(this, '', true);
		});
		var inputConfirm = $('._inputConfirm');
		inputConfirm.bind('blur', function(){
			mvpAuthentication.checkNewPassword(this);
		});
		var inputCheckbox = $('.checkbox input');
		inputCheckbox.bind('click', function(){
			$(this).parent().toggleClass('is_checked');
		});
	};
	this.focusInput = function(input){
		if (input.type == 'text' || input.type == 'password'){
			$(input).parent().removeClass('erreur');
			$(input).parent().removeClass('valide');
			$(input).parent().addClass('actif');
			$(input).parents('fieldset').find('.message_erreur').hide();
			$(input).parents('fieldset').find('._info').show();
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
	 * @param 	booleen	noErrorEmptyField Pas d'erreur si champ vide (valable si on clique sur le champ et on ressort)
	 * @return 	booleen	hasError	Indique s'il y a ou pas une erreur
	 */
	this.verifyEmail = function(email, noErrorEmptyField){
		$(email).parent().removeClass('actif');
		hasError = false;
		var myEmail = $(email).val();
		if ($(email).attr('id') == '_oublie' && myEmail.length == 0){
			if (typeof noErrorEmptyField == 'undefined' || !noErrorEmptyField) {
				this.errorInput(email, 'vide');
			}
		}
		else if ($(email).attr('id') == '_oublie' && myEmail.length > 0){
			var url = "/identificationMVP/checkEmailForPassword/" + $(email).val();
			$.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				success: function(data) {
					if (data.code == 'bad syntax') {
						hasError = true;
						mvpAuth.errorInput(email, 'invalide');
					}
					else if (data.code == 'accountNotFound') {
						hasError = true;
						mvpAuth.errorInput(email, 'inexistant');
					} else{
						mvpAuth.validateInput(email);
					}
				},
				async: false
			});
		}
		else{
			var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
			if(myEmail == ''){
				if (typeof noErrorEmptyField == 'undefined' || !noErrorEmptyField) {
					this.errorInput(email, 'vide');
				}
				hasError = true;
			} else if (regEmail.test(myEmail)) {
				if ($(email).attr('id') != '_loginEmail') {
					var url = "/identificationMVP/checkEmail/"+ myEmail;
					$.ajax({
						url: url,
						dataType: 'json',
						success: function(data) {
							if (!data.success) {
								$('#_registerForm').find('#_registerEmail').parent().addClass('erreur');
								if (data.code == 'accountExists' || data.code == 'accountBlacklisted') {
									mvpAuth.errorInput($('#_registerEmail'), 'existant');
								} else if (data.code == 'bad syntax' || data.code == 'no mx list') {
									mvpAuth.errorInput($('#_registerEmail'), 'invalide');
								}
								hasError = true;
							} else {
								mvpAuth.validateInput(email);
							}
						},
						async: false
					});
				} else {
					mvpAuth.validateInput(email);
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
	 * @param 	booleen	noErrorEmptyField Pas d'erreur si champ vide (valable si on clique sur le champ et on ressort)
	 * @return 	booleen	hasError	Indique s'il y a ou pas une erreur
	 */
	this.verifyPassword = function(password, login, noErrorEmptyField){
		$(password).parent().removeClass('actif');
		hasError = false;
		var myPassWord = $(password).val();
		if (login){
			if(myPassWord == '' || typeof myPassWord == 'undefined'){
				if (typeof noErrorEmptyField == 'undefined' || !noErrorEmptyField) {
					this.errorInput(password, 'vide', $('._info'));
				}
				hasError = true;
			}
			else{
				this.validateInput(password, $('._info'));
			}
		} else{
			if(myPassWord == '' || typeof myPassWord == 'undefined'){
				if (typeof noErrorEmptyField == 'undefined' || !noErrorEmptyField) {
					this.errorInput(password, 'vide', $('._info'));
				}
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
	this.verifyContentForm = function(input){
		$(input).parent().removeClass('actif');
		hasError = false;
		var elemId = $(input).attr('id');
		if (elemId == '_zipInput') {
			hasError = mvpAuth.verifyZipOnBlur(hasError);
		} else {
			if ($(input).val() == ''){
				this.errorInput(input, 'vide');
				hasError = true;
			} else {
			 	this.validateInput(input);
			}
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
			this.errorInput($('#_zipInput'), 'vide');
			hasError = true;
		}
		else if(zipCode.length < 5 && $('#_country').val() == 'FR'){
			this.errorInput($('#_zipInput'), 'invalide');
			hasError = true;
		}
		else {
			this.validateInput($('#_zipInput'));
		}
		return(hasError);
	};
	/**
	 * Verification du téléphone
	 */
	this.verifyPhone = function(phone){
		hasError = false;
		var value = $(phone).val().replace(/\s+/g, '');
		if ( (value[0] == "+" && (value.slice(1).length == 12 || value.slice(1).length == 11) && !isNaN(value)) || (value[0] != "+" && value.length == 10) ) {
			mvpAuth.validateInput(phone);
		} else if($(phone).val() == ''){
			mvpAuth.errorInput(phone, 'vide');
		} else{
			mvpAuth.errorInput(phone, 'invalide');
			hasError = true;
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
		$(element).parent().removeClass('valide');
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
		$(element).parent().addClass('valide');
		$(element).parents('fieldset').find('.message_erreur').hide();
		if (addModif){
			$(element).parents('fieldset').find(otherElement).show();
		}
	};

	this.selectCity = function(elementClicked){
		var city = $(elementClicked).attr('data-value');
		var zip = $(elementClicked).attr('data-zip');
		$(elementClicked).parents('form').find('#_city').val(city);
		$(elementClicked).parents('form').find('#_zipCode').val(zip);
		$(elementClicked).parents('form').find('#_zipInput').val(zip + ' ('+city+')');
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
							$(zip).prev('div#_list_cities').append('<span class="cityList" onmousedown="mvpAuth.selectCity(this);" data-value="'+obj[i].tag+'" data-zip="'+obj[i].zip+'">'+zipBold+' ('+cityBold+')</span>');
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
		if($(optin).is(':checked')){
			this.validateInput(optin);
		} else{
			this.errorInput(optin);
			hasError = true;
		}
		return(hasError);
	};
	/**
	 * Validation du formulaire d'inscription
	 * @param 	string 	origin 	Origine de l'inscription
	 */
	this.register = function(origin, lastStep){
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
			var url = '/identificationMVP/enregistrer';
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
				'projectId':	this._projectId
			};
			// Si l'origin du clic est newsletter, on déconnecte le currentUser si il existe
			if (origin == 'newsletter') {
				$.post('/identificationMVP/logout', function(result) {
					mvpAuth.sendFormInscription(url, postData, ugcId, origin, lastStep);
				});
			} else {
				mvpAuth.sendFormInscription(url, postData, ugcId, origin, lastStep);
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
				mvpAuth.errorInput($('#_registerEmail'), 'existant');
			} else if ((!data.success || data.success == 'false') && data.code == 'invalidEmail'){
				$('#_registerForm').find('#_registerEmail').parent().addClass('erreur');
				mvpAuth.errorInput($('#_registerEmail'), 'invalide');
			} else {
				var loginRedirUrl = '/';
				if(data['loginRedirUrl']){
					loginRedirUrl = data['loginRedirUrl'];
				}
				mvpAuth.endRegister(ugcId, data['registerType'], data['userType'], data['email'], false, loginRedirUrl, origin, lastStep);
			}
		});
	};
	/**
	 * Validation du formulaire de connexion
	 * @param 	string 		origin 		Origine de l'inscription
	 */
	this.login = function(origin, lastStep){
		var email = this.verifyEmail($('#_loginEmail'));
		var password = this.verifyPassword($('#_loginPassword'), true);
		var stayConnected = ($('#stayConnected').attr('checked') === 'checked');
		var ugcId = $("#_ugcId").val();
		if(!email && !password) {
			var url = '/identificationMVP/login/json';
			var postData = {
				'email' : 	$('#_loginEmail').val(),
				'password' : 	$('#_loginPassword').val(),
				'origin':  	origin,
				'stayConnected': stayConnected
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
					mvpAuth.errorInput($('#_loginEmail'), 'inexistant');
				} else if ((!data.success || data.success == 'false') && data.code == 'wrongPassword') {
					$('#_loginForm').find('#_loginPassword').parent().addClass('erreur');
					mvpAuth.errorInput($('#_loginPassword'), 'invalide');
				} else if ((!data.success || data.success == 'false') && data.code == 'blacklisted') {
					$('#_loginForm').find('#_loginEmail').parent().addClass('erreur');
					$('#_loginForm').find('.blackliste').show();
				} else {
					var loginRedirUrl = null;
					if(data['loginRedirUrl']) {
						loginRedirUrl = data['loginRedirUrl'];
					}
					mvpAuth.endRegister(ugcId, data['registerType'], data['userType'], data['email'], false, loginRedirUrl, origin, lastStep);
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
				mvpTracking.trackClic(null, 'inscriptionNL::InscriptionConfirme', 'A');
			}
			var isPopin = $('#_popinDownload').length;
			xt_med('C', 6, stat, 'A');
			var xtAuthType = (authType == 'register' ? 'inscription' : 'connexion');
			var xtUserType = (userType == 'private' ? 'particulier' : 'expert');
			// xt_med('F', 6, 'direct::identification::' + xtAuthType + '::' + xtAuthType + '_' + xtUserType + '::confirmation_' + xtAuthType + '_' + xtUserType + '&f1=' + loginRedirUrl);
			if (isFacebook) {
				mvpTracking.trackClicPage(null, 'direct::identification::confirmation_connexion_avec_facebook', 6);
			} else {
				xt_med('F', (isPopin == 1 ? 5 : 6) , (isPopin == 1 ? 'telechargement' : 'direct') + '::identification::confirmation_' + xtAuthType + (xtAuthType == 'inscription' ? '_' + xtUserType : '') + '&f1=' + loginRedirUrl);
			}
			if(isPopin == 1) {
				mvpAuth.infosTrackingPage('/ebibliotheque/infosDownloadTracking/'+$('#_popinDownload').attr('data-ugc-id'));
			}

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
			// site.question.submitQrForm('qr-form');
			var qrDomId = '#QRTitle';
			sendQuestionForm = "qr-form" ? "#sendQuestionForm-qr-form" : "#sendQuestionForm";
			var elm = $(qrDomId)[0];
			// Tracking
			var trackingZone = $(qrDomId).attr('data-tracking-zone');
			// xt_med('C', xtn2, trackingZone + '::QRPosee', 'A');
			// soumettre directement le formulaire
			$(sendQuestionForm).submit();
		}
	};
	/**
	 * Envoi du doc pour le telechargement
	 * @param 	string 	authType 	Type d'authentification - Login ou Register
	 */
	this.sendDoc = function(authType) {
		var ugcID = $('#_popinDownload').attr('data-ugc-id');
		var url = "/ebibliotheque/mvpTelecharger/" + ugcID + "/true";
		if (authType == "register"){
			var formData = {
				'rqEmail'	: $('#_registerEmail').val(),
				'rqZip'		: $('#_zipCode').val(),
				'rqCity'	: $('#_city').val()
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
				// mvpTracking.doTRackingEbibliothequeTelechargement();
				// xt_med('F', 5, 'ebibliotheque::telecharger::confirmation_telechargement'+'&f1='+response.nbDocuments+'&f2=['+response.docTitle+']&f3=['+response.niche+']&f4=['+response.univers+']&f5='+response.docId+'&f6=['+response.docType+']&f7=['+mvpAuth.atInternetReferer+']');
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
		// On modifie le onclick dans le cas de l'inscription/connnexion pour reload la page
		$('#_popinContent span[class*="close"]').attr('onclick', 'mvpAuth.closePopin($(this), true)');
	};
	/**
	 * Vérifie le formulaire "mot de passe perdu" et envoie au serveur une requête de mot de passe perdu.
	 * @param 	string 		button 		Bouton d'envoi
	 */
	this.sendLostPassword = function(button) {
		var urlReferrer = window.location.href;
		// s'il y a un id UGC, on l'ajoute à l'URL
		if ($('#ugcIdLostMdp').val() != '') {
			urlReferrer += (urlReferrer.indexOf('?') == -1) ? '?' : '&';
			urlReferrer += 'ugcId'+$('#ugcIdLostMdp').val();
		}
		var email = $('#_oublie').val();
		var errorMail = this.verifyEmail($('#_oublie'));
		if (!errorMail){
			// envoi de la requête au serveur
			var formData = {
				email:       email,
				urlReferrer: urlReferrer,
				view:        'json'
			};
			var url = '/identificationMVP/envoyerMotDePasse';
			$.post(url, formData, function(data) {
				if (data && data != 'unknownAccount'){
					$(button).parents('#_popinContent').find('#_step1').hide();
					$(button).parents('#_popinContent').find('#_step2').show();
				} else if (data == 'unknownAccount') {
					mvpAuth.errorInput($('#_oublie'), 'inexistant');
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
		if (this._controller != 'identificationMVP' && !clickPassword){
			$('#_popinContent').find('#_redirPopin').val(url);
		}
		if (clickPassword){
			$('#_popinContent').find('#_infoPassword').val(origin);
			$('#_popinContent').find('#_fromResetPassword').val(1);
		}
		var datas = {
			'projectNameUrlTracking': $('#_projectNameUrlTracking').val(),
			'currentPageType': $('#_currentPageType').val()
		};
		$.ajax({
			method : 'GET',
			url : url,
			data: datas,
			dataType : 'html',
			beforeSend: function(){
				$('#_popinContent').show();
				$('#_popinContent > div').addClass('loading');
				$('#_popinContent > div').html('');
			},
			success: function(data){
				var isConnected = mvpAuth.isAuthenticated();
				if (isConnected == false) {
					mvpAuth.getUserCountryByIp();
					mvpTracking.trackClicPage(null, 'Telechargement::identification::inscription_particulier', 5);
				}
				$('#_popinContent > div').removeClass('loading');
				$('#_popinContent > div').html(data);
				if ($('#_popinContent').find('#_fromResetPassword').val() == 1) {
					mvpAuth.showAuthForm('login');
				}
				mvpAuth.bind();
				if (clickPassword == false || clickPassword == '') {
					mvpAuth.atInternetReferer = mvpAuth._controller;
					if (mvpAuth._controller == 'ebibliotheque') {
						mvpAuth.atInternetReferer += '/'+mvpAuth._action;
					}
					mvpTracking.trackClicPage(null, 'Telechargement::telecharger&f1='+mvpAuth.atInternetReferer, 5);
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
		if(typeof reload == 'undefined') {
			reload = $('#_popinDownload').find('._stepDownload_2').is(':visible');
		}
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
		var isConnected = mvpAuth.isAuthenticated();
		if (typeof conteneur == 'undefined')
			conteneur = '';
		$(conteneur + " span[data-download-id]").off('click').click(function() {
			var urlDownload = isConnected ? '/ebibliotheque/mvpTelecharger/' : '/ebibliotheque/mvpTelechargement/';
			urlDownload += $(this).attr('data-download-id');
			// ajout du tracking de page
			if (isConnected == true) {
				mvpAuth.infosTrackingPage('/ebibliotheque/infosDownloadTracking/'+$(this).attr('data-download-id'));
			}

			mvpAuth.showContentInPopUp(urlDownload);
		});
		this.checkUgcIdInUrl();
		// $(conteneur + " span[data-download-id]").click(function() {
		// 	var urlDownload = isConnected ? '/ebibliotheque/telecharger/' : '/ebibliotheque/telechargement/';
		// 	urlDownload += $(this).attr('data-download-id')+'/true';
		// });
	};

	// Sur le onblur du champ Ville(_zip), on affiche ou non un message d'erreur en fonction de
	// a. Pas de contenu dans ZIP => erreur
	// b. Contenu mais pas de liste autocomplete affiche => VIDE + erreur
	// C. Contenu + liste autocomplete affiche avec + de 1 élem + pas de ville/zip dans le champs hidden  => VIDE + erreur
	// D. Contenu + liste autocomplete affiche avec 1 élem + pas de ville/zip dans le champs hidden  => Select auto du seul contenu dans la liste
	this.verifyZipOnBlur = function(hasError) {
		var zipCode = $('#_zipCode').val();
	 	if (zipCode == '') {
	 		if ($('span.cityList').length > 1 && $('#_zipInput').val() != '') {
	 			mvpAuth.errorInput($('#_zipInput'), 'chooseCity');
			 	$('#_zipInput').val('');
			 	$('#_citySetPart').val('');
	 			$('#_zipInput').prev('div#_list_cities').hide();
	 			return true;
	 		} else if ($('span.cityList').length == 1 && $('#_zipInput').val() != '') {
 				mvpAuth.selectCity($('span.cityList').first());
 				return true;
	 		} else if ($('span.cityList').length == 0 && $('#_zipInput').val() != '') {
	 			mvpAuth.errorInput($('#_zipInput'), 'invalide');
	 			return true;
	 		}
	 	} else if(zipCode != '') {
			this.validateInput($('#_zipInput'));
	 	}


	 	return hasError;
	};

	// Récupére les infos pour le tracking de page d'un téléchargement en mode connecté
	this.infosTrackingPage = function(url) {
		$.post(url, function(response) {
			if (response.status) {
				// Envoi du tracking concernant le choix sur les remonté
				mvpTracking.doTRackingEbibliothequeTelechargement();
				// xt_med('F', 5, 'Telechargement::telecharger::confirmation_telechargement'+'&f1='+response.nbDocuments+'&f2=['+response.docTitle+']&f3=['+response.niche+']&f4=['+response.univers+']&f5='+response.docId+'&f6=['+response.docType+']&f7=['+mvpAuth.atInternetReferer+']');
				xt_med('F', 5, 'Telechargement::confirmation_telechargement'+'&f1='+mvpAuth.atInternetReferer+'&f2=['+response.docTitle+']&f3=['+response.docType+']&f4=['+response.docId+']');
			}
		});
	};
	/**
	 * check if the user is connected
	 */
	this.checkUserConnected = function() {
		$.ajax({
			method: "POST",
			url: "/mvp/isUserConnected"
		})
		.done(function(msg) {
			$('body').attr('data-connected', msg);
			if (msg == 'true') {
				$('.headerConnected').show();
				$('.headerNotConnected').hide();
			} else {
				$('.headerConnected').hide();
				$('.headerNotConnected').show();
			}
		})
	    	.always(function() {
			mvpAuth.replaceDownloadUrl();
		});
	};

	/**
	 * Check dans l'url si ugc id et ouvre popin DL
	 */
	this.checkUgcIdInUrl = function() {
		var url = window.location.href;
		if (url.indexOf('#ugcId=') != -1) {
			var ugcId = url.substring(url.indexOf('#ugcId=')+7); // 7chars in #ugcId=
			if ($('span[data-download-id="'+ugcId+'"]').length > 0) {
				$('span[data-download-id="' + ugcId + '"]').click(); // simulate click to open DL popin
				// simulate click to have good step (connect)
				setTimeout(function () {
					$('#_popinDownload').find('._downloadRegister span').click();
				}, 700);
			}
		}
	}
};