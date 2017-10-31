/**
 * Objet de gestion des domaines de compétence.
 *
 * @author	Camille Khalaghi	<camille.khalaghi@finemedia.fr>
 * @copyright	© 2010, Fine Media
 * @package	FineCommon
 * @subpackage	Javacript
 */

site.authentication.ugcSkill = new function() {
	/** Liste des domaines de compétence sélectionnés. */
	this._chosenSkills = new Hash();

	/**
	 * Fonction d'initialisation, à appeler au chargement de la page.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		// test de la page courante
		if (!((controller == "identification" && action == "profil") ||
		      (controller == "identification" && action == "inscription") ||
		      (controller == "tableauDeBord") ||
		      (action == "publieReponse" && (controller == "qr" || controller == "astuce" || controller == "tips")) ||
		      (action == "publie" && (controller == "qr" || controller == "astuce" || controller == "tips"))
		      ))
			return;
		// test de l'existence de la variable de configuration
		if (typeof(globalSelectedUgcSkills) == "undefined")
			return;
		// ajout des ugcSkills que le current user possède déja
		for (var i in globalSelectedUgcSkills) {
			cat2Id = globalSelectedUgcSkills[i];
			this._chosenSkills.set(cat2Id, cat2Id);
		}
		// alignement scroll
		if ($('#categories1-list .category-selected').length)
			$('#categories1-list').scrollTo($('#categories1-list .category-selected'));
		if ($('#categories2-list .category-selected').length)
			$('#categories2-list').scrollTo($('#categories2-list .category-selected'));
	};
	/**
	 * Verifie le formulaire ugcskillsForm pour envoi.
	 * @return 	BOOL 	Retourne true si tout est bon, false sinon.
	 */
	this.verifyForm = function() {
		// vérification des ugcskills
		if (this._chosenSkills.length() > 0)
			$("#hidden-ugcskills").val(this._chosenSkills.implode(','));
		else
			$("#hidden-ugcskills").val("");
		return (true);
	};
	/**
	 * delete une catégorie dans le div "#proactivities-res".
	 * @param	int	id	Identifiant de la catégorie 2 à enlever.
	 */
	this.unassign = function(id) {
		this._chosenSkills.set(id, null);
		$("#chosen-category-" + id).remove();
		$("#hidden-ugcskills").val(this._chosenSkills.implode(","));
		$("#category2-" + id).removeClass("category-selected").addClass("category-unselected");
	};
	/**
	 * Ajoute une catégorie dans le div "#ugcskills-res".
	 * @param	int	id	Identifiant de la catégorie 2 à ajouter.
	 * @param	string	name	Nom de la catégorie 2 à ajouter.
	 */
	this.assign = function(id, name) {
		// si la catégorie est déjà sélectionnée, on la désélectionne
		if (this._chosenSkills.get(id)) {
			this.unassign(id);
			return;
		}
		// mise logique de la catégorie
		this._chosenSkills.set(id, id);
		// création et mise en place du html
		$("#chosen-categories").append("<span id='chosen-category-" + id + "' class='chosen-category' onclick='site.authentication.ugcSkill.unassign(" + id + ")'>" + name + "</span>");
		$("#hidden-ugcskills").val(this._chosenSkills.implode(','));
		$("#category2-" + id).removeClass("category-unselected").addClass("category-selected");
	};
	/**
	 * Charge les catégories 2 d'une catégorie 1 donnée en paramètre.
	 * @param       int     id      Identifiant de la catégorie 1.
	 */
	this.loadCategories2 = function(id) {
		$("#categories2-list").empty();
		$(".category-selected").removeClass("category-selected").addClass("category-unselected");
		$.getJSON("/categories/list/" + id, function(data) {
			$.each(data, function(i, item) {
				if (item.name.length > 0) {
					$("#categories2-list").append("<div id='category2-" + item.id + "'>" + item.name + "</div>");
					$("#category2-" + item.id).addClass(site.authentication.ugcSkill._chosenSkills.get(item.id) ? "category-selected" : "category-unselected");
					$("#category2-" + item.id).click(function() {
						site.authentication.ugcSkill.assign(item.id, item.name);
					});
				}
			});
			$("#category1-" + id).removeClass("category-unselected").addClass("category-selected");
		});
	};
};

