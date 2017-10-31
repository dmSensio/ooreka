/**
 * Objet de gestion de la page contact.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2011, Fine Media
 */
site.contact = new function() {
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if (controller != 'contact')
			return;
		if (action) {
			$('#contactType').val(action);
			this.updateForm();
		}
	};
	this.getFormType = function(choice) {
		if (choice == "devis" || choice == "partenariat" || choice == "presse" || choice == "client")
			return ("pro");
		if (choice == "recrutement" || choice == "redacteur")
			return ("recrutement");
		if (choice == "liens")
			return ("liens");
		return ("normal");
	};
	// récupère la valeur du select.
	this.updateForm = function() {
		var choice = $('#contactType')[0].value;
		var formType = this.getFormType(choice);
		$("#erreur-contactType").hide('slow');
		$("#erreur-nom").hide('slow');
		$("#erreur-company").hide('slow');
		$("#erreur-email").hide('slow');
		$("#erreur-tel").hide('slow');
		$("#erreur-msg").hide('slow');
		$("#texte-normal").hide();
		$("#texte-devis").hide();
		$("#texte-partenariat").hide();
		$("#texte-presse").hide();
		$("#texte-pro").hide();
		$("#texte-referencement").hide();
		$("#texte-candidature").hide();
		$("#texte-redacteur").hide();
		if (choice == "devis")
			$("#texte-devis").fadeIn('slow');
		else if (choice == "partenariat")
			$("#texte-partenariat").fadeIn('slow');
		else if (choice == "presse")
			$("#texte-presse").fadeIn('slow');
		else if (choice == "recrutement")
			$("#texte-candidature").fadeIn('slow');
		else if (choice == "liens")
			$("#texte-referencement").fadeIn('slow');
		else if (choice == "redacteur")
			$("#texte-redacteur").fadeIn('slow');
		else if (choice == "client")
			$("#texte-pro").fadeIn('slow');
		else
			$("#texte-normal").fadeIn('slow');
		if (formType == "pro") {
			$("#question-entreprise").show('slow');
			$("#question-telephone").show('slow');
			$("#question-cv").hide('slow');
		} else if (formType == "recrutement") {
			$("#question-entreprise").hide('slow');
			$("#question-telephone").show('slow');
			$("#question-cv").hide('slow');
		} else if (formType == "liens") {
			$("#question-entreprise").hide('slow');
			$("#question-telephone").hide('slow');
			$("#question-cv").hide('slow');
		} else {
			$("#question-entreprise").hide('slow');
			$("#question-telephone").hide('slow');
			$("#question-cv").hide('slow');
		}
	};
	// vérification du formulaire
	this.checkForm = function() {
		var choice = $('#contactType')[0].value;
		var formType = this.getFormType(choice);
		var result = true;
		if (choice == "") {
			$("#erreur-contactType").show('slow');
			result = false;
		}
		if (!$("#quest-nom")[0].value.length) {
			$("#erreur-nom").show('slow');
			result = false;
		}
		if (formType == "pro" && !$("#quest-company")[0].value.length) {
			$("#erreur-company").show('slow');
			result = false;
		}
		if (!$("#quest-email")[0].value.length) {
			$("#erreur-email").show('slow');
			result = false;
		}
		if ((formType == "pro" || formType == "recrutement") && !$("#quest-tel")[0].value.length) {
			$("#erreur-tel").show('slow');
			result = false;
		}
		return (result);
	};
};
