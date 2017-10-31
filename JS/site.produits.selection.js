/**
 * Objet de fonctions des produits.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.produits.selection = new function() {
	/**
	 * Fonction d'initialisation, à appeler au chargement de la page.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		// vérification du contexte
		if (!(controller = 'produits' && action == 'liste'))
			return;
		site.requetePro.initProductPopup('/produits/selection/validate', this.callbackInfoProducts);
	};
	/** 
	 * Lorsqu'une checkbox "demande d'info" est cochée ou décochée, cette fonction est appelée. Elle devra ajouter ou supprimer le produit passé en paramètre.
	 * @param	checkbox	Checkbox	Objet qui a été coché ou décoché.
	 * @param	int		idProduit	Id du produit a ajouter/supprimer.
	 */
	this.EventClickOnCheckbox = function(Checkbox, idProduit) {
		var checked = $(Checkbox).attr('checked');
		if (checked == true || checked == "checked") {
			this.add(idProduit);
			$('#selected_products_content').slideDown('slow');
		} else
			this.remove(idProduit);
	};
	/**
	 * Ajoute un produit en session.
	 * @param	int	idProduit	Id du produit a ajouter.
	 */
	this.add = function(idProduit) {
		var url = "/produits/selection/add/" + idProduit;
		$.get(url, function(html) {
			$("#selected_products_content").html(html);
			site.produits.selection.nbr();
			$("#checkbox-product-" + idProduit).attr("checked", "checked");
		});
	};
	/**
	 * Enlève un produit en session.
	 * @param	int	idProduit	Id du produit a ajouter.
	 */
	this.remove = function(idProduit) {
		var url = "/produits/selection/remove/" + idProduit;
		$.get(url, function(html) {
			$("#selected_products_content").html(html);
			site.produits.selection.nbr();
			$("#checkbox-product-" + idProduit).attr("checked", false);
		});
	};
	/** Enlève tous les produits de la session. */
	this.flush = function() {
		var url = "/produits/selection/flush";
		$.get(url, function(html) {
			$("#selected_products_content").html(html);
			$("#selected_products_nbProducts").html("0");
			$("._checkbox-product").attr("checked", false);
			$("#RequetePro_infoProduct_nbProducts").html("0");
		});
	};
	/** Valide la requete Pro. */
	this.validate = function() {
		site.requetePro.openPopupProduct();
	};
	/** Compte le nombre de produits en session. */
	this.nbr = function() {
		var url = "/produits/selection/nbr";
		$.getJSON(url, function(data) {
			$("#selected_products_nbProducts").html(data);
			$("#RequetePro_infoProduct_nbProducts").html(data);
		});
	};
	/** Retourne les produits en session. */
	this.update = function() {
		var url = "/produits/selection/update";
		$.get(url, function(html) {
			$("#selected_products_content").html(html);
			site.produits.selection.nbr();
		});
	};
	/** 
	 * Une fois que la demande d'info produit à été envoyée et validée, cette fonction est appelée.
	 * Cette fonction devra mettre a jour le nombre de produits affiché, le cadre des produits selectionnées et vider toutes les cases cochées.
	 */
	this.callbackInfoProducts = function() {
		$("._checkbox-product").attr("checked", false);
		$("#selected_products_nbProducts").html("0");
		$("#RequetePro_infoProduct_nbProducts").html("0");
		site.produits.selection.update();
	};
};
