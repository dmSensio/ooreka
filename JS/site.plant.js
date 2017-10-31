/**
 * Objet de gestion des plantes.
 *
 * @author	Julien Hamrouni <julien.hamrouni@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
site.plant = new function() {
	// contrôleur effectif
	this._controller;
	this._action;
	this._timeOut = null;
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if (controller != 'plante' && controller != 'ebibliotheque')
			return;
		this.period.init(url, controller, action);
		this.comparative.init(url, controller, action);
		// Réduit la taille des zones de texte
		if (controller == 'plante' && action == 'voir') {
			// site.common.reduceSizeForReadMoreTextBoxes(350);
			site.common.initFancyBox();
		}
		if (controller == 'plante' && (action == 'recherche' || action == 'rechercheAlpha')) {
			this.showFilterMobile();
			this.numberFiltersActive();
			this.resizePage();
			this.processTypeOnLoad();
		}
		// initialisation du contrôleur
		this._controller = controller;
		this._action = action;
		// hp plantes : code permettant de fermer les boîtes de sous-types lorsque l'on clique en dehors des boîtes.
		if (controller != 'plante' || action != 'liste')
			return;
		$('#type-tree, #type-shrub, #type-green, #type-flower, #type-edible, ._stopEventPropagation').click(function(event) {
			event.stopPropagation();
		});

		$('._searchCriterion').change(function(){
			site.plant.disabledClimat();
			site.plant.disabledShape();
			site.plant.reloadCountPlant();
		});
	};
	/**
	 * Désactivation ou réactivation des climat en fonction des critères sélectionnés
	 */
	this.disabledClimat = function() {
		if ($('._insideCriterion:checked').length) {
			$('._climat').attr('disabled','disabled');
			$('._climat').parent().addClass('_disable');
		} else {
			$('._climat').removeAttr('disabled');
			$('._climat').parent().removeClass('_disable');
		}
	};/**
	 * Désactivation ou réactivation des climat en fonction des critères sélectionnés
	 */
	this.disabledShape = function() {
		if($('#check-green-climbing:checked').length) {
			$('._shape').attr('disabled','disabled');
			$('._shape').parent().addClass('_disable');
		} else {
			$('._shape').removeAttr('disabled');
			$('._shape').parent().removeClass('_disable');
		}
	};
	/**
	 *  Resize de la page
	 */
	this.resizePage = function() {
		$(window).resize(function() {
			site.common.changePositionTitle('.liste_plante','.resultat_plante');
		});
		site.common.changePositionTitle('.liste_plante','.resultat_plante');
	};
	/** Résultat de recherche chargé dans un élément. */
	this.reloadSearchResult = function() {
		var data = $('#plant-search-form-criteria').serialize();
		//Modification du titre de la recherche par mots clés
		$('#_titleSearchAlpha').html('Vous recherchez une plante précise');
		$('#_jsInputSearchPlante').val('');
		// afficher l'indicateur de chargement
		$('#_search-processing-indicator').show();
		$('#plant-search-result').load('/' + this._controller + '/miniRecherche', data, function() {
			// cacher l'indicateur de chargement
			$('#_search-processing-indicator').hide();
		});
		site.plant.reloadCountPlant();
	};
	/*
	* Gère l'affichage du nombre de filtre actif
	 */
	this.numberFiltersActive = function () {
		var nbFilters = $('#plant-selected-filters').siblings().find('input:checked').length + $('td[class^="_selected"]').length;
		if (nbFilters > 1){
			$('#_filters-number-active').text('Filtres (' + nbFilters + ')');
		} else if(nbFilters == 1){
			$('#_filters-number-active').text('Filtre (' + nbFilters + ')');
		} else{
			$('#_filters-number-active').text('Filtres');
			// Cache le menu Filtre sur mobile
			this.showFilterMobile();
		}
	}
	/**
	 * Gère le changement de nom des 'label' pour les filtres à deux niveaux
	 */
	this.changeNameLabel = function (type) {
		var nameChecked = $(type).siblings('label').attr('data-checked');
		var nameUnchecked = $(type).siblings('label').attr('data-unchecked');
		if (!$(type).is(':checked') || $(type).hasClass('.bt_retour')) {
			// Changement du text du label si case est décoché
			$(type).siblings('label').find('._changeText').text(nameUnchecked);
		} else if ($(type).parents('li').hasClass('elementShow')){
			var text = $(type).parents('.elementShow').children('label').attr('data-checked');
			$(type).parents('.elementShow').find('._changeText').text(text);
		} else{
			$(type).siblings('label').find('._changeText').text(nameChecked);
		}
	}
	/**
	 * Gère le bouton 'retour' sur le moteur pour les filtres à deux niveaux
	 * @param	element	type	Element 'a'
	 * @param	string	id	Identifiant de l'élément contenant les sous-types.
	 */
	this.backListCheckbox = function (type, id) {
		// Supprime les input checker
		$(type).closest('ul').find('input').removeAttr('checked');
		// Cache la sous liste
		$('#' + id).hide();
		// Réaffiche l'ensemble des listes de premier niveau
		$(type).siblings('label').addClass('bt_liste');
		$(type).parent('li').siblings('li').show();
		// Changement du texte du label
		this.changeNameLabel(type);
		// Cache le bouton
		$(type).hide();
		site.plant.disabledClimat();
		if (this._controller == 'plante' && (this._action == 'recherche' || this._action == 'rechercheAlpha'))
			this.reloadSearchResult();
	}
	/**
	 * Gestion de l'affichage des filtres au deuxieme niveau après le chargement de la page
	 */
	this.processTypeOnLoad = function() {
		$('.row_sous_liste').each(function(index,element){
			var filterChecked = $(element).find('input:checked');
			// Si l'élément checker est de niveau 1
			if (filterChecked.siblings('ul').length == 1){
				var elementShow = filterChecked.parent('li');
			}
			// Si l'élément checker est de niveau 2
			else{
				var elementShow = filterChecked.parents('ul').parent('li');
				elementShow.addClass('elementShow');
			}
			elementShow.find('label').removeClass('bt_liste');
			elementShow.siblings().hide();
			elementShow.children('ul').show();
			elementShow.find('.bt_retour').show();
			site.plant.changeNameLabel(filterChecked);
		});
		// Si aucun element checker, le filtre est caché avec l'icone chevron 'close'
		$('.w_full ul:hidden, .w_full table:hidden').each(function(index,element){
			$(element).prev('p').addClass('close');
		});
	}
	/**
	 * Gère le comportement des checkboxes des types et sous-types de plante à partir d'un clic sur un *** type ***.
	 * @param	element	type	Element 'input' du type.
	 * @param	string	id	Identifiant de l'élément contenant les sous-types.
	 */
	this.processTypeChecking = function(type, id) {
		var subtypes = $('#' + id);
		if (!$(type).is(':checked')) {
			// on est en train de décocher la case de type, donc on décoche toutes les cases de sous-types de ce type
			subtypes.find('input').removeAttr('checked');
			// on ferme la box
			subtypes.hide();
			// Retour au premier niveau de choix
			$(type).siblings('label').addClass('bt_liste');
			$(type).siblings('.bt_retour').hide();
			$(type).parent('li').siblings('li').show();
		}
		else{
			subtypes.show();
			// Affichage des sous-types de plantes
			$(type).siblings('label').removeClass('bt_liste');
			$(type).siblings('.bt_retour').show();
			$(type).parent('li').siblings('li').hide();
			// Décoche des elements enfants
			subtypes.find('input').prop('checked',false);
		}
		this.changeNameLabel(type);
	};
	/**
	 * Gère le comportement des checkboxes des types et sous-types de plante à partir d'un clic sur un *** sous-type ***.
	 * @param	element	subtype	Element 'input' du sous-type.
	 * @param	string	type	Type de plante (pour pouvoir exploiter l'identifiant de la liste de sous-types et celui de l'input du type).
	 */
	this.processSubtypeChecking = function(subtype, type) {
		var subtypes = $('#type-' + type);
		$('#check-' + type).removeAttr('checked');
	};
	/**
	 * Supprime un filtre de type ou de sous-type.
	 * @param	int	type	Suffixe de l'identifiant du type.
	 * @param	string	subtype	(optionnel) Suffixe de l'identifiant du sous-type.
	 */
	this.deleteTypeFilter = function(type, subtype) {
		isSubtype = subtype != undefined;
		var id = isSubtype ? subtype : type;
		// on cache le lien cliqué de suppression de filtre
		$('#uncheck-' + id).hide();
		// on décoche le filtre (qu'il soit un type ou un sous-type)
		var element = $('#check-' + id);
		element.removeAttr('checked');
		if (!isSubtype) {
			// cas d'un type : on doit décocher tous ses enfants sous-types et les cacher
			var subtypes = $('#type-' + id);
			subtypes.find('input').removeAttr('checked');
			subtypes.hide();
			// Réaffiche l'ensemble des listes de premier niveau et change le nom du premier niveau
			$(subtypes).siblings('label').addClass('bt_liste');
			$(subtypes).siblings('.bt_retour').hide();
			$(subtypes).parent('li').siblings('li').show();
			this.changeNameLabel(subtypes);
		} else {
			// cas d'un sous-type : on doit vérifier si c'était le seul coché et cacher la liste à laquelle il appartient le cas échéant et décocher la checkbox de son type
			var subtypes = $('#type-' + type);
			if (subtypes.find('input:checkbox:checked').length == 0) {
				subtypes.hide();
				$('#check-' + type).removeAttr('checked');
				// Réaffiche l'ensemble des listes de premier niveau et change le nom du premier niveau
				$(subtypes).siblings('label').addClass('bt_liste');
				$(subtypes).siblings('.bt_retour').hide();
				$(subtypes).parent('li').siblings('li').show();
				this.changeNameLabel(subtypes);
			}
		}
		// on recharge la liste des fiches plante (car l'évènement "onchange" du formulaire ne se déclenche pas ici)
		this.reloadSearchResult();
	};
	/**
	 * Supprime un filtre.
	 * @param	string	id	Suffixe de l'identifiant de l'élément à décocher.
	 */
	this.deleteFilter = function(id) {
		// on cache le lien cliqué de suppression de filtre
		$('#uncheck-' + id).hide();
		// on décoche le filtre
		$('#check-' + id).removeAttr('checked');
		// on recharge la liste des fiches plante (car l'évènement "onchange" du formulaire ne se déclenche pas ici)
		this.reloadSearchResult();
	};
	/**
	 * Supprime tous les filtres.
	 * @param	string	id	Suffixe de l'identifiant de l'élément à décocher.
	 */
	this.deleteAllFilters = function() {
		// masquage de tous les liens de suppression de filtres
		$('#plant-selected-filters li').hide();
		// on décoche tous les filtres
		$('#plant-search-form-criteria input:checkbox').removeAttr('checked');
		if (window.innerWidth >= 900){
			$('#plant-selected-filters').hide();
		} else{
			this.showFilterMobile();
		}
		// on désactive toutes les cases des calendriers
		this.period.deleteFilter('planting', '1');
		this.period.deleteFilter('flowering', '2');
		this.period.deleteFilter('harvest', '3');
		this.period.deleteFilter('cutting', '4');
		// on recharge la liste des fiches plante
		this.reloadSearchResult();
		this.numberFiltersActive();
	};
	/**
	 * Gestion de l'affichage des filtres sur mobile
	 */
	this.showFilterMobile = function() {
		if (window.innerWidth <= 900){
			var nbFilters = $('#plant-selected-filters').siblings().find('input:checked').length;
			// On cache l'ensemble des filtres
			$('#_filters-title').toggleClass('close');
			$('#_filters-title').nextAll().toggle();
			$('#_filters-title').parent().nextAll('div').toggle();
			if ( nbFilters == 0){
				$('#delete-all-filters').hide();
			}
			// Affiche ou non du bouton pour cacher les filtres
			if ($('#_filters-title').hasClass('close')){
				$('#_btCloseFilters').hide();
			} else {
				$('#_btCloseFilters').show();
			}
			// Gestion de l'affichage si le choix des filtres est ouvert.
			$('.w_full ul:visible, .w_full table:visible').each(function(index,element){
				$(element).prev('p').removeClass('close');
				if ($(element).find('input:checked').length == 0) {
					$(element).prev('p').trigger('click');
				}
			});
		}
	}
	/* ****** Méthodes pour les plantes utilisées dans les pages résultat de recherche de l'ebibliothèque ****** */
	/** Affiche les filtres dans les pages résultat de recherche plantes de l'ebibliothèque. */
	this.ebiblioShowFilters = function() {
		$('#_ebiblio-show-filters').hide();
		$('#_ebiblio-hide-filters').show();
		$('._ebiblioCriteriaSearch').slideDown();
	};
	/** Cache les filtres dans les pages résultat de recherche plantes de l'ebibliothèque. */
	this.ebiblioHideFilters = function() {
		$('#_ebiblio-show-filters').show();
		$('#_ebiblio-hide-filters').hide();
		$('._ebiblioCriteriaSearch').slideUp();
	};
	/**
	 * Gestion des checkbox en double dans la HP de la recherche de plante.
	 * Permet de cocher une checkbox equivalent à ce qui à été cliqué
	 *
	 * @param  HTMlElement 	element        		L'élément sur lequel le clic à eu lieu
	 * @param  string 		idInputAModifier	L'id de l'input qui doit être validé en même temps.
	 * @return void
	 */
	this.gestionBlocUniquementPlantes = function (element, idInputAModifier) {
		if ($(idInputAModifier).length == 0) { return; }
		if ($(element).attr('checked') == 'checked') {
			$(idInputAModifier).attr('checked', 'checked');
		}
		else {
			$(idInputAModifier).removeAttr('checked');
		}
	}
	/**
	 * Transmission des données du bloc de bas de page plante à la page plante/liste
	 */
	this.getSearchCriteria = function () {
		var serializeData = $('form#plant-search-form-criteria-home').serialize();
		document.location.href = 'https://jardinage.ooreka.fr/plante/liste/' + serializeData + '#fromSearchBox';
	}
	/**
	 * Apparition d'une info bulle
	 */
	this.toggleTooltips = function(element) {
		if ($(element).find('span').is(':visible')) {
			$(element).find('span').hide();
		} else {
			$('.bulle_info span').hide();
			$(element).find('span').show();
		}
	}
	/**
	 * Disparition d'une info bulle avec un timeout
	 */
	this.showTooltips = function(element) {
		if (this._timeOut == null) {
			this._startTimeout(element, 1500);
		} else {
			clearTimeout(this._timeOut);
			this._startTimeout(element, 1500);
		}
	};
	/**
	 * Interrompre le timeout
	 */
	this.stopTimeout = function () {
		clearTimeout(this._timeOut);
		$('._informationTooltips').hide();
	}
	/**
	 * Gestion de l'option Toggle sur les critères lorsque qu'on est en responsive ou sur la page de recherche
	 */
	this.toggleCriterion = function (element) {
		if ($(window).width() <= 500 || this._action == 'recherche' || this._action == 'rechercheAlpha') {
			$(element).siblings('ul,a,table').toggle();
			$(element).toggleClass('close');
		}
	}
	/**
	* Gestion des checkbox avec un seul critère sélectionnable
	 */
	this.oneCheckboxValue = function (element) {
		var input = $(element).parents('ul').find('input:checkbox');
		$(input).not(element).prop('checked',false);
	}
	/**
	 * Envoi du formulaire de recherche de la page d'accueil.
	 */
	this.sendFormPlantSearch = function(){
		if ($('#_countPlants').val() > 0){
			$('#plant-search-form-criteria').submit();
		}
	}
	/** Comptage dynamique des plantes */
	this.reloadCountPlant = function() {
		this.period.addHiddenValues();
		var data = '';
		$('input._searchCriterion:hidden:checked').each(function(){
			data += $(this).attr('name')+'=' + $(this).val() + '&';
		});
		// afficher l'indicateur de chargement
		$('#_search-processing-indicator').show();
		$.getJSON('/' + this._controller + '/reloadCountPlant?' + data, function(res) {
			if (res > 1) {
				$('._nbrPlants').html('Et hop !&nbsp;' + res + '&nbsp;plantes vous correspondent');
				$('._nbrPlantsRes').html('Voir les&nbsp;' + res + '&nbsp;résultats');
				$('.barre_fixe_resultat a').removeClass('_noResult');
			} else if (res == 1) {
				$('._nbrPlants').html('Et hop !&nbsp;' + res + '&nbsp;plante vous correspond');
				$('._nbrPlantsRes').html('Voir le&nbsp;' + res + '&nbsp;résultat');
				$('.barre_fixe_resultat a').removeClass('_noResult');
			} else{
				$('._nbrPlants').html('Oh oh !');
				$('._nbrPlantsRes').html('Aucun résultat');
				$('.barre_fixe_resultat a').addClass('_noResult');
			}
			$('#_countPlants').val(res);
			// Affichage de la pop si on a moins de 20 résultats et qu'on ne l'a jamais affichée
			if ($('#_countPlants').val() == 0){
				$('#_criteriaAlert').show();
				$('#_titleAlert').html('Vous avez sélectionné trop de critères et il n&apos;y a plus de résultats.');
				$('#_nbResult').hide();
				$('#_goBackAlert').html('Retour');
				$('#_showCriteriaAlert').val(0);

			} else if ($('#_countPlants').val() < 20 && $('#_showCriteriaAlert').val() == 1) {
				var nbCriterion = $('input._searchCriterion:hidden:checked').length;
				$('#_criteriaAlert').show();
				var resText = "";
				if (res == 1)
					resText = res + "&nbsp;résultat";
				else
					resText =  res + "&nbsp;résultats";
				if (nbCriterion == 1) {
					$('#_titleAlert').html('Vous avez déjà sélectionné&nbsp;' + nbCriterion + '&nbsp;critère et il n&apos;y a plus que&nbsp;' + resText);
				} else {
					$('#_titleAlert').html('Vous avez déjà sélectionné&nbsp;' + nbCriterion + '&nbsp;critères et il n&apos;y a plus que&nbsp;' + resText);
				}
				if (res != 1)
					$('#_nbResult').html('Voir les&nbsp;' + resText);
				else
					$('#_nbResult').html('Voir le résultat');
				$('#_showCriteriaAlert').val(0);
			}

		});
	};
	/* *************** METHODES PRIVEES ************* */
	this._startTimeout = function(element, time) {
		this._timeOut = setTimeout(function() {
			$('._informationTooltips').hide();
			$(element).find('._informationTooltips').show();
			site.plant._timeOut = null;
		}, time);
	}
};
