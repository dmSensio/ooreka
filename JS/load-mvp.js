/**
 * Fichier Javascript de chargement des Javascript.
 * Ce fichier est censé être réécrit en production, avec le contenu minifié des fichiers chargés.
 *
 * @author	David Marcos <david.marcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 * @package	FineCommon
 */

// chargement synchrone des fichiers Javascript
$.ajaxSetup({async: false});
// chargement des fichiers Javascript pour le MVP
$.getScript("/js/mvp/mvpCommon.js");
$.getScript("/js/mvp/mvpHeader.js");
$.getScript("/js/jquery.cookie.js");
$.getScript("/js/mvp/mvpStepper.js");
$.getScript("/js/mvp/mvpBloc.js");
$.getScript("/js/mvp/mvpShare.js");
$.getScript("/js/mvp/mvpPagination.js");
$.getScript("/js/mvp/mvpForm.js");
$.getScript("/js/mvp/mvpAuth.js");
$.getScript("/js/mvp/mvpTracking.js");
$.getScript("/js/mvp/mvpPros.js");
$.getScript("/js/mvp/mvpFormulaireDevis.js");
$.getScript("/js/mvp/mvpAuthentication.js");
$.getScript("/js/mvp/mvpFacebook.js");
$.getScript("/js/mvp/mvpEntretien.js");
// remise à l'état asynchrone habituel
$.ajaxSetup({async: true});

