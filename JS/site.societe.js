/**
 * Objet de gestion des pages marques.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.societe = new function() {
	/**
	 * Fonction d'initialisation, à appeler au chargement de la page.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		// Vérification du contexte.
		if (controller != 'societe')
			return;
		// initialisation des requetes pro
		site.requetePro.initLead();
		site.requetePro.initMeeting();
		site.requetePro.initCheckup();
		if (action == 'produit') {
			site.requetePro.initProductPopup();
			site.requetePro.initDownloadProduct();
		} else if (action == 'brochures')
			site.requetePro.initDownloadLeaflet();
	};
	/**
	 * Lors d'une demande de brochure, paramètre les éléments d'envois de la brochure (nom de la brochure dans le formulaire,
	 * formulaire d'envoi de la brochure elle-même) et demande les infos à l'utilisateur.
	 * @param	string	filename	Nom de la brochure (Nom à indiquer dans le mail envoyé au pro).
	 * @param	string	fileUrl		Url de la brochure à envoyer à l'utilisateur.
	 */
	this.openPopupLeaflet = function(filename, fileUrl) {
		if (typeof(filename) != "undefined")
			$("#RequetePro_downloadleaflet_leafletName").val(filename);
		if (typeof(fileUrl) != "undefined")
			$("#form_sendFile").attr('action', fileUrl);
		site.requetePro.openPopup('download_leaflet');
	};
	/**
	 * Une fois que la demande de fiche produit a été faite, envoyée et acceptée, cette fonction est appélée pour envoyer la fiche produit.
	 * Le formulaire id=form_sendFile est pret pour envoyer cette fiche au client. Il ne reste plus qu'a lui demander de s'enclencher.
	 */
	this.sendFicheProduit = function() {
		$("#form_sendFile").submit();
	};
	/*
	 * Affiche l'image en main, et desselectionne les autres images (page fiche produit).
	 * @param	int	numImage	Numéro de l'image (1-6).
	 * @param	string	urlImage	Url de l'image à mettre en grand.
	 */
	this.setProductMainImage = function(numImage, urlImage) {
		$('#imageProduit').attr('src', urlImage);
		$('._leftPreviewImage').removeClass('selectedLeft').removeClass('left').addClass('left');
		$('._rightPreviewImage').removeClass('selectedRight').removeClass('right').addClass('right');
		if (numImage == 1 || numImage == 3 || numImage == 5)
			$("#product_prev_image" + numImage).removeClass('selectedLeft').removeClass('left').addClass("selectedLeft");
		else if (numImage == 2 || numImage == 4 || numImage == 6)
			$("#product_prev_image" + numImage).removeClass('selectedRight').removeClass('right').addClass("selectedRight");
	};
};
