/**
 * Objet de fonctions des produits.
 *
 * @author	David Marcos <david.marcos@finemedia.fr>
 * @copyright	© 2016, Fine Media
 */
site.produits = new function() {
	/**
	 * Fonction d'initialisation, à appeler au chargement de la page.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if ($('.box_produit').length > 0)
			this.calculateNumberArticle();
		if (controller != 'produits')
			return;
		this.selection.init(url, controller, action);
	};
	this.calculateNumberArticle = function() {
		var heightBox = $('.box_produits article > div').outerHeight();
		$('.box_produits').find('.suivant').hide();
		$('.box_produits').find('.precedent').hide();
		if ($('.box_produits article').length > 4 || $(window).width() < 1000){
			$('.box_produits > div').addClass('nombreux_produits');
			$('.box_produits').find('.suivant').show();
		}
	};
	this.goTo = function(elementClicked, navigation){
		var nbArticle = $('.box_produits article').length;
		var widthArticle = $('.box_produits article:eq(1)').outerWidth(true);
		var allArticle = nbArticle * widthArticle - 50;
		var positionLeft = parseInt($('.ensemble_article').css('left'));
		var widthBox = $('.ensemble_article').outerWidth(true);
		var position = Math.abs(positionLeft);
		if (navigation == 1){
			if ($('.ensemble_article').attr('style')){
				$('.ensemble_article').css('left', positionLeft - widthArticle + "px");
			} else{
				$('.ensemble_article').css({
					"left" : "-" + widthArticle + "px"
				});
			}
			if (widthBox + position + widthArticle >= allArticle){
				$('.box_produits').find('.suivant').hide();
			}
			$(elementClicked).parent().find(".precedent").show();
		} else{
			$(elementClicked).parent().find(".suivant").show();
			$('.ensemble_article').css('left', positionLeft + widthArticle + "px");
			if(position <= widthArticle){
				$(elementClicked).parent().find(".precedent").hide();
			}
		}

	};
};
