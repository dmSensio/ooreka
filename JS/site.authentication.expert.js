/**
 * Objet de gestion de l'inscription expert.
 *
 * @author      Dorian Yahouédéou <dorian.yahouedeou@finemedia.fr>
 * @copyright   © 2014, Fine Media
 */
site.authentication.expert = new function() {
	/** Liste d'expertises */
	this._expertisesList = [];
	/** Validité de la civilité */
	this._isValidCivilite = null;
	/** Validité du nom */
	this._isValidName = null;
	/** Validité du prénom */
	this._isValidSurname = null;
	/** Validité du métier */
	this._isValidJob = null;
	/** Validité de l'email */
	this._isValidEmail = null;
	/** Validité du code postal */
	this._isValidZip = null;
	/** Validité du mot de passe */
	this._isValidPassword = null;
	/** Validité de l'optin des offres */
	this._isValidOffersOptin = null;
	/** Validité de l'option de CGU */
	this._isValidCgu = null;
	/** Validation du téléphone */
	this_isValidPhone = null;
	/** Validation du mobile */
	this_isValidMobile = null;
        /**
         * Initialisation.
         * @param       string  url             URL de la page courante.
         * @param       string  controller      Contrôleur courant.
         * @param       string  action          Action courante.
         */
        this.init = function(url, controller, action) {
		if (controller == 'identification' && action == 'inscription') {
			if ($('#_convertToExpertPopup')) {
				$('#_convertToExpertPopup').dialog({
					disabled:       false,
					width:          680,
					height:         'auto',
					position:       [site.dialogPositionX],
					modal:          true,
					dialogClass:	'inscription_expert_popup',
					resizable:      false,
					closeText:      'Fermer'
				});
				$('#_convertToExpertPopup').dialog('close');
			}
		}
		this.resizeForm();
	};
	/**
	 * Selectionner un domaine d'expertise et passer à l'étape suivante.
	 * @param	object	obj		Objet dom correspondant au domaine d'expertise sélectionné.
	 */
	this.selectDomainExpertise = function(obj) {
		var domainName = $(obj).attr('data-name');
		var domainId = $(obj).attr('data-id');
		// suppression des expertises préalablement sélectionnées
		this._expertisesList = [];
		$('#_btn-gotocard').hide();
		$('#_expertisesId').val('');
		// mémorisation des données
		$('#_domainId').val(domainId);
		$('#_domainName').val(domainName);
		// sélection du domaine d'expertise dans l'interface
		$('.liste_domaine > li').removeClass('selection');
		$(obj).addClass('selection');
		// préparation de l'image de profil
		$('#_avatar').removeClass().addClass('img_expert icon icon-pic');
		var domainCode = $(obj).attr('data-code');
		if ($('#_civilite-mr:checked').val() != undefined)
			var sexe = 'avatar_h';
		else if ($('#_civilite-mme:checked').val() != undefined)
			var sexe = 'avatar_f';
		$('#_avatar').addClass(domainCode).addClass(sexe);
		// passer à l'étape de choix des expertises
		$('.liste_expertise').load('/identification/getExpertisesList/' + domainId, {"selection[]" : this._expertisesList}, function() {
			$('#_stepDomaines').hide();
			$('#_stepExpertises').show();
			$(window).scrollTop($('#_stepExpertises').offset().top);
			$('#_selected-domain-label').removeClass();
			$('#_selected-domain-label').addClass('illu_domaine_' + domainCode);
			$('#_selected-domain-label').text(domainName);
			site.tracking.doTrackingInscriptionExpert('domaineExpertise');
		});
	};
	/**
	 * Sélectionner plusieurs expertises.
	 * @param	object 	obj	Objet dom correspondant à l'expertise sélectionnée.
	 */
	this.selectExpertises = function(obj) {
		var expertiseId = $(obj).attr('data-id');
		// mémorisation des données
		if ($.inArray(expertiseId, this._expertisesList) == -1) {
			this._expertisesList.push(expertiseId);
			$(obj).addClass('selection');
		} else if ($.inArray(expertiseId, this._expertisesList) > -1) {
			this._expertisesList.splice($.inArray(expertiseId, this._expertisesList), 1);
			$(obj).removeClass('selection');
		}
		var expertises = this._expertisesList.join(',');
		$('#_expertisesId').val(expertises);
		// mise à jour de l'interface
		if (this._expertisesList.length > 0)
			$('#_btn-gotocard').show();
		else
			$('#_btn-gotocard').hide();

	};
	/** Retourner à l'étape de sélection d'un domaine. */
	this.backToDomain = function() {
		var domainId = $('#_domainId').val();
		var domain = $("li[data-id='" + domainId  + "']");
		$(domain).addClass('selection');
		var domainName = $(domain).attr('data-name');
		$('#_stepExpertises').hide();
		$('#_stepDomaines').show();
		$(window).scrollTop($('#_stepExpertises').offset().top);
		site.tracking.doTrackingInscriptionExpert('backDomain');
	};
	/** Retourner à l'étape de sélection depuis l'étape finale. */
	this.backToCard = function() {
		$('#_stepLast').hide();
		$('#_stepCard').show();
		$(window).scrollTop($('#_stepCard').offset().top);
		this.refreshPreviewEnterprise();
		this.refreshPreviewCompleteName();
		site.tracking.doTrackingInscriptionExpert('backToCard');
	};
	/** Passer à l'étape de la carte de visite. */
	this.goToCard = function() {
		$('#_stepExpertises').hide();
		$('#_stepCard').show();
		site.tracking.doTrackingInscriptionExpert('goToCard');
		$(window).scrollTop($('#_stepCard').offset().top);
		this.heightInfoContact();
		this.verifyInput();
	};
	/** Passer à l'étape de choix des expertises. */
	this.goToExpertises = function() {
		var domainId = $('#_domainId').val();
		var expertises = $('#_expertisesId').val();
		this._expertisesList = expertises.split(',');
		if (this._expertisesList.length > 0)
			$('#_btn-gotocard').show();
		$('.liste_expertise').load('/identification/getExpertisesList/' + domainId, {"selection[]" : this._expertisesList}, function() {
			$('#_stepCard').hide();
			$('#_stepExpertises').show();
			$(window).scrollTop($('#_stepExpertises').offset().top);
			var domainId = $('#_domainId').val();
			var domainName = $("li[data-id='" + domainId  + "']").attr('data-name');
			$('#_selected-domain-label').text(domainName);
			site.tracking.doTrackingInscriptionExpert('backToExpertise');
		});
	};
	/** Passer à l'étape de fin */
	this.goToLastStep = function() {
		$('#_stepCard').hide();
		$('#_stepLast').show();
		$(window).scrollTop($('#_stepLast').offset().top);
	};
	/** Passer à la page de connexion depuis la page d'inscription expert. */
	this.goToConnection = function() {
		var email = $('#_email').val().trim();
		window.location.href = '/identification/connexion?email=' + encodeURIComponent(email);
	};
	/** Rafraichir le nom et le prénom dans la prévisualisation. */
	this.refreshPreviewCompleteName = function() {
		// mise à jour de la prévisualisation
		$('#_previsualisation-nom-prenom').text($('#_prenom').val() + ' ' + $('#_nom').val());
	};
	/** Rafraichir le métier et l'entreprise. */
	this.refreshPreviewEnterprise = function() {
		var metier = $('#_metier').val();
		var societe = $('#_societe').val();
		// calcul de la taill de chaque saisie
		var societe_length = societe.length;
		var metier_length = metier.length;
		$('#_metier-text-length').text(metier_length);
		$('#_societe-text-length').text(societe_length);
		// combinaison des 2 textes
		if (metier_length > 0 && societe_length > 0)
			var text = metier + ' | ' + societe;
		else if (metier_length > 0 && societe_length == 0)
			var text = metier;
		else if (metier_length == 0 && societe_length > 0)
			var text = societe;
		// affichage dans l'interface
		$('#_previsualisation-fonction-entreprise').text(text);
	};
	/**
	 * Choix d'une civilité
	 * @param	string	civilite	Civilité choisie.
	 */
	this.selectCivilite = function(civilite) {
		// changer l'image de la prévisualisation
		if (civilite == 'woman')
			var sexe = 'avatar_f';
		else
			var sexe = 'avatar_h';
		this._isValidCivilite = true;
		$('#_quest-civilite').removeClass('erreur');
		// positionner le domaine d'expertise et le sexe
		var domainId = $('#_domainId').val();
		var domain = $("a[data-id='" + domainId  + "']");
		var domainCode = $(domain).attr('data-code');
		$('#_avatar').removeClass();
		$('#_avatar').addClass(domainCode).addClass(sexe).addClass('img_expert icon icon-pic');
	};
	/** Choix d'une option "oui" ou "non" pour les offres partenaires. */
	this.selectPartnersInfo = function() {
		this._isValidOffersOptin = true;
		$('#_quest-partnersInfo').removeClass('erreur');
	};
	/**
	 * Cacher/effacer les erreurs associées à un champ donné au clic.
	 * @param	object	element 	Element de dom à manipuler.
	 */
	this.hideError = function(element) {
		var $field = $(element);
		var fieldId = $field.attr('id');
		var fieldName = $field.attr('name');
		var fieldType = $field.attr('type');
		if ($('#_quest-' + fieldName).length == 0)
			return;
		$('#_quest-' + fieldName).removeClass();
	};
	/** Vérifier la civilite */
	this.checkCivilite = function() {
		if ($('#_civilite-mr').is(':checked') || $('#_civilite-mme').is(':checked')) {
			this._isValidCivilite = true;
			$('#_quest-civilite').addClass('valide').removeClass('erreur');
		} else {
			this._isValidCivilite = false;
			$('#_quest-civilite').addClass('erreur').removeClass('valide');
		}
	};
	/** Vérifier le prénom */
	this.checkSurname = function() {
		var prenom = $('#_prenom').val();
		if ($.trim(prenom).length > 0) {
			this._isValidSurname = true;
			$('#_quest-prenom').addClass('valide').removeClass('erreur');
		} else {
			this._isValidSurname = false;
			$('#_quest-prenom').addClass('erreur').removeClass('valide');
			$('#_prenom').parent().removeClass('actif');
		}
	};
	/** Vérifier le nom */
	this.checkName = function() {
		var nom = $('#_nom').val();
		if ($.trim(nom).length > 0) {
			this._isValidName = true;
			$('#_quest-nomFamille').addClass('valide').removeClass('erreur');
		} else {
			this._isValidName = false;
			$('#_quest-nomFamille').addClass('erreur').removeClass('valide');
			$('#_nom').parent().removeClass('actif');
		}
	};
	/** Vérifier le métier */
	this.checkJob = function() {
		if ($.trim($('#_metier').val()).length > 0) {
			this._isValidJob = true;
			$('#_quest-metier').addClass('valide').removeClass('erreur');
		} else {
			this._isValidJob = false;
			$('#_quest-metier').addClass('erreur').removeClass('valide');
			$('#_metier').parent().removeClass('actif');
		}
	};
	/**
	 * Verification du nom de societe
	 */
	this.checkSociety = function(){
		var nomSociete = $('#_societe').val();
		if ($.trim(nomSociete).length == 0){
			$('#_quest-societe').removeClass('valide');
			$('#_societe').parent().removeClass('actif');
		} else{
			$('#_quest-societe').addClass('valide');
		}
	};
	/**
	 * Verification du numero et rue
	 */
	this.checkStreet = function(){
		var street = $('#_street').val();
		if ($.trim(street).length == 0){
			$('#_quest-Rue').removeClass('valide');
			$('#_street').parent().removeClass('actif');
		} else{
			$('#_quest-Rue').addClass('valide');
		}
	};
	/**
	 * Verification de la ville
	 */
	this.checkCity = function(){
		var city = $('#_city').val();
		if ($.trim(city).length == 0){
			$('#_quest-City').removeClass('valide');
			$('#_city').parent().removeClass('actif');
		} else{
			$('#_quest-City').addClass('valide');
		}
	};
	/**
	 * Vérifier le code postal
	 */
	this.checkZip = function() {
		this._isValidZip = true;
		$('#_quest-codePostal').removeClass('erreur');
		$('._infoComplementaire').removeClass('erreur_zip');
		if ($('#_pays').val() == 'FR') {
			this._isValidZip = (/^\d{5}$/.test($('#_codepostal').val()));
			$('#_quest-codePostal').addClass('valide').removeClass('erreur');
		} else if ($('#_codepostal').val().length == 0) {
			this._isValidZip = false;
			$('#_quest-codePostal').addClass('erreur').removeClass('valide');
			$('#_codepostal').parent().removeClass('actif');
		}
		if (!this._isValidZip){
			$('#_quest-codePostal').addClass('erreur');
			$('._infoComplementaire').addClass('erreur_zip');
			var zip = $('#_codepostal').val();
			if ($.trim(zip).length == 0){
				$('#_codepostal').parent().removeClass('actif');
			}
		}
	};
	/**
	 * Verification du site web
	 */
	this.checkWebsite = function(){
		//Verification du site web
                this._isValidWebsite = true;
                $('#_quest-website').removeClass('erreur');
		if ($('#_website').val().trim().length > 0) {
			// si le site web est valide
			if (site.common.checkUrl($('#_website').val())) {
				$('#_quest-website').addClass('valide').removeClass('erreur');
			} else{
				$('#_quest-website').addClass('erreur').removeClass('valide');
				this._isValidWebsite = false;
			}
		} else{
			$('#_website').parent().removeClass('actif').removeClass('erreur').removeClass('valide');
		}
/*		if ((this._isValidMobile == true ? true : false) && (this._isValidPhone == true ? true : false) && (this._isValidCivilite == true ? true : false) && (this._isValidWebsite == true ? true : false) && (this._isValidZip == true ? true : false) && (this._isValidName == true ? true : false) && (this._isValidSurname == true ? true : false) && (this._isValidJob == true ? true : false )) {
			site.tracking.doTrackingInscriptionExpert('goToCreateAccount');
			this.goToLastStep();
		}*/
	};
	/**
	 * Verification du mobile
	 */
	this.checkMobile = function(){
		this._isValidMobile = true;
		var phone = $('#_mobile').val().replace(/\s+/g, '');
		if (phone.length > 0){
			if (phone[0] == "+" && (phone.slice(1).length == 12 || phone.slice(1).length == 11) && !isNaN(phone) ) {
				$('#_quest-mobile').addClass('valide').removeClass('erreur');
			}
			else if (phone[0] != "+" && phone.length == 10){
				$('#_quest-mobile').addClass('valide').removeClass('erreur');
			}
			else{
				$('#_quest-mobile').addClass('erreur').removeClass('valide');
				this._isValidMobile = false;
			}
		} else{
			$('#_mobile').parent().removeClass('actif').removeClass('erreur').removeClass('valide');
		}
	};
	/**
	 * Verification du téléphone
	 */
	this.checkPhone = function(){
		this._isValidPhone = true;
		var phone = $('#_phone').val().replace(/\s+/g, '');
		if (phone.length > 0){
			if (phone[0] == "+" && (phone.slice(1).length == 12 || phone.slice(1).length == 11) && !isNaN(phone) ) {
				$('#_quest-phone').addClass('valide').removeClass('erreur');
			}
			else if (phone[0] != "+" && phone.length == 10){
				$('#_quest-phone').addClass('valide').removeClass('erreur');
			}
			else{
				$('#_quest-phone').addClass('erreur').removeClass('valide');
				this._isValidPhone = false;
			}
		} else{
			$('#_phone').parent().removeClass('actif').removeClass('erreur').removeClass('valide');
		}
	};
	/** Validation du formulaire */
	this.checkStepCard = function() {
		this.checkCivilite();
		this.checkName();
		this.checkSurname();
		this.checkJob();
		this.checkZip();
		this.checkMobile();
		this.checkPhone();
		this.checkWebsite();
		if ($('#_stepCard .erreur').length > 0){
			$('#_champObligatoire').addClass('erreur_existante');
		}
		else {
			site.tracking.doTrackingInscriptionExpert('goToCreateAccount');
			this.goToLastStep();
		}
	};
	/**
	 * Calcul hauteur zone de formulaire pour placer bouton continuer
	 */
	this.heightInfoContact = function(){
		var heightBox = $('._info_contact').outerHeight();
		if ($(window).width() > 800){
			$('._info_contact + div').css({
				'height' : heightBox + 'px'
			});
			$('._info_contact + div').removeClass('version_responsive');
			$('._info_contact + div').addClass('version_desktop');
		} else{
			$('._info_contact + div').css({
				'height' : 'auto'
			});
			$('._info_contact + div').removeClass('version_desktop');
			$('._info_contact + div').addClass('version_responsive');
		}
	}
	this.resizeForm = function(){
		$(window).resize(function() {
			site.authentication.expert.heightInfoContact();
		});
		this.heightInfoContact();
	}
	/**
	 * Valider l'email.
	 * @param	bool	showPopup	Afficher la popup de conversion de compte.
	 */
	this.checkEmail = function(showPopup) {
		var email = $.trim($('#_email').val());
		if (email.length > 0) {
			// vérifier auprès du serveur la validité de l'adresse email
			$('#_quest-email').removeClass();
                        // test de la syntaxe de l'email
                        var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
                        if (!regEmail.test(email)) {
				$('#_quest-email').addClass('erreur')
                                error = true;
                                return;
                        }
			$.getJSON('/identification/checkEmail/' + email, function(data) {
				if (!data.success) {
					// cas d'un compte particulier qui existe déjà
					if (data.code == 'accountExists' && data.accountType == 'private') {
						site.authentication.expert.setEmailValidity(true);
						if (showPopup) {
							// ouvrir la popup
							$('#_convertToExpertPopup').dialog('open');
							$('#_popupErrorAuth').hide();
							// copier la valeur du mot de passe de formulaire d'inscription dans la popup
							$('#_popupMdp').val($('#_mdp').val());
							// activer mode d'authentification adapté (mot de passe ou facebook)
							$('#_facebookAuthMode').hide();
							$('#_standardAuthMode').hide();
							if (data.facebookId != 0)
								$('#_facebookAuthMode').show();
							else
								$('#_standardAuthMode').show();
							site.tracking.doTrackingInscriptionExpert('popInCompteExistantPart');
						}
					} else if (data.code == 'accountExists' && data.accountType == 'expert') {
						// cas d'un compte expert qui existe déjà
						$('#_quest-email').removeClass().addClass('commentaire_expert');
						site.authentication.expert.setEmailValidity(false);
					} else if (data.code == 'bad syntax' || data.code == 'no mx list' || data.code == 'accountBlacklisted') {
						// cas d'une adresse email mal formée ou d'un compte blacklisté
						$('#_quest-email').addClass('erreur').removeClass('valide');
						site.authentication.expert.setEmailValidity(false);
					}
				} else {
					// cas d'une nouvelle adresse valide
					site.authentication.expert.setEmailValidity(true);
					$('#_quest-email').removeClass().addClass('valide');
				}
				// Vérifier l'authentification et déconnecter l'utilisateur si il est connecté
				if (site.authentication.isConnected && showPopup) {
					var urlLogout = '/identification/logout/async';
					$.get(urlLogout, function(response) {
						if (response)
							site.authentication.isConnected = false;
					});
				}
			});
		} else {
			$('#_quest-email').addClass('erreur').removeClass('valide');
			this.setEmailValidity(false);
		}
	};
	/** Vérifier la présence d'un mot de passe. */
	this.checkPassword = function() {
		var password = $.trim($('#_mdp').val());
		if (password.length == 0)
                        $('#_quest-password').addClass('manquant');
		if (password.length > 7  && !(/\s/g.test(password))) {
			$('#_quest-password').addClass('valide').removeClass('erreur');
			this._isValidPassword = true;
		} else {
			$('#_quest-password').addClass('erreur').removeClass('valide');
			this._isValidPassword = false;
		}
	};
	/** Vérifier l'optin partenaire */
	this.checkOffersOptin = function() {
                if ($('#_offres-oui').is(':checked') || $('#_offres-non').is(':checked'))
                        this._isValidOffersOptin = true;
                else {
                        this._isValidOffersOptin = false;
			$('#_quest-partnersInfo').addClass('erreur');
		}
	};
	/**
	 * Définir la validité de l'adresse email
	 * @param	bool	isValid		Indique si l'adresse email est valide ou pas.
	 */
	this.setEmailValidity = function(isValid) {
		this._isValidEmail = isValid;
	};
	/** Vérifier l'acceptation des CGU. */
	this.checkCgu = function() {
                $('#_quest-cgu').removeClass('erreur');
		if ($('#_cgu').is(':checked')) {
			this._isValidCgu = true;
                } else {
			this._isValidCgu = false;
                        $('#_quest-cgu').addClass('erreur');
                }
	};
	/** Finaliser l'inscription */
	this.register = function(accountExists) {
		if (typeof accountExists === 'undefined')
			accountExists = false;
		// vérifier l'email
		this.checkEmail(false);
		// vérifier le code postal
                if (!accountExists) {
			// vérfifier l'option partenaire
			this.checkOffersOptin();
			// vérifier la case des conditions générales
			this.checkCgu();
                } else {
                	this._isValidCgu = true;
                	$('#_cgu').prop('checked', true);
                }
		// vérifier le mot de passe
		this.checkPassword();
		// validation du formulaire
		if (((this._isValidEmail === true ? true : false) && (this._isValidPassword === true ? true : false) &&  (this._isValidOffersOptin === true ? true : false) && (this._isValidCgu === true ? true : false )) || accountExists) {
			if (typeof xt_med != 'undefined') {
				var xtAuthType = 'inscription';
				var xtUserType = 'expert';
				xt_med('F', xtn2, 'identification::' + xtAuthType + '::' + xtAuthType + '_' + xtUserType + '::confirmation_' + xtAuthType + '_' + xtUserType);
			}
			site.tracking.doTrackingInscriptionExpert('endRegisterExpert');
			$('#_form-expert-register').submit();
		}
	};

	/** *********************************** GESTION DES POPUPS ***************************************** */
	/** Envoyer le mail de récupération du mot de passe à l'adresse indiquée dans le formulaire de base. */
	this.popupRecoverPassword = function() {
		var url = '/identification/envoyerMotDePasse';
		$.post(url, {'email': $('#_email').val(), 'view':'json'}, function(response) {
			if (response) {
				// afficher la popup éphémère
				$('#_confirmationRecoverPassword').addClass('popin_go').removeClass('popin_no');
                                setTimeout(function() {
                                        $('#_confirmationRecoverPassword').removeClass('popin_go').addClass('popin_no');
                                }, 3000);
				// valider le champ 'email'
				$('#_quest-email').removeClass().addClass('valide');
			}
		});
	};
	/** Valider le conversion du compte ayant l'adresse email indiquée. */
	this.popupValidConversion = function() {
		var url = '/identification/login/json';
		var popupPassword = $('#_popupMdp').val();
		var userData = {
			'email': $('#_email').val(),
			'password': popupPassword
		};
		if (popupPassword.length == 0)
			return;
		// Opération principale.
		$.post(url, userData, function(response) {
			if (response == false) {
				// Authentification échouée.
				$('#_popupErrorAuth').show();
			} else {
				$('#_popupErorAuth').hide();
				// Authentification réussie.
				site.authentication.isConnected = true;
				// transfert du mot de passe de la popup vers le processus d'inscription
				$('#_mdp').val(popupPassword);
				// fermeture de la popup
				$('#_convertToExpertPopup').dialog('close');
				// validation email + mot de passe
				$('#_quest-email').removeClass().addClass('valide');
				$('#_quest-password').removeClass().addClass('valide');
				site.authentication.expert._isValidEmail = true;
				site.authentication.expert._isValidPassword = true;
				site.authentication.expert.register(true);
			}
		});
	};
	/** Annuler le processus de conversion du compte part en expert. */
	this.popupCancelConversion = function() {
		$('#_convertToExpertPopup').dialog('close');
	};
	/**
	 * Animations des champs de formulaire
	 */
	this.animateInput = function(elementClicked){
		$(elementClicked).parent().addClass('actif');
	};
	/**
	 * Verification au chargement de la page que les inputs renseignés soient correctement affichés.
	 */
	this.verifyInput = function(){
		var input = $('.form_inscription_expert fieldset input').not(':radio');
		input.each(function(index, element){
			if ($(element).val().length > 0){
				$(element).parent().addClass('actif');
			}
		});
	};
	/**
	 * Récupérer les initiales pour la bulle expert
	 */
	this.recoverInitial = function(elementClicked){
		var bulleExpert = $('#_avatar span');
		var firstName = $('#_prenom').val().substring(0,1);
		var lastName = $('#_nom').val().substring(0,1);
		bulleExpert.html(firstName + lastName);
	};
};
