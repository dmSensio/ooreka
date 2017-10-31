/**
 * Objet des fonctions pour la pagination du mvp.
 *
 * @author	David Marcos <david.marcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
mvpPagination = new function() {
	/**
	 * Initialisation.
	 */
	this.init = function() {
		this.shuffle();
		this.checkNumberArticleLinked();
	};
	this.toggleMoreArticle = function(link){
		$(link).find('._hide').toggle();
		$(link).find('._show').toggle();
		$('._moreArticle').toggle();
	};

	/**
	* Modifie l'ordre des articles dans le bloc des articles liés
	*/
	this.shuffle = function () {
		var a = $('#_listArticlesBySection').find('li').get();
	    	var j, x, i;
	    	for (i = a.length; i; i--) {
	        	j = Math.floor(Math.random() * i);
		        x = a[i - 1];
		        a[i - 1] = a[j];
		        a[j] = x;
	    	}
	    	$('#_listArticlesBySection').append(a);
	};

	/**
	* Ajoute la class "_moreArticle" et cache les liens si on a plus de 9 articles liés
	*/
	this.checkNumberArticleLinked = function () {
		var index = 1;
		$('#_listArticlesBySection').find('li').each(function() {
			if (index > 9) {
				$(this).addClass('_moreArticle');
				$(this).hide();
			}
			index++;
		});
	};
}