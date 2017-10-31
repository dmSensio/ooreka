/**
 * Objet de gestion des produits d'un membre.
 *
 * @author	Julien Hamrouni <julien.hamrouni@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.membre.product = new function() {
	/**
	 * Change une image.
	 * @param	string	imageNumber	Numéro de l'image à afficher.
	 */
	this.showImage = function(imageNumber) {
		// contrôle du numéro
		if (imageNumber < 1 || imageNumber > 6)
			return;
		// changement de la valeur du champ hidden qui garde en mémoire l'image en cours de sélection
		$("#shownImage").val(imageNumber);
		// on cache toutes les images et on réaffiche celle qui nous intéresse
		$("._product").hide();
		$("#product-" + imageNumber).show();
	};
	/** Image précédente. */
	this.changeDown = function() {
		// récupération du numéro de l'image affichée actuellement
		var imageNumber = $("#shownImage").val();
		if (imageNumber >= 2 && imageNumber <= 6) {
			// affichage de l'image précédente
			imageNumber--;
			this.showImage(imageNumber);
		}
	};
	/** Image suivante. */
	this.changeUp = function() {
		// récupération du numéro de l'image affichée actuellement
		var imageNumber = $("#shownImage").val();
		if (imageNumber >= 1 && imageNumber <= 5) {
			// affichage de l'image suivante
			imageNumber++;
			this.showImage(imageNumber);
		}
	};
};
