/**
 * Objet des fonctions utilitaires communes aux differentes parties du site.
 *
 * @author	Sebastien ROTH <sebastien.roth@finemedia.fr>
 * @copyright	© 2015, Fine Media
 */
site.common = new function() {
	/* Controller courant */
	this._controller = null;
	/* Action courante */
	this._action = null;
	/* URL courante */
	this._url = null;
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		this._controller = controller;
		this._url = url;
		this._action = action;
		this.bindOuvertureMenu();
		if ($('._layoutPopIn').length > 0){
			this.clickOutPopin($('._layoutPopIn'));
		}
		if ($(window).width() <= 800){
			this.resizeImg();
		}
		if ($('._fixedElementParent').length > 0) {
			this.bindResize(controller);
			this.initElementFixe(controller);
		}
		// on bind la fonction autocomplete sur chaque element avec la classe _needAutocomplete
		this.initAutocomplete();
	};
	/*
	 * Redimensionne si la fenêtre est réduite ou agrandie
	 */
	this.bindResize = function(controller) {
		$(window).resize(function () {
			site.common.initElementFixe(controller);
		});
	};
	/** Ajoute un compteur de caractere sur un champs donne
	 *  Les messages d'erreurs sont dans le tpl qui appel la fonction :
	 *  #_countChar' + ele.id  +  '-error-minChar
	 *  #_countChar' + ele.id  +  '-error-maxChar
	 *  #_countChar' + ele.id  +  '-error-minWords
	 * @param	object	ele		L'element sur lequel on compte les caracteres
	 * @param	int	min		Nombre minimum de caracteres
	 * @param	int	max		Nombre maximum de caracteres
	 * @param	int	minWordCount	Nombre de mots minimum
	 * @param	bool	toCheck		Détermine si le champ est obligatoire
	 * @param 	bool 	showError 	Détermine on affiche les erreurs
	 */
	this.checkCharCount = function(titleSelectorId, min, max, minWordCount, toCheck, showError) {
		if (typeof(toCheck) == 'undefined')
			toCheck = true;
		if (typeof(showError) == 'undefined')
			showError = false;
		if (max == null)
			max = 'unlimited';
		var id = $(titleSelectorId).attr('id');
		var errorSelector = '#' + id + '-error';
		if ($(errorSelector).length == 0)
			errorSelector = '#' + id;
		var charSelector = '#_charCounter-' + id;
		var textSelector = '#' + id;
		var errorMinSelector = '#_countChar-' + id  +  '-error-minChar';
		var errorMaxSelector = '#_countChar-' + id  +  '-error-maxChar';
		var errorMinWordsSelector = '#_countChar-' + id  +  '-error-minWords';
		var regex = /\s+/gi;
	   	var bError = false;
		var len = $(textSelector).val().length;
		var wordCount =  $(textSelector).val().trim().replace(regex, ' ').split(' ').length;
		if (max == 'unlimited')
			$(charSelector).text(len);
		else
			$(charSelector).text(len + '/' + max);
		// Applique une classe erreur sur le compteur lors de la saisie
		if (len < min)
			$(charSelector).addClass('erreur');
		else
			$(charSelector).removeClass('erreur');
		if (len > max && max != 'unlimited')
			$(charSelector).addClass('erreur');
		// Affiche les messages d'erreur
		if (len < min) {
			bError = true;
			if (showError) {
				$(errorSelector).addClass('erreur');
				$(errorMinSelector).show();
			}
		} else {
			if (showError)
				$(errorMinSelector).hide();
		}
		if (len > max && max != 'unlimited') {
			bError = true;
			if (showError) {
				$(errorSelector).addClass('erreur');
				$(errorMaxSelector).show();
			}
		} else {
			if (showError)
				$(errorMaxSelector).hide();
		}
		if ((!bError && minWordCount && wordCount < minWordCount) && minWordCount > 0) {
			bError = true;
			if (showError)
				$(errorMinWordsSelector).show();
		} else {
			if (showError)
				$(errorMinWordsSelector).hide();
		}
		if (!bError) {
			$(charSelector).removeClass('erreur');
			$(errorSelector).removeClass('erreur');
			$(errorMinSelector).hide();
			$(errorMaxSelector).hide();
		}
		if (len == 0 && !toCheck) {
			$(charSelector).removeClass('erreur');
			$(errorSelector).removeClass('erreur');
			$(errorMinSelector).hide();
			$(errorMaxSelector).hide();
			$(errorMinWordsSelector).hide();
		}
		return (bError);
	};
	/**
	 * Effet "ancre" avec une animation
	 * @param  	string 	elementId 	Element cible
	 */
	this.scrollToElementWithAnimation = function(elementId, offset) {
		$('html, body').animate({
			scrollTop: $(elementId).offset().top - $('#_header_fixed').height() - $('.nav_filAriane').outerHeight()
		}, 300, function(){
			$('html, body').animate({
				scrollTop: $(elementId).offset().top - $('#_header_fixed').height() - $('.nav_filAriane').outerHeight()
			},0);
		});
		if (elementId == '#liens_rapides')
			$(elementId).parent().find('.liste_contenu').show();
	};
	/**
	 * Verifie qu'une url est valide.
	 * @param 	string 	url 	url a verifier
	 * @return 	bool 	true si valide, false sinon.
	 */
	this.checkUrl = function (url) {
		if (url.indexOf('@') != -1)
			return false;
		if (url.indexOf('://') == -1)
			url = 'https://' + url;
		var regexUrl = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}/;
		if (regexUrl.test(url))
			return true;
		return false;
	};
	/**
	 * Réduit la taille des blocs de textes qui possèdent la fonctionnalité 'Lire la suite'
	 * @param	int	nbrCharToDisplay	Nombre de caractères a afficher.
	 */
	// this.reduceSizeForReadMoreTextBoxes = function(nbrCharToDisplay) {
	// 	// Variables initialisées de façon arbitraire
	// 	var lineHeightText = 24;
	// 	var lineHeightTitle = 58;
	// 	var nbrOfCharPerLine = 90;
	// 	$('._readMoreBox').each(function(index) {
	// 		var divWidth = $(this).width();
	// 		var nbrLinesTitle = nbrChar = newHeight = 0;
	// 		var imageHeight = 0;
	// 		if ($(this).attr('data-has-image'))
	// 			imageHeight = ($(this).find('#_boxImageCopyright').height() > 0) ? $(this).find('#_boxImageCopyright').height() : 250;
	// 		var nbrCharTotal = $(this).text().trim().length;
	// 		var nbrCharPerLines = Math.floor((nbrOfCharPerLine * divWidth) / 800);
	// 		// Stock la valeur initiale du nbrCharToDisplay
	// 		var nbrCharTmp = nbrCharToDisplay;
	// 		// Compte le nombre de ligne titre dans le contenu
	// 		$(this).find('*').each(function(i) {
	// 			if (nbrChar < nbrCharTmp) {
	// 				var tagName = $(this).prop('tagName');
	// 				if (tagName == 'H3')
	// 					nbrLinesTitle++;
	// 				nbrChar = $(this).text().trim().length;
	// 			}
	// 		});
	// 		nbrCharTmp = ($(this).hasClass('_longText')) ? 800 : nbrCharTmp;
	// 		newHeight = (Math.floor(nbrCharTmp / nbrCharPerLines) * lineHeightText) + (nbrLinesTitle * lineHeightTitle) + 15;
	// 		if (nbrCharTotal <= nbrCharTmp) {
	// 			var buttonId = $(this).next().attr('id');
	// 			$('#' + buttonId).hide();
	// 		} else {
	// 			if (imageHeight != 0 && nbrCharTotal > nbrCharTmp)
	// 				newHeight = imageHeight + 10;
	// 			$(this).height(newHeight);
	// 			$(this).css('overflow-y', 'hidden');
	// 		}
	// 	});
	// };
	/**
	 * Ouvre entièrement le bloc de texte associé à la fonctionnalité 'Lire la suite'
	 * @param	string	buttonId	Id du lien déclencheur.
	 * @param	string	boxId		Id du texte associé.
	 */
	// this.readMoreText = function(buttonId, boxId) {
	// 	$('#' + buttonId).toggleClass('voir_suite');
	// 	$('#' + boxId).height('');
	// 	$('#' + boxId).css('overflow-y', '');
	// 	$('#' + buttonId).hide();
	// };
	/**
	 * Initialise le caroussel responsive
	 */
	this.initFancyBox = function(hasVideo) {
		hasVideo = (typeof hasVideo === 'undefined') ? false : hasVideo;
		// gestion des vignettes de photos
		$('._lightbox-photos').fancybox();
		// gestion des vignettes de vidéos
		if (hasVideo) {
			$('._lightbox-videos').fancybox({
				maxWidth	: 800,
				maxHeight	: 600,
				fitToView	: false,
				width		: '70%',
				height		: '70%',
				autoSize	: false,
				closeClick	: false,
				openEffect	: 'none',
				closeEffect	: 'none'
			});
		}
	};
	/** Fonction d'initialisation et activation du menu, à appeler au chargement de la page. */
	this.bindOuvertureMenu = function() {
		// Fonctionnement du menu sur les hp/univers
		$('p._menu_title').click(function(){
			if($(this).next('ul').hasClass( "_menu_down")) {
				$(this).next('ul').slideDown();
				$(this).next('ul').removeClass("_menu_down");
				$('._menu_up').addClass('_menu_down').removeClass('_menu_up').slideUp();
				$('.actif').removeClass('actif');
				$(this).addClass('actif');
				$(this).next('ul').addClass('_menu_up');
			} else if ($(this).next('ul').hasClass( "_menu_up")){
				$(this).next('ul').removeClass('_menu_up actif').addClass('_menu_down');
				$(this).removeClass('actif');
				$(this).next('ul').hide();
			}
		});
	};
	/**
	 * Ajoute une surbrillance sur le menu des plantes lors du scroll en fonction de la navigation de l'utilisateur
	 */
	this.highlightTableOfContentElement = function() {
		$(window).bind('scroll touchmove', function() {
			var allParts = [];
			// Pré-calcule les positions des position des sections de la fiche plante
			$('._linked_to_menu').each(function(index, value) {
				var position = $(this).offset().top - $('#_header_fixed').height();
				var tmp = {pos: Math.floor(position), id: $(this).attr('id')};
				allParts.push(tmp);
			});
			var idToHighlight = null;
			$.each(allParts, function(index, value) {
				if ($(window).scrollTop() >= value.pos)
					idToHighlight = value.id;
			});
			if (!$('#list_' + idToHighlight).hasClass('selectionne')) {
				$('#_left_menu li').removeClass('selectionne');
				$('#list_' + idToHighlight).addClass('selectionne');
			}
		});
	};
	/**
	 * changer la taille de l'image en responsive
	 */
	this.resizeImg = function(){
		$(".img_remontee").each(function(index, element){
			if ($(element).attr('data-u-mobile')) {
				var img = $(element).attr('style');
				var format = $(element).attr('data-u-mobile');
				format = format.split('-');
				if (format.length == 2){
					img = img.replace(format[0], format[1]);
					$(element).attr('style', img);
				}
			}
			if ($(element).attr('data-o-mobile')) {
				var img = $(element).attr('style');
				var format = $(element).attr('data-o-mobile');
				format = format.split('-');
				if (format.length == 2){
					img = img.replace(format[0], format[1]);
					$(element).attr('style', img);
				}
			}
		});
		$("img").each(function(index, element){
			if ($(element).attr('data-u-mobile')) {
				var img = $(element).attr('src');
				var format = $(element).attr('data-u-mobile');
				format = format.split('-');
				if (format.length == 2){
					img = img.replace(format[0], format[1]);
					$(element).attr('src', img);
				}
			}
			if ($(element).attr('data-o-mobile')) {
				var img = $(element).attr('src');
				var format = $(element).attr('data-o-mobile');
				format = format.split('-');
				if (format.length == 2){
					img = img.replace(format[0], format[1]);
					$(element).attr('src', img);
				}
			}
		});
	};
	/**
	 * Fermer la popin si on clique dans la zone grisée
	 */
	this.clickOutPopin = function(elementParent){
		$(elementParent).on('click', function(event){
			var idTarget = event.target.id;
			var popinId = $(elementParent).attr('id');
			if (idTarget == popinId){
				$(elementParent).hide();
			}
		});
	};
	/**
	 * Changement de place du H1 sur mobile
	 * @param	string	mobileH1 	Classe dans laquelle doit se trouver le h1 sur mobile
	 * @param	string	base 		Classe ou se trouve le H1 de base.
	 */
	this.changePositionTitle = function(mobileH1, base) {
		var titleClone = $('._changePositionTitle h1').clone();
		var title = $('._changePositionTitle h1');
		if (window.innerWidth <= 900 && $('._h1Mobile').length == 0){
			$(mobileH1).prepend(titleClone);
			titleClone.addClass('_h1Mobile');
			title.remove();
		}
		else if(window.innerWidth > 900){
			if($(mobileH1).find('h1').hasClass('_h1Mobile')){
				$(base).prepend($(mobileH1).find('h1'));
				$(mobileH1).find('h1').removeClass();
			}
		}
	};
	/**
	* Fermer la popin si on clique dans la zone grisée
	*/
	this.clickOutPopin = function(elementParent){
		$(elementParent).on('click', function(event){
			var classTarget = $(event.target).attr('class');
			var popinClass = $(elementParent).attr('class');
			if (classTarget == popinClass){
				$(elementParent).hide();
			}
		});
	};
	/**
	 * Fonction permettant de fixer un element en fonction du scroll
	 *
	 */
	this.initElementFixe = function (controller) {
		// Récupération de l'element à fixer
		var box = $('._elementToFixe');
		var boxHeight = box.height();
		var boxWidth = box.width();
		if (box.length == 0) {
			return (false);
		}
		// Ancre lien box commentaire - PAGE TIPS
		if ($('#_versBoxCommentaire').length > 0) {
			$('#_versBoxCommentaire').click(function () {
				$('html, body').animate( {
					scrollTop: $('#_animEtape1').offset().top - $('#_header_fixed').height()
				}, 750);
			});
		}
		$(window).bind('resize scroll', function () {
			// fenetre inférieur à 1000 la fenêtre de commentaire reste en haut de page
			if ($(window).width() < 1000 && controller == 'tips') {
				site.common.ancreBoxCommenter();
				site.common.resetElementFixe();
				return;
			}
			if ($(window).width() > 900) {
				var windowScrollTop = $(window).scrollTop();
				var positionTopBox = $(box).parent().offset().top;
				var navHeaderHeight = $('.nav_header').outerHeight();
				var marginTop = 10;
				var positionEndBox = ($(box).parent().height() + positionTopBox) - (boxHeight + navHeaderHeight + marginTop);
				// Si le scroll est au dessus de l'element à fixer
				if ($(box).hasClass('_box_fixed') && positionTopBox > windowScrollTop) {
					$(box).removeClass('_box_fixed');
					$(box).removeAttr('style');
					if ($('._show_on_scroll').length > 0) {
						$('._show_on_scroll').css('display', 'none');
					}
				}
				// Si le scroll est compris dans la zone ou l'element doit être fixe
				if (!$(box).hasClass('_box_fixed')  && positionTopBox < (windowScrollTop + navHeaderHeight + marginTop) && positionEndBox > windowScrollTop) {
					$(box).addClass('_box_fixed');
					$(box).css({
						'position' : 'fixed',
						'z-index' : '2',
						'top' :  (navHeaderHeight + marginTop) + 'px',
						'width' : boxWidth + 'px'
					});
					if ($('._show_on_scroll').length > 0) {
						$('._show_on_scroll').css('display', 'block');
					}
				} else if ($(box).hasClass('_box_fixed') && windowScrollTop > positionEndBox) {
					$(box).removeClass('_box_fixed');
					$(box).css({
						'position' : 'absolute',
						'top' : 'auto',
						'bottom' : '0',
						'width' : boxWidth + 'px'
					});
					if ($('._show_on_scroll').length > 0) {
						$('._show_on_scroll').css('display', 'none');
					}
				}
			} else {
				site.common.resetElementFixe();
			}
		});
	};
	/**
	 * Reset le menu fixe au resize de la page si inferieur à 1000px ou 900px
	 */
	this.resetElementFixe = function () {
		$('._elementToFixe').removeClass('_box_fixed');
		$('._elementToFixe').removeAttr('style');
		if ($('._show_on_scroll').length > 0) {
			$('._show_on_scroll').css('display', 'none');
		}
	}
	/**
	 * Fonction qui gère le lien commenter pour les tips en responsive
	 */
	this.ancreBoxCommenter = function () {
		var positionCommentaireFin = $('._fixedElementParent').offset().top + $('._fixedElementParent').height();
		var positionBottomWindow = $(window).scrollTop() + $(window).height();
		var positionCommentaireTop = $('._fixedElementParent').offset().top + $('#_addCommentaire').height();
		var positionTopWindow = $(window).scrollTop();
		if (positionBottomWindow >= positionCommentaireFin || positionCommentaireTop >= positionTopWindow){
		 	$('#_versBoxCommentaire').removeClass('lienFixe');
		} else if (positionTopWindow >= positionCommentaireTop ) {
			$('#_versBoxCommentaire').addClass('lienFixe');
		}
	};
	/**
	 * fonction d'autocomplete pour les sites.
	 * Cette fonction est utilisé sur bloc droite, gauche, page de recherche.
	 *
	 * @param string idInputSearchBox Id de l'input de recherche
	 * @return void
	 */
	this.initAutocomplete = function () {
		$('._needAutocomplete').each(function(index, element) {
			var idInputSearchBox = $(element).attr('id');
			var controller = $(element).attr('data-controller');

			// Cas ou le controller n'est pas présent.
			if (typeof(controller) === "undefined") {
				return false;
			}
			idInputSearchBox = '#' + idInputSearchBox;
			// Cas ou l'id de l'input n'est pas présent.
			if ($(idInputSearchBox).length == 0) {
				return false;
			}

			// Initialisation de l'autocompletion
			$(idInputSearchBox).autocomplete({
				source: "/"+controller+"/autocompleteService",
				minLength: 3,
			}).keyup(function (event) {
				// exception pour medicament, géré par une fontion sendFormMedicament
				// ToDo: unifier cette fonction avec sendFormMedicament
				if (controller != 'medicament' && event.keyCode == 13) {
					// replace parent par closest (cas pour la recherche chien où le form est 2 parents plus haut)
					$(this).closest('form').submit();
				}
			});
		});
	};
	this.popinNewsletter = function(button){
		$(button).parents('.popin').removeClass('popin_go').addClass('popin_no');
	};
};
