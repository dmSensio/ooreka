/**
 * Objet de gestion des médicaments.
 *
 * @author	Dorian Yahouédéou <dorian.yahouedeou@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
site.medicament = new function() {

	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if(controller == 'medicament' && action == '' ){
			if ($(window).width() <= 800){
				this.searchButtonFixed();
			}
		} else if(controller == 'medicament' && action == 'voir'){
			this.changeBlocPosition();
			this.resizePage();
		} else if(controller =='medicament' && action == 'rechercher')
			this.filtersNumberActive();
	};
	/**
	 *  Resize de la page
	 */
	this.resizePage = function() {
		$(window).resize(function() {
			site.medicament.changeBlocPosition();
		});
		this.changeBlocPosition();
	};
	/* ******************* GESTION DE LA RERCHERCHE *********************** */
	/** Rechercher par nom */
	this.search = function() {
		// # Déterminer le type de recherche : "recherche totale" ou "filtrage par le champ 'nom médicament, substance, indication'"
		var filter = $('#_search_filter-active').is(':checked');
		// # Si le filtre est actif, recherche avec filtre sur le texte
		if (filter) {
			// filtrer sur le champ texte principal
			this.processFilter($('#_search-keywords'));
		} else {
		// # Nouvelle recherche, sans filtres
			// récupérer la chaine pour la nouvelle recherche
			var queryString = $('#_search-keywords').val();
			// vérification des prérequis
			if ($.trim(queryString) == '')
				return (false);
			// lancer la recherche
			window.location.href = '/medicament/rechercher?searchKeywords=' + queryString;
			return (false);
		}
	};
	/** Indique le nombre de filtres selectionnés */
	this.filtersNumberActive = function(){
		// Nombre de filtre actif
		var numberFilterActive = $('#_filters-summary-list li:visible').length;
		// Affiche le nombre de filtre selectionné + le bt filtre fixe sur mobile
		if (numberFilterActive > 0){
			$('._filters-number-active').text('(' + numberFilterActive + ')');
			if ($(window).width() <= 800){
				$('.filtre_bouton > span:first-of-type').hide();
				$('.filtre_bouton > span:last-of-type').show();
				$('._menuFiltre').toggleClass('open');
			}
		} else if(numberFilterActive == 0 && $(window).width() <= 800){
			$('.filtre_bouton > span:first-of-type').show();
			$('.filtre_bouton > span:last-of-type').hide();
		}
	}
	/** Affiner la recherche en utilisant les critères disponibles. */
	this.searchRefine = function() {
		// récupérer les filtres sélectionnés
		var data = $('#_search-refine').serialize();
		var sort = $('#_search-sort').val();
		if (typeof(sort) == 'undefined')
			sort = 'na';
		// compléter avec le critère de tri courant
		data = data + '&sort=' + sort;
		// afficher l'indicateur de chargement
		$('#_search-processing-indicator').show();
		$('#_search-results').load('/medicament/affiner', data, function() {
			// cacher l'indicateur de chargement
			$('#_search-processing-indicator').hide();
		});
		this.filtersNumberActive();
	};
	/**
	 * Gérer la sélection/déselection d'un filtre et les actions liées (mise à jour du résumé, affinage des résultats).
	 * @param	object		filterObject	Objet représentant un champ de recherche.
	 */
	this.processFilter = function(filterObject) {
		// déterminer le type du filtre
		var filterType = $(filterObject).attr('type');
		if (filterType === 'checkbox') {
			// composer l'identifiant du filtre
			var filterCode = this.getFilterCode(filterObject);
			// cas : filtre activé
			if ($(filterObject).is(':checked')) {
				// élément parent existant ?
				if ($(filterObject).attr('data-group')) {
					// cocher le parent dans l'affinage
					$('#_check_' + $(filterObject).attr('data-group')).attr('checked', 'checked');
					this.processFilter($('#_check_' + $(filterObject).attr('data-group')));
				}
				if ($(filterObject).attr('data-has-children')) {
					// ouvrir le groupe de formes
					this.toggleGroup(filterCode);
				}
				// résumé : afficher le filtre
				this.setFilterVisibility(filterCode, true);
			} else {
			// cas : filtre désactivé
				// éléments enfants existants ?
				if ($(filterObject).attr('data-has-children')) {
					// refermer le groupe de formes
					this.toggleGroup(filterCode);
					// décocher chaque élément enfant
					$("#_children_" + $(filterObject).attr('data-name') + " ._" + $(filterObject).attr('data-name')).each(function() {
						$(this).removeAttr('checked');
						site.medicament.setFilterVisibility(site.medicament.getFilterCode(this), false);
					});
				}
				// résumé : cacher dans le résumé
				this.setFilterVisibility(filterCode, false);
			}
		} else if (filterType === 'text') {
			// récupérer le mot-clef additionnel de recherche dans le champ principal
			var keywordAdditionnal = $(filterObject).val();
			if (keywordAdditionnal == '')
				return;
			var filterCode = this.getFilterCode(filterObject);
			// cloner le filtre souche
			var newAdditionalKeyword = $("#_label_" + filterCode).clone();
			// configurer le nouveau filtre
			// déterminer un identifiant aléatoire
			var randomValue = Math.floor(Math.random() * 10000);
			// élément de la liste
			$(newAdditionalKeyword).attr('id', $(newAdditionalKeyword).attr('id').replace(/randomKey/, randomValue));
			// paramétrer la case à cocher (id, data-name, value)
			$(newAdditionalKeyword).find('input:checkbox').attr('id', $(newAdditionalKeyword).find('input:checkbox').attr('id').replace(/randomKey/, randomValue));
			$(newAdditionalKeyword).find('input:checkbox').attr('data-name', 'elt-' + randomValue);
			$(newAdditionalKeyword).find('input:checkbox').attr('checked', 'checked');
			$(newAdditionalKeyword).find('input:checkbox').val(keywordAdditionnal);
			// paramétrer le texte du label
			$(newAdditionalKeyword).find('#_text_' + filterCode).text(keywordAdditionnal).attr('id', $(newAdditionalKeyword).find('#_text_' + filterCode).attr('id').replace(/randomKey/, randomValue));
			// ajouter l'élément dans le dom
			$(newAdditionalKeyword).removeClass('hide').addClass('show').appendTo('#_filters-summary-list');
			// vider le champ principal
			$(filterObject).val('');
			this.setSummaryVisibility(true);
		}
		// mettre à jour les résultats
		this.searchRefine();
	};
	/**
	 * Afficher/Cacher un sous-groupe de formes pour une voie donnée.
	 * @param	object		filterCode	Code de la voie.
	 */
	this.toggleGroup = function(filterCode) {
		if ($('#_check_' + filterCode).is(':checked'))
			$('#_children_' + filterCode).removeClass('hide').addClass('show');
		else
			$('#_children_' + filterCode).removeClass('show').addClass('hide');
	};
	/** Supprimer les filtres actifs et relancer la recherche initiale de façon asynchone. */
	this.clearFilters = function() {
		// mémoriser les mots-clefs initiaux
		var mainSearchKeywords = $('#_search-keywords_main').val();
		// décocher toutes les cases du formulaire
		$(':input','#_search-refine').not(':button, :submit, :reset, :hidden').removeAttr('checked').removeAttr('selected');
		// résumé des filtres
		// 	cacher tous les éléments du résumé
		$('#_filters-summary-list li').removeClass('show').addClass('hide');
		//	cacher le résumé
		this.setSummaryVisibility(false);
		// repositionner les mots-clefs initiaux mémorisés pour la futur recherche
		$('#_search-keywords_main').val(mainSearchKeywords);
		// relancer la recherche uniquement avec la chaîne de recherche initiale
		this.searchRefine();
	};
	/**
	 * Supprimer un filtre donné et relancer la recherche.
	 * @param	object		filterObject	Objet représentant un champ de recherche.
	 */
	this.deleteFilter = function(filterObject) {
		var filterCode = this.getFilterCode(filterObject);
		// cas d'un filtre de type texte
		if ($(filterObject).attr('data-type-override') === 'text') {
			// vider le champ de l'affinage principal
			$("#_" + $(filterObject).attr('data-name')).val('');
		} else {
		// cas d'un filtre de type checkbox
			// décocher la case correspondante de l'affinage principal
			$("#_check_" + filterCode).removeAttr('checked');
			// cas d'un filtre parent
			if ($(filterObject).attr('data-has-children') === 'true') {
				// décocher la case correspondante de l'affinage principal
				$('#_filters ._' + $(filterObject).attr('data-name')).removeAttr('checked');
				// cacher les éléments fils dans le résumé
				$('#_filters-summary ._' + $(filterObject).attr('data-name')).removeClass('show').addClass('hide');
			}
		}
		// cacher l'élément courant dans le résumé
		this.setFilterVisibility(filterCode, false);
		// relancer l'affinage
		this.searchRefine();
	};
	/**
	 * Supprimer un filtre donné et relancer la recherche.
	 * @param	object		filterObject	Objet représentant un champ de recherche.
	 * @return	string		string		Code du filtre.
	 */
	this.getFilterCode = function(filterObject) {
		if ($(filterObject).attr('data-group'))
			var filterCode = $(filterObject).attr('data-group')  + '_' + $(filterObject).attr('data-name');
		else
			var filterCode = $(filterObject).attr('data-name');
		return (filterCode);
	};
	/**
	 * Gérer la visibilité du filtre dans le résumé des filtres actifs.
	 * @param	string		filterCode	Code du filtre à prendre en compte.
	 * @param	bool		visible		Indique si le filtre doit être activé ou non.
	 */
	this.setFilterVisibility = function(filterCode, visible) {
		if (visible) {
			// afficher l'encart de résumé
			this.setSummaryVisibility(true);
			// afficher le label correspondant au filtre dans le résumé
			$("#_label_" + filterCode).removeClass("hide").addClass("show");
			// cocher la case équivalente dans l'affinage
			$("#_check-label_" + filterCode).attr('checked', 'checked');
		} else {
			// cacher le label dans le résumé des filtres
			$("#_label_" + filterCode).removeClass('show').addClass('hide');
			// décocher la case équivalente dans l'affinage principal
			$("#_check-label_" + filterCode).removeAttr('checked');
			// déterminer si il faut cacher le résumé des filtres (si aucun filtre n'est actif)
			if ($('#_filters-summary-list').find('li:visible').length == 0) {
				this.setSummaryVisibility(false);
			}
		}
	};
	/**
	 * Gérer la visibilité du résumé des filtres.
	 * @param	bool		visible		Indique si le résumé doit être affiché ou non.
	 */
	this.setSummaryVisibility = function(visible) {
		if (visible) {
			$('#_filters-summary-list').removeClass('hide').addClass('show');
			$('#_filters-summary-title').removeClass('hide').addClass('show');
			$('#_action_clear-filters').removeClass('hide').addClass('show');
		} else {
			$('#_filters-summary-list').removeClass('show').addClass('hide');
			$('#_filters-summary-title').removeClass('show').addClass('hide');
			$('#_action_clear-filters').removeClass('show').addClass('hide');
		}
	};

	/* ******************* GESTION EVENEMENTS PAGE D'ACCUEIL ****************** */
	/**
	 * Gestion de la sélection de filtres sur la page d'accueil.
	 * @param	object		filterObject	Objet représentant un champ de recherche.
	 */
	this.processHomepageFilter = function(filterObject) {
		var nbInputChecked = $('form input:checked').length;
		if (nbInputChecked == 1 ) {
			$('#_bt_sendForm').text('Rechercher avec ce filtre');
			$('._bt_fixe').text('Rechercher avec ce filtre');
		} else if (nbInputChecked > 1){
			$('#_bt_sendForm').text('Rechercher avec ces '+ nbInputChecked + ' filtres');
			$('._bt_fixe').text('Rechercher avec ces '+ nbInputChecked + ' filtres');
		} else{
			$('#_bt_sendForm').text('Rechercher');
			$('._bt_fixe').text('Rechercher');
		}
	};
	/**
	 * Envoi du formulaire de recherche de la page d'accueil.
	 */
	this.sendFormMedicament = function(){
		if ($('#_search-keywords').val() == ''){
			$('#_search-keywords').addClass('erreur_recherche');
			setTimeout(function(){
				$('#_search-keywords').removeClass('erreur_recherche');
			},2500);
			return (false);
		} else {
			$('#search-form-main').submit();
		}
	}
	/**
	 * Gestion du bouton "Rechercher" en position fixe sur mobile
	 */
	this.searchButtonFixed = function(){
		$(window).bind('scroll touchmove', function() {
			var positionButtonFixe = $('._bt_fixe').offset().top;
			var positionButtonForm = $('#_bt_sendForm').offset().top;
			if (positionButtonFixe > positionButtonForm && !$('._bt_fixe').hasClass('hide'))
				$('._bt_fixe').addClass('hide');
			else if(positionButtonFixe < positionButtonForm && $('._bt_fixe').hasClass('hide'))
				$('._bt_fixe').removeClass('hide');
		});
	}
	/* ******************* GESTION BOITE DE RECHERCHE ************************* */
	/**
	 * Aller à la page d'accueil pour une recherche avancée.
	 * @param	int	idSearchBox	Identifiant de la boite de recherche.
	 */
	this.goToAdvancedSearchFromBox = function(idSearchBox) {
		// aller à la page d'accueil avec pré-remplissage de la chaine de recherche
		if ($.trim($('#_search-keywords-' + idSearchBox).val()) != '')
			window.location.href = '/medicament?searchKeywords=' + $('#_search-keywords-' + idSearchBox).val();
		else {
		// sinon aller à la page d'accueil sans pré-remplissage
			window.location.href = '/medicament';
		}
	};
	/**
	 * Lance la recherche depuis la boite.
	 * @param	int	idSearchBox	Identifiant de la boite de recherche.
	 */
	this.searchFromBox = function(idSearchBox) {
		if ($.trim($('#_search-keywords-' + idSearchBox).val()) == '')
			return (false);
		// lancer la recherche
		window.location.href = '/medicament/rechercher?searchKeywords=' + $('#_search-keywords-' + idSearchBox).val();
	};
	/* ******************* GESTION PAGE 1 MEDICAMENT ************************* */
	/**
	 * Affiche le titre et le bloc MAJ au dessus du sommaire sur mobile
	 */
	this.changeBlocPosition = function() {
		var blocClone = $('._changeBlocPosition').clone();
		var initialBloc = $('._changeBlocPosition');

		if (window.innerWidth <= 900){
			$('.contenu_nav_gauche').prepend(blocClone);
			blocClone.addClass('_blocChangedMobile');
			initialBloc.remove();
		}
		else if(window.innerWidth > 900){
			if($('.contenu_nav_gauche ._changeBlocPosition').hasClass('_blocChangedMobile')){
				$('.w_3_4.article').prepend($('.contenu_nav_gauche ._changeBlocPosition'));
				$('._changeBlocPosition').removeClass('_blocChangedMobile');
			}
		}
	}
	/**
	 * Affiche/cache les informations sur une indication donnée.
	 * @param	int	indicationId	Identifiant de l'indication cible.
	 */
	this.toggleIndicationsDetails = function(id) {
		if ($("#_indication-" + id).is(":hidden")) {
			$("#_indication-" + id).slideDown();
			$("._puce-indication-" + id).removeClass('plus_med').addClass('moins_med');
		} else {
			$("#_indication-" + id).slideUp();
			$("._puce-indication-" + id).removeClass('moins_med').addClass('plus_med');
		}
	};
	/**
	 * Affiche/cache les informations sur des précautions particulières.
	 * @param	string	precautionType		Type de précaution.
	 */
	this.togglePrecautionsDetails = function(type) {
		if ($("#_precautionDetails-" + type).is(":hidden")) {
			$("#_precautionDetails-" + type).slideDown();
		} else {
			$("#_precautionDetails-" + type).slideUp();
		}
	};
	/**
	 * Affiche/cache les informations d'une recommandation donnée.
	 * @param	int	recommandationPos	Index de la recommandation SMR cible.
	 */
	this.toggleRecommandationSMRDetails = function(recommandationPos) {
		$("#_recommandationSMRDetails-" + recommandationPos).toggle();
	};
	/**
	 * Affiche/cache les informations d'une recommandation donnée.
	 * @param	int	recommandationPos	Index de la recommandation ANSM cible.
	 */
	this.toggleRecommandationANSMDetails = function(recommandationPos) {
		$("#_recommandationANSMDetails-" + recommandationPos).toggle();
	};
};
