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
  if(typeof templates[template] === 'undefined' && $('#'+template).length){
    templates[template]= {render:templates_render,template:$('#'+template).html()}
  }
  if(typeof templates[template] !== 'undefined'){
    return templates[template].render(data, templates);
  }else{
    return gform.m(template,_.extend({},data||{},templates_partials))
  }
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
  toString: function(name,display){
		if(!display){
			if(typeof this.combo !== 'undefined'){
				return '<dt>'+this.label+'</dt> <dd>'+(this.combo.value||'(empty)')+'</dd><hr>'
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
  defaults:{strict:true,search:"/api/users/search/{{search}}{{value}}",format:{title:'{{{label}}}{{^label}}User{{/label}} <span class="text-success pull-right">{{value}}</span>',label:"{{first_name}}{{#last_name}} {{last_name}}{{/last_name}}",value:"{{email}}", display:'{{first_name}} {{last_name}}<div style="color:#aaa">{{email}}</div>'}}
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
  defaults:{options: 'files',custom:{name:"addFile",display:'<div style="padding:10px;color:#084010;border-top:solid 1px #333">Upload New File <span class="pull-right"><i class="fa fa-upload"></i></span></div>',action:function(e){
    $('div#myId').click()

  }},format:{title:'<i class="fa fa-paperclip"></i> {{{label}}}{{^label}}Attachement{{/label}}',label:"{{name}}",value:"{{id}}",display:'<div style="height:50px;padding-left:60px;position:relative" href="{{path}}" target="_blank"><div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}background-image: url({{path}});background-size: contain;background-repeat: no-repeat;background-position: center;{{/icon}}position:absolute;top:0px;left:5px">{{{icon}}}</div> {{name}} <span class="pull-right">{{date}}</span></div>'}}
})
    
gform.stencils.signaturePad = `
<style>.signaturePad-canvas{border:solid 1px #bbb;} 
.has-error .signaturePad-canvas{border-color:red;}</style>
<div class="row clearfix form-group {{modifiers}} data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
    {{/label}}
    <canvas class="signaturePad-canvas" width="567" height="200"></canvas>

	<div class="">
		<div class="input-group" style="width:100%" contentEditable="false"> 
        </div>
        <center style="color:#888"> {{{help}}}{{^help}}Sign Above{{/help}}</center>
        <span class="font-xs text-danger" style="display:block;"></span>
		{{>_actions}}
	</div>
</div>`;
    gform.types['signaturePad'] = _.extend({}, gform.types['input'], gform.types['collection'], {
    set: function(value) {
        if(typeof value == 'undefined' || value == null){
            this.signaturePad.clear();
        }else{
            this.signaturePad.fromData(value);
        }
    },
    toString: function(name, report) {
        if(!report){
            return '<dt>'+this.label+'</dt> <dd><img src="'+( this.signaturePad.toDataURL())+'" alt="(Empty)"/></dd><hr>'
          }else{
            return  this.signaturePad.toDataURL();
          }
    },
    get: function() {
        // return '<img src='+( this.signaturePad.toDataURL("image/svg+xml"))+' alt="(Empty)" style="border:solid 1px"/>'
        // return '<img src='+( this.signaturePad.toDataURL())+' alt="(Empty)"/>'
        return  this.signaturePad.toDataURL();
        // return  this.signaturePad.toData();
    },
    resizeCanvas:function() {
      // This part causes the canvas to be cleared
      this.canvas.width = this.owner.container.offsetWidth||this.canvas.width;

    
      // This library does not listen for canvas changes, so after the canvas is automatically
      // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
      // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
      // that the state of this library is consistent with visual state of the canvas, you
      // have to clear it manually.
      this.signaturePad.clear();
    },
    initialize: function() {
        this.canvas = this.el.querySelector("canvas.signaturePad-canvas");

        
        this.signaturePad = new SignaturePad(this.canvas,{onEnd:function(e){
          this.owner.trigger('input')
        }.bind(this),onBegin:function(e){
          this.owner.trigger('change')
        }.bind(this)});
        window.onresize = gform.types['signaturePad'].resizeCanvas.bind(this);
        setTimeout(gform.types['signaturePad'].resizeCanvas.bind(this), 200);

        
        // this.owner.on('initialized', function(f) {
        //   gform.types['signaturePad'].resizeCanvas.call(f);
        // }.bind(null,this));
        gform.types[this.type].setLabel.call(this);


    },satisfied:function(){
        return !this.signaturePad.isEmpty();
    },focus:function(){

    }
  });


$g = {
  form:gform,
  forms:gform.instances,
  render:gform.m,
  modal:modal,
  uuid:generateUUID,
  grid:GrapheneDataGrid,
  apps:{}
}
if(typeof Berry !== 'undefined'){
Berry.validations.is_https = {
    method: function(value) {
        return value.startsWith("https://");
    },
    message: 'Basic Auth Routes must start with "https://"'
}}

var mime_type_icon_map = {
  // Media
  image: "fa-file-image-o",
  audio: "fa-file-audio-o",
  video: "fa-file-video-o",
  // Documents
  "application/pdf": "fa-file-pdf-o",
  "application/msword": "fa-file-word-o",
  "application/vnd.ms-word": "fa-file-word-o",
  "application/vnd.oasis.opendocument.text": "fa-file-word-o",
  "application/vnd.openxmlformats-officedocument.wordprocessingml":
    "fa-file-word-o",
  "application/vnd.ms-excel": "fa-file-excel-o",
  "application/vnd.openxmlformats-officedocument.spreadsheetml":
    "fa-file-excel-o",
  "application/vnd.oasis.opendocument.spreadsheet": "fa-file-excel-o",
  "application/vnd.ms-powerpoint": "fa-file-powerpoint-o",
  "application/vnd.openxmlformats-officedocument.presentationml":
    "fa-file-powerpoint-o",
  "application/vnd.oasis.opendocument.presentation": "fa-file-powerpoint-o",
  "text/plain": "fa-file-text-o",
  "text/html": "fa-file-code-o",
  "application/json": "fa-file-code-o",
  // Archives
  "application/gzip": "fa-file-archive-o",
  "application/zip": "fa-file-archive-o"
}



debug = {};
Object.defineProperty(debug,'about',{
  get: function(){
    console.log('%c Workflow:\t%c'+mappedData.workflow.name+' %c(ID: '+mappedData.workflow.instance.workflow_id+')','color: #d85e16','color: #aaa','color: #aaa')
    console.log('%c Instance:\t%c'+mappedData.workflow.instance.name+' %c(ID: '+mappedData.workflow.instance.id+')','color: #d85e16','color: #aaa','color: #aaa')
    console.log('%c Version:\t%c'+(mappedData.workflow.instance.version_id||'Latest')+' %c(Using ID: '+mappedData.workflow.instance.version.id+')  %cUpdated  %c'+mappedData.workflow.instance.updated_at,'color: #d85e16','color: #aaa','color: #aaa','color: #d85e16','color: #aaa')
  },
  configurable: false,
});
Object.defineProperty(debug,'summary',{
  get: function(){
    console.log('%c Status:\t\t%c'+mappedData.status,'color: #d85e16','color: #aaa')
    console.log('%c State:\t\t\t%c'+mappedData.state,'color: #d85e16','color: #aaa')

    if(typeof gform.instances.display !== 'undefined'){
      console.log('%c _flowstate:\t%c'+gform.instances.display.get('_flowstate'),'color: #d85e16','color: #aaa')
      console.log('%c Current Form Data:','color: #0088FF')
      console.log(gform.instances.display.get('_state'))
    }
    console.log('%c Template Data:','color: #0088FF')
    console.log(mappedData)
  },
  configurable: false,
});
Object.defineProperty(debug,'form',{
  get: function(){
    if(typeof gform.instances.display !== 'undefined'){
      return gform.instances.display;
    }
  },
  configurable: false,
});
Object.defineProperty(debug,'data',{
  get: function(){
    return mappedData;
  },
  configurable: false,
});

Object.defineProperty(debug,'history',{
  get: function(){
    console.table(_.map(mappedData.history,function(item){
      // item = _.omit(item,'is','log','file','data','date');
      item.owner = item.user.first_name+' '+item.user.last_name;
      item.created_at = item.created_at.date+' '+item.created_at.time;
      item.updated_at = item.updated_at.date+' '+item.updated_at.time;
      if(item.assignemnt.type == "group"){
        item.assignemnt = "Group:"+item.assignemnt.id
      }else{
        item.assignemnt = "User:"+item.assignemnt.id
      }
      item.actor = item.actor.first_name+' '+item.actor.last_name;
      item.previous = item.state+'('+item.status+')';

      // item.user = item.user.first_name+' '+item.user.last_name;
      return _.omit(item,'is','log','file','data','date','user');
    }))
  },
  configurable: false,
});
Object.defineProperty(window,'help',{
  get: function(){
    console.log('%c debug.about\t%c - info about the workflow configuration','color: #0088FF','color: #aaa')
    console.log('%c debug.summary\t%c - summary','color: #0088FF','color: #aaa')
    console.log('%c debug.form\t\t%c - reference to the displayed form','color: #0088FF','color: #aaa')
    console.log('%c debug.data\t\t%c - template data','color: #0088FF','color: #aaa')
    console.log('%c debug.history\t%c - template data','color: #0088FF','color: #aaa')
  },
  configurable: false,
});

Object.defineProperty(debug,'app',{
  get: function(){
    return cb.collections[0].getItems()[0]
  },
  configurable: false,
});
