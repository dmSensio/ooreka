/**
 * Objet de gestion du comparatif de plantes.
 *
 * @author	Julien Hamrouni <julien.hamrouni@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
site.plant.comparative = new function() {
	this._nbrPlants;
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if (controller != 'plante')
			return;
                if (action == 'recherche' || action == 'rechercheAlpha') {
			// boîte d'avertissement
                        $('#_comparativeFullSelection').dialog({
                                disabled:       true,
                                width:          600,
                                height:         'auto',
                                modal:          true,
                                draggable:      false,
                                resizable:      false,
                                closeText:      'Fermer',
                                title:         'Comparatif'
                        });
			$('#_comparativeFullSelection').dialog('close');
		}

	};
	/** Cache / affiche les critères identiques de plantes comparées */
	this.processEquals = function() {
		$('._sameValues').toggle();
	};
	/**
	 * Cache une plante du comparatif (impression de suppression pour l'utilisateur).
	 * @param	int	id	Identifiant de la plante.
	 */
	this.hide = function(id) {
		// "suppression" de la colonne
		$('._plantColumn' + id).hide();
		// gestion de la classe permettant d'agir en css sur les colonnes restantes
		this.setNbrPlants(this._nbrPlants - 1);
		if (this._nbrPlants <= 0)
			return;
		$('#_comparative-table').removeClass('_planteColonne2')
		     .removeClass('_planteColonne3')
		     .removeClass('_planteColonne4')
		     .removeClass('_planteColonne5')
		     .addClass('_planteColonne' + this._nbrPlants);
	};
	/** Ouvre la div de comparatif. */
	this.open = function() {
		$('#_comparativeFullSelection').dialog('close');
		// récupération des identifiants
		var ids = $('._selectedPlant:checked').map(function() {
			return (this.value ? this.value : null);
		}).get();
		if (ids.length <= 1 || ids.length > 5)
			return;
		ids = 'plantIds[]=' + ids.join('&plantIds[]=');
		document.open('/plante/comparatif?' + ids, "Comparatif", "width=" + screen.width + ",height=" + screen.height + ",directories=no,menubar=no,toolbar=no,scrollbars=yes");

	};
	/** Ferme les div d'avertissement et de comparatif. */
	this.close = function() {
		$('#_comparativeFullSelection').dialog('close');
	};
	/**
	 * Teste si le nombre de plantes sélectionnées ne dépasse pas 5.
	 * @param	element	checkbox	Checkbox cochée, décochée.
	 */
	this.verifyCheckboxes = function(checkbox) {
		if ($('._selectedPlant:checked').length > 5) {
			$(checkbox).removeAttr('checked');
			$('#_comparativeFullSelection').dialog('open');
		}
	};
	/**
	 * Affecte le nombre de plantes à comparer.
	 * @param	int	nbrPlants	Nombre de plantes.
	 */
	this.setNbrPlants = function(nbrPlants) {
		this._nbrPlants = nbrPlants;
	};
	/** Récupère le nombre de plantes à comparer. */
	this.getNbrPlants = function() {
		return (this._nbrPlants);
	};
};
