/**
 * Objet de gestion du formulaire de devis defiscalisation.
 * @author	Dorian Yahouédéou <dorian.yahouedeou@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
formulaire.defisc.etude = new function() {
	/**
	 * Configuration pour remontée statistique EULERIAN
	 * nom_etape : {
	 *	page: /ajax/nom_etape
	 *	type: multiple|mixed|unique (multiple: étape avec 1 question à choix multiples, mixed: étape avec plusieurs questions à choix simple et à champ de saisie libre, unique: étape avec 1 question à choix simple ou à champ de saisie libre.
	 * 	answers: hash des réponses
	 * 	options: options possibles
	 * }
	 */
	this.eulerianStatsConf = {
		'premierchargement': {
			'page': '/ajax/premierchargement'
		},
		'objectifs_principaux': {
			'page': '/ajax/objectifs_principaux',
			'type':	'multiple',
			'answers': new Hash(),
			'options': [
				'reduction_impots',
				'patrimoine',
				'retraite',
				'deces'
			]
		},
		'revenus_foyer': {
			'page': '/ajax/revenus_foyer',
			'type': 'unique',
			'answers': new Hash(),
			'options': [
				'revenus_foyer'
			]
		},
		'annee_naissance': {
			'page':	'/ajax/annee_naissance',
			'type': 'unique',
			'answers': new Hash(),
			'options': [
				'annee_naissance'
			]
		},
		'personnes_foyer': {
			'page': '/ajax/personnes_foyer',
			'type': 'unique',
			'answers': new Hash(),
			'options': [
				'personnes_foyer'
			]
		},
		'situmat': {
			'page':	'/ajax/situmat',
			'type': 'unique',
			'answers': new Hash(),
			'options': [
				'situmat'
			]
		},
		'proploc': {
			'page': '/ajax/proploc',
			'type': 'unique',
			'answers': new Hash(),
			'options': [
				'proploc'
			]
		},
		'coordonnees': {
			'page': '/ajax/coordonnees',
			'type': 'mixed',
			'answers': new Hash(),
			'options': [
				'civilite',
				'nom',
				'prenom',
				'email',
				'phone'
			],
			'x-options': [
				'scart', '1',
				'scartcumul', '0'
			]
		},
		'adresse': {
			'page': '/ajax/adresse',
			'type': 'mixed',
			'answers': new Hash(),
			'options': [
				'ville',
				'code_postal',
				'adresse'
			]
		},
		'fin': {
			'page': '/ajax/fin',
			'type': 'mixed',
			'answers': new Hash(),
			'options': [
				'offres_partenaires',
				'newsletter',
				'type',
				'ref'
			],
			'x-options': ['estimate', 1]
		}
	};
	/** Tableau de données utilisateurs complètes */
	this.eulerianCompiledData = [];
	/**
	 * Envoyer les statistiques Eulerian.
	 * @param	string	step	Etape du devis.
	 */
	this.sendEulerianStats = function(step) {
		if (this.eulerianStatsConf[step] === undefined)
			return;
		if (step === 'premierchargement' && window.EA_collector) {
			EA_collector(['path', this.eulerianStatsConf[step]['page']]);
			return;
		}
		var data = [];
		data.push('path', this.eulerianStatsConf[step]['page']);
		if (this.eulerianStatsConf[step]['type'] === 'multiple') {
			for (var i in this.eulerianStatsConf[step]['options']) {
				var option = this.eulerianStatsConf[step]['options'][i];
				var answer = this.eulerianStatsConf[step]['answers'].get(option);
				data.push(option, (answer === 'oui' ? 'oui' : 'non'));
				this.eulerianCompiledData.push(option, (answer === 'oui' ? 'oui' : 'non'));
			}
		} else if (this.eulerianStatsConf[step]['type'] === 'unique') {
			var option = this.eulerianStatsConf[step]['options'][0];
			var answer = this.eulerianStatsConf[step]['answers'].get(option);
			data.push(option, answer);
			this.eulerianCompiledData.push(option, answer);
		} else if (this.eulerianStatsConf[step]['type'] === 'mixed') {
			for (var i in this.eulerianStatsConf[step]['options']) {
				var option = this.eulerianStatsConf[step]['options'][i];
				var answer = this.eulerianStatsConf[step]['answers'].get(option);
				if (answer != undefined) {
					data.push(option, answer);
					this.eulerianCompiledData.push(option, answer);
				}
			}
		}
		if (this.eulerianStatsConf[step]['x-options'] != undefined) {
			for (var i in this.eulerianStatsConf[step]['x-options'])
				data.push(this.eulerianStatsConf[step]['x-options'][i]);
		}
		if (step == 'fin')
			data = data.concat(this.eulerianCompiledData);
		if (window.EA_collector)
			EA_collector(data);
	};
	/**
	 * Sélectionner une réponse à la question "Objectifs principaux".
	 * @param	answer		Réponse.
	 */
	this.questObjectifsPrincipaux = function(answer) {
		formulaire.step.init();
		// gérer la sélection d'une option
		if ($('#_form_etude-objectifs_principaux-' + answer).is(":checked")) {
			$('#_form_etude-objectifs_principaux-' + answer).removeAttr('checked');
			$('#_form-option-objectifs_principaux-' + answer).removeClass('selected');
			if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true')
				this.eulerianStatsConf['objectifs_principaux']['answers'].set(answer, 'non');
		} else {
			$('#_form_etude-objectifs_principaux-' + answer).attr('checked', 'checked');
			$('#_form-option-objectifs_principaux-' + answer).addClass('selected');
			if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true')
				this.eulerianStatsConf['objectifs_principaux']['answers'].set(answer, 'oui');
		}
	};
	/** Vérifier l'étape "Objectifs principaux" et passer à l'étape suivante. */
	this.stepObjectifsPrincipaux = function() {
		// Cacher les messages d'erreur
		$('#_form_etude-erreur-objectif').removeClass("show").addClass("hide");
		// Vérifications
		var formValidated = false;
		$('#_form-question-objectifs_principaux .checkbox').each(function() {
			if($(this).is(":checked"))
				formValidated = true;
		});
		// Passer à l'étape suivante
		if (formValidated) {
			formulaire.step.next();
			// Envoyer les stats Eulerian
			if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true')
				this.sendEulerianStats('objectifs_principaux');
		} else
			$('#_form_etude-erreur-objectif').removeClass("hide").addClass("show");
	};
	/**
	 * Répondre à la question "Nombre de personnes du foyer".
	 * @param	answer	Réponse.
	 */
	this.questPersonnesFoyer = function(answer) {
		var stepName = 'personnes_foyer';
		// Gestion des sélections
		$('#_form-question-personnes_foyer ._option').removeClass('selected');
		$('#_form-option-personnes_foyer-' + answer).addClass('selected');
		$('#_form_etude-erreur-foyer').removeClass("show").addClass("hide");
		$('#_form_etude-foyer').val(answer);
		if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true') {
			this.eulerianStatsConf[stepName]['answers'].set(stepName, answer);
        	        this.sendEulerianStats(stepName);
		}
		// Passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Répondre à la question "Revenus du foyer".
	 * @param	answer		Réponse.
	 */
	this.questRevenusFoyer = function(answer) {
		var stepName = 'revenus_foyer';
		// Gestion des sélections
		$('#_form-question-revenus_foyer span._option').removeClass('selected');
		$('#_form-option-revenus_foyer-' + answer).addClass('selected');
		// Mettre à jour la réponse à poster
		if (answer == "10000")
			answer = "+10000";
		$('#_form_etude-revenu').val(answer);
		if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true') {
			this.eulerianStatsConf[stepName]['answers'].set(stepName, answer);
			this.sendEulerianStats(stepName);
		}
		// Passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Répondre à la question "Situation matrimoniale".
	 * @param	answer		Réponse.
	 */
	this.questSituationMatrimoniale = function(answer) {
		var stepName = 'situmat';
		// Gestion des sélections
		$('#_form-question-situmat span._option').removeClass('selected');
		$('#_form-option-situmat-' + answer).addClass('selected');
		// Mettre à jour la réponse à poster
		$('#_form_etude-situmat').val(answer);
		if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true') {
			this.eulerianStatsConf[stepName]['answers'].set(stepName, answer);
			this.sendEulerianStats(stepName);
		}
		// Passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Répondre à la question "Résidence principale : Propriétaire/Locataire ?".
	 * @param	answer		Réponse.
	 */
	this.questResidencePrincipale = function(answer) {
		var stepName = 'proploc';
		// Gestion des sélections
		$('#_form-question-proploc span._option').removeClass('selected');
		$('#_form-option-proploc-' + answer).addClass('selected');
		// Mettre à jour la réponse à poster
		$("#_form_etude-proploc").val(answer);
		if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true') {
	                this.eulerianStatsConf[stepName]['answers'].set(stepName, answer);
	                this.sendEulerianStats(stepName);
		}
		// Passer à l'étape suivante
		formulaire.step.next();
	};
	/** Répondre à la question "Année de naissance". */
	this.stepAnnee = function() {
		var stepName = 'annee_naissance';
		// Cacher les messages d'erreur
		$('#_form_etude-erreur-annee_naissance').removeClass("show").addClass("hide");
		// Vérifier
		formValidated = true;
		if ($('#_form_etude-annee_naissance')[0] &&
			($("#_form_etude-annee_naissance")[0].value.length != 4 || parseInt($("#_form_etude-annee_naissance")[0].value) != $("#_form_etude-annee_naissance")[0].value - 0)) {
			$("#_form_etude-erreur-annee_naissance").removeClass("hide").addClass("show");
			formValidated = false;
		}
		var answer = $("#_form_etude-annee_naissance")[0].value;
		if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true')
			this.eulerianStatsConf[stepName]['answers'].set(stepName, answer);
		// Passer à l'étape suivante
		if (formValidated) {
			if ($('#_btn-validate').attr('data-stats-eulerian-enabled') == 'true')
                		this.sendEulerianStats(stepName);
			// on appelle la fonction deepsight avec le param half car on est à l'étape > 3
			this.deepsight('half');
			formulaire.step.next();
		}
	};
	this.openPopin = function(elementClicked){
		if ($(elementClicked).parents('.devis_etapes #_form-step-1 .selected').length > 0) {
			$(elementClicked).parents('.devis_etapes').addClass('full_screen');
		}
	};

	/* Ajout d'un tag js DEEPSIGHT */
	this.deepsight = function(event) {
		// on met toutes les infos en variables
		var reduction_impots = this.eulerianStatsConf['objectifs_principaux']['answers'].get('reduction_impots');
		var patrimoine = this.eulerianStatsConf['objectifs_principaux']['answers'].get('patrimoine');
		var retraite = this.eulerianStatsConf['objectifs_principaux']['answers'].get('retraite');
		var deces = this.eulerianStatsConf['objectifs_principaux']['answers'].get('deces');
		var revenus = this.eulerianStatsConf['revenus_foyer']['answers'].get('revenus_foyer');
		var date_naissance = this.eulerianStatsConf['annee_naissance']['answers'].get('annee_naissance');
		var num_foyer = this.eulerianStatsConf['personnes_foyer']['answers'].get('personnes_foyer');
		var situmat = this.eulerianStatsConf['situmat']['answers'].get('situmat');
		var proploc = this.eulerianStatsConf['proploc']['answers'].get('proploc');
		var civilite = this.eulerianStatsConf['coordonnees']['answers'].get('civilite');
		var ville = this.eulerianStatsConf['adresse']['answers'].get('ville');
		var code_postal = this.eulerianStatsConf['adresse']['answers'].get('code_postal');

		// on créé un element script
		var s=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
		s.type = "text/javascript";
		s.async = true;
		// on met les vars dans un array
		var ds_vars = {
			client_id: 'rJnRNFGrFA',
			url: window.location.href,
			referrer: window.document.referrer,
			user_agent: window.navigator.userAgent,
			event: event,
			reduc_impot: ((reduction_impots===undefined) ? 'non' : reduction_impots),
			patrimoine: ((patrimoine===undefined) ? 'non' : patrimoine),
			retraite: ((retraite===undefined) ? 'non' : retraite),
			deces: ((deces===undefined) ? 'non' : deces),
			revenus: ((revenus===undefined) ? '' : revenus),
			date_naissance: ((date_naissance===undefined) ? '' : date_naissance),
			num_foyer: ((num_foyer===undefined) ? '' : num_foyer),
			situmat: ((situmat===undefined) ? '' : situmat),
			proploc: ((proploc===undefined) ? '' : proploc),
			civilite: ((civilite===undefined) ? '' : civilite),
			ville: ((ville===undefined) ? '' : ville),
			code_postal: ((code_postal===undefined) ? '' : code_postal)
		};
		var urlParam = [];
		// on créé l'url
		for (var i in ds_vars){
			urlParam.push(encodeURIComponent(i) + "=" + encodeURIComponent(ds_vars[i]));
		}
		// on fini de composer l'URL
		s.src = 'https://sync.deepsight.io/a?' + urlParam.join("&");
		// on insère le script
		s0.parentNode.insertBefore(s,s0);
	};
}
