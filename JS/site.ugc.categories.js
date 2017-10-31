/**
 * Objet de gestion de la catégorisation des contenus UGC.
 *
 * @author	Amaury Bouchard <amaury.bouchard@finemedia.fr>, Julien Hamrouni <julien.hamrouni@finemedia.fr>
 * @copyright	© 2010, Fine Media
 * @package	FineCommon
 * @subpackage	Ugc
 */
 
site.ugc.categories = new function() {
	/** Liste des identifiants des catégories 3 choisies pour le contenu. */
	this._chosenCategories = new Hash();
	
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if (action == "categorisation" || (controller == "tableauDeBord" && action == "publier" && $("#categories1-list").length)) {
			$('#categories1-list').scrollTo($('.category-selected'));
			$('#categories2-list').scrollTo($('#categories2-list .category-selected'));
		}
	};
	/**
	 * Charge les catégories 2 d'une catégorie 1 donnée en paramètre.
	 * @param	int	id	Identifiant de la catégorie 1.
	 */
	this.loadCategories2 = function(id) {
		$("#categories3-list").empty();
		$("#categories2-list").empty();
		$(".category-selected").removeClass("category-selected").addClass("category-unselected");
		$.getJSON("/categories/list/" + id, function(data) {
			$.each(data, function(i, item) {
				if (item.name.length > 0) {
					$("#categories2-list").append("<div id='category2-" + item.id + "' class='category-unselected' " +
								      "onclick='site.ugc.categories.loadCategories3(" + id + ", " + item.id + ")'>" + item.name + "</div>");
				}
			});
			$("#category1-" + id).removeClass("category-unselected").addClass("category-selected");
		});
	};
	/**
	 * Charge les catégories 3 d'une catégorie 2 donnée en paramètre.
	 * @param	int	id1	Identifiant de la catégorie 1.
	 * @param	int	id2	Identifiant de la catégorie 2.
	 */
	this.loadCategories3 = function(id1, id2) {
		$("#categories3-list").empty();
		$(".category-selected").removeClass("category-selected").addClass("category-unselected");
		$("#category1-" + id1).removeClass("category-unselected").addClass("category-selected");
		$.getJSON("/categories/list/" + id1 + "/" + id2, function(data) {
			$.each(data, function(i, item) {
				if (item.name.length > 0) {
					$("#categories3-list").append("<div id='category3-" + item.id + "'>" + item.name + "</div>");
					$("#category3-" + item.id).addClass(site.ugc.categories._chosenCategories.get(item.id) ? "category-selected" : "category-unselected");
					$("#category3-" + item.id).click(function() {
						site.ugc.categories.assignCategory3(item.id, item.name);
					});
				}
			});
			$("#category2-" + id2).removeClass("category-unselected").addClass("category-selected");
		});
	};
	/**
	 * Ajoute une catégorie 3 au contenu UGC.
	 * @param	int	id	Identifiant de la catégorie 3.
	 * @param	string	name	Nom de la catégorie.
	 */
	this.assignCategory3 = function(id, name) {
		if (this._chosenCategories.get(id)) {
			this.unassignCategory3(id);
			return;
		}
		this._chosenCategories.set(id, id);
		$("#chosenCategories").append("<span id='chosen-category-" + id + "' class='chosen-category' onclick='site.ugc.categories.unassignCategory3(" + id + ")'>" + name + "</span>");
		$("#selectedCategories").val(this._chosenCategories.implode(","));
		$("#category3-" + id).removeClass("category-unselected").addClass("category-chosen");
	};
	/**
	 * Retire une catégorie 3 du contenu UGC.
	 * @param	int	id	Identifiant de la catégorie 3.
	 */
	this.unassignCategory3 = function(id) {
		this._chosenCategories.set(id, null);
		$("#chosen-category-" + id).remove();
		$("#selectedCategories").val(this._chosenCategories.implode(","));
		$("#category3-" + id).removeClass("category-chosen").addClass("category-unselected");
	};
	/** Ajoute des champs textes pour saisir des tags. */
	this.moreTags = function() {
		$("#tags").append("<div>" +
					"<input type='text' class='tags' name='tags[]' /> " +
					"<input type='text' class='tags' name='tags[]' /> " +
					"<input type='text' class='tags' name='tags[]' /> " +
					"<input type='text' class='tags' name='tags[]' /> " +
				  "</div>");
	};
};
