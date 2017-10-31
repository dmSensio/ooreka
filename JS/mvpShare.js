/**
 * Objet des fonctions pour le partage du mvp.
 *
 * @author	David Marcos <david.marcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
mvpShare = new function() {
	/**
	 * Initialisation.
	 */
	this.init = function() {
	};
	/**
	 * Ne pas afficher les liens de partage si on ne clique pas sur la barre de partage
	 */
	this.clickOutShare = function(){
		$('body').click(function (event) {
			var idElementParent = $(event.target).parent().attr('id');
			if (idElementParent != "_shareModule" && idElementParent != "_elementToShare"){
				$('._linkShare').hide();
			}
		});
	};
	/**
	 * Afficher les partages possibles (fb, sms, ...)
	 */
	this.share = function(){
		$('._linkShare').toggle();
	};
}