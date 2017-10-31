/**
 * Objet de gestion de la homepage des sites Ooreka.
 *
 * @author	Amaury Bouchard <amaury.bouchard@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.homepage = new function() {
	/** Liste des tableau d'identifiants d'ugc devant être affichées */
	this.ugc = [new Array(), new Array(), new Array()];
	/** Liste des id de questions devant être affichées */
	this.questions = new Array();
	/** Liste des id d'ugc (astuces, avis de pros) devant être affichés (concerne la boîte visible par défaut) */
	this.ugc1 = new Array();
	/** Liste des id d'ugc (astuces, avis de pros) devant être affichés (concerne la boîte cachée par défaut) */
	this.ugc2 = new Array();
	/** Controller courant */
	this._controller = null;
	/** URL courante */
	this._url = null;
	/** Action courante */
	this._action = null;

	/** Initialisation du site. */
	this.init = function(url, controller, action) {
		if (url != "/" )
			return;
		this._controller = controller;
		this._url = url;
		this._action = action;
		// Affichage des questions
		if (typeof(g_nbrUgcHP) != "undefined") {
			if (typeof(g_nbrHPQuestionsToDisplay) == "undefined")
				g_nbrHPQuestionsToDisplay = 0;
			if (g_nbrUgcHP[0]) {
				this.ugc[0] = this.myrand(0, g_nbrUgcHP[0] - 1);
				this.ugc[0].sort(function(a, b) { return (a - b); });
				for (var i = 0; i < g_nbrHPQuestionsToDisplay; i++) {
					$("#question" + this.ugc[0][i]).show();
					if (i % 2)
						$("#question" + this.ugc[0][i]).addClass("nocolor");
					else
						$("#question" + this.ugc[0][i]).addClass("color");
				}
			}
			if (g_nbrUgcHP[1]) {
				this.ugc[1] = this.myrand(0, g_nbrUgcHP[1] - 1);
				this.ugc[1].sort(function(a, b) { return (a - b); });
				var odd = this.ugc[1].length % 2;
				for (i = 0; i < 5; i++) {
					$("#ugc1" + this.ugc[1][i]).show();
					if (i % 2)
						$("#ugc1" + this.ugc[1][i]).addClass("nocolor");
					else
						$("#ugc1" + this.ugc[1][i]).addClass("color");
				}
			}
			if (g_nbrUgcHP[2]) {
				this.ugc[2] = this.myrand(0, g_nbrUgcHP[2] - 1);
				this.ugc[2].sort(function(a, b) { return (a - b); });
				for (i = 0; i < 5; i++) {
					$("#ugc2" + this.ugc[2][i]).show();
					if (i % 2)
						$("#ugc2" + this.ugc[2][i]).addClass((odd ? "" : "no") + "color");
					else
						$("#ugc2" + this.ugc[2][i]).addClass((!odd ? "" : "no") + "color");
				}
			}
		}
	};
	/**
	 * Effacement d'un texte donné supposé par défaut présent dans le champ "input" ou "textarea" (sert pour la homepage, mais peut servir aussi pour d'autres pages).
	 * @param	string	field	Champ concerné.
	 * @param	string	value	Valeur éventuelle du champ.
	 */
	this.removeText = function(field, text) {
		jField = $(field);
		if (!jField.length)
			return;
		if (typeof(jField[0].tagName) == "undefined")
			return;
		var tag = jField[0].tagName.toLowerCase();
		if (tag == "input" && jField.val() == text)
			jField.val("");
		else if (tag == "textarea" && jField.val() == text)
			jField.val("");
		else if (tag == "body" && jField.text() == text) { //wisiwig
			jField.text("");
		}
	};
	/**
	 * Sélectionne au hasard cinq contenus.
	 * @param	int	min	Valeur min de l'intervalle.
	 * @param	int	max	Valeur max de l'intervalle.
	 * @return	Array	Tableau contenant les valeurs.
	 */
	this.myrand = function(min, max) {
		var arr = new Array();
		var ugc = new Array();
		for (var i = min; i <= max; i++)
			arr.push(i);
		if (typeof(g_nbrHPQuestionsToDisplay) == "undefined")
			g_nbrHPQuestionsToDisplay = 0;
		while (ugc.length < g_nbrHPQuestionsToDisplay) {
			var n = parseInt(Math.random() * arr.length);
			ugc.push(arr[n]);
			arr.splice(n, 1);
		}
		return (ugc);
	};
	/**
	 * Valide le formulaire "publier un contenu".
	 * @param	int	suffix du formulaire utilisé	(optionnel) Numéro du formulaire associé.
	 */
	this.validatePublicationForm = function(suffix) {
		// Initialisation.
		var existTitre = false;
		if ($("#QRTitle").length > 0)
			existTitre = true;
		var valueTitre = $('#QRTitle').val();
		var valueText = $('#QRText').val();
		var error = false;
		// Desaffichage des erreurs.
		$('#visibleRegistration:hidden').show('slow');
		$("#QR-error-title").hide();
		$("#QR-error-content").hide();
		// Controle.
		if (existTitre && (valueTitre == ""  || valueTitre == "Titre de votre question")) {
			error = true;
			$("#QR-error-title").show();
		}
		if (valueText == "" || valueText == "Texte de votre question" || valueText == "<br>") {
			error = true;
			$("#QR-error-content").show();
		}
		// Retour.
		if (error)
			return;
		// demander l'authentification si besoin et exécuter l'action métier
		site.authentication.setContext(null, 'contactMembre', 'register', 'part', 'popup').triggerAuthenticatedAction(function() {
			$("#sendQuestionForm-" + suffix).submit();
		});
	};
	/*
	 * Vérifie et envoie le formulaire d'annonce immobilière.
	 */
	this.sendAnnonceImmoForm = function(numFastRegister) {
		// initialisations
		$("#_erreur-immoType, #_erreur-immoLocalite").hide();
		var error = false;
		// localité
		if (!$("#_localisation").val().length) {
			$("#_erreur-immoLocalite").show();
			error = true;
		}
		// types de biens recherchés
		var typeIsChecked = false;
		$("._immoType").each(function(position) {
			if (!$(this).attr('checked'))
				return (true);
			typeIsChecked = true;
			return (false);
		});
		if (typeIsChecked == false) {
			$("#_erreur-immoType").show();
			error = true;
		}
		// retour
		if (error == false)
			$("#hp-form-annonces-immo").submit();
	};
};
