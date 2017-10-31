/**
 * Objet de gestion de la eBibliotheque.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.eBibliotheque = new function() {
	/** Tag xiti après post-transfo. */
	this._postTrackingTag = null;

	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if (controller != 'ebibliotheque' && controller != 'fiche' && controller != 'videos' && controller != 'plante' && !(controller == 'partenariat' && action == 'landing'))
			return;
		// carousel (sur www.ooreka.fr)
		if (controller == 'ebibliotheque' && action == 'voir' && $('#carousel').length) {
			var nbrMedias = $('#carousel a').length;
			site.ugc.processCarousel((nbrMedias >= 5 ? 5 : nbrMedias), 1, 0, 108, 21);
		}
		// boites de dialogue
		var title = "Télécharger et imprimer";
		if (controller == 'ebibliotheque') {
			title = "Télécharger un document";
		}
		// leadPopup et carousel de eDocuments (sur les sites de niche et le portail)
		if (action == 'voir' || action == 'liste' || action == 'diaporama') {
			// box "les internautes ont aussi téléchargé..."
			if (controller == 'ebibliotheque' && action == 'voir' && $('#carousel').length > 0) {
				var nbrMedias = $('#carousel a').length;
				site.ugc.processCarousel((nbrMedias >= 5 ? 5 : nbrMedias), 1, 0, 108, 21);
			}
		}
		// popup de visualisation des premières pages d'un pdf ; code partagé avec les sites partenaires
		if (action == 'voir' || (controller == 'partenariat' && action == 'landing')) {
			$('#viewerPopin').dialog({
				disabled:	true,
				width:		'auto',
				height:		'auto',
				modal:		true,
				draggable:      false,
				resizable:      false,
				closeText:      'Fermer',
				title:		'Prévisualisation'
			});
			$('#viewerPopin').dialog('close');
		}
		// initialiser la page de téléchargement
		if (controller == 'ebibliotheque' && action == 'telechargement' && typeof(site.eBibliotheque.downloadForm) != "undefined")
			site.eBibliotheque.downloadForm.init(url, controller, action);
	};
	/**
	 * Affiche la bonne description (Résumé, sommaire, description, notice).
	 * Cette fonction est appelée dans la page 'ebibliotheque/voir'.
	 * @param	string	idTitle		Identifiant du div contenant le tite a sélectionner
	 * @param	string	idContent	Identifiant du div contenant le contenu a afficher.
	 */
	this.showContent = function(idTitle, idContent) {
		// déselection de tous les titres
		$("#content-title-resume, #content-title-sommaire, #content-title-description, #content-title-notice").removeClass('selected');
		// effacement de tous les contenus
		$("#content-resume, #content-sommaire, #content-description, #content-notice").hide();
		// affichage du bon titre
		$("#" + idTitle).addClass('selected');
		// affichage du bon contenu
		$("#" + idContent).show();
	};
	/**
	 * Ouvre la fenetre de preview d'un pdf.
	 * @param	int	id	Identifiant du preview.
	 * @param	string	title	Titre du préview.
	 */
	this.openPreviewPopin = function(id, title) {
		var url = "https://mesannuaires.pagesjaunes.fr/fineMedia/ebook.php?sk=2&ebookId=" + id;
		$('#viewerPopinIframe').attr('src', url);
		$('#viewerPopin').dialog({'title': title});
		$('#viewerPopin').dialog('open');
	};
	/**
	 * Charge en Ajax des contenus téléchargeables
	 */
	this.loadMoreEdocuments = function() {
		var ugcIds = $('._eDocumentLink:visible').map(
			function() {
				return $(this).attr('data-id');
			}
		).get();
		var isMobile = $(window).width() < 500 ? true : false;
		$.post('/ebibliotheque/loadMoreEdocuments', {'excludedIds': ugcIds, 'mobile': isMobile}, function(data) {
			var test = $.trim(data);
			var idBox = isMobile ? '_eDocumentsListMobile' : '_eDocumentsListDesktop';
			if (test.length > 0) {
				$('#' + idBox).append(data);
				site.auth.replaceDownloadUrl();
			}
			else
				$('#_moreDocumentsLink').hide();
		});
	};
};

