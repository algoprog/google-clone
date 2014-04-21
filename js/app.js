/*
Google Clone 2.0
Developed by GreekDev

https://github.com/greekdev/google-clone
*/

app_name = "Google Clone 2.0";
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
		if(e.keyCode==13){
			go_search();
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
if(no_search==0){
	if(tab=='web'){
		get_results(0);
	}else if(tab=='images'){
		get_images(0);
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
	}
	if(no_get==0){
	gurl = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&num=10&prettyPrint=false&source=gcsc&gss=.com&sig=ee93f9aae9c9e9dba5eea831d506e69a&cx=partner-pub-8993703457585266%3A4862972284&googlehost=www.google.com&q="+query;
	
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
				}
				$.each(response.results, function(index, item){
					$("#res").append("<a href='"+item.url+"' target='blank' class='rl'>"+item.title+"</a><br/><span class='g'>"+item.visibleUrl+"</span><br/>"+item.content+"<br/><br/><br/>");
				});
				if(start==0 && response.cursor.resultCount!='0'){
					$("#res_img").hide();
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

function get_images(start){
	$("#q").googleSuggest({service: "images"});
	ls = 1;
	tab = 'images';
	page = start;
	select("ti");
	if(no_fade==0){
		$("#res").css({"opacity":"0.4"});
		$("#res_img").css({"opacity":"0.4"});
	}
	if(no_get==0){
	gurl = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&num=10&prettyPrint=false&source=gcsc&gss=.com&sig=ee93f9aae9c9e9dba5eea831d506e69a&searchtype=image&cx=partner-pub-8993703457585266%3A4862972284&googlehost=www.google.com&q="+query;
	
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

$(window).scroll(function(){
    if($(window).scrollTop() >= $(document).height() - $(window).height() - 200 && ls==0){
        if(tab=='web'){
			no_fade = 1;
			get_results(page+1);
		}else if(tab=='images'){
			no_fade = 1;
			get_images(page+1);
		}
    }
});

function clear(){
	page = 0;
	$("#res").hide();
	$("#res").html("");
	$("#res_img").hide();
	$("#res_img").html("");
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
	$("#info").hide();
	$(".tabs").hide();
	$(".main").show();
	$(".footer").show();
	$("#sug").val("");
	$("#q").val("");
	$("#qs").val("");
	$("#qs").focus();
}
