/**
 * Objet d'un membre.
 *
 * @author	Julien Hamrouni <julien.hamrouni@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.membre = new function() {
	/**
	 * Initialisation.
	 * @param	string	url		URL courante.
	 * @param	string	controller	Nom du contrôleur courant.
	 * @param	string	action		Nom de l'action courante.
	 */
	this.init = function(url, controller, action) {
		if (controller != 'membre')
			return;
		if ($('#texte_description').height() > 169)
			$(".suite").show();
		if (action == 'profil') {
			$('._erreurTitle').hide();
			$('._erreurMsg').hide();
		}
	};
	/**
	 * Affiche la fenêtre de signalement de membre.
	 * @param	int	id	Identifiant du membre.
	 */
	this.showBadAccountForm = function(id) {
		// on vide les champs
		$("#badAccountDescription").val("");
		$("#badAccountId").val('');

		// on les remplit
		$("#badAccountId").val(id);
		//$("#warnBadAccount").dialog("open");
		$("#warnBadAccount").show();
	};
	/** Signalement d'un contenu. */
	this.warnBadAccount = function() {
		// vérification
		var description = $("#badAccountDescription").val();
		if (!description.length) {
			$('._erreur_explication').addClass('erreur');
			return;
		}
		// récupération des valeurs
		var id = $("#badAccountId").val();
		var url = "/membre/signaler/" + id;
		$.post(url, {'description': description}, function(data) {
			$("#warnBadAccount").hide();
		}, "json");
	};
	/** Affiche la description complète du membre. */
	this.showDescription = function() {
		var height = $('#texte_description').height() + 30;
		$(".suite").hide();
		$(".description_membre").animate({height: height + "px"}, "slow", function() {
			$(".reduire").show();
		});
	};
	/** Cache le texte supplémentaire de la description du membre. */
	this.hideDescription = function() {
		$(".reduire").hide();
		$(".description_membre").animate({height: "169px"}, "slow", function() {
			$(".suite").show();
		});
	};
	/**
	 * Envoi un message depuis la page profil
	 */
	this.sendMessage = function() {
		$('._titleFieldSet').removeClass('erreur');
		$('._msgFieldSet').removeClass('erreur');
		//Recuperation du formulaire
		var id = $('#mDestId').val();
		var title = $('#mTitle').val();
		var message = $('#mText').val();
		var name = $('#mDestName').val();
		var url = '/membre/message/' + id + '/' + name;
		// envoi de la requête au serveur
		var formData = {
			'id':			id,
			'title':		title,
			'message':		message,
			'json': 		true,
		};
		if (title == '') {
			$('._titleFieldSet').addClass('erreur');
			$('._erreurTitle').show();
			return false;
		}
		if (message == '') {
			$('._msgFieldSet').addClass('erreur');
			$('._erreurMsg').show();
			return false;
		}
		$.post(url, formData, function(data) {
			if (data.success) {
				$('#mTitle').val('');
				$('#mText').val('');
				$('#_confirmationMessageSent').addClass('popin_go').removeClass('popin_no');
				setTimeout(function() {
					$('#_confirmationMessageSent').removeClass('popin_go').addClass('popin_no');
				}, 3000);
			} else {
				if (typeof data.redirect !== 'undefined') {
					window.location.href = data.redirect;
					return;
				}
				if (data.error.title) {
					$('._titleFieldSet').addClass('erreur');
					$('._erreurTitle').show();
				}
				if (data.error.message) {
					$('._msgFieldSet').addClass('erreur');
					$('._erreurMsg').show();
				}
			}
		});
		return true;
	};
	/**
	 * Gestion du filtre de tri  sur la page reponse du profil expert
	 */
	this.changeFilter = function(memberId, memberName, page) {
		var url = '/membre/reponse/' + memberId +  '/' + memberName + '/' + $('#_sortFilter').val() + '/' + page;
		window.location.href = url;
	};
};
