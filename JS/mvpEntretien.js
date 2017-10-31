/**
 * Objet des fonctions entretenir-reparer du mvp.
 *
 * @author	Sahème Nhim <saheme.nhim@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
mvpEntretien = new function() {
	/**
	 * Initialisation.
	 */
	this.init = function() {
		this.mainFunction();
	};

	this.preventDefault = function(e) {
		e = e || window.event;
		if (e.preventDefault)
			e.preventDefault();
		e.returnValue = false;
	}

	this.preventDefaultForScrollKeys = function(e) {
		var keys = {32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1};
		if (keys[e.keyCode]) {
			mvpEntretien.preventDefault(e);
			return false;
		}
	}

	this.disableScroll = function() {
		if (window.addEventListener) // older FF
			window.addEventListener('DOMMouseScroll', mvpEntretien.preventDefault, false);
		window.onwheel = mvpEntretien.preventDefault; // modern standard
		window.onmousewheel = document.onmousewheel = mvpEntretien.preventDefault; // older browsers, IE
		window.ontouchmove  = mvpEntretien.preventDefault; // mobile
		document.onkeydown  = mvpEntretien.preventDefaultForScrollKeys;
	}

	this.enableScroll = function() {
		if (window.removeEventListener)
			window.removeEventListener('DOMMouseScroll', mvpEntretien.preventDefault, false);
		window.onmousewheel = document.onmousewheel = null;
		window.onwheel = null;
		window.ontouchmove = null;
		document.onkeydown = null;
	}

	this.isScrolledIntoView = function(elem) {
		var $elem = $(elem);
		var $window = $(window);

		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();

		var elemTop = $(elem).offset().top;
		var elemBottom = elemTop + $(elem).height();

		return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}

	this.callPageList = function(newpage, currentPage) {
		var formData = {
			'isScroll'	: 1,
			'newpage'	: newpage
		};
		$.post("/entretenir-reparer/liste?page=" + newpage, formData, function (msg) {
			var newContentLi = '';
			if (!document.getElementById('_page-order-' + msg.newPage)) {
				newContentLi = '<div id="_page-order-' + msg.newPage + '" class="_lazyLoadContainer page_liste" data-page="' + msg.newPage + '"><p>Page ' + msg.newPage + '</p><div class="grid_3 bloc_fp">';
				for(var i = 0, len = msg.datas.length; i < len; i++) {
					if (i == 0) {
						newContentLi += '<article class="_lazyLoadFirst">';
					} else if (i == len-1) {
						newContentLi += '<article class="_lazyLoadLast">';
					} else {
						newContentLi += '<article>';
					}
					// newContentLi += '<figure><img style="100%" src="https://medias.ooreka.fr/public/MVP/media/'+ msg.datas[i].image +'-preview.JPEG" alt="'+ msg.datas[i].title +'">';
					newContentLi += '<figure><img style="100%" src="https://medias.ooreka.fr/usage=main:orientation=horizontal/'+ msg.datas[i].image +'" alt="'+ msg.datas[i].title +'">';
					if (msg.datas[i].imageCopyright)
						newContentLi += '<figcaption class="copyright">'+ msg.datas[i].imageCopyright +'</figcaption>';
					newContentLi += '</figure>';
					if (msg.datas[i].art.period || msg.datas[i].art.nbrPeople || msg.datas[i].art.difficulty) {
						newContentLi += '<div>';
						// Difficulty
						if (msg.datas[i].art.difficulty == 'easy')
							newContentLi += '<span>Débutant</span>';
						else if (msg.datas[i].art.difficulty == 'medium')
							newContentLi += '<span>Moyen</span>';
						else if (msg.datas[i].art.difficulty == 'hard')
							newContentLi += '<span>Confirmé</span>';
						else
							newContentLi += '<span>-</span>';
						// Period
						if (msg.datas[i].art.period)
							newContentLi += '<span>'+ msg.datas[i].art.period +'</span>';
						else
							newContentLi += '<span>-</span>';
						// NbrPeople
						if (msg.datas[i].art.nbrPeople)
							newContentLi += '<span>'+ msg.datas[i].art.nbrPeople +'</span>';
						else
							newContentLi += '<span>-</span>';
						newContentLi += '</div>';
					}
					newContentLi += '<p class="icon icon-chevron titre"><a href="'+ msg.datas[i].url +'">'+ msg.datas[i].title +'</a></p></article>';
				}
				newContentLi += '</div>';
				currentPage = parseInt(currentPage);
				var nextPage = parseInt(msg.newPage);
				if (currentPage < nextPage) {
					$("#_page-order-" + currentPage).after(newContentLi);
				} else if (currentPage > nextPage) {
					$("#_page-order-" + currentPage).before(newContentLi);
					// adjust scroll
					item_height = $("#_page-order-" + currentPage).height();
      					window.scrollTo(0, $(window).scrollTop()+item_height);
				}
			}
		});
		return false;
	}

	this.mainFunction = function() {
		var lastScroll = $(window).scrollTop();
		// scroll down to hide empty room
		// Si on est pas sur la première page, on décalle le scroll
		var page = $('._lazyLoadContainer').attr('data-page');
		if (page != 1) {
			var headerHeight = $('.header_mvp').height();
			head_height = $('._lazyLoadContainer').first().offset().top-(headerHeight+60);
			window.scrollTo(0, head_height);
			$('._lazyLoadContainer').first().offset().top;
		}
		var currentTitle = $('title').html();
		var tmpTitle = currentTitle.substr(0, (currentTitle.length-8));
		$(window).scroll(function (event) {
			var scrollPosition = $(window).scrollTop();
			// Change le numéro de page dans l'url
			elem = $('._lazyLoadContainer');
			$("._lazyLoadContainer").each(function() {
				// Height du premier article de la page afficher
				var firstElemHeight = $(this).find('._lazyLoadFirst').height();
				if ($(this).offset().top+firstElemHeight > $(window).scrollTop()) {
					var urlPage = ($(this).attr('data-page'));
					history.pushState(null, null, "/entretenir-reparer/liste?page=" + urlPage);
					$('title').html(tmpTitle + " – Page " + urlPage + " - Ooreka");
					return false;
				}
			});
			// Check scroll vers le bas
			if (scrollPosition > lastScroll) {
				var classExist = document.getElementsByClassName('_lazyLoadLast');
               			if (classExist.length > 0) {
					var page = $('._lazyLoadContainer').last().attr('data-page');
					elem = $('._lazyLoadContainer ._lazyLoadLast').last();
					if (mvpEntretien.isScrolledIntoView(elem)) {
						var newpage = parseInt(page)+1;
						mvpEntretien.callPageList(newpage, page);
					}
				}
			}
			// Check scroll vers le haut
			if (scrollPosition < lastScroll)  {
				var page = $('._lazyLoadContainer').first().attr('data-page');
				if (page > 1) {
					elem = $('._lazyLoadContainer ._lazyLoadFirst').first();
					if (mvpEntretien.isScrolledIntoView(elem)) {
						var newpage = parseInt(page)-1;
						mvpEntretien.callPageList(newpage, page);
					}
				}
			}
			lastScroll = $(window).scrollTop();
		});
	};
}