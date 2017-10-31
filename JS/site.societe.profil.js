/**
 * Objet de gestion des pages marques.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.societe.profil = new function() {
	/** 
	 * affiche un ugcContent parmi les 3 TopUgcContents
	 * @param	int	position	Position du div de l'ugcContent a afficher.
	 */
	this.setTopUgcContent = function(position) {
		$("#topUgcContent-0, #topUgcContent-1, #topUgcContent-2, #topUgcContent-3").hide();
		$("#topUgcContent-"+position).show();
	};
};
