/**
 * Objet des fonctions communes aux mvp.
 *
 * @author	David Marcos <david.marcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
mvpCommon = new function() {
	/**
	 * Initialisation.
	 */
	this.init = function() {
		if ($(window).width() <= 768){
			this.resizeImg();
		};
		// activer le lazyload sur toutes les images
		$("img").lazyload({
			threshold : 100
		});
		// déclencher sticky header si tablette ou desktop et n'a pas la classe tunnel
		if ($(window).width() > 480 && !$('header').hasClass('tunnel')){
			this.scrollSticky($('header'));
		}
		if ($(window).width() > 900){
			this.initElementToFixe();
		}
		// si habillage
		if ($('body').hasClass('habillage')){
			var positionSection = $('._site').offset().top;
			$(window).bind('scroll', function() {
				var positionPage = $(window).scrollTop();
				if (positionPage >= positionSection && !$('._site').hasClass('hab_fixed')){
					$('._site').addClass('hab_fixed');
				}
				if (positionPage <= positionSection && $('._site').hasClass('hab_fixed')){
					$('._site').removeClass('hab_fixed');
				}
			});
		}
		// si box pro PJ
		if ($('.bloc_pj').length > 0){
			var widthElement = $('.bloc_pj .job_pro .grid > div').eq(1).outerWidth(true);
			if ($(window).width() > 970){
				var widthBloc = $('.bloc_pj').width();
				var limit = Math.ceil(widthBloc/widthElement);

			}
			var grid = $('.bloc_pj .job_pro .grid');
			var elementLength = $('.bloc_pj .job_pro .grid > div').length;
			var elementSelected = $('.bloc_pj .job_pro .selected');
			// connaitre index de l'élément cliqué
			var eltIndex = elementSelected.index();
			// si element non visible alors on bouge le carousel
			if (eltIndex > limit - 1){
				// connaitre position du dernier élément
				var posLastVisible = -Math.abs((eltIndex - (limit-1)) * widthElement);
				// changer position
				grid.css('left', posLastVisible);
			} else{
				$('.bloc_pj .job_pro ._prev').addClass('inactive');
			}
			// si l'élément sélectionné est le dernier
			if (eltIndex == (elementLength - 1)){
				$('.bloc_pj .job_pro ._next').addClass('inactive');
			}
			// si tous les éléments sont visibles
			if(limit > elementLength){
				$('.bloc_pj .job_pro ._prev').remove();
				$('.bloc_pj .job_pro ._next').remove();
			}
		}

		this.changeMetaDatas();
	};
	/**
	 * Déclenche un élement en sticky
	 */
	this.scrollSticky = function(element){
		var heightElement = $(element).outerHeight(true);
		$(window).bind('scroll touchmove', function() {
			var positionPage = $(window).scrollTop();
			if (positionPage >= heightElement){
				$(element).addClass('element_fixed');
			} else{
				$(element).removeClass('element_fixed');
			}
		});
	};
	/**
	 * Fixer un élement au scroll
	 */
	this.initElementToFixe = function(){
		var box = $('._elementToFixe');
		var classExist = document.getElementsByClassName('_elementToFixe');
               	if (classExist.length > 0) {
			$(window).bind('scroll', function () {
				var windowScrollTop = $(window).scrollTop();
				var positionTopBox = box.parent().offset().top;
				var heightBoxParent = box.parent().outerHeight(true);
				var heightBox = box.outerHeight(true);
				var positionEndBox = positionTopBox + heightBoxParent;
				var heightHeader = $('header').outerHeight(true);
				var margin = 20;
				if ((windowScrollTop + heightHeader + margin) >= (positionTopBox) && (windowScrollTop + heightBox) < positionEndBox){
					if (box.hasClass('fixed_bottom')){
						box.removeClass('fixed_bottom');
					}
					if (!box.hasClass('fixed_top')){
						box.addClass('fixed_top');
					}
					box.css({
						'top': (heightHeader + margin) + 'px'
					});
				}
				if ((windowScrollTop + heightHeader + margin + heightBox) >= positionEndBox){
					if (box.hasClass('fixed_top')){
						box.removeClass('fixed_top');
					}
					if (!box.hasClass('fixed_bottom')){
						box.addClass('fixed_bottom');
					}
					box.css({
						'top': 'auto'
					});
				}
				if ((windowScrollTop + heightHeader + margin) < positionTopBox && box.hasClass('fixed_top')){
					if (box.hasClass('fixed_top')){
						box.removeClass('fixed_top');
					}
					box.css({
						'top': 'auto'
					});
				}
			});
		}
	};
	/**
	 *
	 */
	this.search = function(button, inHeader){
		var goSearch = true;
		if (typeof inHeader != "undefined" && inHeader) {
			var inputVisible = $(button).parent().find('input').is(':visible');
			if (!inputVisible){
				$(button).parent().find('input').show();
				goSearch = false;
			} else{
			}
		}
		if (goSearch){
			var inputSearch = $(button).parent().find('input');
			var errorSearchBar = this.verifyInput(inputSearch);
			if (!errorSearchBar) {
				// $(button).parents('form').submit();
			} else{

			}
		}
	};
	this.verifyInput = function(inputSearch){
		hasError = false;
		if (inputSearch.val() == ""){
			this.showError(inputSearch, 'vide');
			hasError = true;
		} else{
			this.hideError(inputSearch);
		}
		return (hasError);

	};
	this.showError = function(element, typeErreur){
		$(element).parent().addClass('erreur');
		$(element).parents('fieldset').find('.message_erreur').hide();
		$(element).parents('fieldset').find('.' + typeErreur).show();
	};
	this.hideError = function(element){
		$(element).parent().removeClass('erreur');
		$(element).parents('fieldset').find('.message_erreur').hide();
	};
	this.focusForm = function(input){
		$(input).parents('form').addClass('form_active');
	};
	this.formActiveOrNot = function(input, inHeader){
		if ($(input).val() == ""){
			this.hideError(input);
			$(input).parents('form').removeClass('form_active');
			if (typeof inHeader != "undefined" && inHeader) {
				$(input).hide();
			}
		}
	};
	/**
	 * Fermeture de popin
	 */
	this.closePopin = function(element, firstChild){
		if (firstChild == undefined){
			$(element).parent().parent().hide();
		} else{
			firstChild.hide();
		}
	};
	/**
	 * [showTooltips description]
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	this.showTooltips = function(element){
		$(element).find('._tool').toggle();
	};
	/**
	 *
	 */
	this.moveCarousel = function(elementClicked, type){
		if ($(elementClicked).hasClass('inactive')){
			return;
		}
		if (type != 'element'){
			var element = $(elementClicked).parents('.job_pro').find('.grid > div');
			var grid = $(elementClicked).parents('.job_pro').find('.grid');
		} else{
			var element = $(elementClicked).parent().parent().find('.grid > div');
			var grid = $(elementClicked).parent().parent().find('.grid');
		}
		// connaitre largeur du carousel
		var widthGrid = grid.width();
		// connaitre nombre element dans le carousel
		var lengthElement = element.length;
		// connaitre position du carousel
		var posCarousel = parseInt(grid.css('left'));
		// connaitre largeur d'un élement
		var widthElement = element.eq(1).outerWidth(true);
		// connaitre la marge entre chaque element
		var margin = element.eq(1).outerWidth(true) - element.eq(1).outerWidth();
		// connaitre la limite pour afficher le bouton précédent
		var stopPrev = -Math.abs(widthElement);
		// connaitre la limite pour afficher le bouton suivant
		var stopNext = -Math.abs(lengthElement*widthElement - margin - widthGrid - widthElement);
		// connaitre le nombre d'élément visible
		var elementVisible = (widthGrid + margin)/widthElement;
		// connaitre le nombre d'élément invisible
		var elementInvisible = lengthElement - elementVisible;
		// action bouton précédent
		if (type == 'prev'){
			// changer position
			grid.css('left', posCarousel + widthElement);
			// si limite alors on cache le bouton
			if (posCarousel == stopPrev){
				$(elementClicked).addClass('inactive');
			}
			// si element invisible alors affichage du bouton suivant
			if (posCarousel >= -Math.abs(widthElement*elementInvisible) && elementInvisible > 0){
				$(elementClicked).parent().find('._next').removeClass('inactive');
			}
		}
		// action bouton suivant
		if (type == 'next'){
			// changer position
			grid.css('left', posCarousel - widthElement);
			// afficher bouton précédent
			$(elementClicked).parent().find('._prev').removeClass('inactive');
			// si limite alors on cache le bouton suivant
			if (posCarousel == stopNext){
				$(elementClicked).addClass('inactive');
			}
		}
	}
	/**
	 * changer la taille de l'image en responsive
	 */
	this.resizeImg = function(){
		$("img").each(function(index, element){
			if ($(element).attr('data-size')) {
				var img = $(element).attr('src');
				var format = $(element).attr('data-size');
				format = format.split('-');
				if ($(window).width() >= 480){
					img = img.replace(format[0], format[1]);
				} else{
					img = img.replace(format[0], format[2]);
				}
				$(element).attr('src', img);
			}
		});
	};

	/**
	 * Changer les meta données
	 */
	this.changeMetaDatas = function() {
		var currentPageType = $('#_currentPageType').val();
		if (currentPageType == 'hp_rubrique' || currentPageType == 'homepage') {
			var chapeau = $('.chapeau').html().trim();
			$('.meta-description').attr('content', chapeau.substr(0, 300));
		}
	}
}
