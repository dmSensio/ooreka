/**
 * Gestion de toutes les fonctions dont le template "identification/profilPro" aurait besoin.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.authentication.profilPro = new function() {
	/**
	 * Affiche le div "horaires" ou "fermé" suivant l'état de la checkbox
	 * @param	string	id	Identifiant des éléments à manipuler.
	 */
	this.openingHours = function(id) {
		if ($("#check-" + id).attr("checked")) {
			$("#" + id + "-horaires").show();
			$("#" + id + "-ferme").hide();
		} else {
			$("#" + id + "-horaires").hide();
			$("#" + id + "-ferme").show();
		}
	};
	/** Affiche ou cache la div "activités" et change le wording en conséquence. */
	this.processActivitiesDisplay = function() {
		if ($("#activities").is(":hidden")) {
			$("#activities_open_wording").hide();
			$("#activities_close_wording").show();
		} else if ($("#activities").is(":visible")) {
			$("#activities_open_wording").show();
			$("#activities_close_wording").hide();
		}
		$("#activities").slideToggle('slow');
	};
	/** Affiche ou cache la div "départements" et change le wording en conséquence. */
	this.processDepartementsDisplay = function() {
		if ($("#departements").is(":hidden")) {
			$("#departements_open_wording").hide();
			$("#departements_close_wording").show();
		} else if ($("#departements").is(":visible")) {
			$("#departements_open_wording").show();
			$("#departements_close_wording").hide();
		}
		$("#departements").slideToggle('slow');
	};
	/**
	 * Fonction de vérification de la validité d'un numéro de téléphone.
	 * @param	string	phone	Numéro de téléphone.
	 * @return	bool	'true' si numéro bien formé.
	 */
	this.checkPhone = function(phone) {
		return (!phone.length || /^(\d\d\s?){5}$/.test(phone));
	};
	/**
	 * Vérification des champs obligatoires avant envoi des données du formulaire.
	 * @return	bool	'true' si les champs sont corrects.
	 */
	this.verifyForm = function() {
		$('#error-firstname').hide();
		$('#error-lastname').hide();
		$('#error-callable').hide();
		$('#error-tel').hide();
		$('#error-mobile').hide();
		$('#error-cp').hide();
		var error = false;
		if (!$('#firstname').val()) {
			$('#error-firstname').show();
			error = true;
		}
		if (!$('#lastname').val()) {
			$('#error-lastname').show();
			error = true;
		}
		if ($('#pays').val() == 'FR' && !(/^\d{5}$/.test($('#cp').val()))) {
			$('#error-cp').show();
			error = true;
		}
		if ($('#tel').val() || $('#mobile').val()) {
			if (!this.checkPhone($('#tel').val())) {
				$('#error-tel').show();
				error = true;
			}
			if (!this.checkPhone($('#mobile').val())) {
				$('#error-tel').show();
				error = true;
			}
		}
		return (!error);
	};
};
