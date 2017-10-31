/**
 * Objet de gestion de la catégorisation des questions.
 *
 * @author	Julien Hamrouni <julien.hamrouni@finemedia.fr>
 * @copyright	© 2011, Fine Media
 * @package	FineCommon
 * @subpackage	question
 */

site.question.categories = new function() {
	/** Liste des identifiants des catégories 3 choisies pour le contenu. */
	this._chosenCategories = new Hash();

	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
	};
	/**
	 * Charge les catégories 1 dans un select.
	 * @param	HTMLSelectElement	select	Elément "select".
	 */
	this.loadCategories1 = function(select) {
		$.getJSON("/categories/list", function(data) {
			var html = '';
			$.each(data, function(i, item) {
				if (item.name.length > 0) {
					html += '<option value="' + item.id + '">' + item.name + '</option>';
				}
			});
			// mise en place des valeurs
			$(select).append(html);
		});
	};
	/**
	 * Charge les catégories 2 d'une catégorie 1 donnée en paramètre.
	 * @param	HTMLSelectElement	select	Elément "select".
	 * @param	string			suffix	Suffix appliqué aux identifiants des éléments.
	 */
	this.loadCategories2 = function(select, suffix) {
		var id1 = select.value;
		if (id1 == "Choisissez")
			return;
		// pour atteindre la div arrière-grand-parente du select
		var select1 = $(select);
		var line = select1.parent().parent().parent();
		var category1 = select1.find("option:selected");
		var category1Name = category1.html();
		var selectStr = "";
		$.getJSON("/categories/list/" + id1, function(data) {
			selectStr += '<select name="categories2" onchange="site.question.categories.loadCategories3(' + id1 + ', this, ' + suffix + ')"><option>Choisissez</option>';
			$.each(data, function(i, item) {
				if (item.name.length > 0) {
					selectStr += '<option value="' + item.id + '">' + item.name + '</option>';
				}
			});
			selectStr += "</select>";
			// mise en place des valeurs
			var categories2 = $(line).find("._categories2");
			var select2 = categories2.find("._select");
			select2.html(selectStr);
			var text1 = $(line).find("._categories1 ._text");
			var textStr = '<a onclick="site.question.categories.reselect(this, ' + suffix + '); return false;">' + category1Name + '</a>';
			text1.html(textStr);
			// gestion de l'affichage
			select1.parent().hide();
			text1.show();
			select2.show();
			categories2.show();
		});
	};
	/**
	 * Charge les catégories 3 d'une catégorie 2 donnée en paramètre.
	 * @param	int			id1	Identifiant de la catégorie 1.
	 * @param	HTMLSelectElement	select	Elément "select".
	 * @param	string			suffix	Suffix appliqué aux identifiants des éléments.
	 */
	this.loadCategories3 = function(id1, select, suffix) {
		var id2 = select.value;
		if (id2 == "Choisissez")
			return;
		// pour atteindre la div arrière-grand-parente du select
		var select2 = $(select);
		var line = select2.parent().parent().parent();
		var category2 = select2.find("option:selected");
		var category2Name = category2.html();
		var selectStr = "";
		var thisClone = this;
		$.getJSON("/categories/list/" + id1 + "/" + id2, function(data) {
			selectStr += '<select name="categories3" onchange="site.question.categories.processCategory3(this, ' + suffix + ');"><option>Choisissez</option>';
			$.each(data, function(i, item) {
				if (item.name.length > 0) {
					if (thisClone._chosenCategories.get(item.id))
						return (true);
					selectStr += '<option value="' + item.id + '">' + item.name + '</option>';
				}
			});
			selectStr += "</select>";
			// mise en place des valeurs
			var categories3 = $(line).find("._categories3");
			var select3 = categories3.find("._select");
			select3.html(selectStr);
			var text2 = $(line).find("._categories2 ._text");
			var textStr = '<a onclick="site.question.categories.reselect(this, ' + suffix + '); return false;">' + category2Name + '</a>';
			text2.html(textStr);
			// gestion de l'affichage
			select2.parent().hide();
			text2.show();
			select3.show();
			categories3.show();
		});
	};
	/**
	 * Ajoute une catégorie 3 au contenu UGC.
	 * @param       int     id      Identifiant de la catégorie 3.
	 * @param       string  name    Nom de la catégorie.
	 * @param	string	suffix	Suffix appliqué aux identifiants des éléments.
	 */
	this.assignCategory3 = function(id, suffix) {
		if (suffix) {
			if (!window['chosenCategories' + suffix])
				window['chosenCategories' + suffix] = new Hash();
			if (window['chosenCategories' + suffix].get(id))
				return;
		} else if (this._chosenCategories.get(id)) {
			//this.unassignCategory3(id);
			return;
		}
		var selectedCategoriesVar = suffix ? "#selectedCategories-" + suffix : "#selectedCategories" ;
		if (suffix) {
			window['chosenCategories' + suffix].set(id, id);
			var tempChosenCategories = window['chosenCategories' + suffix];
		} else {
			this._chosenCategories.set(id, id);
			var tempChosenCategories = this._chosenCategories;
		}
		$(selectedCategoriesVar).val(tempChosenCategories.implode(","));
	};
	/**
	 * Retire une catégorie 3 du contenu UGC.
	 * @param       int     id      Identifiant de la catégorie 3.
	 * @param	string	suffix	Suffix appliqué aux identifiants des éléments.
	 */
	this.unassignCategory3 = function(id, suffix) {
		if (suffix) {
			window['chosenCategories' + suffix].set(id, null);
			var selectedCategoriesVar = "#selectedCategories-" + suffix;
			$(selectedCategoriesVar).val(window['chosenCategories' + suffix].implode(","));
		} else {
			this._chosenCategories.set(id, null);
			var selectedCategoriesVar = "#selectedCategories";
			$(selectedCategoriesVar).val(this._chosenCategories.implode(","));
		}
	};
	/**
	 * Gère l'affichage des listes de sélection de catégories.
	 * @param	HTMLAElement	link	Elément '<a>' cliqué.
	 * @param	string		suffix	(Optionnel) Suffix appliqué aux identifiants des éléments.
	 */
	this.reselect = function(link, suffix) {
		var categories = $(link).parent().parent();
		// détermination du niveau de catégorisation
		var level = 0;
		if (categories.hasClass("_categories1"))
			level = 1;
		if (categories.hasClass("_categories2"))
			level = 2;
		if (categories.hasClass("_categories3"))
			level = 3;
		if (level == 0)
			return;
		// initialisations
		var line = $(categories).parent();
		var categories1 = $(line).find("._categories1");
		var categories2 = $(line).find("._categories2");
		var categories3 = $(line).find("._categories3");
		// niveau 3 : on supprime la catégorie préalablement sauvegardée
		this.unassignCategory3(categories3.find("select option:selected").val());
		// tous les cas : on cache le titre de la catégorie 3 et on affiche le select
		categories3.find('._text').hide();
		var selectDiv = categories3.find('._select');
		// repositionnement du select sur la valeur "choisissez"
		selectDiv.find("select").val('');
		selectDiv.show();
		// si niveau 1 ou 2
		if (level == 1 || level == 2) {
			// on cache le titre de la catégorie 2 et on affiche le select
			categories2.find('._text').hide();
			selectDiv = categories2.find('._select');
			// repositionnement du select sur la valeur "choisissez"
			selectDiv.find("select").val('');
			selectDiv.show();
			// on cache la div de la catégorie 3
			categories3.hide();
		}
		// si niveau 1
		if (level == 1) {
			// on cache le titre de la catégorie 1 et on affiche le select
			categories1.find('._text').hide();
			selectDiv = categories1.find('._select');
			// repositionnement du select sur la valeur "choisissez"
			selectDiv.find("select").val('');
			selectDiv.show();
			// on cache la div de la catégorie 2
			categories2.hide();
			// si le select est vide, on le rempli
			var nbrOptions = selectDiv.find("select option").length;
			if (nbrOptions <= 1)
				this.loadCategories1(selectDiv.find("select")[0]);
		}
		this.deleteUselessLine();
	};
	/**
	 * Cache la sélection de catégories 3, affiche et sauvegarde la catégorie choisie et affiche le lien pour ajouter un autre sujet (nouvelle catégorisation).
	 * @param	HTMLSelectElement	select	Elément 'select' des catégories 3.
	 * @param	string			suffix	Suffix appliqué aux identifiants des éléments.
	 */
	this.processCategory3 = function(select, suffix) {
		var newSubjectVar = suffix ? '#new-subject-' + suffix : '#new-subject' ;
		var val3 = select.value;
		if (val3 == "Choisissez" || val3 == "")
			return;
		// initialisations
		var categories3 = $(select).parent().parent();
		var category3 = categories3.find("select option:selected");
		var id3 = category3.val();
		// traitement de l'enregistrement logique
		if (!this._chosenCategories.get(id3))
			this.assignCategory3(id3, suffix);
		// traitement de l'affichage du niveau 3
		var category3Name = category3.html();
		var textStr = '<a onclick="site.question.categories.reselect(this, ' + suffix + '); return (false);">' + category3Name + '</a><a class="supprimer_ligne" onclick="site.question.categories.removeLine(this, ' + suffix + ');"><img src="/img/i_supprimer_ariane.png" alt="supprimer" /></a>';
		var text3 = categories3.find("._text");
		text3.html(textStr);
		categories3.find("._select").hide();
		text3.show();
		categories3.show();
		// affichage du lien
		$(newSubjectVar).show();
	};
	/**
	 * Ajoute une nouvelle ligne de catégorisation.
	 * @param	string	suffix	Suffix appliqué aux identifiants des éléments.
	 */
	this.addNewLine = function(suffix) {
		var newSubjectVar = suffix ? '#new-subject-' + suffix : '#new-subject';
		var categories1Var = suffix ? '#categories1-' + suffix : '#categories1';
		var choosecategoriesVar = suffix ? "#choose-categories-" + suffix : "#choose-categories";
		$(newSubjectVar).hide();
		var jNewLine =	$('<div class="_line">' +
					'<div class="_categories1">' +
						'<div class="_select"></div>' +
						'<div class="_text" style="display: none"></div>' +
					'</div>' +
					'<div class="_categories2" style="display: none">' +
						'<div class="_select"></div>' +
						'<div class="_text" style="display: none"></div>' +
					'</div>' +
					'<div class="_categories3" style="display: none">' +
						'<div class="_select"></div>' +
						'<div class="_text" style="display: none"></div>' +
					'</div>' +
				'</div>');
		jNewLine.find("._categories1 ._select").html($(categories1Var).html());
		jNewLine.find("._categories1 ._select select").val('');
		$(choosecategoriesVar).append(jNewLine);
		//this.deleteUselessLine();
	};
	/**
	 * Calcule combien de menus déroulants sont visibles et supprime la ligne contenant le dernier s'il y en a d'autres et qu'il est celui de la dernière ligne en catégorie 1.
	 */
	this.deleteUselessLine = function() {
		var lines = $("#choose-categories ._line");
		var nbrLines = lines.length;
		var visibleSelects = $("#choose-categories ._select").filter(":visible");
		var nbrVisibleSelects = visibleSelects.length;
		if (nbrVisibleSelects <= 1)
			return;
		var lineToRemove = $(lines[nbrLines - 1]);
		var lastVisibleCat1Select = lineToRemove.find("._categories1 ._select").filter(":visible");
		if (lastVisibleCat1Select.length == 1) {
			lineToRemove.remove();
			$('#new-subject').show();
		}
	};
	/**
	 * Supprime la ligne courante.
	 * @param	HTMLAElement	link	Elément '<a>' cliqué.
	 * @param	int		suffix	(Optionnel) Suffix de formulaire et éléments associés.
	 */
	this.removeLine = function(link, suffix) {
		// initialisation
		var line = $(link).parent().parent().parent();
		// effacement logique
		idCat3 = $(line).find("._categories3 select").val();
		this.unassignCategory3(idCat3, suffix);
		// efacement graphique
		line.remove();
	};
};
