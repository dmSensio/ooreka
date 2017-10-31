/**
 * Fichier Javascript de chargement des Javascript.
 * Ce fichier est censé être réécrit en production, avec le contenu minifié des fichiers chargés.
 *
 * @author	Amaury Bouchard <amaury.bouchard@finemedia.fr>
 * @copyright	© 2010, Fine Media
 * @package	FineCommon
 */

// chargement synchrone des fichiers Javascript
$.ajaxSetup({async: false});
// chargement des fichiers Javascript externes
$.getScript("/js/rollover.js");
$.getScript("/js/jquery-ui.min.js");
$.getScript("/js/jquery.cookie.js");
$.getScript("/js/jquery.ui.datepicker-fr.js");
$.getScript("/js/jquery.cleditor.min.js");
$.getScript("/js/jquery-scrollTo.js");
$.getScript("/js/jquery.jDiaporama.js");
$.getScript("/js/jquery.ui.rcarousel.js");
$.getScript("/js/jquery.cycle.all.js");
$.getScript("/js/Hash.js");
$.getScript("/js/site.js");
$.getScript("/js/site.common.js");
$.getScript("/js/site.sharebar.js");
$.getScript("/js/site.authentication.js");
$.getScript("/js/site.auth.js");
$.getScript("/js/site.authentication.expert.js");
$.getScript("/js/site.authentication.profilPro.js");
$.getScript("/js/site.authentication.lostPassword.js");
$.getScript("/js/site.authentication.linkAccountsPopup.js");
$.getScript("/js/site.authentication.ugcSkill.js");
$.getScript("/js/site.confirmation.js");
$.getScript("/js/site.cms.js");
$.getScript("/js/site.ugc.js");
$.getScript("/js/site.ugc.categories.js");
$.getScript("/js/site.map.js");
$.getScript("/js/site.membre.js");
$.getScript("/js/site.membre.product.js");
$.getScript("/js/site.requetePro.js");
$.getScript("/js/site.societe.js");
$.getScript("/js/site.societe.profil.js");
$.getScript("/js/site.produits.js");
$.getScript("/js/site.produits.selection.js");
$.getScript("/js/site.homepage.js");
$.getScript("/js/site.contact.js");
$.getScript("/js/site.question.js");
$.getScript("/js/site.question.categories.js");
$.getScript("/js/site.question.publibox.js");
$.getScript("/js/site.eBibliotheque.js");
$.getScript("/js/site.eBibliotheque.downloadForm.js");
$.getScript("/js/site.eBibliotheque.thankyouPopin.js");
$.getScript("/js/site.annuaire.js");
$.getScript("/js/site.videos.js");
$.getScript("/js/site.shareForm.js");
$.getScript("/js/site.facebook.js");
$.getScript("/js/site.twitter.js");
$.getScript("/js/site.plan.js");
$.getScript("/js/site.plant.js");
$.getScript("/js/site.plant.period.js");
$.getScript("/js/site.plant.comparative.js");
$.getScript("/js/site.medicament.js");
$.getScript("/js/site.slider.js");
$.getScript("/js/slimbox2.js");
$.getScript("https://apis.google.com/js/plusone.js");
$.getScript("/js/site.tracking.js");
$.getScript("/js/site.animation.js");
$.getScript("/js/site.dossier.js");
$.getScript("/js/site.push.js");
$.getScript("/js/site.dictionnaire.js");
$.getScript("/js/site.kameleoon.js");
$.getScript("/js/site.formulaireDevis.js");
$.getScript("/js/site.mvp.js");
// remise à l'état asynchrone habituel
$.ajaxSetup({async: true});

