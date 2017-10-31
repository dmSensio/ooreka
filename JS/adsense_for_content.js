var google_adnum = 0;
/* La variable JavaScript 'xtn2' apparaissant dans les appels au tracking XiTi est définie dans le footer des sites. */
function google_ad_request_done(google_ads) {
	var s = '';
	var i;
	if (google_ads.length == 0)
		return;
	if (google_ads[0].type == "flash") {
		s += "<center>" +
			"<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\"" +
			" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0\"" +
			" WIDTH=\"" + google_ad.image_width + "\" HEIGHT=\"" + google_ad.image_height + "\">" +
			"<PARAM NAME=\"movie\" VALUE=\"" + google_ad.image_url + "\" />" +
			"<PARAM NAME=\"quality\" VALUE=\"high\" />" +
			"<PARAM NAME=\"AllowScriptAccess\" VALUE=\"never\">" +
			"<EMBED src=\"" + google_ad.image_url + "\"" +
			" WIDTH=\"" + google_ad.image_width + "\" HEIGHT=\"" + google_ad.image_height + "\"" +
			" TYPE=\"application/x-shockwave-flash\"" +
			" AllowScriptAccess=\"never\"" +
			" PLUGINSPAGE=\"https://www.macromedia.com/go/getflashplayer\"></EMBED></OBJECT>" +
			"</center>";
	} else if (google_ads[0].type == "image") {
		s += "<center><a href=\"" + google_ads[0].url + "\" target=\"_top\" title=\"" + google_ads[0].visible_url + "\" " +
			"onclick=\"return (xt_click(this, 'C', xtn2, 'Adsense', 'A'));\" " +
			"onmouseout=\"window.status=''\" onmouseover=\"window.status='" + google_ads[0].visible_url + "'; return true\">" +
			"<img border=\"0\" src=\"" + google_ads[0].image_url + "\" width=\"" + google_ads[0].image_width + "\" " +
			"height=\"" + google_ads[0].image_height + "\"></a></center>";
	} else if (google_ads[0].type == "html") {
		s += "<center>" + google_ads[0].snippet + "</center>";
	} else {
		s += "<div class=\"google-afc-zone\">" +
			"<div class=\"google-afc-baseline\"><a href=\"" + google_info.feedback_url + "\">Annonces Google</a></div>";
		for(i = 0; i < google_ads.length; ++i) {
			s += "<div class=\"google-afc-ad\">" +
				"<div class=\"google-afc-title\"><a href=\"" + google_ads[i].url + "\" " +
					"onclick=\"return (xt_click(this, 'C', xtn2, 'Adsense', 'A'));\" " +
					"onmouseover=\"window.status='" + google_ads[0].visible_url + "'\" " +
					"onmouseout=\"window.status=''\">" + google_ads[i].line1 + "</a></div>" +
				"<div class=\"google-afc-text\">" + google_ads[i].line2 + " " + google_ads[i].line3 + "</div>" +
				"<div class=\"google-afc-link\"><a href=\"" + google_ads[i].url + "\" " +
					"onclick=\"return (xt_click(this, 'C', xtn2, 'Adsense', 'A'));\" " +
					"onmouseover=\"window.status='" + google_ads[0].visible_url + "'\" " +
					"onmouseout=\"window.status=''\">" + google_ads[i].visible_url + '</a></div>' +
				"</div>";
		}
		s += "</div>";
	}
	if (google_ads[0].bidtype == "CPC") { /* insert this snippet for each ad call */
		google_adnum = google_adnum + google_ads.length;
	}
	document.write(s);
	return;
}
