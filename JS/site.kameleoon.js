/**
 * Objet de gestion de la connexion telechargement document
 *
 * @author	David Marcos <david.marcos@finemedia.fr>
 * @copyright	© 2016, Fine Media
 */
site.kameleoon = new function() {
	/**
	 * Initialisation.
	 * @param	stringcd /	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if ($('.test_kameleoon_formulaire').is(':visible') ){
			this.addElementPage();
			this.verifyPressButton();
			if ($(window).width() <= 500){
				var heightHeader = $('.header_kameleoon').outerHeight() + $('.kameleoon_indication_etape').outerHeight();
				$('.test_kameleoon_formulaire').parent('section').addClass('section_kameleoon');
				$('.section_kameleoon').css({
					'margin-top' : heightHeader + 'px'
				});
				$('.kameleoon_indication_etape').css({
					'top' : heightHeader + 'px'
				});
			}
			else{
				this.heightBoxConnexion();
			}
		}
	};
	/**
	 * Check si input autocomplete
	 */
	this.checkAutoComplete = function(){
		$('.ensemble_champ .etapes input').each(function(index, element){
			if ($(element).val().length > 0){
				$(element).parents('fieldset').addClass('champ_valide');
			}
		});
	};
	/**
	 * Ajouter des elements et classes à la page
	 */
	this.addElementPage = function(){
		$('.test_kameleoon_formulaire').parents('body').find('header').addClass('header_kameleoon');
		$('.test_kameleoon_formulaire').parents('body').find('section.reassurance').addClass('reassurance_kameleoon');
		$('.test_kameleoon_formulaire').parents('body').find('.header_kameleoon').after(
			'<div class="kameleoon_indication_etape"><span></span></div>'
		)
		$('.test_kameleoon_formulaire').parents('body').find('.retour_kameleoon').show();
	};
	/**
	 * Calcule le hauteur de la box connexion email ou facebook
	 */
	this.heightBoxConnexion = function(){
		var heightBox = $('#_presentationDocument .w_2_3').outerHeight(true);
		$('#_presentationDocument .w_1_3').css('height', heightBox);
	};
	/**
	 * Calcule la hauteur du formulaire
	 */
	this.calculateHeight = function() {
		var heightElement = $('.ensemble_champ fieldset').outerHeight(true);
		var elementVisible = heightElement*3;
		$('.ensemble_champ, ._inscriptionKameleoon').css({
			'height' : elementVisible + 'px'
		});
		return (elementVisible);
	};
	/**
	 * Ouverture du formulaire de Connexion
	 */
	this.showConnexion = function(elementClicked){
		// afficher formulaire de connexion/inscription
		$('._inscriptionKameleoon').show();
		// cacher présentation document
		$(elementClicked).parents('#_presentationDocument').hide();
		// calculer la hauteur du formulaire
		this.calculateHeight();
		//cacher réassurance
		$('.reassurance').hide();
		$('.kameleoon_indication_etape').css({
			'height' : '10px'
		});
		this.checkAutoComplete();
		//afficher connexion facebook et message cnil
		$('._info_basDePage').show();
		// focus sur le champ email
		$('#_email').click();
		$('#_email').focus();
	};
	/**
	 * Action sur le champ du formulaire sélectionné
	 */
	this.selectInput = function(elementClicked) {
		var goStep = $(elementClicked).parents('fieldset').attr('data-step');
		var step = $(".etapes").attr('data-step');
		// si pas d'erreur
		if ( $('#_box_erreur p:visible').length == 0){
			// premier clic formulaire
			if ( goStep == step && $('.champ_actif').length == 0 ){
				// ajout class champ actif
				$('.etapes fieldset').removeClass('champ_actif');
				$(elementClicked).parents('fieldset').addClass('champ_actif');
			}
			// si clic sur étape précédente OU si le champ est rempli et étape suivante
			else if( goStep < step || ($('.champ_actif input').val().length > 0 && goStep > step) ) {
				// si champ rempli et étape suivante : possibilité de cliquer sur le champ
				if ($('.champ_actif input').val().length > 0 && goStep > step){
					$(elementClicked).removeAttr('readonly');
					$('.champ_actif').addClass('champ_valide');
				}
				// ajout class champ actif
				$('.etapes fieldset').removeClass('champ_actif');
				$(elementClicked).parents('fieldset').addClass('champ_actif');
				// déplacement des étapes
				var heightElement = $('.ensemble_champ fieldset').outerHeight(true);
				var index = $(elementClicked).parents('fieldset').index();
				$('.ensemble_champ .etapes').css({
					'top' : '-' + heightElement*index + 'px'
				});
				// recuperation et indication de l'étape active
				var stepActive = $('.champ_actif').attr('data-step');
				$('.ensemble_champ .etapes').attr('data-step', stepActive);
				// si étape active est la première, alors cacher fleche precedente
				if (stepActive == "1"){
					$('._stepBefore').hide();
				} else{
					$('._stepBefore').show();
				}
			}
			// déplacer curseur avancée du formulaire
			site.kameleoon.animateBarStep();
		}
		// valider le champ si renseigné
		$('.etapes fieldset').each(function(index,element){
			if ( $(element).find('input').val().length == 0 && $(element).hasClass('champ_valide') ){
				$(element).removeClass('champ_valide');
			} else if($(element).find('input').val().length > 0 && !$(element).hasClass('champ_valide') ){
				$(element).addClass('champ_valide');
			}
		});
	};
	/**
	 * Retourner à l'étape précédente - Fleche
	 */
	this.stepBefore = function() {
		var stepIndex = $('.etapes .champ_actif').index();
		$(".etapes fieldset").each(function(index, element){
			if ( $(element).attr('data-step') == stepIndex ){
				$(element).find('input').click();
				$(element).find('input').focus();
			}
		});
	}
	/**
	 * Validation de l'étape si touche Entrée ou Tab
	 */
	this.verifyPressButton = function() {
		$('.test_kameleoon_formulaire fieldset input, body').keydown(function(event) {
			if (event.keyCode == 13 || event.keyCode == 9) {
				site.kameleoon.validateStep();
				return false;
			}
		});
	};
	/**
	 * Validation etape bouton OK
	 */
	this.validateStep = function(){
		var typeInput = $('.champ_actif').find('input').attr('type');
		var step = $('.ensemble_champ .etapes').attr('data-step');
		// Vérification commune pour tous les champs "text" qui sont remplis
		if ($.inArray(typeInput, ['text', 'email', 'password', 'hidden']) != -1 && $('.champ_actif').find('input').val().trim() == '') {
			site.kameleoon.goToNextFieldOrShowError(true, step, 'manquant');
			return (false);
		}
		// Vérification pour le champ email
		if (typeInput == 'email') {
			site.kameleoon.verifyEmail($('.champ_actif').find('input').val().trim(), step);
		}
		// Vérification du mot de passe
		else if (typeInput == 'password') {
			site.kameleoon.verifyPassword($('.champ_actif').find('input').val(), step);
		}
		// Pas de vérification particulière pour la civilité et le nom d'utilisateur
		else if ((typeInput == 'text' || typeInput == 'hidden') && $.inArray($('.champ_actif').find('input').attr('id'), ['_name', '_civilite']) != -1) {
			site.kameleoon.goToNextFieldOrShowError(false, step);
		}
		// Vérification pour le code postal
		else if (typeInput == 'text' && $('.champ_actif').find('input').attr('id') == '_zip') {
			site.kameleoon.verifyZipCode($('.champ_actif').find('input').val(), step);
		}
		// on affiche les optin
		if( step == 5 && $('._person.selected').length > 0 ) {
			var heightBox = $('.ensemble_champ').outerHeight(true);
			$('._inscriptionKameleoon > div').css({
				'top' : '-' + heightBox + 'px'
			});
			$('#_optin').addClass('optin_visible');
			var heightOptin = $('#_optin').outerHeight();
			if ($(window).width() <= 500 && $('.optin_visible').length > 0) {
				$('._inscriptionKameleoon').css({
					'height' : heightOptin + 'px'
				});
			}
			$('._inscriptionKameleoon > div').addClass('validation_champ');
		}
	};
	/**
	 * Vérification de l'email, plusieurs possibilité :
	 * - Email déjà présent => On désactive les autres champs pour être en mode connexion
	 * - Email Non présent => On conserve les autres champs
	 * - Email non valide => message d'erreur
	 * - Email blacklisté => message d'erreur
	 *
	 * @param  string email 	L'email remplit par l'utilisateur
	 * @param  string email 	Le step
	 * @return boolean 		True si l'email est valide, false sinon
	 */
	this.verifyEmail = function (email, step) {
		var hasError = false;
		var errorToShow = false;
		// Vérification du format du mail
		var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
		if (!regEmail.test(email)) {
			errorToShow = 'invalidate';
			hasError = true;
		}
		if (!hasError) {
			// Vérification AJAX de l'email
			$.getJSON("/identification/checkEmail/"+ email, function(data) {
				if (!data.success) {
					// Compte existant
					if (data.code == 'accountExists') {
						site.kameleoon.hideInscriptionField();
						$('._oubliMdp').show();
					}
					// Mauvaise syntaxe
					else if (data.code == 'bad syntax' || data.code == 'no mx list') {
						errorToShow = 'invalidate';
						hasError = true;
					}
					// Compte blacklisté
					else if (data.code == 'accountBlacklisted') {
						errorToShow = 'blacklisted';
						hasError = true;
					}
				} else{
					// On affiche tous les champs pour l'inscription
					$('._oubliMdp').hide();
					site.kameleoon.showInscriptionField();
				}
				site.kameleoon.goToNextFieldOrShowError(hasError, step, errorToShow);
			});
		} else {
			site.kameleoon.goToNextFieldOrShowError(hasError, step, errorToShow);
		}
	}
	/**
	 * Vérification du mot de passe
	 */
	this.verifyPassword = function (password, step) {
		var authType = $('._inscriptionKameleoon').data('authtype');
		// si inscription
		if (authType == 'register'){
			if (password.length == 0){
				site.kameleoon.goToNextFieldOrShowError(true, step, 'manquant');
			}
			// si mot de passe à au moins 8 caractères
			else if (password.length > 7 && !(/\s/g.test(password))) {
				// On est en mode inscription on passe à l'étape suivante
				site.kameleoon.goToNextFieldOrShowError(false, step);
			} else {
				site.kameleoon.goToNextFieldOrShowError(true, step, 'invalidate');
			}
		}
		else{
			if (password.length == 0){
				site.kameleoon.goToNextFieldOrShowError(true, step, 'manquant');
			}
			else if (!(/\s/g.test(password))) {
				// Le password est valide et on est en mode connexion, on logue donc l'utilisateur
				site.kameleoon.doLogin();
			} else {
				site.kameleoon.goToNextFieldOrShowError(true, step, 'erreur');
			}
		}
	}
	/**
	 * Vérification du code postal :
	 *  - Moins de 5 caractères ou contenant des espaces => erreur
	 *  - 5 caractère ou plus on check le pays
	 * @param  string zipCode
	 * @param  int step
	 */
	this.verifyZipCode = function (zipCode, step) {
		// Moins de 5 caractères ou contenant des espaces
		if (zipCode.length < 5 && !(/\s/g.test(zipCode))) {
			site.kameleoon.goToNextFieldOrShowError(true, step, 'manquant');
		}
		// Géoloc
		else if (zipCode.length >= 5) {
			$.ajax({
				url: '/annuaire/geoloc/0',
				datatype: 'json',
				beforeSend: function () {
					// Affichage loader
					$('#_loaderZip').show();
				},
				success: function (retour) {
					// Masquer loader
					$('#_loaderZip').hide();
					if (zipCode.length > 5 && retour.zip !== false) {
						site.kameleoon.goToNextFieldOrShowError(true, step, 'manquant');
					} else {
						if (zipCode.length == 5 && retour.zip !== false)
							$('#_pays').val('FR');
						site.kameleoon.goToNextFieldOrShowError(false, step);
					}
				},
				error: function () {
					// Masquer loader
					$('#_loaderZip').hide();
					site.kameleoon.goToNextFieldOrShowError(false, step);
				}
			});
		}

	};
	/**
	 * Aller à l'étape suivante ou afficher une erreur
	 * @param  {[type]} error     [description]
	 * @param  {[type]} step      [description]
	 * @param  {[type]} errorName [description]
	 * @return {[type]}           [description]
	 */
	this.goToNextFieldOrShowError = function (error, step, errorName) {
		var authType = $('._inscriptionKameleoon').data('authtype');
		var heightBox = $('.ensemble_champ').outerHeight(true);
		$('#_box_erreur ._step'+step).hide();
		$('#_box_erreur ._step'+step+' p').hide();
		// Si le champ actif est mal remplit, on affiche une erreur
		if (error){
			$('.champ_actif').addClass('erreur');
			$('#_box_erreur ._step'+step).show();
			$('#_box_erreur ._step'+step+ ' .' + errorName).show();
		}
		// sinon on passe à l'étape d'après
		else{
			// si erreur, on enleve
			if ($('.champ_actif').hasClass('erreur')) {
				$('.champ_actif').removeClass('erreur');
			}
			// on valide le champ
			$('.champ_actif').addClass('champ_valide');
			if( (authType == "connexion" && step == 1) || authType == "register" ){
				site.kameleoon.nextStep();
			}
			site.kameleoon.animateBarStep();
		}
	}
	/**
	 * Aller etape suivante
	 */
	this.nextStep = function() {
		var step = $('.test_kameleoon_formulaire .etapes').attr('data-step');
		var fieldset = $('.test_kameleoon_formulaire .etapes fieldset');
		// ajout class champ actif
		$('.etapes fieldset').removeClass('champ_actif');
		fieldset.eq(step).addClass('champ_actif');
		// focus etape suivante
		if (step == "4"){
			fieldset.eq(step).find('p').focus();
		} else{
			// supprimer attribut
			fieldset.eq(step).find('input').removeAttr('readonly');
			fieldset.eq(step).find('input').focus();

		}
		// on déplace le formulaire d'une étape
		var heightElement = $('.ensemble_champ fieldset').outerHeight(true);
		if ( $('._inscriptionKameleoon .validation_champ').length == 0 && step != 5 ) {
			$('.ensemble_champ .etapes').css({
				'top' : '-' + heightElement*step + 'px'
			});
		}
		var stepActive = $('.champ_actif').attr('data-step');
		$('.test_kameleoon_formulaire .etapes').attr('data-step', stepActive);
		// si etape active est la premiere, ne pas afficher la fleche d'étape précédente
		if (stepActive == "1"){
			$('._stepBefore').hide();
		} else{
			$('._stepBefore').show();
		}
	};
	/**
	 * Animation Barre indication étape
	 */
	this.animateBarStep = function(){
		var nbValide = $('.champ_valide').length;
		var nbElement = $('.test_kameleoon_formulaire .etapes fieldset:visible').length;
		// si optin visible bar step à 100%
		if ($('.optin_visible').length > 0){
			$('.kameleoon_indication_etape span').css({
				'width' : '100%'
			});
		} else{
			$('.kameleoon_indication_etape span').css({
				'width' : (100/nbElement)*nbValide + '%'
			});
		}
	};
	/**
	 * Choix homme/femme
	 */
	this.switchInput = function(elementClicked){
		if ($("#_zip").parents('fieldset').hasClass('champ_valide') && $(elementClicked).parents('fieldset').hasClass('champ_actif')){
			var elementSelect = $(elementClicked).html();
			var elementIndex = $(elementClicked).index();
			var nbElement = $('.test_kameleoon_formulaire ._person').length;
			$('.test_kameleoon_formulaire .choix_sexe input').val(elementSelect);
			$(elementClicked).parent().find('.selected').removeClass('selected');
			$(elementClicked).addClass('selected');
			site.kameleoon.validateStep();
			//$('.bt_valider ._buttonValidate').click();
		}
	};
	/**
	 * Permet de masquer les champs uniquement utilisé pour l'inscription afin de garder ceux de la connexion
	 */
	this.hideInscriptionField = function() {
		// On masque les champs
		$('._inscriptionField').hide();
		// On ajoute un attribut sur le formulaire pour indiquer le mode connexion
		$('._inscriptionKameleoon').attr('data-authtype', 'connexion');
		this.trackingIdentification('login', 'particulier', 'library');
	};
	/**
	 * Permet d'afficher les champs utilisés pour l'inscription
	 */
	this.showInscriptionField = function() {
		// On affiche les champs
		$('._inscriptionField').show();
		// On ajoute un attribut sur le formulaire pour indiquer le mode inscription
		$('._inscriptionKameleoon').attr('data-authtype', 'register');
		this.trackingIdentification('inscription', 'particulier', 'library');
	};
	/**
	 * Tracking inscription ou connexion
	 */
	this.trackingIdentification = function(authType, userType, origin) {
		var xtAuthType = (authType == 'login' ? 'connexion' : 'inscription');
		if (authType == 'login') {
			xt_med('F', xtn2, 'identification::' + xtAuthType + '::' + xtAuthType + '::' + xtAuthType + '&f1=' + origin);
		} else {
			xt_med('F', xtn2, 'identification::' + xtAuthType + '::' + xtAuthType + '_' + userType + '::' + xtAuthType + '_' + userType + '&f1=' + origin);
		}
	};
	/**
	 * Envoi du formulaire de connexion en AJAX
	 */
	this.doLogin = function () {
		var step = $('.ensemble_champ .etapes').attr('data-step');
		var formData = {
			'origin'  : 	'library',
			'email'	  :	$('#_email').val().trim(),
			'password':	$('#_password').val()
		};
		$.ajax({
			url: '/identification/login/json',
			type: 'POST',
			data: formData,
			datatype : 'json',
			beforeSend : function () {
				// Affichage du loader
				$('#_loaderConnexion').show();
			},
			success : function (retour) {
				if (!retour){
					$('#_loaderConnexion').hide();
					site.kameleoon.goToNextFieldOrShowError(true, step, 'erreur');
					return;
				}
				site.kameleoon.goToNextFieldOrShowError(false, step);
				// On coche de manière auto les téléchargement complémentaire sur non
				$("._telechargement_form").find('input[type="radio"][value="1"]').removeAttr('checked');
				$("._telechargement_form").find('input[type="radio"][value="0"]').attr('checked', 'checked');
				// On soumet le formulaire de téléchargement
				site.eBibliotheque.downloadForm._verifyForm();
			},
			error : function () {
				// Masquer le loader
				$('#_loaderConnexion').hide();
			}
		});
	};
	/**
	 * Retourner aux étapes du formulaire, quand on est sur les optin et cgu
	 */
	this.returnStep = function() {
		var elementVisible = this.calculateHeight();
		$('#_optin').removeClass('optin_visible');
		if($(window).width() <= 500){
			$('._inscriptionKameleoon').css({
				'height' : elementVisible + 'px'
			});
		}
		$('._inscriptionKameleoon > div').css('top', '0');
		var nbFieldset = $('.etapes fieldset').length;
		var indexFieldset = nbFieldset - 1;
		$('.etapes fieldset').eq(indexFieldset).addClass('champ_actif');
		$('.etapes fieldset').eq(indexFieldset).find('p').click();
		$('._inscriptionKameleoon > div').removeClass('validation_champ');
	};
	/**
	 * [selectOptinYesNo description]
	 * @param       string        choisir entre oui ou non
	 * @return      booleen       si le choix a été fait ou pas
	 */
	this.selectOptinYesNo = function(elementClicked) {
		selectYesOrNo = false;
		$(elementClicked).parent().find('.selected').removeClass('selected');
		$(elementClicked).addClass('selected');
		$(elementClicked).parents('fieldset').addClass('champ_valide');
		if ( $('#_quest-partnersInfoKameleoon .selected').length > 0 ){
			selectYesOrNo = true;
			$('#_quest-partnersInfoKameleoon .erreur').hide();
		}
		return (selectYesOrNo);

	};
	/**
	 * Vérification des optin et cgu
	 */
	this.verifyOptin = function(){
		var selectYesOrNo = this.selectOptinYesNo();
		// si cgu ne sont pas cochés, alors on affiche les erreurs.
		if ($("#_quest-cguKameleoon input[type='checkbox']:checked").length == 0){
			// on affiche les erreurs
			$('#_quest-cguKameleoon .erreur').show();
			$('#_quest-cguKameleoon').removeClass('champ_valide');
		}
		else{
			$('#_quest-cguKameleoon').addClass('champ_valide');
		}
		// vérification si pas d'erreur
		if (selectYesOrNo && $("#_quest-cguKameleoon input[type='checkbox']:checked").length > 0){
			// on cache les erreurs
			$('#_quest-partnersInfoKameleoon .erreur').hide();
			$('#_quest-cguKameleoon .erreur').hide();
			// on vérifie tous les champs
			if (site.kameleoon.verifyForm()) {
				// on lance l'inscription
				this.registerPart();
			}
		}
		// si Oui ou Non ne sont pas sélectionnés, on affiche les erreurs.
		if (!selectYesOrNo){
			$('#_quest-partnersInfoKameleoon .erreur').show();
		}
		var heightOptin = $('#_optin').outerHeight();
		$('._inscriptionKameleoon').css({
			'height' : heightOptin + 'px'
		});
	}
	/**
	 * Verification que tous les champs sont renseignés
	 * @return      booleen        Return si le formulaire est valide
	 */
	this.verifyForm = function(){
		var formValid = false;
		nbFieldset = $('._inscriptionKameleoon fieldset').length;
		nbChampValide = $('._inscriptionKameleoon .champ_valide').length;
		if (nbFieldset == nbChampValide){
			formValid = true;
		}
		return(formValid);

	}
	/**
	 * Envoi en AJAX du formulaire d'inscription
	 */
	this.registerPart = function(){
		var authFormId = $('#_leadForm').attr('data-ugc-id');
		var email = $('#_email').val();
		var password = $('#_password').val();
		var name = $('#_name').val();
		var zip = $('#_zip').val();
		var country = $('#_pays').val();
		var civilite = $('#_civilite').val() == 'homme' ? 'man' : 'woman' ;
		var optin = $('#_quest-partnersInfoKameleoon .selected input').val();
		var cgu = $("#_quest-cguKameleoon input[type='checkbox']:checked").length > 0 ? '1' : '0';
		var formData = {
			'ugcId'			: authFormId,
			'email'			: email,
			'password'		: password,
			'name'			: name,
			'zip'			: zip,
			'country'		: country,
			'title'			: civilite,
			'lead'			: '',
			'partnersInfo'		: optin,
			'cgu'			: cgu,
			'type'			: 'private',
			'view'			: 'json',
			'from'			: 'library',
			'leadChannel'		: ''
		};
		var url = "/identification/enregistrer";
		$.ajax({
			url: url,
			type: 'POST',
			data: formData,
			beforeSend : function () {
				// Affichage du loader
				$('#_loaderConnexion').show();
			},
			success : function (retour) {
				// Masquer le loader
				$('#_loaderConnexion').hide();
				// On coche de manière auto les téléchargement complémentaire sur non
				$("._telechargement_form").find('input[type="radio"][value="1"]').removeAttr('checked');
				$("._telechargement_form").find('input[type="radio"][value="0"]').attr('checked', 'checked');
				// On soumet le formulaire de téléchargement
				site.eBibliotheque.downloadForm._verifyForm();
			},
			error : function () {
				// Masquer le loader
				$('#_loaderConnexion').hide();
			}
		});
	};
};