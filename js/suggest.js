$.fn.googleSuggest = function(opts){
  opts = $.extend({service: 'web', secure: false}, opts);

  var services = {
    youtube: { client: 'youtube', ds: 'yt' },
    books: { client: 'books', ds: 'bo' },
    products: { client: 'products-cc', ds: 'sh' },
    news: { client: 'news-cc', ds: 'n' },
    images: { client: 'img', ds: 'i' },
    web: { client: 'psy', ds: '' },
    recipes: { client: 'psy', ds: 'r' }
  }, service = services[opts.service];

  opts.source = function(request, response){
    $.ajax({
      url: 'https://clients1.google.com/complete/search',
      dataType: 'jsonp',
      data: {
        q: request.term,
        nolabels: 't',
        client: service.client,
        ds: service.ds
      },
      success: function(data) {
		uquery = data[1][0].toString();
		tquery = uquery.split(",0");
		window.squery = tquery[0];
		if(window.squery!="undefined" && window.squery!=query){
			window.squery = window.squery.replace('<b>','');
			window.squery = window.squery.replace('</b>','');
			window.squery = window.squery.replace('\u003cb\u003e','');
			set_query(window.squery);
			if(window.squery.indexOf($("#q").val())>-1){
				$("#sug").val(query);
			}else{
				$("#sug").val("");
			}
		}
		else if(window.squery=="undefined"){
			set_query("");
		}
        response($.map(data[1], function(item){
          return { value: $("<span>").html(item[0]).text() };
        }).slice(0, 4));
      }
    });  
  };
  
  return this.each(function(){
    $(this).autocomplete(opts);
  });
}
