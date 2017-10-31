/**
 * Objet de gestion des push.
 *
 * @author	David Marcos <david.marcos@finemedia.fr>
 * @copyright	© 2016, Fine Media
 */
site.push = new function() {
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if ($(window).width() <= 800){
			this.showArticlePopinRevisit();
		}
	};
	/**
	 * Ferme le push
	 */
	this.closePush = function(button, content, delay){
		$(button).parents(content).find('.fadeIn').removeClass('fadeIn').addClass('fadeInOut');
		setTimeout (function(){
			$(button).parents(content).addClass('fadeInOut');
			$(content).hide();
		}, delay);
	};
	/**
	 * Cacher un article s'il y en a 3, juste pour le responsive - PopInInscriptionRevisiteur
	 */
	this.showArticlePopinRevisit = function() {
		var article = $('#_dernierArticle ._article');
		var nbArticle = article.length;
		if (nbArticle >= 3) {
			article.eq(0).remove();
		}
	};
};

