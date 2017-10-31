/**
 * Objet de gestion des périodes de plantation, floraison, récolte, taille.
 *
 * @author	Julien Hamrouni <julien.hamrouni@yahoo.fr>
 * @copyright	© 2013, Fine Media
 */
site.plant.period = new function() {
	/** Calendriers (semence, floraison, récolte, taille) */
	this._calendars = [null, new Hash(), new Hash(), new Hash(), new Hash()];
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
	};
	/**
	 * Initialise le calendrier logiquement.
	 * @param	int 	calendarNum	Numéro de calendrier.
	 * @param	string	months		Mois séparés par des virgules.
	 */
	this.initCalendar = function(calendarNum, months) {
		if (!months)
			return;
		var monthList = months.split(',');
		if (!monthList)
			return;
		for (var i = 0; i < monthList.length; i++)
			this._calendars[calendarNum].set(monthList[i], monthList[i]);
	};
	/**
	 * Inverse la sélection de la case courante du calendrier courant.
	 * @param	Element	this		Élement courant.
	 * @param	string	classNum	Numéro de la classe de l'élément.
	 * @param	int	month		Numéro du mois correspondant.
	 * @param	bool	submitForm	Indique si on envoie le formulaire ou pas, suite au clic (sert pour les filtres à gauche de la recherche).
	 */
	this.invertPeriodSelection = function(element, classNum, month, submitForm) {
		var jElement = $(element);
		if (jElement.hasClass("_selected" + classNum)) {
			// suppression graphique
			jElement.removeClass("_selected" + classNum);
			// suppression logique
			this._calendars[classNum].set(month, null);
		} else {
			// ajout graphique
			jElement.addClass("_selected" + classNum);
			// ajout logique
			this._calendars[classNum].set(month, month);
		}
		/*this.addHiddenValues();*/
		site.plant.reloadCountPlant();
		if (submitForm) {
			site.plant.reloadSearchResult();
		}
	};
	/**
	 * Efface le calendrier (suite à la  suppression d'un filtre de calendrier).
	 * @param	string	type		Type de calendrier ('planting', 'flowering', 'hRedarvest', 'cutting').
	 * @param	string	classNum	Numéro de la classe de l'élément.
	 */
	this.deleteFilter = function(type, classNum) {
		$('#uncheck-period-' + type).hide();
		$('#uncheck-period-' + type  + ' input').removeAttr('checked');
		this._calendars[classNum] = new Hash();
		$('table#table-' + type + '-period tr td').removeClass('_selected' + classNum);
		// on recharge la liste des fiches plante
		site.plant.reloadSearchResult();
	};
	/** Ajoute les valeurs des périodes (de plantation, floraison, ...) cochées dans les champs 'hidden' prévus à cet effet. */
	this.addHiddenValues = function() {
		$("#planting-period").val(this._calendars[1].implode(","));
		if ($("#planting-period").val() != '') {
			$("#planting-period").attr('checked', 'checked');
		}
		$("#flowering-period").val(this._calendars[2].implode(","));
		if ($("#flowering-period").val() != '') {
			$("#flowering-period").attr('checked', 'checked');
		}
		$("#harvest-period").val(this._calendars[3].implode(","));
		if ($("#harvest-period").val() != '') {
			$("#harvest-period").attr('checked', 'checked');
		}
		$("#cutting-period").val(this._calendars[4].implode(","));
		if ($("#cutting-period").val() != '') {
			$("#cutting-period").attr('checked', 'checked');
		}
	};
};
