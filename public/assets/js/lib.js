toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
function render(template, data){
  if(typeof templates[template] === 'undefined'){
    templates[template] =  Hogan.compile($('#'+template).html());
  }
return templates[template].render(data, templates);
}
function modal(options) {
  $('#myModal').remove();
  this.ref = $(render('modal', options));

  options.legendTarget = this.ref.find('.modal-title');
  options.actionTarget = this.ref.find('.modal-footer');

  $(this.ref).appendTo('body');

  if(options.content) {
    $('.modal-body').html(options.content);
    options.legendTarget.html(options.legend);
  }else{
    options.autoDestroy = true;
    var myform = this.ref.find('.modal-body').berry(options).on('destroy', $.proxy(function(){
      this.ref.modal('hide');
    },this));

    this.ref.on('shown.bs.modal', $.proxy(function () {
      this.$el.find('.form-control:first').focus();
    },myform));
  }
  if(options.onshow){
    this.ref.on('shown.bs.modal', options.onshow);
  }  
  this.ref.modal();
  return this;
};


function processFilter(options){
  options = options || {};
	var	currentTarget = options.currentTarget || this.currentTarget;
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
$('body').on('keyup','[name=filter]', function(event){

	this.currentTarget = event.currentTarget;
	this.selector = $(this).data('selector');
	if(!$(this).hasClass("delay")){
		processFilter.call(this);
	}else{
  	clearTimeout(filterTimer);
  	filterTimer=setTimeout($.proxy(processFilter, this), 300);
	}
});

templates.listing = Hogan.compile('<ol class="list-group">{{#widgets}}<li data-guid="{{guid}}" class="list-group-item"><div class="handle"></div>{{widgetType}} - {{title}}</li>{{/widgets}}</ol>')
gform.types['user']= _.extend({}, gform.types['smallcombo'], {
  toString: function(name,display){
		if(!display){
			if(typeof this.combo !== 'undefined'){
				return '<dt>'+this.label+'</dt> <dd>'+(this.combo.innerText||'(empty)')+'</dd><hr>'
			}else{
				return '<dt>'+this.label+'</dt> <dd>'+(this.get()||'(empty)')+'</dd><hr>'
			}
    }else{
      if(typeof this.options !== 'undefined' && this.options.length){
        return _.find(this.options,{unique_id:this.value})||this.value;
      }else{
        return this.value;
      }
		}
	},
  defaults:{strict:true,search:"/api/users/search/{{search}}{{value}}",format:{title:'{{{label}}}{{^label}}User{{/label}} <span class="text-success pull-right">{{value}}</span>',label:"{{first_name}}{{#last_name}} {{last_name}}{{/last_name}}",value:"{{unique_id}}", display:'{{first_name}} {{last_name}}<div style="color:#aaa">{{email}}</div>'}}
})
gform.types['user_email']= _.extend({}, gform.types['user'], {
  defaults:{value:"{{email}}",}
})
gform.types['group']= _.extend({}, gform.types['smallcombo'], {
  toString: function(name,display){
		if(!display){
			if(typeof this.combo !== 'undefined'){
				return '<dt>'+this.label+'</dt> <dd>'+(this.combo.innerText||'(empty)')+'</dd><hr>'
			}else{
				return '<dt>'+this.label+'</dt> <dd>'+(this.get()||'(empty)')+'</dd><hr>'
			}
    }else{
      if(typeof this.options !== 'undefined' && this.options.length){
        return _.find(this.options,{id:parseInt(this.value)})||this.value;
      }else{
        return this.value;
      }
		}
	},
  defaults:{options: '/api/groups?members=20',format:{title:'{{{label}}}{{^label}}Group{{/label}} <span class="text-success pull-right">{{value}}</span>',label:"{{name}}",value:"{{id}}"}}
})
gform.types['files']= _.extend({}, gform.types['smallcombo'], {
  toString: function(name,display){
		if(!display){
			if(typeof this.combo !== 'undefined'){
				return '<dt>'+this.label+'</dt> <dd>'+(this.combo.innerText||'(empty)')+'</dd><hr>'
			}else{
				return '<dt>'+this.label+'</dt> <dd>'+(this.get()||'(empty)')+'</dd><hr>'
			}
    }else{
      return _.find(this.options,{id:parseInt(this.value)})||{}

		}
	},
  defaults:{options: 'files',format:{title:'<i class="fa fa-paperclip"></i> {{{label}}}{{^label}}Attachement{{/label}}',label:"{{name}}",value:"{{id}}",display:'<div style="height:50px;padding-left:60px;position:relative" href="{{path}}" target="_blank"><div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}background-image: url({{path}});background-size: contain;background-repeat: no-repeat;background-position: center;{{/icon}}position:absolute;top:0px;left:5px">{{{icon}}}</div> {{name}} <span class="pull-right">{{date}}</span></div>'}}
})