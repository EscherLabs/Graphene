(function($) {
  $.score = function(base, abbr, offset) {
    if(abbr.length === 0) return 0.9;
    if(abbr.length > base.length) return 0.0;
    
    for (var i = abbr.length; i > 0; i--) {
      var sub_abbr = abbr.substring(0,i);
      var index = base.indexOf(sub_abbr);
      
      if(index < 0) continue;
      if(index + abbr.length > base.length + offset) continue;
      
      var next_string = base.substring(index+sub_abbr.length);
      var next_abbr = null;
      
      if(i >= abbr.length)
        next_abbr = '';
      else
        next_abbr = abbr.substring(i);
      
      // Changed to fit new (jQuery) format (JSK)
      var remaining_score   = $.score(next_string, next_abbr,offset+index);
      
      if (remaining_score > 0) {
        var score = base.length-next_string.length;
        
        if(index !== 0) {          
          var c = base.charCodeAt(index-1);
          if(c==32 || c == 9) {
            for(var j=(index-2); j >= 0; j--) {
              c = base.charCodeAt(j);
              score -= ((c == 32 || c == 9) ? 1 : 0.15);
            }
          } else {
            score -= index;
          }
        }
        score += remaining_score * next_string.length;
        score /= base.length;
        return score;
      }
    }
    return 0.0;
  };
})(jQuery);

function processFilter(){
	var	currentTarget = this.currentTarget;
	var collection;
	if(this.selector){
		collection = $(this.selector).find('.filterable')
	}else{
		collection = $('.filterable');
	}
	collection.each(
	function(){
    if($.score($(this).text().replace(/\s+/g, " ").toLowerCase(), $(currentTarget).val().toLowerCase() ) > ($(currentTarget).data('score') || 0.40)){
			$(this).removeClass('nodisplay');
		}else{
			$(this).addClass('nodisplay');
		}
	});
}


filterTimer = null;
$('body').on('keyup','[name=filter]', function(event){  debugger;

	this.currentTarget = event.currentTarget;
	this.selector = $(this).data('selector');
	if(!$(this).hasClass("delay")){
		processFilter.call(this);
	}else{
  	clearTimeout(filterTimer);
  	filterTimer=setTimeout($.proxy(processFilter, this), 300);
	}
});



// function processSearch() {
//   var currentTarget = this.currentTarget;
//   var collection;
//   if(this.selector){
//     collection = $(this.selector).find('.filterable')
//   }else{
//     collection = $('.filterable');
//   }
//   var searchCollection = [];
//   collection.each(function(){
//     $(this).addClass('nodisplay');
//     $(this).attr('data-score', $.score($(this).text().replace(/\s+/g, " ").toLowerCase(), $(currentTarget).val().toLowerCase() )*10); 
//   });
//   var ordered = collection.sort(function (a, b) {
//     return $(b).data("score")-$(a).data("score")
//   });
//   $(this.selector).empty();
//   $(this.selector).html(ordered);
//   $(this.selector).find('.filterable').slice(0, 10).removeClass('nodisplay')
// }

// searchTimer = null;
// $('body').on('keyup','[name=search]', function(event){
//   this.currentTarget = event.currentTarget;
//   this.selector = $(this).data('selector');
//   if(!$(this).hasClass("delay")){
//     processSearch.call(this);
//   }else{
//     clearTimeout(searchTimer);
//     searchTimer=setTimeout($.proxy(processSearch, this), 500);
//   }
// });
