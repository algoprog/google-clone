/*
Google Clone 2.2
Developed by GreekDev

https://github.com/greekdev/google-clone
*/

app_name = "Google Clone 2.2";
loc = "el";
var squery;

$(document).ready(function(){
	tab = 'web';
	no_search = 0;
	no_get = 0;
	page = 0;
	cnt = 0;
	no_fade = 0;
	window.squery = "";
	query = "";
	search = setTimeout('',1);
	wiki = 0;
	
	$("#q").googleSuggest({service: "web"});
	$("#q").on("autocompleteselect",function(){setTimeout("$('#q').blur(); no_fade = 0; fsearch();",10);});
	$("#q").autocomplete("option", "minLength", 1);
	
	$("#qs").focus();
	
	if(get_hash().indexOf("q=")>=0){
		set_query(get_hash().replace("q=",""));
		$("#qs").val(query);
		instant();
		if(tab=='web'){
			get_results(0);
		}else if(tab=='images'){
			get_images(0);
		}
		$("#q").blur();
		$("#delete").css({"border":"1px solid #D8D8D8", "border-left":"none"});
	}
	
	$("#qs").bind('keyup keypress change cut copy paste', function(){
		setTimeout("instant();",10);
	});
	
	$("#q").bind('keyup keypress cut copy paste', function(e){
		if(e.keyCode==13){
			go_search();
		}
		if(window.squery.indexOf($("#q").val())>-1){
			$("#sug").val(query);
		}else{
			$("#sug").val("");
		}
		if($("#q").val()==""){
			clear();
			$("#x").fadeOut();
			no_search = 1;
			clearTimeout(search);
		}else{
			$("#x").fadeIn();
			clearTimeout(search);
			search = setTimeout("no_search = 0; gsearch();",500);
		}
	});
	
	$(".sbtn").click(function(){
		go_search();
	});
	
	$("#q").blur(function(){
		$("#delete").css({"border":"1px solid #D8D8D8", "border-left":"none"});
	});
	
	$("#q").focus(function(){
		$("#delete").css({"border":"1px solid #81BEF7", "border-left":"none"});
	});
	
	$("#x").click(function(){
		clear();
		$("#q").focus();
		$(this).hide();
    });
	
});

function go_search(){
	$("html, body").animate({ scrollTop: 0 }, 500);
	$("#sug").val("");
	clearTimeout(search);
	$("#q").blur();
	if(window.squery!=$("#q").val()){
		$("#res").css({"opacity":"0.4"});
		no_search = 1;
		set_query($("#q").val());
		if(tab=='web'){
			get_results(0);
		}else if(tab=='images'){
			get_images(0);
		}else if(tab=='videos'){
			get_videos(0);
		}
	}
}

function lucky(){
	window.location = "http://www.google.com/search?hl=en&source=hp&btnI&q="+$("#qs").val();
}

function get_hash(){
	return decodeURIComponent(window.location.hash.substring(1));
}

function instant(){
	$(".main").hide();
	$(".footer").hide();
	$(".top").show();
	$("#q").focus();
	$("#q").val($("#qs").val());
}

function set_query(q){
	no_fade = 0;
	query = q;
	if(query!=""){
		document.title = query + " - " + app_name;
	}else{
		document.title = app_name;
	}
	window.location.replace("#q=" + encodeURIComponent(query));
}

function gsearch(){
if($("html, body").scrollTop()>0){
	$("html, body").animate({ scrollTop: 0 }, 500);
	$(".ui-autocomplete").hide();
}
if(no_search==0){
	if(tab=='web'){
		get_results(0);
	}else if(tab=='images'){
		get_images(0);
	}else if(tab=='videos'){
		get_videos(0);
	}
}
}

function fsearch(){
	$("#sug").val("");
	if(window.squery!=$("#q").val()){
		no_search = 1;
		clearTimeout(search);
		set_query($("#q").val());
		if(query!=""){
			document.title = query + " - " + app_name;
		}else{
			document.title = app_name;
		}
		if(tab=='web'){
			get_results(0);
		}else if(tab=='images'){
			get_images(0);
		}else if(tab=='videos'){
			get_videos(0);
		}
	}
}

function select(sid){
	$(".tabs span").removeClass("selected");
	$("#"+sid).addClass("selected");
}

function get_results(start){
	$("#q").googleSuggest({service: "web"});
	ls = 1;
	tab = 'web';
	page = start;
	select("tw");
	if(no_fade==0){
		$("#res").css({"opacity":"0.4"});
		$("#res_img").css({"opacity":"0.4"});
		$("#res_yt").css({"opacity":"0.4"});
	}
	if(no_get==0){
	gurl = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&num=10&prettyPrint=false&source=gcsc&gss=.com&sig=ee93f9aae9c9e9dba5eea831d506e69a&cx=partner-pub-8993703457585266%3A4862972284&googlehost=www.google.com&hl="+loc+"&q="+query;
	
	if(start>0){
		gurl = gurl + "&start=" + start + 1;
	}
	no_get = 1;
	$.ajax({
		type: "GET",
		url: gurl,
		dataType:"jsonp",
		success: function(response){
			if(response.results){
				if(start==0){
					$("#res").html("");
					wiki = 0;
				}
				$.each(response.results, function(index, item){
					if(item.visibleUrl.indexOf(".wikipedia.org")>=0 && wiki==0){
						wimg = "<img src='' id='wimg'>";
						wtitle = item.title.match(/<b>(.*?)<\/b>/);
					}else{
						wimg = "";
						wtitle = "";
					}
					$("#res").append("<div class='rbox clearfix' onclick='window.open("+'"'+decodeURIComponent(item.url)+'"'+","+'"_blank"'+");'>"+wimg+"<img class='icon' src='https://plus.google.com/_/favicon?domain="+item.visibleUrl+"'/>&nbsp; <span class='rl'>"+item.title+"</span><br/><span class='g'>"+item.visibleUrl+"</span><br/>"+item.content+"<br/></div><br/>");
					if(wtitle!="" && wiki==0) get_thumb(wtitle[1]);
				});
				if(start==0 && response.cursor.resultCount!='0'){
					$("#res_img").hide();
					$("#res_yt").hide();
					$("#res").show();
					$("#query").html(query);
					$("#count").html(response.cursor.resultCount);
					$("#speed").html(response.cursor.searchResultTime);
					$("#info").show();
					$(".tabs").show();
				}
				if(cnt<1){
					cnt++;
					no_get = 0;
					get_results(start+1);
				}else{
					cnt = 0;
					ls = 0;
				}
			}
			$("#res").css({"opacity":"1"});
			no_get = 0;
		}
	});
	}
}

function get_thumb(title){
wiki = 1;
$.ajax({
	type: "GET",
	url: "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&hl="+loc+"&q="+title+"&start=0",
	dataType:"jsonp",
	success: function(response){
		if(response.responseData.results){
			$("#wimg").attr("src", response.responseData.results[0].unescapedUrl);
		}else{
			$("#wimg").hide();
		}
	}
});
}

function get_images(start){
	$("#q").googleSuggest({service: "images"});
	ls = 1;
	tab = 'images';
	page = start;
	select("ti");
	if(no_fade==0){
		$("#res").css({"opacity":"0.4"});
		$("#res_img").css({"opacity":"0.4"});
		$("#res_yt").css({"opacity":"0.4"});
	}
	if(no_get==0){
	gurl = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&num=10&prettyPrint=false&source=gcsc&gss=.com&sig=ee93f9aae9c9e9dba5eea831d506e69a&searchtype=image&cx=partner-pub-8993703457585266%3A4862972284&googlehost=www.google.com&hl="+loc+"&q="+query;
	
	if(start>0){
		gurl = gurl + "&start=" + start + 1;
	}
	no_get = 1;
	$.ajax({
		type: "GET",
		url: gurl,
		dataType:"jsonp",
		success: function(response){
			if(response.results){
				if(start==0){
					$("#res_img").html("");
				}
				$.each(response.results, function(index, item){
					$("#res_img").append("<div class='image'><a href='"+item.unescapedUrl+"' target='blank'><img src='"+item.tbUrl+"'></a></div>");
				});
				if(start==0 && response.cursor.resultCount!='0'){
					$("#res").hide();
					$("#res_yt").hide();
					$("#res_img").show();
					$("#query").html(query);
					$("#count").html(response.cursor.resultCount);
					$("#speed").html(response.cursor.searchResultTime);
					$("#info").show();
					$(".tabs").show();
				}
				if(cnt<10){
					cnt++;
					no_get = 0;
					get_images(start+1);
				}else{
					cnt = 0;
					ls = 0;
				}
			}
			$("#res_img").css({"opacity":"1"});
			no_get = 0;
		}
	});
	}
}

function get_videos(start){
	$("#q").googleSuggest({service: "youtube"});
	ls = 1;
	tab = 'videos';
	page = start;
	select("ty");
	if(no_fade==0){
		$("#res").css({"opacity":"0.4"});
		$("#res_img").css({"opacity":"0.4"});
		$("#res_yt").css({"opacity":"0.4"});
	}
	if(no_get==0){
	gurl = "http://gdata.youtube.com/feeds/api/videos?alt=jsonc&v=2&lr=en&orderby=viewCount&max-results=20&hl="+loc+"&q="+query;
	gurl = gurl + "&start-index=" + 2*start + 1;
	
	no_get = 1;
	$.ajax({
		type: "GET",
		url: gurl,
		dataType:"jsonp",
		success: function(response){
			if(response.data.items){
				if(start==0){
					$("#res_yt").html("");
				}
				$.each(response.data.items, function(index, item){
					var cdate = new Date().getTime()/1000;
					pdate = toTimestamp(item.uploaded);
					var diff = cdate-pdate;
					if(diff<0){
						diff = -diff;
					}
					date = timeago(diff);
					$("#res_yt").append("<div class='video'><a href='http://youtube.com/watch?v="+item.id+"' target='blank'><img src='"+item.thumbnail.sqDefault+"'/><div class='duration'><p style='padding:3px; margin:0px;'>"+get_duration(item.duration)+"</p></div></a><a href='http://youtube.com/watch?v="+item.id+"' class='rl' target='blank'>"+item.title+"</a><br/><a href='http://youtube.com/user/"+item.uploader+"'>"+item.uploader+"</a> - "+date+" - "+number_format(item.viewCount)+" views</div>");
				});
				if(start==0 && response.data.totalItems!='0'){
					$("#res").hide();
					$("#res_img").hide();
					$("#res_yt").show();
					$("#query").html(query);
					$("#count").html(number_format(response.data.totalItems));
					$("#speed").html('~0.2');
					$("#info").show();
					$(".tabs").show();
				}
				if(cnt<1){
					cnt++;
					no_get = 0;
					get_videos(start+1);
				}else{
					cnt = 0;
					ls = 0;
				}
			}
			$("#res_yt").css({"opacity":"1"});
			no_get = 0;
		}
	});
	}
}

$(window).scroll(function(){
    if($(window).scrollTop() >= $(document).height() - $(window).height() - 200 && ls==0){
        if(tab=='web'){
			no_fade = 1;
			get_results(page+1);
		}else if(tab=='images'){
			no_fade = 1;
			get_images(page+1);
		}else if(tab=='videos'){
			no_fade = 1;
			get_videos(page+1);
		}
    }
});

function number_format(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function mround(num, dec){
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function get_duration(duration){
	var dur1 = mround((duration/60), 0);
	if((duration % 60)<10){
		var dur = '0'+(duration % 60);
	}else{
		var dur = duration % 60;
	}
	return dur1+':'+dur;
}

function toTimestamp(strDate){
	var datum = Date.parse(strDate);
	return datum/1000;
}
	
function timeago(time_difference){
	var seconds = time_difference; 
	var minutes = Math.round(time_difference/60);
	var hours = Math.round(time_difference/3600); 
	var days = Math.round(time_difference/86400); 
	var weeks = Math.round(time_difference/604800); 
	var months = Math.round(time_difference/2419200); 
	var years = Math.round(time_difference/29030400); 
		
	if(seconds <= 60){
		return seconds + " seconds ago"; 
	}
	else if(minutes <=60){
		if(minutes==1){
			return "1 minute ago"; 
		}
		else{
			return minutes + " minutes ago"; 
		}
	}
	else if(hours <=24){
		if(hours==1){
			return "1 hour ago";
		}
		else{
			return hours + " hours ago";
		}
	}
	else if(days <=7){
		if(days==1){
			return "1 day ago";
		}
		else{
			return days + " days ago";
		} 
	}
	else if(weeks <=4){
		if(weeks==1){
			return "1 week ago";
		}
		else{
			return weeks + " weeks ago";
		}
	}
	else if(months <=12){
		if(months==1){
			return "1 month ago";
		}
		else{
			return months + " months ago";
		} 
	}
	else{
		if(years==1){
			return "1 year ago";
		}
		else{
			return years + " years ago";
		}
	}
}

function clear(){
	page = 0;
	$("#res").hide();
	$("#res").html("");
	$("#res_img").hide();
	$("#res_img").html("");
	$("#res_yt").hide();
	$("#res_yt").html("");
	$("#info").hide();
	$(".tabs").hide();
	$("#q").val("");
	$("#qs").val("");
	$("#sug").val("");
	set_query("");
	window.squery = "";
	window.location.replace("#");
	document.title = app_name;
}

function reset(){
	tab = 'web';
	page = 0;
	no_search = 1;
	set_query("");
	window.squery = "";
	window.location.replace("#");
	$(".top").hide();
	$("#res").html("");
	$("#res").hide();
	$("#res_img").hide();
	$("#res_img").html("");
	$("#res_yt").hide();
	$("#res_yt").html("");
	$("#info").hide();
	$(".tabs").hide();
	$(".main").show();
	$(".footer").show();
	$("#sug").val("");
	$("#q").val("");
	$("#qs").val("");
	$("#qs").focus();
}
