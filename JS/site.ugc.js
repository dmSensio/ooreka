/**
 * Objet de gestion des pages UGC.
 *
 * @author	Amaury Bouchard <amaury.bouchard@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.ugc = new function() {
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		// Gestion du carousel des dossier spéciaux. TODO > modifier la largeur et l'espacement
		if (controller == 'dossier' && $('#carousel').length) {
			var nbrItems = $('#carousel li').length;
			var nbrDisplay = $('#carousel').attr('data-nbrDisplay');
			var itemWidth = $('#carousel').attr('data-itemWidth');
			this.processCarousel(parseInt(nbrDisplay), 1, 0, parseInt(itemWidth), 50);
		}
		if (controller == 'fiche' && action == 'voir') {
			// gestion des vignettes de photos
			site.common.initFancyBox();
		}
		if (controller != "astuce" && controller != "tips" && controller != "qr" && controller != 'communique' && controller != 'medicament')
			return;
		site.ugc.categories.init(url, controller, action);
	};
	/**
	 * Affiche la fenêtre de signalement de contenu.
	 * @param	string	contentType	Type de contenu UGC, en français (qr, astuce).
	 * @param	int	id		Identifiant du contenu UGC.
	 * @param	string	replyId		Identifiant du commentaire ou de la réponse.
	 * @param	string	commentId	Identifiant du commentaire sur réponse.
	 */
	this.showBadContentForm = function(contentType, id, replyId, commentId) {
		// on vide les champs
		$("#_badContentType").val('');
		$("#_badContentId").val('');
		$("#_badContentReplyId").val('');
		$("#_badContentCommentId").val('');
		$("#_causeValue").val('');
		// on les remplit
		$("#_badContentType").val(contentType);
		$("#_badContentId").val(id);
		$("#_badContentReplyId").val(replyId);
		$("#_badContentCommentId").val(commentId);
		$("#_badContentDescription").val("");
		$("#_warnBadContent").show();
	};
	/** Signalement d'un contenu. */
	this.warnBadContent = function() {
		$('._erreur_cause').removeClass('erreur');
		// vérification
		var cause = $("#_causeValue").val();
		if (!cause.length) {
			$('._erreur_cause').addClass('erreur');
			return;
		}
		var description = $("#_badContentDescription").val();
		if (!description.length)
			description = '';
		// récupération des valeurs
		var type = $("#_badContentType").val();
		if (type === 'fiche' || type === 'communique' || type === 'comprendre' || type === 'info' || type === 'plante')
			type = 'qr';
		var id = $("#_badContentId").val();
		var replyId = $("#_badContentReplyId").val();
		var commentId = $("#_badContentCommentId").val();
		var url = "/" + type + "/signaler/" + id;
		if (replyId)
			url += "/" + replyId;
		if (commentId) {
			if (!replyId)
				url += "/";
			url += "/" + commentId;
		}
		$.post(url, {'description': description, 'cause': cause}, function(data) {
			$("#_warnBadContent").hide();
		}, "json");
	};
	/**
	 * Ajoute un vote sur un contenu UGC.
	 * @param	string	type		Type de contenu (qr, astuce).
	 * @param	int	id		Identifiant du contenu.
	 * @param	string	answerId	(optionnel) Identifiant de la réponse.
	 */
	this.vote = function(type, id, answerId) {
		// demander l'authentification si nécessaire et exécuter l'action métier.
		site.authentication.setContext(null, 'vote', 'register', 'part', 'popup')
			.triggerAuthenticatedAction(function () {
				// prise de l'url
				if (type === 'plante')
					type = 'qr';
				var url = "/" + type + "/voter/" + id;
				if (answerId)
					url += "/" + answerId;
				// demande de vote
				$.getJSON(url, function(data) {
					if (answerId)
						id += "-" + answerId;
					if (data) {
						//utilisé dans /templates/videos/inc.bundleShareBar.tpl
						if ($("#text-content-mark-" + id).length > 0) {
							$("#text-content-mark-" + id).html(data);
							$("#content-action-mark-" + id).html("vote(s)").attr("onclick", "").removeClass("mark-vote").addClass("mark-voted");
						}
						//utilise dans /templates/modules/inc.shareBox.tpl
						if ($("_text-content-mark-" + id).length > 0) {
							$("._text-content-mark-" + id).html(data);
							$("._content-action-mark-" + id).html("vote(s)").attr("onclick", "").removeClass("mark-vote").addClass("mark-voted");
						}
					}
				});
			});
	};
	/**
	 * Supprime un vote sur un contenu UGC.
	 * @param	string	type		Type de contenu (qr, astuce).
	 * @param	int	id		Identifiant du contenu.
	 * @param	string	answerId	(optionnel) Identifiant de la réponse.
	 */
	this.delVote = function(type, id, answerId) {
		// demander l'authentification si nécessaire et exécuter l'action métier.
		site.authentication.setContext(null, 'vote', 'register', 'part', 'popup')
			.triggerAuthenticatedAction(function () {
				// prise de l'url
				if (type === 'plante')
					type = 'qr';
				var url = "/" + type + "/delVoter/" + id;
				if (answerId)
					url += "/" + answerId;
				// demande de vote
				$.getJSON(url, function(data) {});
			});
	};
	/**
	 * Met à jour l'affichage lors d'un vote sur un contenu UGC.
	 * @param	int	answerId	Identifiant du la réponse.
	 * @param	string	voteType	'expert' ou 'utile'.
	 * @param	int	userId		Identifiant de l'utilisateur.
	 */
	this.updateAddVoteDisplay = function(answerId, voteType, userId) {
		//On verifie les paramètres, si l'utilisateur est connecté et si l'utilisateur n'a pas déjà voté sur ce contenu
		if (!answerId
			|| (voteType != 'expert' && voteType != 'utile')
			|| !site.authentication.isAuthenticated()
			|| $('#_reply-' + answerId + '-alreadyVoted').val() == 'true')
			return;
		var userType = '';
		if (voteType == 'expert') {
			userType = 'Expert';
			//je suis d'accord > je ne suis plus d'accord
			$('#_buttonAddVoteExpert-' + answerId).hide();
			$('#_buttonDelVoteExpert-' + answerId).show();
			//affiche le nom de l'expert dans la liste des votants
			$('#_voteExpertList-' + answerId + '-' + userId).show();
		}
		if (voteType == 'utile'){
			userType = 'Utile';
			//on désactive le boutton; réponse utile
			$('#_buttonVoteUtile-' + answerId).addClass('non_active');
		}
		var nbVote = $('#_valNbVote' + userType + '-' + answerId).val();
		//on ajoute 1 vote
		nbVote = parseInt(nbVote) + 1;
		//Met à jour le nombre de votes dans l'input hidden
		$('#_valNbVote' + userType + '-' + answerId).val(nbVote);
		//Met à jour l'affichage du nombre de votes
		$('#_nbVote' + userType + '-' + answerId).html(nbVote);
		//Ajoute le(s) 's' nécessaire(s)
		if (nbVote >= 2)
			$('._vote' + userType + 'S-' + answerId).show();
		//Affiche le nombre de votes si ce n'etait pas déjà fait (cas 0 vote)
		if (nbVote >= 1)
			$('#_vote' + userType + '-' + answerId).show('slow');
		//Met à jour l'input hidden pour dire que l'utilisateur a voté sur le contenu
		$('#_reply-' + answerId + '-alreadyVoted').val('true');
	};
	/**
	 * Met à jour l'affichage lors de la suppression d'un vote sur un contenu UGC.
	 * @param	int	answerId	Identifiant du la réponse.
	 * @param	int	userId		Identifiant de l'utilisateur.
	 */
	this.updateDelVoteDisplay = function(answerId, userId) {
		//On verifie les paramètres, si l'utilisateur est connecté et si l'utilisateur a déjà voté sur ce contenu
		if (!answerId
			|| !site.authentication.isAuthenticated()
			|| $('#_reply-' + answerId + '-alreadyVoted').val() == 'false')
			return;
		var nbVote = $('#_valNbVoteExpert-' + answerId).val();
		//on enleve 1 vote
		nbVote = parseInt(nbVote) - 1;
		//je ne suis plus d'accord > je suis d'accord
		$('#_buttonDelVoteExpert-' + answerId).hide();
		$('#_buttonAddVoteExpert-' + answerId).show();
		//Met à jour le nombre de votes dans l'input hidden
		$('#_valNbVoteExpert-' + answerId).val(nbVote);
		//Met à jour l'affichage du nombre de votes
		$('#_nbVoteExpert-' + answerId).html(nbVote);
		//cache le(s) 's' nécessaire(s)
		if (nbVote <= 1)
			$('._voteExpertS-' + answerId).hide();
		//cache le nom de l'expert dans la liste des votants
		$('#_voteExpertList-' + answerId + '-' + userId).hide();
		//cache l'affichage du nombre de votes si besoin (cas 0 vote)
		if (nbVote == 0)
			$('#_voteExpert-' + answerId).hide('slow');
		//Met à jour l'input hidden pour dire que l'utilisateur n'a pas voté sur le contenu
		$('#_reply-' + answerId + '-alreadyVoted').val('false');
	};
	/**
	 * Ajouter un follower sur le contenu
	 * /!\ Appele par le template et par site.tableauDeBord.activite.js
	 * @param	int	ugcId	Identifiant du contenu.
	 * @param	int	userId	Identifiant de l'utilisateur.
	 */
	this.addFollower = function(ugcId) {
		// demander l'authentification si nécessaire et exécuter l'action métier.
		site.authentication.setContext(null, 'vote', 'register', 'part', 'popup')
			.triggerAuthenticatedAction(function () {
				// prise de l'url
				var url = "/qr/suivre/" + ugcId;
				// demande de vote
				$.getJSON(url, function(data) {
					$('._addFollowerLink' + ugcId).hide();
					$('._delFollowerLink' + ugcId).show();
				});
			});
	};
	/**
	 * Supprime un follower sur le contenu
	 * /!\ Appele par le template et par site.tableauDeBord.activite.js
	 * @param	int	ugcId	Identifiant du contenu.
	 * @param	int	userId	Identifiant de l'utilisateur.
	 */
	this.delFollower = function(ugcId) {
		// demander l'authentification si nécessaire et exécuter l'action métier.
		site.authentication.setContext(null, 'vote', 'register', 'part', 'popup')
			.triggerAuthenticatedAction(function () {
				// prise de l'url
				var url = "/qr/delSuivre/" + ugcId;
				// demande de vote
				$.getJSON(url, function(data) {
					$('._delFollowerLink' + ugcId).hide();
					$('._addFollowerLink' + ugcId).show();
				});
			});
	};
	/**
	 * Affiche le formulaire principal de réponse.
	 * @param	int	id		Identifiant numérique de la boite de réponse.
	 * @param	mixed	callback	(optionnel) Fonction de callback à exécuter.
	 */
	this.showMainReplyForm = function(id, callback) {
		$("#_answerBox-" + id).slideToggle();
		// si l'utilisateur n'est pas connecté, afficher le formulaire d'authentification
		var formIdSelector = "#_authenticationForm-" + id;
		site.authentication.openIntegratedAuthentication('register', 'part', id, 'repondre', callback);
		$("#edit-main").cleditor({
			controls: "bold italic | bullets | link"
		});
	};
	/**
	 * Affiche le formulaire d'ajout de commentaire sur une réponse.
	 * @param	string	answerId	Identifiant de la réponse.
	 * @param	mixed	callback	(optionnel) Fonction de callback à exécuter.
	 */
	this.showCommentForm = function(answerId, callback) {
		$("#comment-form-" + answerId).slideToggle();
		$("#edit-comment-" + answerId).cleditor({
			controls: "bold italic | bullets | link"
		});
	};
	/**
	 * Verifie le formulaire de catégorisation d'un contenu
	 * @param	HTMLFormElement	form	Objet js formulaire.
	 * @return 	bool		Retourne true si ok, false sinon.
	 */
	this.checkFormCategorisation = function(form) {
		var jForm = $(form);
		var error = false;
		// on cache toutes les erreurs
		jForm.find("#error_categories").hide();
		jForm.find("#error_notags").hide();
		jForm.find("#error_smallTags").hide();
		jForm.find("#error_badTags").hide();

		// On vérifie qu'au moins une catégorie a été sélectionnée.
		if (jForm.find("#selectedCategories").length > 0) {
			if (jForm.find("#selectedCategories").val().length <= 0) {
				error = true;
				jForm.find("#error_categories").show();
			}
		}
		// On vérifie qu'au moins un tag d'au moins 3 lettres et bien formé (chiffres, lettres, underscore, tiret) a été mis.
		if (jForm.find("#tags input:text").length > 0) {
			var notags = true;
			var notags3letterOrMore = true;
			var noWellFormedTag = true;
			jForm.find("#tags input:text").each(function() {
				var value = $(this).val();
				if (value.length > 0)
					notags = false;
				if (value.length >= 3) {
					notags3letterOrMore = false;
					// vérification que le tag ne comporte que des lettres, chiffres, underscore et tiret
					if (/^[\wàéèùâêîôûäëïöüçœ-]*$/i.test(value))
						noWellFormedTag = false;
				}
				if (notags == false && notags3letterOrMore == false && noWellFormedTag == false)
					return (false);
				return (true);
			});
			if (notags == true) {
				error = true;
				jForm.find("#error_notags").show();
			} else if (notags3letterOrMore == true) {
				error = true;
				jForm.find("#error_smallTags").show();
			} else if (noWellFormedTag == true) {
				error = true;
				jForm.find("#error_badTags").show();
			}
		}
		if (error == true)
			return (false);
		return (true);
	};
	/**
	 * Valide le formulaire "répondre".
	 * Submit le formulaire "'#sendResponseForm-' + idSuffix" si tout va bien, sinon affiche les messages d'erreurs pertinents.
	 * @param	int	idSuffix		Suffixe de l'identifiant de la zone de réponse.
	 * @param	string	controller		(optionnel) nom du controlleur.
	 * @param	string	xitiOrigin		(optionnel) "Sel" de la stat à envoyer.
	 */
	this.processResponseForm = function(idSuffix, controller, xitiOrigin) {
		if ($('#_sendAnswer-' + idSuffix).hasClass('non_active'))
			return;
		//Desactive le boutton
		$('#_sendAnswer-' + idSuffix).addClass('non_active');
		var isExtraQuestion = ($("#isAdditionalQuestion-" + idSuffix + "-yes:checked").length > 0) ? true : false;
		// Initialisation.
		var existTitre = false;
		if ($("#responseTitle").length > 0)
			existTitre = true;
		var valueTitre = $('#responseTitle').val();
		var valueText = $("#responseText-" + idSuffix).val();
		var error = false;
		// Desaffichage des erreurs.
		$('#visibleResponseRegistration:hidden').show('slow');
		$("#response-error-title").hide();
		$("#response-error-content-" + idSuffix).hide();
		// Controle.
		if (existTitre == true && (valueTitre == ""  || valueTitre == "Titre de votre question")) {
			error = true;
			$("#response-error-title").show();
		}
		if (controller == 'qr' || controller == 'tableauDeBord') {
			// Vérification du corps de la réponse
			if (site.common.checkCharCount('#responseText-' + idSuffix, 70, 5000, 10, false, true)) {
				error = true;
			}
		}
		if (controller == 'tips') {
			// Vérification du corps de la réponse
			if (site.common.checkCharCount('#responseText-' + idSuffix, 1, 5000, 1, false, true)) {
				error = true;
			}
		}
		// Retour.
		if (error) {
			//Active le boutton
			$('#_sendAnswer-' + idSuffix).removeClass('non_active');
			return;
		}
		// envoyer le formulaire de données sous condition d'authentification
		site.authentication.setContext(idSuffix)
				   .triggerAuthenticatedAction(function() {
			// si l'utilisateur est connecté
			// envoi de la stat
			if (xitiOrigin) {
				xt_med('C', xtn2, "React_contenu::" + xitiOrigin, 'A');
			}
			// sérialiser et soumettre le formulaire
			site.ugc.sendFormToServer('#sendResponseForm-', idSuffix);
		});
	};
	/**
	 * Valide le formulaire "commentaire".
	 * Envoi du formulaire si toutes les données sont valides.
	 * @param	int	numResponse	(optionnel) Numéro de la réponse auquel le commentaire devra répondre.
	 * @param	string	controller	(optionnel) nom du contôlleur.
	 */
	this.processCommentForm = function(numResponse, controller) {
		if ($('#_sendComment-' + numResponse).hasClass('non_active'))
			return;
		//Desactive le boutton
		$('#_sendComment-' + numResponse).addClass('non_active');
		// Initialisation.
		var existTitre = false;
		if ($("#commentTitle-" + numResponse).length > 0)
			existTitre = true;
		var valueTitre = $("#commentTitle-" + numResponse).val();
		var valueText = $("#commentText-" + numResponse).val();
		var error = false;
		// Desaffichage des erreurs.
		$('#visibleCommentRegistration-" + numResponse + ":hidden').show('slow');
		$("#comment-error-title-" + numResponse).hide();
		$("#comment-error-content-" + numResponse).hide();
		// Controle.
		if (existTitre == true && (valueTitre == ""  || valueTitre == "Titre de votre question")) {
			error = true;
			$("#comment-error-title-" + numResponse).show();
		}
		if (valueText == "" || valueText == "Texte de votre question" || valueText == "<br>") {
			error = true;
			$("#comment-error-content-" + numResponse).show();
		}
		// Retour.
		if (error) {
			//Active le boutton
			$('#_sendComment-' + numResponse).removeClass('non_active');
			return;
		}
		// envoyer le formulaire sous condition d'authentification
		site.authentication.setContext(numResponse).triggerAuthenticatedAction(function() {
			site.ugc.sendFormToServer('#sendCommentForm-', numResponse);
		});
	};
	/**
	 * Sérialiser et envoyer un formulaire donné (valable pour les réponses/réactions et commentaires).
	 * @param	string	formPrefix	Préfixe du formulaire.
	 * @param	int	idSuffix	Identifiant du formulaire.
	 */
	this.sendFormToServer = function(formPrefix, idSuffix) {
		// soumission du formulaire
		var formData = $(formPrefix + idSuffix).serialize();
		var formAction = $(formPrefix + idSuffix).attr('action');
		$.post(formAction, formData, function(response) {
			if (response.status) {
				var callback = $(formPrefix + idSuffix).attr('data-callback');
				if (typeof callback !== "undefined") {
					eval(callback);
				} else {
					// rester sur la page du contenu à l'emplacement de l'ancre
					if (typeof(response.redirectUrl) != 'undefined' && response.redirectUrl != '') {
						window.location.href = '/qr/redirectService?redirectUrl=' + encodeURIComponent(response.redirectUrl);
					}
				}
			}
		});
	};
	/** Affiche ou cache le bloc "autres sujets" dans la page qr/liste. */
	this.toggleMoreSubject = function() {
		if ($("#moreSubjects-data:hidden").length) {
			$("#moreSubjects-data").show('slow');
			$("#moreSubjects-button").hide();
		} else {
			$("#moreSubjects-data").hide('slow');
			$("#moreSubjects-button").show();
		}
	};
	/**
	 * Traite l'affichage du carroussel dans le diaporama d'astuce.
	 * Si un paramètre est changé dans le code de la fonction, penser aux répercussions sur l'affichage.
	 * @param	int	nbrVisibles	Nombre d'images visibles.
	 * @param	int	numStep		Nombre d'images en mouvement lors de la navigation dans le carroussel.
	 * @param	int	page		???.
	 * @param	int	optionWidth	Taille en px des diapos du carroussel.
	 * @param	int	optionMargin	Taille en px de la séparation inter-diapos..
	 */
	this.processCarousel = function(nbrVisibles, numStep, page, optionWidth, optionMargin) {
		var position;
		if (page <= 2)
			position = 0;
		else
			position = page - 2;
		// paramétrage du carroussel
		$("#carousel").rcarousel({
			"visible": nbrVisibles,
			"step": numStep,
			"width": (optionWidth > 0 ? optionWidth : 80),
			"margin": (optionMargin > 0 ? optionMargin : 26)
		});
		// paramétrage des flèches 'précédent' et 'suivant'
		$("#ui-carousel-next").add("#ui-carousel-prev").hover(
			function() {
				$(this).css("opacity", 0.7);
			},
			function() {
				$(this).css("opacity", 1.0);
			}
		);
		// positionnement du carroussel à la bonne page
		$("#carousel").rcarousel("goToPage", position);
	};
	/**
	 * Récupère les ugc relatifs à un texte et les affichent.
	 * @param	string	ugctype		Type d'ugc recherché ('qr').
	 * @param	string	text		Texte à utiliser pour la recherche.
	 * @param	string	suffix		Suffix d'identifiant du formulaire et de ces éléments.
	 * @param	string	function	Callback à exécuter après la vérification/récupération des suggestions.
	 */
	this.getRelatedContents = function(ugctype, text, suffix, callback) {
		// vérification des paramètres
		if (!text.length || text == 'Titre de votre question (60 caractères max.)' || text == 'Titre de votre question')
			return;
		var relatedContentsVar = suffix ? "#_relatedContents-" + suffix : "#_relatedContents";
		var title1Var = suffix ? "#_title1-" + suffix : "#_title1";
		var title2Var = suffix ? "#_title2-" + suffix : "#_title2";
		var qrDomId = suffix ? "#QRTitle-" + suffix : "#QRTitle";
		// envoi de la requete
		data = {
			'text': text
		};
		// récupérer les méta-données
		var elm = $(qrDomId)[0];
		var trackingCode = $(qrDomId).attr('data-tracking-code');
		var trackingZone = $(qrDomId).attr('data-tracking-zone');
		// ajouter le nombre de contenus à récupérer
		if ($(relatedContentsVar).attr('data-max'))
			data.maxContents = $(relatedContentsVar).attr('data-max');
		else
			data.maxContents = '';
		url = "/" + ugctype + "/getRelatedContents/" + data.maxContents + '/' + trackingZone;
		$(relatedContentsVar).load(url, data, function(response, status) {
			if (status == "error" || response == '') {
				$(relatedContentsVar).hide();
				$(relatedContentsVar).html('');
				$('#_step-1').removeClass('apparition_suggestion');
			} else {
				$(relatedContentsVar).fadeIn('slow');
				$(title2Var).show();
				if ($('#_step-1').length > 0)
					$('#_step-1').addClass('apparition_suggestion');
			}
			// afficher ou cacher le bouton 'plus de suggestions'
			if ($(relatedContentsVar).attr('data-less') == 'true')
				$('#_relatedContentMore').hide();
			// exécution de la callback si existante
			if (callback) {
				var res = (status != "error" ? true : false);
				callback(res);
			}
			xt_med('C', xtn2, trackingCode, 'A');
		});
	};
	/** Gère l'affichage de la sélection de professionnels ayant des communiqués de presse (clic sur la flèche) */
	this.managePressAccountsDisplay = function() {
		if ($('._pressAccounts:visible').length > 1) {
			$('._pressAccounts').hide();
			$('._pressAccounts._selected').show();
		} else
			$('._pressAccounts').show();
	};
	/**
	 * Affiche l'élément sélectionné puis soumet le formulaire tel qu'il doit être envoyé avec les filtres sélectionnés (pro sélectionné ayant des communiqués de presse).
	 * @param	int	accountId	Identifiant de professionnel.
	 */
	this.submitPressAccount = function(accountId) {
		$("#_chosenAccount").val(accountId);
		$("._pressAccounts").hide();
		$("._pressAccounts").removeClass("_selected");
		$("#_press-account-" + accountId).addClass("_selected");
		$("#_press-account-" + accountId).show();
		$('#_pressForm').submit();
	};
};
