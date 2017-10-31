/**
 * Objet de gestion du formulaire de devis standard téléphonique.
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2014, Fine Media
 */
formulaire.b2b.standardTelephonique  = new function() {
	/**
	 * Sélectionner une réponse à la question "Que souhaitez-vous ?".
	 * @param	answer	Réponse.
	 */
	this.stepStandardTelephonique = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-recherche_standard_telephonique span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-recherche_standard_telephonique-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-recherche_standard_telephonique').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	this.stepPreference = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-preference span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-preference-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-preference').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	this.stepCablage = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-cablage span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-cablage-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-cablage').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	this.stepExistant = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-existant_standard_telephonique span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-existant_standard_telephonique-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-existant_standard_telephonique').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	this.stepNombrePostesTelephoniques = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-nombre_tel span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-nombre_tel-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-nombre_tel').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	this.stepOperateurFixe = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-operateur_fixe span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-operateur_fixe-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-operateur_fixe').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	this.stepOperateurInternet = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-internet span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-internet-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-internet').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "délai".
	 * @param	answer		Réponse.
	 */
	this.questDelai = function(answer) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-delai span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-delai-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-delai').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/** Question "description". */
	this.stepPrecision = function() {
		formulaire.step.init();
		formulaire.step.next();
	};
	/**
	 * Sélectionner une réponse à la question "fournisseurs".
	 * @param	answer		Réponse.
	 */
	this.checkFournisseurs = function(answer) {
		formulaire.step.init();
		$('#_form-option-fournisseurs_standard_telephonique-' + answer).removeClass('selected');
		// gérer la sélection d'une option
		if ($('#_form_main-fournisseurs_standard_telephonique-' + answer + ':checked').length > 0) {
			$('#_form_main-fournisseurs_standard_telephonique-' + answer).removeAttr('checked');
		} else {
			$('#_form_main-fournisseurs_standard_telephonique-' + answer).attr('checked', 'checked');
			$('#_form-option-fournisseurs_standard_telephonique-' + answer).addClass('selected');
		}
	};
	/** Vérifier l'étape "Fournisseur" et passer à l'étape suivante. */
	this.stepFournisseurs = function() {
		formulaire.step.init();
		formulaire.step.next();
	};
}
