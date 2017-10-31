/**
 * Animation côté front.
 * @author	David Marcos	<david.marcos@finemedia.fr>
 * @copyright	© 2015, Fine Media
 */
site.animation = new function() {
	/**
	 * Initialisation.
	 * @param       string  url             URL de la page courante.
	 * @param       string  controller      Contrôleur courant.
	 * @param       string  action          Action courante.
	 */
	this.init = function(url, controller, action) {
		var nombreEtape = $('[id^=_animEtape]').length;
		$(window).scroll(function(){
			for (var i = 1; i <= nombreEtape; i++) {
				site.animation.animationDeclenche('#_animEtape'+i);
			}
		});
	};
	/**
	 * Fonction permettant de déclencher les animations dès que l'élément animable est visible au 1/3 de la fenêtre.
	 * @param       object  elt          	Element animable
	 */
	this.animationDeclenche = function (elt) {
		if ($(elt).hasClass('animated') || $(elt).length == 0) {
			return false;
		}
		var posYdeclencheur = $(elt).height()/3 + $(elt).offset().top;
		var viewBottom = $(window).scrollTop() + $(window).height();
		if (viewBottom >= posYdeclencheur) {
			$(elt).addClass('animated');
		}
	};
	/**
	 * Fonction au focus d'un élement input ajoute une classe.
	 */
	this.animatedFocusTitleInput = function(element) {
		$(element).parent('.input').removeClass('error');
		$(element).parent('.input').addClass('input_filled input_focus');
	};
	/**
	 * Fonction au Blur d'un élement input vide supprime une classe.
	 */
	this.animatedBlurTitleInput = function(element) {
		if ($(element).val() == ''){
			$(element).parent('.input').removeClass('input_filled');
		}
		$(element).parent('.input').removeClass('input_focus');
	};
};
