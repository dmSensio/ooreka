/**
 * Objet de gestion des étapes communes des demande de devis b2b
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2014, Fine Media
 */
formulaire.b2b.infosEntreprise = new function() {
	/**
	 * Valider la question "vous êtes".
	 * @param	string		answer		Réponse à la question.
	 * @param	function	functionNext	(optionnel) Fonction à appeler si on veut passer à l'étape suivante. Par défaut : formulaire.step.next.
	 */
	this.stepVousEtes = function(answer, functionNext) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-vous_etes span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-vous_etes-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-vous_etes').val(answer);
		// passage à l'étape suivante
		if (functionNext)
			functionNext();
		else
			formulaire.step.next();
	};
	/**
	 * Question "Societe".
	 * @param	function	functionNext	(optionnel) Fonction à appeler si on veut passer à l'étape suivante. Par défaut : formulaire.step.next.
	 */
	this.stepSociete = function(functionNext) {
		formulaire.step.init();
		$("#_form_main-erreur-societe").removeClass("show").addClass("hide");
		// Vérifications
		var formValidated = true;
		var value = $("#_form_main-societe").val();
		if (value.length <= 0) {
			$("#_form_main-erreur-societe").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// passer à l'étape suivante
		if (formValidated) {
			if (functionNext)
				functionNext();
			else
				formulaire.step.next();
		}
	};
	/**
	 * Valider la question "nombre de salairiés".
	 * @param	string		answer		Réponse à la question.
	 * @param	function	functionNext	(optionnel) Fonction à appeler si on veut passer à l'étape suivante. Par défaut : formulaire.step.next.
	 */
	this.stepSalaries = function(answer, functionNext) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form_main-salaries span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-salaries-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-salaries').val(answer);
		// passage à l'étape suivante
		if (functionNext)
			functionNext();
		else
			formulaire.step.next();
	};
	/**
	 * Valider la question "collaborateur".
	 * @param	string		answer		Réponse à la question.
	 * @param	function	functionNext	(optionnel) Fonction à appeler si on veut passer à l'étape suivante. Par défaut : formulaire.step.next.
	 */
	this.stepFonction = function(answer, functionNext) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-fonction span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-fonction-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-fonction').val(answer);
		// passage à l'étape suivante
		if (functionNext)
			functionNext();
		else
			formulaire.step.next();
	};
	/* Valider la question "Decisionnaire".
	 * @param	string		answer		Réponse à la question.
	 * @param	function	functionNext	(optionnel) Fonction à appeler si on veut passer à l'étape suivante. Par défaut : formulaire.step.next.
	 */
	this.stepDecisionnaire = function(answer, functionNext) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-decisionnaire span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-decisionnaire-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-decisionnaire').val(answer);
		// passage à l'étape suivante
		if (functionNext)
			functionNext();
		else
			formulaire.step.next();
	};
};
