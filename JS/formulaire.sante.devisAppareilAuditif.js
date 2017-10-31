/**
 * Objet de gestion du formulaire de devis appareils auditif.
 * @author	Camille Khalaghi <khalaghi.camille@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
formulaire.sante.devisAppareilAuditif  = new function() {
	/**
	 * Sélectionner une réponse à la question "Pour qui est ce bilan ?".
	 * @param	answer	Réponse.
	 */
	this.who = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-who span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-who-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_etude-who').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	}
	/** Répondre à la question "Code postal". */
	this.stepCodepostal = function() {
		formulaire.step.init();
		// Cacher les messages d'erreur
		$('#_form_etude-erreur-codepostal').removeClass("show").addClass("hide");
		// Vérifier
		formValidated = true;
		var cp = $('#_form_etude-codepostal')[0];
		if (cp.value.length != 5) {
			$("#_form_etude-erreur-codepostal").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// Passer à l'étape suivante
		if (formValidated)
			formulaire.step.next();
	}
	/**
	 * Sélectionner une réponse à la question "attentes".
	 * @param	answer	Réponse.
	 */
	this.attente = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-attente span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-attente-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_etude-attente').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	}
	/**
	 * Sélectionner une réponse à la question "Delai".
	 * @param	answer	Réponse.
	 */
	this.delai = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-delai span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-delai-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_etude-delai').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	}
	/**
	 * Sélectionner une réponse à la question "plage horaire pour être appelé".
	 * @param	answer	Réponse.
	 */
	this.horaire = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-horaire span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-horaire-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_etude-horaire').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	}
	/** Etape "description". */
	this.stepDescription = function() {
		formulaire.step.next();
	}
}
