/**
 * Objet de gestion des pages de questions.
 *
 * @author	Julien Hamrouni <julien.hamrouni@finemedia.fr>
 * @copyright	© 2011, Fine Media
 */
site.question = new function() {
	/* URL de la page courante */
	this._url = null;
	/* Contrôleur courant */
	this._controller = null;
	/* Action courante */
	this._action = null;
	/* Question en cours d'ecriture */
	this._questionTitle = '';
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		this._url = url;
		this._controller = controller;
		this._action = action;
		// Mets à jour la date de dernière réponse dans la liste des qr.
		if (controller == 'qr' && action == 'liste') {
			site.question.lastAnswerDateFormat();
			setInterval(function() {
				site.question.lastAnswerDateFormat();
			}, 60000);
		}
		if ($('#QRTitle').length > 0 && $('#QRTitle').val().length > 0)
			site.common.checkCharCount('#QRTitle', 25, 80, 4, true, true);
		// Désactive la touche entrée pour le champ titre
		$('#QRTitle').keypress(function(e) {
			if (e.which == '13')
				e.preventDefault();
		});
		if ($('#QRText').length > 0)
			$('#QRText').val('');
		if ($(window).width() <= 500)
			$('#QRTitle').addClass('version_mobile');

		this.selectedStep();
		this.showAnchorComment();
	};
	/**
	 * Charge les catégories principales pour la sendQuestionBox.
	 * @param	int		cat1Id			Identifiant de la catégorie 1 principale du site.
	 * @param	int		cat2Id			Identifiant de catégorie 2 principale du site.
	 * @param	int		suffix			(Optionnel) Suffix de formulaire et éléments associés.
	 */
	this.loadMainCategory = function(cat1Id, cat2Id, suffix) {
		var chooseCategoriesVar = suffix ? "#choose-categories-" + suffix : "#choose-categories";
		// affichage des catégories
		$(chooseCategoriesVar).show();
		var sendQuestionBoxCategories1ModelVar = suffix ? "#sendQuestionBoxCategories1Model-" + suffix : "#sendQuestionBoxCategories1Model";
		if ($(sendQuestionBoxCategories1ModelVar + ' option').length <= 1) {
			// prise des catégories 1
			$.getJSON("/categories/list", function(data) {
				var selectStr = "<option value=''>Choisissez...</option>";
				$.each(data, function(i, item) {
					if (item.name.length > 0) {
						if (item.id == cat1Id)
							selectStr += '<option value="' + item.id + '" selected="selected">' + item.name + '</option>';
						else
							selectStr += '<option value="' + item.id + '">' + item.name + '</option>';
					}
				});
				$(sendQuestionBoxCategories1ModelVar).html(selectStr); // select "modèle"
				$(sendQuestionBoxCategories1ModelVar).html(selectStr); // select cat1 de la première ligne
			});
			// prise des catégories 2 de la cat1 principale du site
			$.getJSON("/categories/list/" + cat1Id, function(data2) {
				var selectStr2 = "";
				$.each(data2, function(i, item) {
					if (item.name.length > 0) {
						if (item.id == cat2Id)
							selectStr2 += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
						else
							selectStr2 += "<option value='" + item.id + "'>" + item.name + "</option>";
					}
				});
				var selectStr2 = "<select name='categories2' onchange='site.question.categories.loadCategories3(\"" + cat1Id + "\", this, " + suffix + ");'>" +
									"<option>Choisissez</option>" +
									selectStr2 +
								 "</select>";
				var sendQuestionBoxCategories2Var = suffix ? "#sendQuestionBoxCategories2-" + suffix : "#sendQuestionBoxCategories2";
				$(sendQuestionBoxCategories2Var).html(selectStr2);
			});
			// prise des catégories 3 de la cat1 principale du site
			$.getJSON("/categories/list/" + cat1Id + "/" + cat2Id, function(data3) {
				var selectStr3 = "";
				$.each(data3, function(i, item) {
					if (item.name.length > 0)
						selectStr3 += "<option value='" + item.id + "'>" + item.name + "</option>";
				});
				selectStr3 = "<select name='categories3' onchange='site.question.categories.processCategory3(this, " + suffix + ");'>" +
								"<option>Choisissez</option>" +
								selectStr3 +
							  "</select>";
				var sendQuestionBoxCategories3Var = suffix ? "#sendQuestionBoxCategories3-" + suffix : "#sendQuestionBoxCategories3";
				$(sendQuestionBoxCategories3Var).html(selectStr3);
			});
		}
	};
	/**
	 * Vide le champ titre s'il a la valeur initiale.
	 * @param	int	suffix	Suffix du formulaire manipulé.
	 */
	this.emptyTitleField = function(suffix) {
		// initialisation du champ s'il contient le texte par défaut
		var qrTitleVar = suffix ? "#QRTitle-" + suffix : "#QRTitle";
		var qrValue = $(qrTitleVar).val();
		if (qrValue == 'Titre de votre question (60 caractères max.)' || qrValue == 'Titre de votre question' || qrValue == 'Titre de votre avis (60 caractères max.)')
			$(qrTitleVar).val('');
		// on cache tous les messages d'erreur
		var qrErrorCatVar = suffix ? "#QR-error-categories-" + suffix : "#QR-error-categories";
		$(qrErrorCatVar).hide();
		var qrErrorTitleVar = suffix ? "#QR-error-title-" + suffix : "#QR-error-title";
		$(qrErrorTitleVar).hide();
		var qrErrorContentVar = suffix ? "#QR-error-content-" + suffix : "#QR-error-content";
		$(qrErrorContentVar).hide();
	};
	/**
	 * Assigne une expertise à une question
	 * @param 	HTMLElement	element 	Objet html de l'élément courant.
	 * @param	int		id		Identifiant de l'expertise.
	 * @param 	int 		domainId 	Identifiant du domaine
	 */
	this.assignExpertise = function(element, id, domainId) {
		var li_expertise = '';
		var li_expertise_other = '';
		var expertiseChosen = null;
		if( typeof(domainId) == 'undefined' ) {
			li_expertise_other = '#_li_expertise_other';
			li_expertise = '#_li_expertise_' + id;
		}
		else {
			li_expertise_other = '#_li_domain_' + domainId + '_expertise_other';
			li_expertise = ' #_li_domain_' + domainId + '_expertise_' + id;
		}
		var expertisesIds = $('#_selectedExpertises').val();
		if (id != 'other') {
			expertiseChosen = $(li_expertise).find('span').attr('class');
			expertiseChosen = $(li_expertise).hasClass('selection') ? expertiseChosen.replace('illu_', 'unselected_') : expertiseChosen.replace('illu_', 'selected_');
			// Décoche le bouton 'Ma question concerne un autre sujet' lorsque une autre expertise est coché.
			if ($(li_expertise_other).hasClass('selection')) {
				// Supprime 'other' dans le champ hidden
				$('#_selectedExpertises').val('');
				$(li_expertise_other).removeClass('selection');
				expertisesIds = '';
				if ($("._conseil_categorie").is(":visible")){
					$("._conseil_categorie").slideUp();
				}
			}
			// cas où le choix de l'utilisateur est une expertise existante.
			if (expertisesIds == '') {
				$('#_selectedExpertises').val(id);
				$(li_expertise).addClass('selection');
			} else {
				expertisesIds = expertisesIds.split(',');
				if (!$(element).hasClass('selection')) {
					expertisesIds.push(id);
					$(li_expertise).addClass('selection');
				}
				else {
					for (var i = 0; i < expertisesIds.length; i++) {
						if (expertisesIds[i] == id)
							expertisesIds.splice(i, 1);
					}
					$(li_expertise).removeClass('selection');
				}
				$('#_selectedExpertises').val(expertisesIds.join(','));
			}
		} else {
			// cas où le choix de l'utilisateur est 'Aucune catégorie ne correspond à ma question'
			if ($(element).hasClass('selection')) {
				$('#_selectedExpertises').val('');
				$(li_expertise).removeClass('selection');
				expertiseChosen = 'unselect_other';
			} else {
				$('#_selectedExpertises').val('other');
				$(li_expertise).addClass('selection');
				expertiseChosen = 'select_other';
			}
			if ($("._conseil_categorie").is(":hidden")){
				$("._conseil_categorie").slideDown();
				$("._conseil_categorie").parents('._expertise').find('._elements_expertise').addClass('aucune_cat_coche');
				$("._conseil_categorie").parents('._expertise').find("#QR-error-expertises").slideUp();
			} else{
				$("._conseil_categorie").slideUp();
				$("._conseil_categorie").parents('._expertise').find('._elements_expertise').removeClass('aucune_cat_coche');
			}
			$('._elements_expertise').removeClass('selection');
		}
		site.tracking.doTRackingProcessQR('expertise', expertiseChosen);
	};
	/**
	 * Callback du getRelatedContent
	 */
	this.endOfrelatedContent = function () {
		site.question.calculateHeightBoxSuggestion();
		site.question.modifyMoreResultUrl();
		site.question.linkTarget();
		site.tracking.bindRelatedContentQR('#_relatedContents');
	};
	this.modifyMoreResultUrl = function () {
		var url = '/recherche?q=' + encodeURIComponent($("#QRTitle").val());
		$('._plusResultat').attr('href', url);
	};
	/**
	 * Initialisation du formulaire "poser une question", préalable à l'écriture d'une question.
	 * récupération de question identifiques, initialisation formulaire authentification.
	 * @param	string	controller		Contrôleur MVC courant.
	 * @param	string	titleSelectorId		Selecteur de l'élément dans le dom.
	 */
	this.initQrForm = function(controller, titleSelectorId) {
		// initialiser le champ du titre de la question
		if ($(titleSelectorId).val().length > 25 && $(titleSelectorId).val() != this._questionTitle) {
			// rechercher et proposer des contenus avec un titre de question similaire
			site.ugc.getRelatedContents(controller, $(titleSelectorId).val().trim(), '', site.question.endOfrelatedContent);
			this._questionTitle = $(titleSelectorId).val();
		}
		site.common.checkCharCount(titleSelectorId, 25, 80, 4, true, true);
	};
	/**
	 * Valide le formulaire "poser une question".
	 * @param	int	suffix		 	(optionnel) suffix du formulaire associé.
	 */
	this.validateQrForm = function(suffix) {
		// Initialisation.
		var qrTitleVar = "#QRTitle";
		var qrTextVar = "#QRText";
		var existTitre = false;
		if ($(qrTitleVar).length > 0)
			existTitre = true;
		var valueTitre = $(qrTitleVar).val();
		var valueText = $(qrTextVar).val();
		var error = false;
		// désaffichage des erreurs.
		$('#visibleRegistration:hidden').show('slow');
		var qrErrorExpVar = "#QR-error-expertises";
		$(qrErrorExpVar).hide();
		var qrErrorTitleVar = "#QR-error-title";
		$(qrErrorTitleVar).hide();
		var qrErrorContentVar = "#QR-error-content";
		$(qrErrorContentVar).hide();
		// Vérification du titre
		if (site.common.checkCharCount('#QRTitle', 25, 80, 4, true, true)) {
			error = true;
			window.location.href = '#QRTitle';
		}
		// vérification sur le détail
		if (valueText.length > 0 && site.common.checkCharCount('#QRText', 70, 2000, 0, false, true)) {
			if (!error)
				window.location.href = '#QRText';
			error = true;
		}
		var selectedExpertiseVar = "#_selectedExpertises";
		// on vérifie qu'au moins une expertise a été sélectionnée.
		if ($(selectedExpertiseVar).length > 0) {
			if ($(selectedExpertiseVar).val().length <= 0) {
				error = true;
				$(qrErrorExpVar).show();
				$("._elements_expertise").addClass('aucun_selectionne');
			}
		}
		// Retour.
		if (error)
			return false;
		var sendQuestionForm = "#sendQuestionForm";
		site.tracking.doTRackingProcessQR(2);
		if (this._controller == "tableauDeBord")
			$(sendQuestionForm).submit();

		if (site.auth.isAuthenticated()) {
			this.submitQrForm(suffix);
		} else {
			$('#_authForm-qr-form').show();
			site.auth.showAuthForm('register');
		}
		if ($('#_authForm-qr-form').is(':visible')){
			$('#sendQuestionForm-qr-form').hide();
		}
	};
	this.submitQrForm = function (suffix) {
		var qrDomId = '#QRTitle';
		sendQuestionForm = suffix ? "#sendQuestionForm-" + suffix : "#sendQuestionForm";
		var elm = $(qrDomId)[0];
		// Tracking
		var trackingZone = $(qrDomId).attr('data-tracking-zone');
		xt_med('C', xtn2, trackingZone + '::QRPosee', 'A');
		// soumettre directement le formulaire
		$(sendQuestionForm).submit();
	}
	this.verifyError = function(elementClicked){
		$(elementClicked).parents('._expertise').find("._elements_expertise").each(function (index,element){
			$(element).removeClass('aucune_cat_coche');
			$(element).removeClass('aucun_selectionne');
			$(element).parents('._expertise').find("#QR-error-expertises").slideUp();
		});
	}
	/**
	 * Applique un filtre sur la liste des questions
	 * @param  	string 	controller 	Nom du controller
	 * @param  	string 	filterName	Nom du filtre
	 */
	this.changeFilter = function(controller, filterName) {
		if (filterName == 'questionsActives')
			window.location = '/' + controller + '/liste';
		else if (filterName == 'non-resolues') {
			xt_med('C', xtn2, 'Questions-avis::listes::liste_questions_non_resolues', 'A');
			window.location = '/' + controller + '/liste/non-resolues';
		}
	};
	/** Affiche ou cache le bloc "autres sujets" dans la page qr/liste. */
	this.toggleMoreSubject = function() {
		if ($("#moreSubjects-data:hidden").length) {
			$("#moreSubjects-data").show('slow');
			$("#moreSubjects-button").hide();
		} else {
			$("#moreSubjects-data").hide('slow');
			$("#moreSubjects-button").show();
		}
	};
	/** Transforme un timestamp en minutes ou heures ou jours ou dd/mm/yyyy par rapport à la date/heure courant  */
	this.lastAnswerDateFormat = function() {
		var now = Math.floor(new Date().getTime() / 1000);
		$('._lastAnswerDate').each(function() {
			var timestamp = $(this).find('._lastAnswerRawDate').val();
			if (timestamp == 0 || timestamp == '')
				return;
			var id = $(this).attr('id');
			var date = new Date(timestamp * 1000);
			var dateDiff = Math.abs(now - timestamp);
			var tmp = 0;
			// Calcule des secondes
			tmp = dateDiff;
			var seconds = dateDiff % 60;
			// Calcule des minutes
			tmp = Math.floor((tmp - seconds) / 60);
			var minutes = tmp % 60;
			// Calcule des heures
			tmp = Math.floor((tmp - minutes) / 60);
			var hours = tmp % 24;
			// Calcule des jours
			tmp = Math.floor((tmp - hours) / 24);
			var days = tmp;
			if (days >= 15) {
				var day = '' + date.getDate();
				if (day.length == 1)
					day = '0' + day;
				var month = '' + (parseInt(date.getMonth()) + 1);
				if (month.length == 1)
					month = '0' + month;
				$('#' + id + ' ._lastAnswerDateText').text(day + '/' + month + '/' + date.getFullYear());
			} else if (days >= 1)
				$('#' + id + ' ._lastAnswerDateText').text('Il y a ' + days + ' j');
			else if (hours >= 1)
				$('#' + id + ' ._lastAnswerDateText').text('Il y a ' + hours + ' h');
			else {
				minutes = (minutes == 0) ? 1 : minutes;
				$('#' + id + ' ._lastAnswerDateText').text('Il y a ' + minutes + ' min');
			}
		});
	};
	/**
	 * Vérifie le contenu de la question et passe à l'étape suivante
	 */
	this.checkQuestion = function() {
		var title = $('#QRTitle').val();
		var text = $('#QRText').val();
		var error = false;
		if (site.common.checkCharCount('#QRTitle', 25, 80, 4, true, true))
			error = true;
		if (text.length == 0 || (text.length > 0 && (text.length < 70 || text.length > 2000))) {
			site.common.checkCharCount('#QRText', 70, 2000, 0, true, true);
			error = true;
		}
		if (!error) {
			$('#_step-1').hide();
			$('#_step-2').show();
			$(window).scrollTop($('#_step-2').offset().top);
			$('#_section_QR').removeClass('poser_QR');
			site.tracking.doTRackingProcessQR(1);
		}
		$(window).scrollTop(0);
		this.selectedStep();
	};
	/** Affiche l'étape */
	this.goStep = function(numero){
		$("[id^='_step-']").hide();
		$('#_step-' + numero).show();
		site.tracking.doTRackingProcessQR(numero*-1);
		if ($(window).width() >= 800){
			$(window).scrollTop(0);
		}
		else{
			$(window).scrollTop($('#_section_QR').offset().top);
		}
		this.selectedStep();
	}
	/**
	 * Affiche le formulaire
	 */
	this.selectExpertiseStep = function() {
		$('#sendQuestionForm-qr-form').show();
		$('#_sendQr-qr-form').show();
		$('#_authForm-qr-form').hide();
	};
	/**
	 * Affiche les conseils à l'internaute pour poser une question
	 */
	this.toggleAskQuestion = function(champ, etape){
		$(champ).parents('fieldset').find('._adviceQuestion').slideDown();
		// Si focus question 1 alors les conseils de la question 2 se ferme et inversement
		if (etape == 1){
			$("._precisionQr").find('._adviceQuestion').slideUp();
		} else{
			$("._titreQr").find('._adviceQuestion').slideUp();
		}
	};
	/**
	 * Affiche les informations supplémentaires (Qui va vous répondre et question sur internet)
	 */
	this.toggleInfo = function(element) {
		$(element).next('div').slideToggle();
		$(element).toggleClass('info_ouverte');
	};
	/**
	 * Resize le textarea en fonction de la hauteur du contenu du textarea
	 */
	this.resizeTextarea = function(champ){
		var elemHeight = $(champ).outerHeight();
		$(champ).css({
			"height" : elemHeight + $(champ).scrollTop() + "px",
			"overflow" : "hidden"
		});
	};
	/**
	 * Ajoute une classe selected sur l'etape en cours
	 */
	this.selectedStep = function() {
		var step = $("[id^='_step-']:visible").attr('data-step');
		$('#_step-' + step + ' #_stepQr span').each(function(index,element){
			if ($(element).attr('data-step') == step){
				$(element).addClass('selected');
			}
			if ($(element).attr('data-step') < step){
				$(element).parent().addClass('etape_precedente');
			}
		});
		if (step == 1){
			$('#_section_QR').addClass('poser_QR');
		}
	};
	/**
	 * Scroller vers le commentaire de l'internaute qui a reçu la notification par mail
	 */
	this.showAnchorComment = function() {
		if (window.location.hash.substring(1, 9) == "comment-"){
			var commentaire = window.location.hash.substring(1);
			$('#' + commentaire).parents('.partie_commentaire').toggle();
			var heightHeader = $('nav').outerHeight();
			setTimeout(function(){
				$('html, body').animate( {
					scrollTop: $('#' + commentaire).parents('.partie_commentaire').offset().top - heightHeader
				}, 0);
			}, 1500);
		}
	};
	/*
	 * Calcule la hauteur des suggestions qr
	 */
	this.calculateHeightBoxSuggestion = function(){
		var articleVisible = $('#_section_QR').find('#_relatedContents article').length;
		if ($('.qr_univers_spe').length > 0) {
			var heightQr = $('#_section_QR .w_2_3 .qr_univers_spe').offset().top + $('#_section_QR .w_2_3 .qr_univers_spe').outerHeight() - $('#_section_QR .w_2_3').offset().top;
		} else{
			var heightQr = $('#_section_QR .w_2_3 .bt_valider_inscription').offset().top + $('#_section_QR .w_2_3 .bt_valider_inscription').outerHeight() - $('#_section_QR .w_2_3').offset().top;
		}
		var heightTitle = $('._titreSuggestion').outerHeight();
		var heightLinkMoreResult = $('._plusResultat').outerHeight();
		if (articleVisible == '1' && $('#_relatedContents article').height() != "0"){
			$('._titreSuggestion').show();
			$('._plusResultat').show();
		} else {
			$('._titreSuggestion').hide();
			$('._plusResultat').hide();
		}
		$('#_section_QR').find('#_relatedContents').css({
			'height' : (heightQr - heightLinkMoreResult - heightTitle) + 'px'
		});
	};
		/*
	* Ajoute l'attribut target _blank sur tous les liens des suggestions qr/ecrire
	*/
	this.linkTarget = function() {
		$('#_relatedContents').parent().find('a').attr('target', '_blank');
	};
};
