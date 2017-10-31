/**
 * Objet de gestion des étapes communes des demande de devis
 * @author	Dorian Yahouédéou <dorian.yahouedeou@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
formulaire.common = new function() {
	/** Valider la question "civilité". */
	this.questCivilite = function(answer) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-civilite span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-civilite-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-civilite').val(answer);
	};
	/** Valider l'étape "coordonnées/contact". */
	this.stepContact = function() {
		var stepName = 'coordonnees';
		// Réinitialiser les erreurs
		$("#_form_main-erreur-civilite").removeClass("show").addClass("hide");
		$("#_form_main-erreur-nom").removeClass("show").addClass("hide");
		$("#_form_main-erreur-prenom").removeClass("show").addClass("hide");
		$("#_form_main-erreur-email").removeClass("show").addClass("hide");
		$("#_form_main-erreur-phone").removeClass("show").addClass("hide");
		// Vérifications
		var formValidated = true;
		// civilité
		if ($("#_form_main-civilite")[0].value == "") {
			$("#_form_main-erreur-civilite").addClass("show").removeClass("hide");
			formValidated = false;
		}
		// nom
		if ((($("#_form_main-nom")[0] && $("#_form_main-nom")[0].value == "")) || $("#_form_main-nom")[0].value == "Nom :" || !this._checkValue($("#_form_main-nom")[0].value)) {
			$("#_form_main-erreur-nom").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// prénom
		if (($("#_form_main-prenom")[0] && $("#_form_main-prenom")[0].value == "") || $("#_form_main-prenom")[0].value == "Prénom :" || !this._checkValue($("#_form_main-prenom")[0].value)) {
			$("#_form_main-erreur-prenom").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// email
		if ($("#_form_main-email")[0] && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test($("#_form_main-email")[0].value) == false) {
			$("#_form_main-erreur-email").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// téléphone
		if ($("#_form_main-phone")[0] && /^((\+?33)|0)\d{9}$/.test($("#_form_main-phone")[0].value) == false) {
			$("#_form_main-erreur-phone").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// Passer à l'étape suivante
		if (formValidated) {
			// eulerian Stats
			if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true' && formulaire.defisc.etude != 'undefined') {
				formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('civilite', $("#_form_main-civilite")[0].value);
				formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('nom', $("#_form_main-nom")[0].value);
				formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('prenom', $("#_form_main-prenom")[0].value);
				formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('email', $("#_form_main-email")[0].value);
				formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('phone', $("#_form_main-phone")[0].value);
				formulaire.defisc.etude.sendEulerianStats(stepName);
			}
			formulaire.step.next();
		}
	};
	/**
	 * Vérifier la validité d'une chaîne de caractère (nom, prénom).
	 * @param	string	value	Valeur à vérifier.
	 * @return	bool	Validité de la chaîne.
	 */
	this._checkValue = function(value) {
		// vérifier la validité : absence de caractères spéciaux
		return (/^[éèêîïôöùàâa-zA-Z0-9- ]*$/.test(value));
	};
	/** Valider l'étape "localisation des travaux". */
	this.stepPlace = function(combineSteps) {
		var stepName = 'adresse';
		// Réinitialiser les erreurs
		$("#_form_main-erreur-ville").removeClass("show").addClass("hide");
		$("#_form_main-erreur-code_postal").removeClass("show").addClass("hide");
		$("#_form_main-erreur-adresse").removeClass("show").addClass("hide");
		var formValidated = true;
		// Vérifications
		// ville
		if (($("#_form_main-ville")[0] && $("#_form_main-ville")[0].value == "") || $("#_form_main-ville")[0].value == "Ville :") {
			$("#_form_main-erreur-ville").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// code postal
		var zip = $("#_form_main-code_postal")[0];
		if (zip && /^\d{5}$/.test(zip.value) == false) {
			$("#_form_main-erreur-code_postal").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// Passer à l'étape suivante
		if (formValidated) {
			if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true' && formulaire.defisc.etude != 'undefined') {
				formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('ville', $("#_form_main-ville")[0].value);
				formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('code_postal', $("#_form_main-code_postal")[0].value);
				formulaire.defisc.etude.sendEulerianStats(stepName);
				// on appelle la fonction deepsight avec le param 'done' car on a fini toutes les étapes
				formulaire.defisc.etude.deepsight('done');
			}
			if (combineSteps == 0){
				formulaire.step.next();
			} else{
				this.stepFinalize();
			}
		}
	};
	/** Valider la dernière étape et poster le formulaire. */
	this.stepFinalize = function(combineSteps) {
		var stepName = 'fin';
		var formValidated = true;
		if (combineSteps == 0){
			// Réinitialiser les erreurs
			$("#_form_main-erreur-offres_partenaires, #_form_main-erreur-newsletter").removeClass("show").addClass("hide");
			// offres partenaires
			if ($("#_form_main-offres_partenaires_0").length > 0) {
				if ($("#_form_main-offres_partenaires_0:checked").length <= 0 && $("#_form_main-offres_partenaires_1:checked").length <= 0) {
					$("#_form_main-erreur-offres_partenaires").removeClass("hide").addClass("show");
					formValidated = false;
				}
				if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true' && formulaire.defisc.etude != 'undefined')
					formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('offres_partenaires', ($("#_form_main-offres_partenaires_0:checked").length > 0 ? 'oui' : 'non'));
			}
			// newsletter
			if ($("#_form_main-newsletter_0").length > 0) {
				if ($("#_form_main-newsletter_0:checked").length <= 0 && $("#_form_main-newsletter_1:checked").length <= 0) {
					$("#_form_main-erreur-newsletter").removeClass("hide").addClass("show");
					formValidated = false;
				}
				if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true' && formulaire.defisc.etude != 'undefined')
					formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('newsletter', ($("#_form_main-newsletter_0:checked").length > 0 ? 'oui' : 'non'));
			}
		}

		// Cas defiscalisation avec stats eulerian
		if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true' && formulaire.defisc.etude != 'undefined' && $('#_btn-validate').attr('data-siteLabel') != undefined && window.EA_collector) {
			var siteLabel = $('#_btn-validate').attr('data-siteLabel');
			var date = Date.now();
			var leadRef = siteLabel + '_'  + date   + '_'  + Math.floor((Math.random() * 100000));
			formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('type', siteLabel);
			formulaire.defisc.etude.eulerianStatsConf[stepName]['answers'].set('ref', leadRef);
			if (formValidated) {
				formulaire.defisc.etude.sendEulerianStats(stepName);
				var delayForStat = true;
			}
		}
		// Envoyer le formulaire
		if (formValidated) {
			if (delayForStat) {
				setTimeout(function() {
					$('#_stepForm').submit();
				}, 600);
			} else
				$('#_stepForm').submit();
		}
	};
	/**
	 * Affichage des messages d'erreur sur le formulaire
	 * @return boolean  Retourne true s'il y a une erreur false sinon
	 */
	this.showErrorMessage = function() {
		var stepName = 'coordonnees';
		// Réinitialiser les erreurs
		$("#_form_main-erreur-civilite").removeClass("show").addClass("hide");
		$("#_form_main-erreur-nom").removeClass("show").addClass("hide");
		$("#_form_main-erreur-prenom").removeClass("show").addClass("hide");
		$("#_form_main-erreur-email").removeClass("show").addClass("hide");
		$("#_form_main-erreur-phone").removeClass("show").addClass("hide");
		// Vérifications
		var formValidated = true;
		// civilité
		if ($("#_form_main-civilite")[0].value == "") {
			$("#_form_main-erreur-civilite").addClass("show").removeClass("hide");
			formValidated = false;
		}
		// nom
		if ((($("#_form_main-nom")[0] && $("#_form_main-nom")[0].value == "")) || $("#_form_main-nom")[0].value == "Nom :" || !this._checkValue($("#_form_main-nom")[0].value)) {
			$("#_form_main-erreur-nom").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// prénom
		if (($("#_form_main-prenom")[0] && $("#_form_main-prenom")[0].value == "") || $("#_form_main-prenom")[0].value == "Prénom :" || !this._checkValue($("#_form_main-prenom")[0].value)) {
			$("#_form_main-erreur-prenom").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// email
		if ($("#_form_main-email")[0] && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test($("#_form_main-email")[0].value) == false) {
			$("#_form_main-erreur-email").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// téléphone
		if ($("#_form_main-phone")[0] && /^((\+?33)|0)\d{9}$/.test($("#_form_main-phone")[0].value) == false) {
			$("#_form_main-erreur-phone").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// ville
		if (($("#_form_main-ville")[0] && $("#_form_main-ville")[0].value == "") || $("#_form_main-ville")[0].value == "Ville :") {
			$("#_form_main-erreur-ville").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// code postal
		var zip = $("#_form_main-code_postal")[0];
		if (zip && /^\d{5}$/.test(zip.value) == false) {
			$("#_form_main-erreur-code_postal").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// Optin
		if ($("#_form_main-offres_partenaires_0:checked").length == 0 && $("#_form_main-offres_partenaires_1:checked").length == 0) {
			formValidated = false;
		}
		return (formValidated);
	}
};
