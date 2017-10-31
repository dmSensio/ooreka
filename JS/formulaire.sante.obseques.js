/**
 * Objet de gestion du formulaire de devis obseques et assurance obseques.
 * @author	Thomas Ringuedé <ringuede.thomas@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
formulaire.sante.obseques  = new function() {
	/**
	 * Sélectionner une réponse à la question "Pour qui est ce bilan ?".
	 * @param	answer	Réponse.
	 */
	this.questPrestation = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-prestation_obseques span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-prestation_obseques-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_etude-prestation_obseques').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/** Question "description". */
	this.stepDescription = function() {
		formulaire.step.init();
		// Réinitialiser les erreurs
		$("#_form_main-erreur-description").removeClass("show").addClass("hide");
		// vérification
		if ($.trim($('#_form_main-description').val()) == '')
			$("#_form_main-erreur-description").removeClass("hide").addClass("show");
		else {
			// passer à l'étape suivante
			formulaire.step.next();
		}
	};
}
