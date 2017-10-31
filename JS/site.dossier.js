/**
 * Objet de gestion des dossier ops.
 *
 * @author	David Marcos <david.marcos@finemedia.fr>
 * @copyright	© 2016, Fine Media
 */
site.dossier = new function() {
	/* URL de la page courante */
	this._url = null;
	/* Contrôleur courant */
	this._controller = null;
	/* Action courante */
	this._action = null;
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
		if ($('.boxDevis_epargne').length > 0 && $(window).width() >= 1000)
			this.positionBoxDevis();
	};
	/**
	 * La box suit le scroll jusqu'à la demande de devis
	 */
	this.positionBoxDevis = function() {
		if ($(window).width() <= 1000){
			var replaceElement = $('.boxDevis_epargne').clone();
			replaceElement.hide();
			$('.article_epargne').before(replaceElement);
		}
		$(window).scroll(function(){
			var positionWindow = $(window).scrollTop();
			var positionDevis = $('#devis_epargne').offset().top;
			var heightBox = $('.boxDevis_epargne').outerHeight();
			var positionArticle = $('.article_epargne').offset().top;
			if (positionWindow >= positionArticle && !$('.boxDevis_epargne').hasClass("box_fixed") && !$('.boxDevis_epargne').hasClass("box_non_visible")){
				$('.boxDevis_epargne').addClass('box_fixed');
				if ($(window).width() <= 1000){
					$('.boxDevis_epargne').show();
				}
			}
			else if (positionWindow <= positionArticle && $('.boxDevis_epargne').hasClass("box_fixed")){
				$('.boxDevis_epargne').removeClass('box_fixed');
				if ($(window).width() <= 1000){
					$('.boxDevis_epargne').hide();
				}
			}
			else if (positionWindow >= (positionDevis - heightBox) && $('.boxDevis_epargne').hasClass("box_fixed")){
				$('.boxDevis_epargne').removeClass('box_fixed');
				$('.boxDevis_epargne').addClass('box_non_visible');
			}
			else if (positionWindow <= (positionDevis - heightBox) && $('.boxDevis_epargne').hasClass("box_non_visible")){
				$('.boxDevis_epargne').removeClass('box_non_visible');
				$('.boxDevis_epargne').addClass('box_fixed');
			}
			$('.box_fixed').css({
				'top' : '0'
			});
			$('.box_non_visible').css({
				'top' : '-' + heightBox + 'px'
			});
		});
		$('.boxDevis_epargne').click(function() {
			$('html, body').animate({
				scrollTop: $('#devis_epargne').offset().top
			}, 750);
		});
	};
};