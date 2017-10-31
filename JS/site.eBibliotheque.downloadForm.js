/**
 * Objet de gestion de la popup de téléchargment de la bibliothèque.
 *
 * @author	Thomas Ringuedé <thomas.ringuede@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.eBibliotheque.downloadForm = new function() {
	/** Controlleur de la page.. */
	this._controller = null;
	/** Identifiant ugc. */
	this._ugcId = null;

	this.atInternetReferer = "";
	/**
	 * Initialisation.
	 * @param	stringcd /	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		this._controller = controller;
		// ouverture du formulaire d'authentification
		var ugcId = $('#_leadForm').attr('data-ugc-id');
		this._ugcId = ugcId;
		if ($("#_authForm-" + ugcId)) {
			site.authentication.openIntegratedAuthentication('register', 'part', ugcId, 'telecharger', function(authType, userType, email) {
				$('html,body').scrollTop(0);
				var xitiHitVar = "Inscription::eBibliotheque::''" + authType;
				xt_med('C', xtn2, xitiHitVar, 'A');
				site.eBibliotheque.downloadForm.showForm(email);
			});
		}
	};
	/**
	 * Affiche le formulaire RQ de la eBibliotheque.
	 * Verifie aussi l'affichage des bons champs.
	 */
	this.changeRqForm = function() {
		var campaign0Type = '';
		var campaign1Type = '';
		var campaign2Type = '';
		// campagne 0 existante : prise du type
		if ($('#_RQ0-yes').attr('checked'))
			campaign0Type = $('#_RQ0Type').val();
		// campagne 1 existante : prise du type
		if ($('#_RQ1-yes').attr('checked'))
			campaign1Type = $('#_RQ1Type').val();
		if ($('#_RQ2-yes').attr('checked'))
			campaign2Type = $('#_RQ2Type').val();
		// pas de campagne a oui : retour
		if (!campaign0Type && !campaign1Type && !campaign2Type) {
			$('#_rqForm').hide();
			return;
		}
		$('#_rqForm').show();
		// cacher les messages d'erreur
		$('#_leadForm').find('fieldset').removeClass('erreur');
		// affichage des champs
		$("#_rqForm ._rqName").show();
		$("#_rqForm ._rqSurname").show();
		$("#_rqForm ._rqPhone").show();
		$("#_rqForm ._rqAddress").show();
		$("#_rqForm ._rqZip").show();
		$("#_rqForm ._rqCity").show();
		$("#_rqForm ._rqPhonContact").show();
	};
	/**
	 * Afficher le formulaire de requêtes de pros.
	 * @param	string	email	Email de l'utilisateur venant de s'authentifier, pour préparer les requêtes pros.
	 */
	this.showForm = function(email) {
		$("#_rqEmail").attr('value', email);
	};
	/**
	 * Vérifier la valeur des champs.
	 * @param	DOMElement	element	Element du dom.
	 */
	this.checkField = function(element) {
		$e = $(element);
		if ($e.attr('name') == 'rqSurname') {
			if ($e.val().length == 0)
				$('._rqSurname').addClass('erreur').removeClass('valide');
			else
				$('._rqSurname').addClass('valide').removeClass('erreur');
		} else if ($e.attr('name') == 'rqName') {
			if ($e.val().length == 0)
				$('._rqName').addClass('erreur').removeClass('valide');
			else
				$('._rqName').addClass('valide').removeClass('erreur');
		} else if ($e.attr('name') == 'rqAddress') {
			if ($e.val().length == 0)
				$('._rqAddress').addClass('erreur').removeClass('valide');
			else
				$('._rqAddress').addClass('valide').removeClass('erreur');
		} else if ($e.attr('name') == 'rqCity') {
			if ($e.val().length == 0)
				$('._rqCity').addClass('erreur').removeClass('valide');
			else
				$('._rqCity').addClass('valide').removeClass('erreur');
		} else if ($e.attr('name') == 'rqPhone') {
			if ($e.val().length == 0 || /^((\+?33)|0)\d{9}$/.test($e.val()) == false) {
				$('._rqPhone').addClass('erreur').removeClass('valide');
			} else {
				$('._rqPhone').addClass('valide').removeClass('erreur');
			}
		}
	};
	/**
	 * Cacher les erreurs à la sélection
	 * @param	int	index	Index de la requête.
	 */
	this.hideErrors = function(index) {
		$("#_RQ" + index  + "Erreur").hide();
	};
	/** Etape 2 : Verifie le formulaire et appele la fonction "sendLead". */
	this._verifyForm = function() {
		// vérification choix lead et RQ
		var error = false;
		$("#_RQ0Erreur, #_RQ1Erreur, #_RQ2Erreur").hide();
		if ($("#_RQ0-yes").length > 0 && $("#_RQ0-yes:checked").length <= 0 && $("#_RQ0-no:checked").length <= 0) {
			$("#_RQ0Erreur").show();
			error = true;
		}
		if ($("#_RQ1-yes").length > 0 && $("#_RQ1-yes:checked").length <= 0 && $("#_RQ1-no:checked").length <= 0) {
			$("#_RQ1Erreur").show();
			error = true;
		}
		if ($("#_RQ2-yes").length > 0 && $("#_RQ2-yes:checked").length <= 0 && $("#_RQ2-no:checked").length <= 0) {
			$("#_RQ2Erreur").show();
			error = true;
		}
		if ($("#_leadResponse-yes").length > 0 && $("#_leadResponse-yes:checked").length <= 0 && $("#_leadResponse-no:checked").length <= 0) {
			var index = $('#_leadResponse-yes').attr('data-index');
			$("#_RQ" + index  +  "Erreur").show();
			error = true;
		}
		if (error)
			return (false);
		// vérification du formulaire RQ
		if (!this._verifyRqForm())
			return (false);

		//return;
		// prise des données.
		var sendLead = $('#_leadResponse-yes').attr('checked') ? true : false;
		// formData
		var formData = {
			'lead'		: $('#_lead').val(),
			'eDocument0Id'	: $('#_idEdocument0').val(),
			'sendEDocument0': $('#_sendEDocument0').attr('checked') ? 1 : 0,
			'eDocument1Id'	: $('#_idEdocument1').val(),
			'sendEDocument1': $('#_sendEDocument1').attr('checked') ? 1 : 0,
			'eDocument2Id'	: $('#_idEdocument2').val(),
			'sendEDocument2': $('#_sendEDocument2').attr('checked') ? 1 : 0,
			'rq0Id'		: $('#_RQ0Id').val(),
			'sendRq0'	: $('#_RQ0-yes').attr('checked') ? 1 : 0,
			'rq1Id'		: $('#_RQ1Id').val(),
			'sendRq1'	: $('#_RQ1-yes').attr('checked') ? 1 : 0,
			'rq2Id'		: $('#_RQ2Id').val(),
			'sendRq2'	: $('#_RQ2-yes').attr('checked') ? 1 : 0,
			'rqSurname'	: $('#_rqSurname').val(),
			'rqName'	: $('#_rqName').val(),
			'rqEmail'	: $('#_rqEmail').val(),
			'rqPhone'	: $('#_rqPhone').val(),
			'rqAddress'	: $('#_rqAddress').val(),
			'rqZip'		: $('#_rqZip').val(),
			'rqCity'	: $('#_rqCity').val(),
			'rqCountry'	: $('#_rqCountry').val(),
			'rqPhoneContact': $('#_rqPhoneContact-yes').is(':checked') ? 1 : 0
		};
		// Poster directement
		site.eBibliotheque.downloadForm._sendLead(formData, sendLead);
	};
	/* ************************************* FONCTIONS PRIVEES ******************************** */

	/**
	 *  Etape 3 : Envoie la requête POST pour le téléchargement au serveur.
	 *  @param	array	formData	Données à passer en POST au serveur.
	 *  @param	bool	sendLead	True pour rediriger ensuite vers la page de lead.
	 */
	this._sendLead = function(formData, sendLead) {
		var contentId = this._ugcId;
		var queryUrl = "/ebibliotheque/telecharger/" + contentId;
		$.post(queryUrl, formData, function(response) {
			if (response.status) {
				// Envoi du tracking concernant le choix sur les remonté
				site.tracking.doTRackingEbibliothequeTelechargement();
				xt_med('F', xtn2, 'ebibliotheque::telecharger::confirmation_telechargement'+'&f1='+response.nbDocuments+'&f2=['+response.docTitle+']&f3=['+response.niche+']&f4=['+response.univers+']&f5='+response.docId+'&f6=['+response.docType+']&f7='+site.eBibliotheque.downloadForm.atInternetReferer);
				// redirection url
				if (sendLead) {
					document.location.href="/ebibliotheque/devis/" + contentId;
					return;
				}
				if ($('#_redirUrl').val().length > 0)
					document.location.href = $('#_redirUrl').val();
				else
					document.location.reload();
			} else {
				alert("Erreur de communication avec le serveur.");
			}
		}, 'json');
	};
	/**
	 * Vérifie le(s) formulaire(s) RQ.
	 * @return	true si le formulaire est complet. false sinon.
	 */
	this._verifyRqForm = function() {
		// cacher les messages d'erreurs
		$('#_leadForm').find('fieldset').removeClass('erreur').removeClass('valide');
		// prise des types de RQ
		var campaign0Type = $('#_RQ0-yes').attr('checked') ? $('#_RQ0Type').val() : '';
		var campaign1Type = $('#_RQ1-yes').attr('checked') ? $('#_RQ1Type').val() : '';
		var campaign2Type = $('#_RQ2-yes').attr('checked') ? $('#_RQ2Type').val() : '';
		// rien a envoyer => rien à vérifier
		if (!campaign0Type && !campaign1Type && !campaign2Type)
			return (true);
		// vérifications
		var error = false;
		// prénom
		var surname = $('#_rqSurname').val();
		if (!surname.length) {
			error = true;
			$('._rqSurname').addClass('erreur');
		} else
			$('._rqSurname').addClass('valide');
		// nom
		var name = $('#_rqName').val();
		if (!name.length) {
			error = true;
			$('._rqName').addClass('erreur');
		} else
			$('._rqName').addClass('valide');
		// address
		var address = $('#_rqAddress').val();
		if (!address.length) {
			error = true;
			$('._rqAddress').addClass('erreur');
		} else
			$('._rqAddress').addClass('valide');
		// city
		var city = $('#_rqCity').val();
		if (!city.length) {
			error = true;
			$('._rqCity').addClass('erreur');
		} else
			$('._rqCity').addClass('valide');
		// tel
		var phone = $('#_rqPhone').val();
		if (!phone.length) {
			error = true;
			$('._rqPhone').addClass('erreur');
		} else
			$('._rqPhone').addClass('valide');
		// pays
		var country = $('#_rqCountry').val();
		// code postal
		var zip = $('#_rqZip').val();
		if (!zip.length || (country == 'FR' && !(/^\d{5}$/.test(zip)))) {
			error = true;
			$('._rqZip').addClass('erreur');
		} else
			$('._rqZip').addClass('valide');
		// contact par téléphone
		var phoneContact = !$('#_rqPhoneContact-yes').is(':checked') && !$('#_rqPhoneContact-no').is(':checked') ? false : true;
		if (!phoneContact) {
			error = true;
			$('._rqPhoneContact').addClass('erreur');
		} else
			$('._rqPhoneContact').addClass('valide');
		// retour
		return (!error);
	};
};
