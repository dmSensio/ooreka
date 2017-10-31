/**
 * Objet de gestion des pages de l'annuaire.
 *
 * @author	Julien Hamrouni <julien.hamrouni@finemedia.fr>
 * @copyright	© 2012, Fine Media
 */
site.annuaire = new function() {
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action, domain) {
		if (action == 'pro' || (controller == 'pro' && action == 'voir')) {
			site.common.initFancyBox(true);
		} else if (domain == 'annuaire.ooreka.fr') {
			site.callGeoloc(url, controller, action, null, 'activitiesHP');
		}
		/** TODO A CHANGER LORS DE LA MISE EN PROD **/
		// var precedentOoreka = document.referrer.indexOf('ooreka') > -1;
		var precedentOoreka = document.referrer.indexOf('finemedia') > -1;
		var precedentPasAnnuaire = document.referrer.indexOf('annuaire') === -1;
		if (controller == 'pro' && precedentOoreka && precedentPasAnnuaire) {
			this.toggleMap($('.map_show'));
		}
		if (controller == 'pro'){
			this.actionScroll();
			var imgCarousel = setInterval(function() {
				if ($('#_carousel img').length > 0) {
					site.annuaire.calculImgCarousel();
					clearInterval(imgCarousel);
				}
			}, 200);
			var avisCarousel = setInterval(function() {
				if ($('#_listingAvis .un_avis').length > 0) {
					// site.annuaire.calculAvisCarousel();
					site.annuaire.calculHeightAvis();
					clearInterval(avisCarousel);
				}
			}, 200);
		}
	};
	/**
	 * Vérifie le formulaire de recherche PJ.
	 * @param	bool	checkWhatWhoField	Indique s'il faut tester la valeur du champ "Quoi ? Qui ?" ou non (tester quand le champ est de type 'text').
	 * @return	bool	Retourne true si les champs sont valides.
	 */
	this.checkPJForm = function(checkWhatWhoField) {
		var isValid = true;
		if (checkWhatWhoField)
			isValid = this._validTextFieldById('quoiqui', 'Quoi ?');
		isValid = isValid && this._validTextFieldById('ou', 'Où ?');
		return (isValid);
	};
	/** Ouvre ou ferme la liste de sélection d'activités dans la recherche PJ. */
	this.toggleActivitiesBox = function() {
		$('#conteneur_check').slideToggle('fast');
	};
	/**
	 * Réajuste l'iframe en hauteur.
	 * @param	string	iframeId	Identifiant de l'iframe à redimensionner.
	 * @param	string	height		Nouvelle taille en hauteur de l'iframe.
	 */
	this.resizeIframe = function(iframeId, height) {
		var iframe = $('#' + iframeId);
		if (!iframe)
			return;
		if (iframe)
			iframe.height(height + 35);
	};
	/**
	 * Renseigner le code postal lors de l'inscription
	 * @param 	string 	zip		Champ zipCode du form
	 */
	this.informZipCode = function(zip){
		if ($(zip).val().length >= 2) {
			// $('#_citySetPart').val($(zip).val());
			$.ajax({
				type: 'POST',
				url: '/annuaire/getCitiesByZip',
				data: {address: $(zip).val()},
				success: function(infos) {
					$(zip).prev('div#_list_cities').find('span').remove();
					if(infos && $(zip).val() != '') {
						obj = JSON.parse(infos);
						// var citySetPart = $('#_citySetPart').val();
						for (var i = 0; i < obj.length; i++) {
							var cityBold = obj[i].tag.replace($(zip).val(), '<b>'+$(zip).val()+'</b>');
							var zipBold = obj[i].zip.replace($(zip).val(), '<b>'+$(zip).val()+'</b>');
							$(zip).prev('div#_list_cities').append('<span class="cityList" onclick="return site.annuaire.selectCity(this);" data-value="'+obj[i].tag+'" data-zip="'+obj[i].zip+'">'+zipBold+' ('+cityBold+')</span>');
						}
						$(zip).prev('div#_list_cities').show();
					} else {
						$(zip).prev('div#_list_cities').hide();
					}
				}
			});
		} else {
			$('#_list_cities').hide();
		}
	};
	/**
	 * Selection de la ville depuis l'autocomplete
	 * @param  {[type]} elementClicked [description]
	 * @return {[type]}                [description]
	 */
	this.selectCity = function(elementClicked){
		var city = $(elementClicked).attr('data-value');
		var zip = $(elementClicked).attr('data-zip');
		$(elementClicked).closest('#_formSearchAnnuaire').find('#_where').val(city + ' ' + zip);
		$(elementClicked).closest('#_formSearchAnnuaire').find('#_where').focus();
		$(elementClicked).parent().hide();
		return false;
	};
	/**
	 * Affiche les numéros de téléphone, fax, etc...
	 * Exécute éventuellement une requête vers l'url "fantomasStatUrl".
	 * @param	HTMLElement	that	Elément courant à cacher (type 'object') ou chaîne de caractères indiquant quoi cacher (type 'string').
	 * @param	int		classe	Classe des éléments à afficher.
	 */
	this.showContactInfo = function(encodedId, that, classe, boxPro, idPj) {
		if (boxPro) {
			$(that).parent().hide();
			$(that).parent().next().show();
		} else {
			// distinction entre "this" de type 'object' et une chaîne de caractères (type 'string')
			var element = (typeof(that) != 'string' ? that : ('.' + that));
			$(element).hide();
			$('.' + classe).show();
			if (encodedId != null)
				this._setFantomasCookie(encodedId);
		}
		// Comptage du RSI des annonceurs
		if (idPj !== undefined) {
			$.post('/annuaire/annonceurRSI/' + idPj, function(data) {
			});
		}
	};
	/**
	 * Gère l'affichage des activités sur la HP de l'annuaire.
	 * @param  	string 	cityName 	Nom de la ville.
	 * @param  	int 	zipcode  	Code postal.
	 */
	this.displayActivitiesHP = function(cityName, zipcode) {
		if (cityName != undefined && zipcode != undefined) {
			$('#_activitiesHP ._activity').each(function() {
				var text = $(this).text();
				$(this).attr('href', '/resultats/liste?quoiqui=' + text + '&location=' + cityName + '-' + zipcode);
			});
			cityNameUrlize = cityName.toLowerCase().replace(' ', '-');
			$('#_activitiesHP #_more_activities').attr('href', '/ville/voir/' + zipcode + '/' + cityNameUrlize);
			$('#_activitiesHP').slideDown(300);
		}
	};
	/**
	 * Affiche le numéro de téléphone du pro
	 */
	this.showPhoneNumber = function(encodedId) {
		if ($('#_phoneNumber-' + encodedId).is(':visible'))
			return;
		$('#_phoneText-' + encodedId).hide();
		$('#_phoneNumber-' + encodedId).show();
		this._setFantomasCookie(encodedId);
	};
	/* *** Méthodes privées *** */
	/**
	 * Teste le champ correspondant à l'identifiant passé en paramètre.
	 * @param	string	fieldId		Identifiant du champ.
	 * @param	string	defaultText	Texte par défaut du champ.
	 * @return	bool	Retourne true si le champ est valide, false sinon.
	 */
	this._validTextFieldById = function(fieldId, defaultText) {
		var textField = $('#' + fieldId).val();
                textField = textField.trim();
                if (textField == "" || textField == defaultText)
                        return (false);
                return (true);
	};
	/**
	 * Toggle la carte mappy et le texte "Afficher"/"Masquer"
	 */
	this.toggleMap = function(element){
		var content = $(element).find('span');
		var textChange = $(element).attr('data-change');
		var mapId = 'mymap';
		if (content.hasClass('icon-croix')) {
			content.text(textChange);
			content.switchClass('icon-croix','icon-position', 0);
			$('#_mapContent').removeClass('mapContent_open');
			$('#_mapContent').animate({
				height: "0px"
			}, 500, function(){
				$('#_mapContent').height(0);
			});
		} else {
			$('#_mapContent').addClass('mapContent_open');
			$('#_mapContent').height(400);
			site.map.initMap(mapId);
			content.text('Masquer la carte');
			content.switchClass('icon-position','icon-croix', 0);
		}
	}
	/**
	 * Set un cookie lorsqu'un utilisateur affiche le numéro d'un pro.
	 * @param	string	idPro	Identifiant du pro.
	 */
	this._setFantomasCookie = function(idPro) {
		$.cookie('phoneDisplayedPro_' + idPro, 1, {domain:'annuaire.ooreka.fr', path:'/', expires: 1});
	}
	/**
	 * Afficher le numero
	 */
	this.showNumber = function(elementClicked, showAllNumberPage){
		if (showAllNumberPage){
			$('._buttonNumber').each(function(index, element){
				var height = $(element).outerHeight();
				$(element).addClass('numero_visible');
				$(element).find('._show').css({
					'line-height' : height + 'px'
				});
			});
			$('._show').show();
			$('._hide').hide();
		} else{
			var height = $(elementClicked).parents('._buttonNumber').outerHeight();
			$(elementClicked).parents('._buttonNumber').find('._show').css({
				'line-height' : height + 'px'
			});
			$(elementClicked).parents('._buttonNumber').find('._hide').hide();
			$(elementClicked).parents('._buttonNumber').find('._show').show();
		}
		if ($(window).width() <= 500){
			$('#_headerFd').addClass('popin_call');
			$('#_headerFd ._close').show();
			var adress = $('#_headerFd ._adress');
			$('#_headerFd .h1').after(adress);
			$('#_headerFd ._activity').hide();
			$('#_headerFd .w1000 > .icon-mobile').show();
		}
	};
	this.hidePopinCall = function(elementClicked){
		$('#_headerFd').removeClass('popin_call');
		$('#_headerFd ._close').hide();
		var adress = $('#_headerFd ._adress');
		$('#_headerFd ._buttonNumber').after(adress);
		$('#_headerFd ._activity').show();
		$('#_headerFd .w1000 > .icon-mobile').hide();
	};
	/**
	 * Definit quand les boutons d'actions passent en position fixed
	 */
	this.actionScroll = function(){
		$(document).on('scroll', function(){
			var positionSticky = $('#_headerFd').offset().top + $('#_headerFd').outerHeight();
			var positionWindow = $(window).scrollTop();
			var heightWindow = $(window).height();
			if ($(window).width() <= 500){
				var division = 1;
			} else{
				var division = 3;
			}
			// Si le bouton Sticky est au top de l'écran :
			// 	- ajout class pour le rendre fixe
			// Sinon :
			// 	- retirer class pour ne plus le rendre fixe
			if (positionWindow >= positionSticky){
				$('#_btSticky').addClass('fixed');
			} else{
				$('#_btSticky').removeClass('fixed');
			}
			// Si le scroll > au tiers de la hauteur de la fenetre :
			// 	- affiche le bouton top
			if (positionWindow > heightWindow/division){
				$('#_btTop').addClass('visible');
			} else{
				$('#_btTop').removeClass('visible');
			}
		});
	};
	/**
	 * Aller en haut de la page
	 */
	this.goTo = function(goToElement){
		$('html, body').animate({
			scrollTop: $(goToElement).offset().top - $('#_btSticky').height()*2
		}, 750);
	};
	/**
	 * Création navigation carousel
	 */
	this.calculImgCarousel = function(){
		// Pour chaque image, créer bullet point avec position image/carousel(parent)
		var positionLeft = parseInt($('#_carousel').css('left'));
		if ($('#_carousel img').length > 1){
			$('#_carousel img').each(function(index, element){
				var position = Math.round($(element).position().left);
				$('#_bullet').append(
					"<span onclick='site.annuaire.goImg(this)' data-position='" + position +"'></span>"
				)
			});
			// Au chargement, selectionner le premier bullet point par défaut
			if (positionLeft == 0){
				$('#_bullet span').eq(0).addClass('selected');
				$('#_precedent').hide();
			}
		} else{
			$('#_suivant').hide();
			$('#_precedent').hide();
		}
	}
	/**
	 * Se déplacer dans le carousel
	 */
	this.goImg = function(elementClicked){
		// changement positionnement de l'image
		var buttonNav = $('#_precedent').width();
		var position = $(elementClicked).data('position');
		if (position == 0 || $(window).width() < 500){
			$('#_carousel').css('left', '-' + position + 'px');
		} else{
			$('#_carousel').css('left', '-' + (position-buttonNav) + 'px');
		}
		// ajout de la class selected
		$(elementClicked).parent().find('.selected').removeClass('selected');
		$(elementClicked).addClass('selected');
		// gestion afficher/cacher bouton précédent et suivant
		this.gestionButtonNavSlider();
	};
	/**
	 * Navigation precedent/suivant du carousel
	 */
	this.slider = function(elementClicked, direction){
		// si bouton suivant
		if (direction == 1){
			$('#_bullet .selected').removeClass('selected').next().addClass('selected');
		} else{
			$('#_bullet .selected').removeClass('selected').prev().addClass('selected');
		}
		$('#_bullet .selected').click();
		// gestion afficher/cacher bouton précédent et suivant
		this.gestionButtonNavSlider();
	};
	/**
	 * Affichage ou non des boutons de navigation precedent/suivant
	 */
	this.gestionButtonNavSlider = function(){
		var bulletLength = $('#_bullet span').index();
		if ($('#_bullet span').eq(bulletLength).hasClass('selected')){
			$('#_suivant').hide();
		} else{
			$('#_suivant').show();
		}
		if ($('#_bullet span').eq(0).hasClass('selected')){
			$('#_precedent').hide();
		} else{
			$('#_precedent').show();
		}
	};
	/**
	 * Action lorsqu'un champ de formulaire est focus
	 */
	this.inputFocus = function(elementClicked){
		$(elementClicked).parent().addClass('actif');
	};
	/**
	 * Verification du mail
	 */
	this.verifyEmail = function(email){
		hasError = false;
		var value = $(email).val();
		var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
		if (regEmail.test(value)) {
			this.validateInput(email);
		} else{
			this.errorInput(email);
			hasError = true;
		}
		return(hasError);
	};
	/**
	 * Verification du téléphone
	 */
	this.verifyPhone = function(phone){
		hasError = false;
		var value = $(phone).val().replace(/\s+/g, '');
		if ( (value[0] == "+" && (value.slice(1).length == 12 || value.slice(1).length == 11) && !isNaN(value)) || (value[0] != "+" && value.length == 10) || (value == "") ) {
			this.validateInput(phone);
		} else{
			this.errorInput(phone);
			hasError = true;
		}
		return(hasError);
	};
	/**
	 * Verification des autres champs
	 */
	this.verifyContentForm = function(elementClicked){
		hasError = false;
		if ($(elementClicked).val() == 0){
			this.errorInput(elementClicked);
			hasError = true;
		} else {
			this.validateInput(elementClicked);
		}
		return(hasError);
	};
	/**
	 * Si après verification, il y a une erreur...
	 */
	this.errorInput = function(elementClicked){
		if ($(elementClicked).val() == ""){
			$(elementClicked).parent().removeClass('actif');
		}
		$(elementClicked).parent().removeClass('valide');
		$(elementClicked).parent().removeClass('icon-tick');
		$(elementClicked).parent().addClass('erreur');
		$(elementClicked).parent().addClass('icon-croix');
	};
	/**
	 * Si après vérification, c'est validé...
	 */
	this.validateInput = function(elementClicked){
		$(elementClicked).parent().removeClass('actif');
		$(elementClicked).parent().removeClass('erreur');
		$(elementClicked).parent().removeClass('icon-croix');
		if ($(elementClicked).parent().hasClass('_obligatoire') || $(elementClicked).val() != "" ){
			$(elementClicked).parent().addClass('valide');
			$(elementClicked).parent().addClass('icon-tick');
		}
	};
	/**
	 * Checker les optins
	 */
	this.checkOptin = function(elementClicked){
		$(elementClicked).toggleClass('valide');
		if($(elementClicked).hasClass('valide')){
			$(elementClicked).find('input').attr('value', "1")
		} else{
			$(elementClicked).find('input').attr('value', "0")
		}
	};
	/**
	 * Validation du formulaire
	 */
	this.validateForm = function(){
		var name = this.verifyContentForm($('#_name'));
		var email = this.verifyEmail($('#_email'));
		var emailPro = this.verifyEmail($('#_emailPro'));
		var phone = this.verifyPhone($('#_phone'));
		var object = this.verifyContentForm($('#_object'));
		var message = this.verifyContentForm($('#_message'));
		if(!name && !email && !phone && !object && !message) {
			var action = $('#_formContact').attr('action');
			var postData = {
				name: $('#_formContact').find('#_name').val(),
				email: $('#_formContact').find('#_email').val(),
				emailPro: $('#_formContact').find('#_emailPro').val(),
				phone: $('#_formContact').find('#_phone').val(),
				object: $('#_formContact').find('#_object').val(),
				message: $('#_formContact').find('#_message').val()
			};
			$.post(action, postData, function(data) {
				if (!data) {
					// todo
					$('#_infoMessage').show();
					$('#_infoMessage').addClass('popin_visible');
					setTimeout(function(){
						$('#_infoMessage').removeClass('popin_visible');
					}, 3000);
					$('._obligatoire input').val('');
					$('._obligatoire textarea').val('');
					$('._obligatoire').removeClass('valide');
					$('._obligatoire').removeClass('icon-tick');
				}
			});
		}
	};
	this.calculHeightAvis = function(){
		var nbAvis = $('#_listingAvis .un_avis').length;
		if ($(window).width() <= 500){
			var avisVisible = 1
		} else{
			var avisVisible = 3
		}
		if (nbAvis > avisVisible){
			$('#_voirPlusAvis').show();
			heightAvis0 = $('#_listingAvis .un_avis').eq(0).outerHeight(true);
			heightAvis1 = $('#_listingAvis .un_avis').eq(1).outerHeight(true);
			heightAvis2 = $('#_listingAvis .un_avis').eq(2).outerHeight(true);
			if (avisVisible == 1){
				$('#_listingAvis').css({
					'height' : heightAvis0 + 'px'
				});
			} else{
				$('#_listingAvis').css({
					'height' : (heightAvis0 + heightAvis1 + heightAvis2) + 'px'
				});
			}

		}
	};
	this.showMoreAvis = function(elementClicked){
		$(elementClicked).toggleClass('masquer');
		if ($(elementClicked).hasClass('masquer')){
			$(elementClicked).text('Masquer les avis');
			$('#_listingAvis').css('height', 'inherit');
		} else{
			$(elementClicked).text("Afficher + d'avis");
			site.annuaire.goTo('#_avis');
			setTimeout(function(){
				site.annuaire.calculHeightAvis();
			},750);
		}
	}
	/**
	 * Création Slider sur les avis
	 */
	// this.calculAvisCarousel = function(){
	// 	// Tous les deux avis, créer bullet point
	// 	if ($(window).width() > 800){
	// 		var length = Math.round($('#_carouselAvis .un_avis').length/2);
	// 	}
	// 	else{
	// 		var length = $('#_carouselAvis .un_avis').length;
	// 	}
	// 	var x;
	// 	for (x=0; x < length; x++) {
	// 		$('#_bulletAvis').append(
	// 			"<span onclick='site.annuaire.goAvis(this)'></span>"
	// 		)
	// 	}
	// 	// Au chargement, selectionner le premier bullet point par défaut
	// 	$('#_bulletAvis span').eq(0).addClass('selected');
	// };
	// /**
	//  * Navigation Slider sur les avis
	//  */
	// this.goAvis = function(elementClicked){
	// 	var widthContent = $('#_carouselAvis').outerWidth();
	// 	var index = $(elementClicked).index();
	// 	// changement positionnement de l'image
	// 	$('#_carouselAvis').css('left', '-' + (index*widthContent) + 'px');
	// 	// ajout de la class selected
	// 	$(elementClicked).parent().find('.selected').removeClass('selected');
	// 	$(elementClicked).addClass('selected');
	// };
	/**
	 * Fermer la popin sur la carte map
	 */
	this.closePopinMap = function(elementClicked){
		$(elementClicked).parent().fadeOut();
	};
	this.growMap = function(elementClicked){
		var text = "Agrandir la carte";
		var heightMap = $('._map').height();
		if ($(elementClicked).hasClass('icon')){
			$(elementClicked).html(text);
			$('._map').css({
				'height' : heightMap/2 + 'px'
			});
		} else{
			$('html, body').animate({
				scrollTop: $('._map').offset().top - $('#_btSticky').height()*2
			}, 750);
			$(elementClicked).html('');
			$('._map').css({
				'height' : heightMap*2 + 'px'
			});
		}
		$(elementClicked).toggleClass('icon icon-croix');
	}
};
