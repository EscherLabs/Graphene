toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": true,
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

modal = (options, data) => {

  if(typeof options == 'string'){
    options = {content:options};
  }
  var hClass = ''
  switch(options.status){
    case 'error':
      hClass = 'bg-danger';
      break;
    case 'success':
    case 'primary':
    case 'info':
    case 'warning':
      hClass = 'bg-'+options.status;
      break;
  }
  let mm =  new gform({
    modal:{ header_class: hClass},
    ...options,
    data:{...data,...options.data},
    fields:[
      {
        type:'output',
        name:'modal',
        label:false,
        format:{},
        value:$g.render(options.content,_.extend({}, options.partials, data))
      },
      ...(options.fields||[])],
    actions:(!!options.footer)?[]:[{type:'cancel',label:'<i class="fa fa-times"></i> Close',"modifiers": "btn btn-default pull-right"}],

  }).modal().on('cancel', e => {
    e.form.dispatch('close');
    e.form.destroy();
  });
  mm.ref = $(mm.el);
  return mm;
}

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
gform.types['user_id']= _.extend({}, gform.types['smallcombo'], {
  toString: function(name,display){
		if(!display){
			if(typeof this.combo !== 'undefined'){
				return '<dt>'+this.label+'</dt> <dd>'+(this.combo.innerText||'(empty)')+'</dd><hr>'
			}else{
				return '<dt>'+this.label+'</dt> <dd>'+(this.get()||'(empty)')+'</dd><hr>'
			}
    }else{
      if(typeof this.options !== 'undefined' && this.options.length){
        return _.find(this.options,{id:this.value})||this.value;
      }else{
        return this.value;
      }
		}
	},
  defaults:{strict:true,search:"/api/users/search/{{search}}{{value}}",format:{title:'{{{label}}}{{^label}}User{{/label}} <span class="text-success pull-right">{{value}}</span>',label:"{{first_name}}{{#last_name}} {{last_name}}{{/last_name}}",value:function(item){return item.id}, display:'{{first_name}} {{last_name}}<div style="color:#aaa">{{email}}</div>'}, template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}'}
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
  defaults:{template:"{{display.group_id}}",options: '/api/groups?members=20',format:{title:'{{{label}}}{{^label}}Group{{/label}} <span class="text-success pull-right">{{value}}</span>',label:"{{name}}",value:"{{id}}"}}
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
gform.types['endpoint'] = {...gform.types['smallcombo'],
  defaults:{label:true,strict:true, options: 'endpoints',format:{label:'{{name}}',value:"{{id}}",display:'<dl class="dl-horizontal" style="margin-bottom:0"><dt>Name:</dt><dd>{{name}}</dd><dt>URL:</dt><dd>{{config.url}}</dd><dt>User:</dt><dd>{{config.username}}</dd></dl>'}},
  setLabel (){
    gform.toggleClass(this.labelEl,'required',this.required)
    this.labelEl.innerHTML = this.owner.options.data.resources[this.parent.index].name+this.suffix;
    
  },  
  render: function(){
    if(typeof this.mapOptions == 'undefined'){
      this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
      this.mapOptions.on('change', function(){
        this.options = this.mapOptions.getoptions()
        if(this.shown){
          this.renderMenu();
        }
        if(typeof this.value !== 'undefined'){
          gform.types[this.type].set.call(this, this.value);
        }
        }.bind(this))
    }
    this.options = this.mapOptions.getoptions();
    this.value = this.value || "";
    this.help = ($g.collections.get('endpoints').find(endpoint=>endpoint.id == this.value)||{config:{url:''}}).config.url
    + (this.owner.options.data.resources.find(resource=>resource.name == this.owner.options.data.resources[this.parent.index].name)||{path:''}).path	
    
    return gform.render('smallcombo', this);				
  }
}


gform.stencils.signaturePad = `
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
      this.canvas.width = (this.el.offsetWidth)?this.el.offsetWidth-32:this.canvas.width;

    
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


 
gform.stencils.base64_file = `
<style>
  .files .badge{position:absolute;right:10px;bottom:10px;overflow:hidden;text-overflow:ellipsis;max-width:50%}
  .files .badge:hover{max-width:fit-content}
  </style>
<div class="row clearfix form-group {{modifiers}}" data-type="{{type}}">
  {{>_label}}
  {{#label}}
  {{^horizontal}}<div class="col-md-12">{{/horizontal}}
  {{#horizontal}}<div class="col-md-8">{{/horizontal}}
  {{/label}}
  {{^label}}
  <div class="col-md-12">
  {{/label}}
    {{#pre}}<div class="input-group col-xs-12"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
    {{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
      {{#multiple}}
      <small class="count text-muted pull-left" style="display:block;text-align:left;margin:5px">0/{{max}}</small>

      <div style="overflow:hidden;margin-bottom: 10px;"><div class="btn-group pull-right" role="group" aria-label="...">
        <button type="button" class="btn btn-danger gform-clear-all" {{^value}}disabled{{/value}}><i class="fa fa-times"></i> Clear</button>
      </div></div>
      {{/multiple}}
      <div class="dropzone dz-clickable" id="{{id}}"><div class="dz-message">Drop files here to upload</div>
      </div>

      <ul class="files list-group" style="border: none;margin: 0;padding: 0;min-height:0">
      </ul>
    {{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
    {{^post}}{{#pre}}</div>{{/pre}}{{/post}}

    {{>_addons}}
    {{>_actions}}
  </div>
</div>
`;

gform.stencils.base64_file_preview = `<li class="list-group-item ">
  <div><div class="btn-group pull-right" role="group" aria-label="...">
        <button type="button" class="btn btn-danger gform-remove" title="Remove"><i class="fa fa-times"></i></button>
        <button type="button" class="btn btn-info gform-replace" title="Replace"><i class="fa fa-refresh"></i></button>
      </div></div>
      <span class="badge">{{name}}</span>
  <div style="background: #eee;text-align: center;line-height: 120px;border-radius: 20px;overflow: hidden;width: 120px;height: 120px;">{{#icon}}
    <i class="fa {{{icon}}} fa-3x" style="padding-top: 4px;"></i>
    {{/icon}}{{^icon}}<img data-dz-thumbnail /></div>\n {{/icon}} </div></li>`,

Dropzone.autoDiscover = false;
gform.types.base64_file = _.extend({}, gform.types['input'], gform.types['collection'],{
  focus: function() {
    // var e = this.name;
    // this.multiple && (e += "[]"),
    // this.el.querySelector('[name="' + e + '"]').focus()
},
defaults:{format:{uri: '{{{name}}}',options:[]}},
  dataURItoBlob:function(dataURI) {
      'use strict'
      var byteString, 
          mimestring 

      if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
        byteString = atob(dataURI.split(',')[1])
      } else {
        byteString = decodeURI(dataURI.split(',')[1])
      }

      mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]

      var content = new Array();
      for (var i = 0; i < byteString.length; i++) {
          content[i] = byteString.charCodeAt(i)
      }

      return new Blob([new Uint8Array(content)], {type: mimestring});
  },
  updateStatus:function(silent){
    if(!silent)this.trigger('input',this)
    if(this.multiple)this.el.querySelector('.gform-clear-all').disabled = !this.Dropzone.files.length;

    if(this.Dropzone.files.length>=(this.multiple?this.limit:1)){
      this.Dropzone.disable();
      gform.addClass(this.el.querySelector('.dropzone'),'hidden')
    }else{
      this.Dropzone.enable();
      gform.removeClass(this.el.querySelector('.dropzone'),'hidden')
    }
    if(this.el.querySelector('.count') != null){
      var text = this.value.length;
      if(this.limit>1){text+='/'+this.limit;}
      this.el.querySelector('.count').innerHTML = text;
    }

  },
  set:function(value){
    if(typeof value !== 'object')return;
    isDataURLregex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
    if(this.multiple){
      if(typeof value == 'object' && !_.isArray(value)){
        value = [value];
      }
      value=this.value = value||[];
    }else{
      value=this.value = value||{};
    }
    var _this = this;
    _.each(((this.multiple)?value:[value]),function(value){
      if(!_.isEmpty(value) ){
        if(typeof value.dataURI == "string" && !!value.dataURI.match(isDataURLregex)){
          var mockFile = gform.types.base64_file.dataURItoBlob(value.dataURI,value.name);
          // mockFile.contents = value.dataURI;
          mockFile.name = value.name;
          _this.Dropzone.addFile( mockFile);
          
        }else if(typeof value == "object"){
          var mockFile = value;
          mockFile.name = value.name||value.dataURI;
          _this.Dropzone.displayExistingFile(mockFile, gform.m(_this.format.uri, value) ) ;
          _this.Dropzone.files.push(mockFile); 
        }
      }
    })
  },
  get: function() {
    if(this.Dropzone.files.length){
      var val = _.reduce(this.Dropzone.files,function(obj,file){
        if(file instanceof Blob ){
          var temp = _.pick(file, 'type', 'name', 'dataURI')
          temp.dataURI = temp.dataURI;//||file.contents;
          temp.name = temp.name||file.upload.uuid;
        }else{
          var temp = _.pick(file, 'name', 'type')
          temp.dataURI = file.dataURL;
        }
        obj.push(temp)
        return obj;
      },[])
      if(this.multiple){
        
          this.value = val||[];
        }else{
          this.value = val[0]||this.value;
        }   
    }else{
      this.value = (this.multiple)?[]:{};
    }
    return this.value;
  },
  toString: function(name, report) {
    if(!report){
      return gform.m('<dt>{{label}}</dt> <dd>{{#value.dataURI}}<img height=75px src="{{value.dataURI}}"/>{{/value.dataURI}} {{value.name}}{{^value.name}}<span class="text-muted">(empty)</span>{{/value.name}}</dd><hr>', this)
    }else{
      return this.value.dataURI
    }
  },      
  satisfied: function(value) {
    value = value||this.value;
    if(_.isArray(value)){return !!value.length;}
    return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'number' && isNaN(value)) && !_.isEmpty(value));            
  },
  initialize:function(){
    this.el.querySelector("#"+this.id+'.dropzone .dz-message').innerHTML = (this.item.format && this.item.format.message)?this.item.format.message:'Drop files here to upload';
    var onError = function(data){
      this.trigger('change',this,data)
      this.trigger('error',this, data)
      this.trigger('input',this,data)
    }.bind(this)
    var onSuccess = function(data){
      this.trigger('change',this,data)
      this.trigger('success',this, data)
      this.trigger('input',this,data)
    }.bind(this)
    this.Dropzone = new Dropzone(this.el.querySelector("#"+this.id+'.dropzone'), {
      addedfile: function(file) {
        var data = this.options.formelement.get();
        if(this.options.formelement.multiple){
          data = data[this.files.indexOf(file)];
        }else{
        }

        data = _.extend(data,file);

        if(typeof data.type !== 'undefined'){
          switch(data.type){
          case "image/jpeg":
          case "image/png":
          case "image/jpg":
          case "image/gif":

              // file.preview = '<div style="text-align:center;padding:10px;"><img style="max-width:100%" src="'+file.path+'"/></div>';
            break;
          default:
            
            // var icon = ;
            data.icon = (mime_type_icon_map[data.type] || mime_type_icon_map[data.type.split('/')[0]] || mime_type_icon_map[data.ext] || "fa-file-o");
          }

          // if(file.ext == "pdf"){
          //   file.preview = '<iframe width="100%" height="'+($( document ).height()-$('.report').position().top-100)+'px" src="'+file.path+'"></iframe>';
          // }

        }
        file.previewElement = Dropzone.createElement(gform.render('base64_file_preview',data));

        var _this = this;

        file.previewElement.querySelector('.gform-remove').addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();

          // Remove the file preview.
          _this.removeFile(file);

          gform.types.base64_file.updateStatus.call(_this.options.formelement)
        });

        file.previewElement.querySelector('.gform-replace').addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();

          // Remove the file preview.

          _this.enable();

          _this.clickableElements[0].click()

          _this.options.formelement.replaceIndex = _this.files.indexOf(file)
          _this.options.formelement.replaceFile = file;
          gform.types.base64_file.updateStatus.call(_this.options.formelement,true)

       });
        this.options.formelement.el.querySelector('ul.files').append(file.previewElement)
      },
      formelement:this,queuecomplete:gform.types.base64_file.updateStatus.bind(this),
      accept: function(file, done) {
if(this.options.formelement.replaceIndex !== null){

  // if(typeof this.options.formelement.replaceFile !== 'undefined'){
    this.removeFile(this.options.formelement.replaceFile);
    clearReplace();
  // }
}


        if(this.files.length>((this.options.formelement.multiple)?this.options.formelement.limit:1)){
          this.removeFile(file);

          done("Max files reached");
        }
        // this._uploadData = function(){}
        this._sendIntercept(file).then(result => {
          file.dataURI = result;
          if(typeof(this.localSuccess) === 'function') {
            this.localSuccess(file, done);
          } else {
            done(); // empty done signals success
          }
        }).catch(result => {
          if(typeof(this.localFailure) === 'function') {
            file.dataURI = result;
            this.localFailure(file, done);
          } else {
            if(typeof(this.localFailure) === 'string') {
              done(this.localFailure);
            }else{
              done(`Failed to upload file ${file.name}`);
              console.warn(file);
            }
          }
        });
      }, url:"#", timeout:60000,uploadMultiple:false/*,maxFiles:(this.multiple?this.multiple.max:1)*/, init: function(field) {

        this.submitRequest = function(xhr, formData, files) {
          files = _.each(files,function(file){
            files.status = (files.status == "uploading")?'success':file.status;
          })                  
          this._finished(files);
        }
        this._sendIntercept = function(file, options={}) {
          return new Promise((resolve,reject) => {
            if(!options.readType) {
              options.readType = _.reduce(['text/*', 'application/xml', 'application/x-sh', 'application/x-script', 'image/svg+xml'],function(result,type){
                const re = new RegExp(type);
                return result || re.test(file.type);
              },false) ? 'readAsText' : 'readAsDataURL';
            }
            let reader = new window.FileReader();

            reader.onload = () => {
              resolve(reader.result);
            };
            reader.onerror = () => {
              reject(reader.result);
            };
        
            // run the reader
            reader[options.readType](file);
          });
        }
        this.localSuccess = function(file,done) {
          onSuccess(file);
          done();
        }
        this.localFailure = function(file,done) {
          onError(file);
        }
      }
    });

    this.replaceIndex = null;
    clearReplace = function(){
      this.replaceIndex = null;
      delete this.replaceFile;
    }.bind(this)
    this.Dropzone.hiddenFileInput.onclick = clearReplace;
    this.Dropzone.on('drop',clearReplace)

    this.el.addEventListener('click', function(e){
      if(e.target.classList.contains('disabled')){return;}
      if(e.target.classList.contains('gform-clear-all')){
        this.Dropzone.removeAllFiles()
        gform.types.base64_file.updateStatus.call(this)
      }
    }.bind(this))
    gform.types.base64_file.set.call(this,this.value)
    gform.types.base64_file.setup.call(this);
  }
});





gform.stencils.upload = `
<div class="row clearfix form-group {{modifiers}}" data-type="{{type}}">
  {{>_label}}
  {{#label}}
  {{^horizontal}}<div class="col-md-12">{{/horizontal}}
  {{#horizontal}}<div class="col-md-8">{{/horizontal}}
  {{/label}}
  {{^label}}
  <div class="col-md-12">
  {{/label}}
    {{#pre}}<div class="input-group col-xs-12"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
    {{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
      <div class="dropzone" id="{{id}}">
      </div>
    {{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
    {{^post}}{{#pre}}</div>{{/pre}}{{/post}}

    {{>_addons}}
    {{>_actions}}
  </div>
</div>
`;

gform.types.upload =  _.extend({}, gform.types['input'],{
  focus: function() {
},
defaults:{format:{uri: '{{{name}}}',options:[]}},


  set:function(value){
  },
  get: function() {
    return this.value;
  },edit: function(state) {
    this.editable = state;
    this.el.querySelector('[id="'+this.id+'"].dropzone').disabled = !state;
  },
  toString: function(name, report) {
    if(!report){
      return gform.m('<dt>{{label}}</dt> <dd>{{#value.dataURI}}<img height=75px src="{{value.dataURI}}"/>{{/value.dataURI}} {{value.name}}{{^value.name}}<span class="text-muted">(empty)</span>{{/value.name}}</dd><hr>', this)
    }else{
      return this.value.dataURI
    }
  },      
  satisfied: function(value) {
    value = value||this.value;
    if(_.isArray(value)){return !!value.length;}
    return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'number' && isNaN(value)) && !_.isEmpty(value));            
  },
  initialize:function(){
    this.Dropzone = new Dropzone(this.el.querySelector("#"+this.id+'.dropzone'), 
    { url:this.item.path, method: 'post', paramName: this.name, success: function(message,response){
				this.trigger('uploaded',this,{response:response});
    }.bind(this)}
    
    );
  }
});




  

$g = function(){
     //new gform.eventBus({owner:"graphene",item:'data',handlers:{}}, this),
     function eventHub() {
      let handlers = {};
      let on = (event, handler, data) => {
        let guid = false;
        if(typeof event !== 'undefined'){
            var events = event.split(' ');
            guid = api.uuid
            events.forEach(event => {
                handlers[event] = handlers[event] ||[];
                if(typeof handler !== 'function') throw "Event handler must be a function"

                handlers[event].push({handler:handler, id: guid, data:data});
            });
        }
        return guid;
      };
  
      let off = (event, id) => {
          handlers[event].splice(handlers[event].findIndex(elem => (elem.id == id)),1)
      };
  
      let emit = (e, data) => {
          let a = data || {};
          let pd = true;
          let propagate = true;
          a.preventDefault = () => { pd = true; }
          a.stopPropagation = () => { propagate = false; }
  
          // let events = [];
          if(typeof e == 'string'){
              e = e.split(' ');
          }
          if(typeof e !== 'object' || !Array.isArray(e)) throw 'Event must be a string or array'
          // events = events.concat(e)
  
          e.forEach(event => {
              a.event = event;
              let f = (handler) => {
                  if(typeof handler.handler == 'function'){
                      handler.handler(a);
                  }
                  return propagate;
              }
              if(event in handlers)handlers[event].every(f);
              if('*' in handlers)handlers['*'].every(f);
          })
          return a;
      }
      return {
        emit: emit,
        on: on,
        off: off
      }
  }
  let globalevents = new eventHub();
  let actionBuffer =[]
  
  let api =  {
    worker: new Worker('/assets/js/grapheneWorker.js'),
    // elapsedSeconds:0,
    // timer:setInterval(function() {
    //  $g.emit('cron',++$g.elapsedSeconds);
    // }, 1000),
    form:gform,
    forms:gform.instances,
    render:gform.m,
    emit:globalevents.emit,
    on:globalevents.on,
    off:globalevents.off,
    schedule: (method, interval) => {
      return api.on('schedule',(e) => {
          if(!(e.ticks%(interval||1))) method.call(null,e);
      })
    },
    intervalTask:(actions, opts) =>{
      let options = _.extend({period:1000},opts);
      actionBuffer = actionBuffer.concat(actions||[]);
      if(timer == null) {
        timer = setInterval(function() {
          if(actionBuffer.length) {
            if(typeof actionBuffer[0] == "function") {
              actionBuffer.shift().call(this)
            } else {
              actionBuffer.shift()
            }
          }
          if(!actionBuffer.length) {
            clearInterval(timer);
            timer = null;
          }
        }, options.period)
      }
      return timer;
    },
    modal:modal,
    // getID:generateUUID,
    grid:GrapheneDataGrid,
    collections: gform.collections,
    apps:{},
    engines:{},
    formatDates:function(data){
      if(data == null) return {};
      if(typeof data.created_at == 'string'){
        var cat = moment(data.created_at);
        data.created_at = {
          original:data.created_at,
          time:cat.format('h:mma'),
          date:cat.format('MM/DD/YY'),
          fromNow:cat.fromNow()
        }

        data.date = data.created_at.original;
      }
      if(typeof data.updated_at == 'string'){

        var uat = moment(data.updated_at);
        data.updated_at = {
          original:data.updated_at,
          time:uat.format('h:mma'),
          date:uat.format('MM/DD/YY'),
          fromNow:uat.fromNow()
        }
      }
      return data;
    }
  }

  api.worker.onmessage = (message)=>{
    api.emit('schedule', {timeStamp:message.timeStamp,ticks: message.data.ticks})
  }
  Object.defineProperty(api, "widgets", {
    get:function(){
        return _.reduce(cb.collections, function(list,item){
          return list.concat(item.getItems())
          // return list;
        },[])
        // return cb.collections[0].getItems()[0]

    },
    enumerable: true
  });
  Object.defineProperty(api, "uuid", {
    get:function(){
        return generateUUID();
    },
    enumerable: true
  });
  Object.defineProperty(api, "waiting", {
    get:function(){
        return !!this.isWaiting;
    },
    set: function(value){
      if(value){
        if(!this.el){
          this.el  = document.createElement("div");
          this.el.setAttribute("class", "hide_wait");

        this.el.setAttribute("id", "waiting");

          // this.el.setAttribute("style", 'padding: 5px 10px;position:fixed;bottom:10px;left:10px;background:rgba(0,0,0,.1);box-shadow:0 0 2px #888');

          document.body.append(this.el);
        }
        this.el.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i> <span>'+value+'</span>';

        this.el.setAttribute("class", "");

      }else{
        if(this.el)this.el.setAttribute("class", "hide_wait");
      }
      this.isWaiting = value;
    },
    enumerable: true
  });

  return api;

}()

if(typeof Berry !== 'undefined'){
Berry.validations.is_https = {
    method: function(value) {
        return value.startsWith("https://");
    },
    message: 'Basic Auth Routes must start with "https://"'
}}

gform.validations.is_https = function(value) {
  return ( value.startsWith("https://")) ? false : 'Basic Auth Routes must start with "https://"';
}


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
    return cb.collections[0].getItems()[0].appEngine
  },
  configurable: false,
});



gform.types['textarea'] = _.extend({}, gform.types['textarea'], {
focus:function(timeout) {
    //   .focus();
    window.setTimeout(function(){
        if(this.el.querySelector('textarea[name="' + this.name + '"]') !== null && typeof this.el.querySelector('textarea[name="' + this.name + '"]').focus == "function"){


            this.el.querySelector('textarea[name="'+this.name+'"]').focus();
            var temp = this.value;
            this.set('');
            this.set(temp);
        }
    }.bind(this), timeout||0); 

     
    //   this.el.querySelector('[name="'+this.name+'"]').select();
  }
});
Object.defineProperty(debug,'state',{
  get: function(){
    return window.localStorage.getItem("debug") == 'true'
  },
  configurable: false,
});


gform.stencils.ace = `
<div class="row clearfix form-group" name="{{name}}">
	{{>_label}}
	{{#label}}
	{{#inline}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
	{{^inline}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
	{{/label}}
		<div class="formcontrol"><div placeholder="{{placeholder}}" style="min-height: 250px;outline:none;border:solid 1px #cbd5dd;{{^unstyled}}background:#fff;padding:10px{{/unstyled}}" id="{{id}}container"></div></div>
	</div>
</div>`;

gform.types['ace'] = _.extend({}, gform.types['input'], {
  create: function(){
    var tempEl = document.createElement("span");
    tempEl.setAttribute("id", this.id);
    if(this.owner.options.clear){
      tempEl.setAttribute("class", ''+gform.columnClasses[this.columns]);
    }
    tempEl.innerHTML = this.render();
    return tempEl;
},
// render:function(){
//   return gform.render('textarea',this)
// },
  initialize: function(){
    //   this.iel = this.el.querySelector('input[name="' + this.name + '"]')
    //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
      this.onchangeEvent = function(input){
        //   this.input = input;
          this.value = this.get();
          if(this.el.querySelector('.count') != null){
            var text = this.value.length;
            if(this.limit){text+='/'+this.limit;}
            this.el.querySelector('.count').innerHTML = text;
          }
        //   this.update({value:this.get()},true);
        //   gform.types[this.type].focus.call(this)
          this.owner.trigger(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});

        //   this.owner.pub('change:'+this.name, this,{input:this.value});
        //   this.owner.pub('change', this,{input:this.value});
        //   this.owner.pub('input:'+this.name, this,{input:this.value});
        //   this.owner.pub('input', this,{input:this.value});
      }.bind(this)
      this.input = this.input || false;
      // this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

      // this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
    this.editor = ace.edit(this.id+"container");
    this.editor.setTheme(this.item.theme || "ace/theme/chrome");
    this.editor.getSession().setMode({path: this.owner.options.default.mode || this.item.mode || "ace/mode/handlebars", inline:this.owner.options.default.inlinemode || this.item.inlinemode});
    this.editor.session.setValue(this.value);
    this.editor.on("change",this.onchangeEvent.bind(null,false))
   
  },
  // update: function(item, silent) {
  //   if(typeof item !== 'undefined' && (
  //       typeof item.options !== undefined ||
  //       typeof item.max !== undefined ||
  //       typeof item.action !== undefined 
  //       )
  //       && typeof this.mapOptions !== 'undefined'){
  //       delete this.mapOptions;
  //       this.item = _.defaults({},item,this.item);

  //       // this.item.options = _.assign([],this.item.options,item.options);
  //       this.options = _.extend([],this.item.options);
  //       this.max = this.item.max;
  //       this.min = this.item.min;
  //       this.path = this.item.path;
  //       this.action = this.item.action;
  //   }
  //   // else if(typeof this.mapOptions !== 'undefined'){
  //   // }
  //   if(typeof item === 'object') {
  //       _.extend(item,this);
  //   }
  //   this.label = gform.renderString((item||{}).label||this.item.label, this);

  //   // var oldDiv = document.getElementById(this.id);
  //   // var oldDiv = this.owner.el.querySelector('#'+this.id);
  //   var oldDiv = this.el;
  //   this.destroy();
  //   this.el = gform.types[this.type].create.call(this);
  //   oldDiv.parentNode.replaceChild(this.el,oldDiv);
  //   gform.types[this.type].initialize.call(this);

  //   if(!silent) {
  //       this.owner.pub(['change:'+this.name,'change'], this);
  //   }
  //   if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
    
  // },
  set:function(value){
    this.editor.session.setValue(value);
  },
  get:function(){
    return this.editor.getValue()
  },
  focus: function(){
    this.editor.focus();
  }
});





const fieldLibrary = (function(){
  let group_id = (typeof resource_id !== 'undefined')?resource_id:(typeof instanceData !== 'undefined')?instanceData.group_id:null;
  // let mycomposites = (typeof composites !== 'undefined')?composites:[]
  let collection = {
      layout:	{
        label:'Layout',
        name:'layout',
        options: 'layouts', 
        value: 0,
        format:{display:"{{{original.label}}} {{title}} ",label:"{{title}}",value:layout=>parseInt(layout.value)} ,
        type:'smallcombo'
      },
      group: {label: 'Group', name:'group_id',strict:true, type: 'smallcombo', required: true, value: parseInt(group_id), edit: [{type: 'not_matches',name: "_method", value: "edit"},{type: 'test', test: () => (resource_id == '') }],options:'groups',format: {title: '{{{label}}}{{^label}}Group{{/label}} <span class="text-success pull-right">{{value}}</span>',label:"{{name}}", value:(group => group.id)}},
      icon: {label: 'Icon', name:'icon', type:'smallcombo', template: '<i class="{{attributes.icon}}"></i>', 
          format:{
            title: 'Icon <span class="pull-right"><i class="{{value}}"></i></span>',
            label: i => i.name.replace(/(\r\n|\s)/gm, ""), 
            value: "{{value}}",template:'<i class="fa fa-{{value}}"></i>',
            display: '<span style = "text-transform:capitalize;"><i class="{{value}}"></i> {{{label}}}'
          }, 
          options: 'icons',
          required: false
        },
      name:[
        {label: 'Name', name:'name', required: true},
        {label: 'Slug', name:'slug', required: true},
      ],
      composites:[
        {label: 'Limit Composite Groups', name: 'limit',value: function(e){
          if(typeof e.form !== 'undefined' && !e.form.isActive){
            return (typeof e.form.options.data.groups !== 'undefined' && _.compact(e.form.options.data.groups).length>0);
          }else{
            return e.initial.value;
          }
        }, type: 'checkbox',options:[{label:'No',value:false},{label:'Yes',value:true}],template:"{{#attributes.groups.length}}Yes{{/attributes.groups.length}}{{^attributes.groups.length}}No{{/attributes.groups.length}}", show:  [{type:'matches',name:'public', value: false},{type:'test',test: () => $g.collections.get('composites').length >0 } ]
      },
      {label: 'Composites',get: ()=> (this.visible)?gform.types[this.type].get.call(this):null,legend: 'Composites',parse:true,array: {min:1,max:100,duplicate:{copy:true}}, name: 'groups', type: 'smallcombo', options: 'composites',format:{label:"{{name}}",value:function(i){return i.id}},'show': [{type:"matches",name: 'limit',value: true}],validate:[{type:'unique',message:"Duplicate group"}]}
      ],
      _display: [
        {label: 'List in page menu', name:'unlisted',value:0, type: 'checkbox',options:[{label:'No',value:true},{label:'Yes',value:false}]},				
        {label: 'Limit Device', name: 'device',type:"select", format:{value:"{{index}}"},value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
        {label: 'Public', name:'public', type: 'checkbox',options:[{label:'No',value:false},{label:'Yes',value:true}], edit:  [{type:'matches',name:'limit', value: false}]},    
      ]

    }
    Object.defineProperty(collection,'content',{
      get: ()=>{
        const {name, icon, _display, composites} = collection;
        return [...name, icon, ..._display, ...composites,{name: 'order', type:'hidden'}];
      },
      configurable: false,
    });
    
return collection;
    
  }())