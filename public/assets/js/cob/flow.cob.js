
// /**
//  * Timeago is a jQuery plugin that makes it easy to support automatically
//  * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
//  *
//  * @name timeago
//  * @version 1.6.3
//  * @requires jQuery v1.2.3+
//  * @author Ryan McGeary
//  * @license MIT License - http://www.opensource.org/licenses/mit-license.php
//  *
//  * For usage and examples, visit:
//  * http://timeago.yarp.com/
//  *
//  * Copyright (c) 2008-2017, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
//  */

//  (function (factory) {
//     if (typeof define === 'function' && define.amd) {
//       // AMD. Register as an anonymous module.
//       define(['jquery'], factory);
//     } else if (typeof module === 'object' && typeof module.exports === 'object') {
//       factory(require('jquery'));
//     } else {
//       // Browser globals
//       factory(jQuery);
//     }
//   }(function ($) {
//     $.timeago = function(timestamp) {
//       if (timestamp instanceof Date) {
//         return inWords(timestamp);
//       } else if (typeof timestamp === "string") {
//         return inWords($.timeago.parse(timestamp));
//       } else if (typeof timestamp === "number") {
//         return inWords(new Date(timestamp));
//       } else {
//         return inWords($.timeago.datetime(timestamp));
//       }
//     };
//     var $t = $.timeago;
  
//     $.extend($.timeago, {
//       settings: {
//         refreshMillis: 60000,
//         allowPast: true,
//         allowFuture: false,
//         localeTitle: false,
//         cutoff: 0,
//         autoDispose: true,
//         strings: {
//           prefixAgo: null,
//           prefixFromNow: null,
//           suffixAgo: "ago",
//           suffixFromNow: "from now",
//           inPast: 'any moment now',
//           seconds: "less than a minute",
//           minute: "about a minute",
//           minutes: "%d minutes",
//           hour: "about an hour",
//           hours: "about %d hours",
//           day: "a day",
//           days: "%d days",
//           month: "about a month",
//           months: "%d months",
//           year: "about a year",
//           years: "%d years",
//           wordSeparator: " ",
//           numbers: []
//         }
//       },
  
//       inWords: function(distanceMillis) {
//         if (!this.settings.allowPast && ! this.settings.allowFuture) {
//             throw 'timeago allowPast and allowFuture settings can not both be set to false.';
//         }
  
//         var $l = this.settings.strings;
//         var prefix = $l.prefixAgo;
//         var suffix = $l.suffixAgo;
//         if (this.settings.allowFuture) {
//           if (distanceMillis < 0) {
//             prefix = $l.prefixFromNow;
//             suffix = $l.suffixFromNow;
//           }
//         }
  
//         if (!this.settings.allowPast && distanceMillis >= 0) {
//           return this.settings.strings.inPast;
//         }
  
//         var seconds = Math.abs(distanceMillis) / 1000;
//         var minutes = seconds / 60;
//         var hours = minutes / 60;
//         var days = hours / 24;
//         var years = days / 365;
  
//         function substitute(stringOrFunction, number) {
//           var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
//           var value = ($l.numbers && $l.numbers[number]) || number;
//           return string.replace(/%d/i, value);
//         }
  
//         var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
//           seconds < 90 && substitute($l.minute, 1) ||
//           minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
//           minutes < 90 && substitute($l.hour, 1) ||
//           hours < 24 && substitute($l.hours, Math.round(hours)) ||
//           hours < 42 && substitute($l.day, 1) ||
//           days < 30 && substitute($l.days, Math.round(days)) ||
//           days < 45 && substitute($l.month, 1) ||
//           days < 365 && substitute($l.months, Math.round(days / 30)) ||
//           years < 1.5 && substitute($l.year, 1) ||
//           substitute($l.years, Math.round(years));
  
//         var separator = $l.wordSeparator || "";
//         if ($l.wordSeparator === undefined) { separator = " "; }
//         return $.trim([prefix, words, suffix].join(separator));
//       },
  
//       parse: function(iso8601) {
//         var s = $.trim(iso8601);
//         s = s.replace(/\.\d+/,""); // remove milliseconds
//         s = s.replace(/-/,"/").replace(/-/,"/");
//         s = s.replace(/T/," ").replace(/Z/," UTC");
//         s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
//         s = s.replace(/([\+\-]\d\d)$/," $100"); // +09 -> +0900
//         return new Date(s);
//       },
//       datetime: function(elem) {
//         var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
//         return $t.parse(iso8601);
//       },
//       isTime: function(elem) {
//         return $(elem).get(0).tagName.toLowerCase() === "time"; 
//       }
//     });
  
//     // functions that can be called via $(el).timeago('action')
//     // init is default when no action is given
//     // functions are called with context of a single element
//     var functions = {
//       init: function() {
//         functions.dispose.call(this);
//         var refresh_el = $.proxy(refresh, this);
//         refresh_el();
//         var $s = $t.settings;
//         if ($s.refreshMillis > 0) {
//           this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
//         }
//       },
//       update: function(timestamp) {
//         var date = (timestamp instanceof Date) ? timestamp : $t.parse(timestamp);
//         $(this).data('timeago', { datetime: date });
//         if ($t.settings.localeTitle) {
//           $(this).attr("title", date.toLocaleString());
//         }
//         refresh.apply(this);
//       },
//       updateFromDOM: function() {
//         $(this).data('timeago', { datetime: $t.parse( $t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title") ) });
//         refresh.apply(this);
//       },
//       dispose: function () {
//         if (this._timeagoInterval) {
//           window.clearInterval(this._timeagoInterval);
//           this._timeagoInterval = null;
//         }
//       }
//     };
  
//     $.fn.timeago = function(action, options) {
//       var fn = action ? functions[action] : functions.init;
//       if (!fn) {
//         throw new Error("Unknown function name '"+ action +"' for timeago");
//       }
//       // each over objects here and call the requested function
//       this.each(function() {
//         fn.call(this, options);
//       });
//       return this;
//     };
  
//     function refresh() {
//       var $s = $t.settings;
  
//       //check if it's still visible
//       if ($s.autoDispose && !$.contains(document.documentElement,this)) {
//         //stop if it has been removed
//         $(this).timeago("dispose");
//         return this;
//       }
  
//       var data = prepareData(this);
  
//       if (!isNaN(data.datetime)) {
//         if ( $s.cutoff === 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
//           $(this).text(inWords(data.datetime));
//         } else {
//           if ($(this).attr('title').length > 0) {
//               $(this).text($(this).attr('title'));
//           }
//         }
//       }
//       return this;
//     }
  
//     function prepareData(element) {
//       element = $(element);
//       if (!element.data("timeago")) {
//         element.data("timeago", { datetime: $t.datetime(element) });
//         var text = $.trim(element.text());
//         if ($t.settings.localeTitle) {
//           element.attr("title", element.data('timeago').datetime.toLocaleString());
//         } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
//           element.attr("title", text);
//         }
//       }
//       return element.data("timeago");
//     }

//   function inWords(date) {
//     return $t.inWords(distance(date));
//   }

//   function distance(date) {
//     return (new Date().getTime() - date.getTime());
//   }

//   // fix for IE6
//   document.createElement("abbr");
//   document.createElement("time");
// }));


Cobler.types.Workflow = function(container){
	function get() {
		item.widgetType = 'Workflow';
		return item;
	}
	var item = {
		guid: generateUUID()}
	var fields = {
		Title: {},
		'Workflow ID': {type: 'select', options: '/api/groups/'+group_id+'/workflowinstances',format:{label:"{{name}}",value:"{{id}}"}},
	}
	return {
    container:container,
		fields: fields,
		render: function() {
      var temp = get();
      temp.workflow_admin = group_admin;
      if(typeof temp.workflow !== 'undefined'){
        temp.allowFiles = temp.workflow.version.code.form.files && (_.find(temp.workflow.version.code.flow,{name:this.get().workflow.configuration.initial})||temp.workflow.version.code.flow[0]).uploads
      }
      
      return gform.renderString(workflow_report.workflow, temp);
		},
		edit: defaultCobEditor.call(this, container),
		toJSON: get,
		get: get,
		set: function (newItem) {
      $.extend(item, newItem);
      $g.emit('workflow_summary',{current:item.current})
    },
    updateRequired:function() {


      $g.emit('workflow_summary',{required:
        
          _.uniq(_.compact(_.map(_.filter(
            gform.instances.workflow.find({name:"_state"}).filter({visible:true,required:true}),function(item){
            var search = item;
            while(typeof search.parent == "object" && !(search.parent instanceof gform)){
              if(!search.visible) return false;
              search = search.parent;
            }
            return true;
          }),function(e){
            // return !e.satisfied()?{label:e.label,id:e.id}:null;
            return {label:e.label,id:e.id,satisfied:e.satisfied()};
            
          })))})
              

      // document.body.querySelector('.workflow-required').innerHTML = gform.renderString('{{#required.length}}<hr class="thin"><h5>Required information</h5>{{/required.length}}<div>{{#required}}<div class="label label-primary">{{.}}</div>{{/required}}</div>', )
    },
    saveFlow:function(e, data) {
      $.ajax({
        url:'/api/workflowsubmissions/'+this.get().instance_id,
        dataType : 'json',
        contentType: 'application/json',
        data: JSON.stringify(function(){
          let temp = data;
          temp._state = JSON.stringify(data._state);
          return temp;
        }.call(null,data)),
        type: 'POST',
        success  : function(data){
          e.form.find('_state').el.style.opacity = 1
          document.location = "/workflows/report/"+data.id;
        }.bind(this),
        error:function(){
          e.form.find('_state').el.style.opacity = 1
          gform.types.fieldset.edit.call(e.form.find('_state'),true)
          $('.gform-footer').show();
          toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
        }
      })
    },
		initialize: function(el) {
      gform.collections.add('files', [])


      window.addEventListener("beforeunload", function (e) {
        
          if($('.flow-title .status').html() == 'Saving...'){
            var confirmationMessage = 'Changes you made May not be saved';
      
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
          }
      });


      if(typeof this.get().instance_id == 'undefined'){return false;};
        this.fields['Workflow ID'].enabled = false;
      if(this.container.owner.options.disabled && this.get().enable_min){
        var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
        this.set({collapsed:collapsed});
        $(el).find('.widget').toggleClass('cob-collapsed', collapsed)
      }
      var instance = this.get().workflow;
      // return;

       this.load = function(){
        this.container.elementOf(this).querySelector('.flow-title').innerHTML = instance.workflow.name+'<span class="label label-default pull-right status"></span>';
        
        mappedData = {actor:this.get().user,form:{},owner:null,state:instance.configuration.initial,history:[]};
        // mappedData.workflow = this.get();
        mappedData.datamap = {};
        _.each(instance.configuration.map,function(item){
          mappedData.datamap[item.name] = item.value;
        })

        /* problem here  */
        // gform.prototype.options.rootpath = '/workflows/fetch/'+this.get().instance_id+'/'
        _.each(this.get().resources,function(item,name){
          gform.collections.add(name, _.isArray(item)?item:[])
        })
        mappedData.resources = _.reduce(this.get().resources,function(resources, item, name){
          resources[name] = item;
          return resources;
        },{})

        var data = {
          _flowstate:instance.configuration.initial,
          _state:(this.get().current||this.get()).data,
          user:this.get().user,
          data:mappedData
        }
        let myPromise = new Promise(function(myResolve, myReject) {
          if(
            (!this.container.owner.options.disabled) ||
            (resource_type !== 'workflow') ||

            //nothing started - we can assume starting a new one
            (this.get().current == null) ||
            (this.get().current.updated_at == this.get().current.created_at) ||

            //data is the same as starting - assume continuing 
            // (JSON.stringify(this.get().current.data) == JSON.stringify(new gform({fields:this.get().workflow.version.code.form.fields}).get()) && (this.get().current.files == null || _.isEmpty(this.get().current.files) )) ||
            // (JSON.stringify(this.get().current.data) == JSON.stringify(new gform({fields:this.get().workflow.version.code.form.fields}).get()) && (this.get().current.files == null || _.isEmpty(this.get().current.files) )) ||
            _.isEqual(this.get().current.data,new gform({fields:this.get().workflow.version.code.form.fields}).get()) ||
            
            parseInt(window.location.search.split('?saved=')[1]) == this.get().current.id

          ){
            myResolve();
            return;
          }

          // if(parseInt(window.location.search.split('?saved=')[1]) !== this.get().current.id)
          // if(JSON.stringify(this.get().current.data) == JSON.stringify(new gform({fields:this.get().workflow.version.code.form.fields}).get()) && (this.get().current.files == null || _.isEmpty(this.get().current.files) ))myResolve();

        // if(
        //   this.get().current !== null && 
        //   (window.location.search.split('?saved=')[0] == "" || this.get().all.length >0) && 
        //   parseInt(window.location.search.split('?saved=')[1]) !== this.get().current.id && 
        //   (JSON.stringify(this.get().current.data) !== JSON.stringify(new gform({fields:this.get().workflow.version.code.form.fields}).get()) && (this.get().current.files == null || _.isEmpty(this.get(current.files)) ))
        //   ){
        // this.get().current
          var content = $g.render(`You are currently in the middle of this workflow. Would you like to continue with your current data?<hr>{{#current}}
          <dl class="dl-horizontal">
          {{#title}}<dt>Title</dt>
      <dd>{{{title}}}</dd>{{/title}}
      
      {{#saved}}<dt>Comment</dt>
      <dd>{{{comment}}}{{^comment}} - {{/comment}}</dd>
      {{/saved}}
      <dt>Started</dt>
      <dd>{{created_at.date}} @ {{{created_at.time}}}</dd>
      <dt>Last Updated</dt>
      <dd>{{updated_at.date}} @ {{{updated_at.time}}}</dd>
      </dl>
          {{/current}}`,{saved:this.get().current.status == 'saved',current:$g.formatDates(this.get().current)});
          new gform({legend:"Workflow in progress",modal:{header_class:'bg-info'},fields:[{type:'output',name:'modal',label:false,format:{},value:content}],actions:[
            {type:'button',action:'discard',label:'<i class="fa fa-times"></i> Discard',"modifiers": "btn btn-danger pull-left"},
            {type:'save',label:'<i class="fa fa-save"></i> Save For later',"modifiers": "btn btn-info pull-right"},
            {type:'button',action:'use',label:'<i class="fa fa-check"></i> Use',"modifiers": "btn btn-success pull-right"}
            ]}).modal()
            .on('discard save use cancel',function(myResolve,e){
              e.form.dispatch('close');
              e.form.destroy();

              
              if(e.event == 'save'){
                data._state = this.get().data

                let savePromise = new Promise(function(myResolve,saveResolve, saveReject) {
                  new gform({legend:"Comment associated with this submission",modal:{header_class:'bg-success'},fields:[{label:"Comment"}]}).modal().on('save',function(saveResolve,e){
                    e.form.dispatch('close');
                    e.form.destroy();
                    saveResolve(e.form.get('comment'))
                  }.bind(null,saveResolve)).on('cancel',function(saveReject,e){
                    saveReject()
                  }.bind(null,saveReject))
                }.bind(null,myResolve))
                savePromise.then(
                  function(value) {

                    $.ajax({
                      url:'/api/workflowsubmissions/'+this.get().instance_id+'/save',
                      dataType : 'json',
                      contentType: 'application/json',
                      data: JSON.stringify(_.extend(this.get().current,{comment:value})),
                      type: 'POST',
                      success  : function(myResolve,data){
                        // location.reload();

                        this.set({current:{data:{}}})
                        this.initialstate = this.get().current.data;
                        // this.initialstate = gform.instances['workflow'].get();

                        myResolve();
                      }.bind(this),
                      error:function(){
                    
                        // this.form.find('_state').el.style.opacity = 1
                        // gform.types.fieldset.edit.call(e.form.find('_state'),true)
                    
                        // $('.gform-footer').show();
                        // toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
                    
                    
                      }
                    })


                  }.bind(this),function(value){
                    location.reload();
                  })
                
              }else if(e.event == 'discard'){
                $.ajax({
                  url:'/api/workflowsubmissions/'+this.get().current.id
      ,
                  type: 'delete',
                  success  : function(){

                    location.reload();
                  },
                  error:function(){

                  }
                })

              }else{
                data._state = ((e.event == 'use')?this.get().current:this.get()).data
                myResolve(e.event)
              }
            }.bind(this,myResolve))
            // .on('save',function(myResolve,e){
            //   e.form.dispatch('close');
            //   e.form.destroy();
            //   data._state = this.get().data;
            //   myResolve()
            // }.bind(this,myResolve))
            // .on('use',function(myResolve,e){

            //   e.form.dispatch('close');
            //   e.form.destroy();
            //   data._state = this.get().current.data;
            //   myResolve()
            // }.bind(this,myResolve));
          // myResolve(); // when successful
          // myReject();  // when error
        // }else{
        //   myResolve();
        // }
        }.bind(this));
      
        myPromise.then(
          function(value) { 
            this.methods = [];
            _.each(this.get().workflow.workflow.code.methods,function(item,index){
              eval('this.methods["method_'+index+'"] = function(data,e){'+item.content+'\n}.bind(data,data.data)');
            }.bind(this))
            var formSetup = {
              "data":data,
              "name":"workflow",
              "events":instance.version.code.form.events||{},
              "actions": [
                {
                  "type": "cancel",
                  "name": "cancel",
                  "action":"canceled",
                  "label": "<i class='fa fa-times'></i> Clear"
                },{
                  "type": "button",
                  "name": "_save_for_later",
                  "action":"save",
                  "modifiers":"btn btn-info pull-right",
                  "label": "<i class='fa fa-save'></i> Save For later"
                },{
                  "type": "hidden",
                  "name": "_flowstate"
                }
              ],
              "fields":[
                  {"name":"_state","label":false,"type":"fieldset","fields": instance.version.code.form.fields
                }
              ]
            }

            var actions = _.filter((_.find(instance.version.code.flow,{name:instance.configuration.initial}) || {"actions": []}).actions,function(action){
              if(typeof action.assignment == 'undefined'){
                return true;
              }else{
                if(action.assignment.type == "user"){
                  if(gform.m(action.assignment.id,mappedData) == mappedData.actor.id.toString()){
                    return true;
                  }
                }else if(action.assignment.type == "group"){
                  if(mappedData.actor.groups.indexOf(parseInt(gform.m(action.assignment.id,mappedData))) >=0){
                    return true;
                  }
                }
              }
              return false;


            })


            //create actions buttons that are active in current(initial) state
            _.each(actions,function(action){
              action.modifiers = 'btn btn-'+action.type;
              action.action = 'save';
              action.type = 'button';
              formSetup.actions.push(action);
            });
            formSetup.methods = this.methods;

            formSetup.data._state = formSetup.data._state ||{};
            if(this.get().workflow.workflow.code.form.resource !== ''){
            if(this.get().workflow.workflow.code.form.resource in mappedData.resources){
              _.extend(formSetup.data._state,mappedData.resources[this.get().workflow.workflow.code.form.resource]);
            }
            if(this.get().workflow.workflow.code.form.resource in formSetup.methods){
              _.extend(formSetup.data._state,formSetup.methods[this.get().workflow.workflow.code.form.resource](data));
            }
            }
            if(this.get().current != null){
              this.initialstate = this.get().current.data;
              this.id = this.get().current.id;
              gform.collections.update('files', this.get().current.files||[])
              this.form = new gform(formSetup, '.g_'+get().guid);
            }else{
              gform.collections.update('files', [])
            }

            this.form = new gform(formSetup, '.g_'+get().guid);
            this.updateRequired();

            this.form.on('invalid',function(e){


              // gform.instances.workflow.find({name:"_state"}).filter({visible:true,valid:false})[0].errors

              // _.uniq(_.compact(_.map(_.filter(
              //   gform.instances.workflow.find({name:"_state"}).filter({visible:true,valid:false}),function(item){
              //   var search = item;
              //   while(typeof search.parent == "object" && !(search.parent instanceof gform)){
              //     if(!search.visible) return false;
              //     search = search.parent;
              //   }
              //   return true;
              // }),function(e){return !e.satisfied()?{label:e.label,id:e.id,errors:e.errors}:null})))
              
              
              var invalid_fields = _.filter(
                gform.instances.workflow.find({name:"_state"}).filter({visible:true,valid:false}),function(item){
                var search = item;
                while(typeof search.parent == "object" && !(search.parent instanceof gform)){
                  if(!search.visible) return false;
                  search = search.parent;
                }
                return true;
              })
              $g.emit('workflow_summary',{errors:_.compact(_.map(invalid_fields,function(e){
                return !e.valid?{label:e.label,id:e.id,errors:e.errors.split('<br>')}:null}))})

                invalid_fields[0].focus();
          })      
          this.form.on('valid',function(e){
            $g.emit('workflow_summary',{errors:[]})

        })
            this.initialstate = this.initialstate||gform.instances['workflow'].get();
            update = function(file,response){
              var files = this.get().current.files = this.get().current.files || this.form.collections.get('files')

              if(typeof response !== 'undefined'){
                var exists = _.find(files,{id:response.id});
                if(typeof exists !== 'undefined'){
                  _.merge(exists,response);
                }else{
                  files = files || [];
                  files.push(response)
                }
              }
              if(files !== "waiting"){
                files = _.map(files,function(file){
                  switch(file.mime_type){
                    case "image/jpeg":
                    case "image/png":
                    case "image/jpg":
                    case "image/gif":
                      break;
                    // case "application/pdf":
                    //   file.icon = '<i class="fa fa-file-pdf-o fa-3x" style="padding-top: 4px;"></i>';
                    //   break;
                    // case "application/zip":
                    //   file.icon = '<i class="fa fa-file-zip-o fa-3x" style="padding-top: 4px;"></i>';
                    //   break;
                    default:
                      var icons = {
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
                      var icon = icons[file.mime_type] || icons[file.mime_type.split('/')[0]] || icons[file.ext] || "fa-file-o";
                      file.icon = '<i class="fa '+icon+' fa-3x" style="padding-top: 4px;"></i>';
                  }
                  file.date =  moment(file.deleted_at||file.created_at).format('MM/DD/YY h:mm a');
                  return file;

                })
              }
              $('.f_'+get().guid).html(gform.renderString(workflow_report.attachments, this.get().current))
              gform.collections.update('files', files)
              this.get().current.files = files
              var field = this.form.find({shown:true,type:'files'});
              if(field){
                field.set(response.name)
                field.renderMenu();
                $('[href="'+_.find(field.options,{id:response.id}).path+'"]').click()
                // field.el.find((response.name)
              }

            }.bind(this)
            if(this.id && this.get().workflow.version.code.form.files && _.find(this.get().workflow.version.code.flow,{name:this.get().workflow.configuration.initial}).uploads){
              if($('#myId').length){
                $('#myId').html('');
                this.Dropzone = new Dropzone("div#myId", {timeout:60000, url: "/api/workflowsubmissions/"+this.id+"/files", init: function() {
                  this.on("success", update);
                }});
              }
              update();
            }
            $('.f_'+get().guid).on('click','[data-id]',function(e){
              e.stopPropagation();
              e.preventDefault();
              if(e.currentTarget.dataset.action == 'delete'){
                $.ajax({
                  url:'/api/workflowsubmissions/'+this.id+'/files/'+e.currentTarget.dataset.id,
                  type: 'delete',
                  success  : update.bind(null,{}),
                  error:function(){

                  }
                })

              }else if(e.currentTarget.dataset.action == 'edit'){
                myModal = new gform({legend:"Edit file name",data:_.find(this.get().current.files,{id:parseInt(e.currentTarget.dataset.id)}),fields:[
                  {name:"name",label:false},
                  {name:"id", type:"hidden"}
                ]}).on('cancel',function(e){
                  e.form.trigger('close');
                }).on('save',function(e){
                  $.ajax({
                    url:'/api/workflowsubmissions/'+this.id+'/files/'+e.form.get('id'),
                    type: 'put',
                    dataType : 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(e.form.get()),
                    success  : update.bind(null,{}),
                    error:function(){
        
                    }
                  })
                  e.form.trigger('close');
                }.bind(this)).modal();
              }
            }.bind(this))

            this.form.on('save',function(e){
              if(e.field.name == '_save_for_later'){
                

                // data._state = this.get().data
                debugger;
                var data = {
                  _flowstate:instance.configuration.initial,
                  _state:e.form.get('_state'),//(this.get().current||this.get()).data,
                  user:this.get().user,
                  data:mappedData
                }


                let savePromise = new Promise(function(saveResolve, saveReject) {
                  new gform({legend:"Comment associated with this submission",modal:{header_class:'bg-success'},fields:[{label:"Comment"}]}).modal().on('save',function(saveResolve,e){
                    e.form.dispatch('close');
                    e.form.destroy();
                    saveResolve(e.form.get('comment'))
                  }.bind(null,saveResolve)).on('cancel',function(saveReject,e){
                    saveReject()
                  }.bind(null,saveReject))
                }.bind(null))
                savePromise.then(
                  function(value) {

                    $.ajax({
                      url:'/api/workflowsubmissions/'+this.get().instance_id+'/save',
                      dataType : 'json',
                      contentType: 'application/json',
                      data: JSON.stringify(_.extend(this.get().current,{comment:value})),
                      type: 'POST',
                      success  : (data)=>{
                        this.set({current:{data:{}}})
                        this.initialstate = this.get().current.data;
                        location.reload();                        
                      },
                      error:function(){
                    
                        // this.form.find('_state').el.style.opacity = 1
                        // gform.types.fieldset.edit.call(e.form.find('_state'),true)
                    
                        // $('.gform-footer').show();
                        // toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
                    
                    
                      }
                    })


                  }.bind(this))

                
                return false;
              }

                //check if validation required first
              var currentAction = _.find(_.find(this.get().workflow.version.code.flow,{name:mappedData.state}).actions,{name:e.field.name});

              
              if(currentAction.validate !== false && !e.form.validate(true)){
                if(currentAction.invalid_submission !== true || !confirm(gform.renderString("This form has the following errors:\r\n\r\n{{#errors}}{{.}}\r\n{{/errors}}\r\nWould you like to submit anyway?",{errors:_.values(e.form.errors)}) )){
                  toastr.error("Form invalid, please check for errors!", 'ERROR');
                  return;
                }
              }
              
              if(currentAction.signature){

                signature = new gform({legend:"Signature Required",actions:[{type:"cancel",label:'<i class="fa fa-times"></i> Clear'},{type:"save"}]}).
                on('cancel',function(e){
                  e.form.set({signature:null})
                  var signature = e.form.find('signature');
                  e.form.valid = true;
                  signature.valid = true;
                  signature.errors=""
                  gform.handleError(signature);
                
                }).
                on('save',function(e,name,modal){
                  if(modal.form.validate()){
                    // modal.form.find('signature').el.querySelector('canvas').style.borderColor = "#bbb"
                    modal.form.trigger('close')
                    gform.types.fieldset.edit.call(e.form.find('_state'),false)
                    e.form.find('_state').el.style.opacity = .7
                    $('.gform-footer').hide();
                    var data = e.form.toJSON();
                    data.signature = modal.form.get('signature');
                    data.action = name;
                    this.saveFlow.call(this,e,data)
                  }
                  // else{
                  //   modal.form.find('signature').el.querySelector('canvas').style.borderColor = "red"
                  // }

                }.bind(this,e,e.field.name)).on('input',function(e){
                  if(e.form.el.classList.contains('in'))e.form.validate()
                  
                  // e.form.find('signature').el.querySelector('canvas').style.borderColor = "#bbb"
                }).modal()
                signature.fields.push(signature.add({type:'signaturePad',required:true,label:"Signature",hideLabel:true,help:_.find(_.find(this.get().workflow.version.code.flow,{name:mappedData.state}).actions,{name:e.field.name}).signature_text||"Please Sign Above",name:"signature"}))
              }else{
                gform.types.fieldset.edit.call(e.form.find('_state'),false)
                e.form.find('_state').el.style.opacity = .7
                $('.gform-footer').hide();
                var data = e.form.toJSON();
                data.action = e.field.name;
                this.saveFlow.call(this,e,data)
              }
            }.bind(this))
            .on('canceled',function(e) {
              e.form.set('_state',this.initialstate._state)
            }.bind(this))
            this.form.on('input canceled', function() {
              if(!_.isEqual(this.initialstate,gform.instances['workflow'].get())){
                  this.updateRequired();
                if($('.flow-title .status').html() != 'Saving...'){
                  $('.flow-title .status').html('Saving...').removeClass('label-success')
                  $g.waiting = "Saving..."
                  // interval()
                }

                if(typeof mytimeout !== 'undefined') clearTimeout(mytimeout);
                mytimeout = setTimeout(interval, 1500);
              }else{
                $('.flow-title .status').html('All Changes Saved').removeClass('label-danger').addClass('label-success')
              }
            }.bind(this))


            interval = function() {
              if($('.flow-title .status').html() == 'Saving...'){
                $.ajax({
                  url:'/api/workflowsubmissions/'+this.get().instance_id+'/save'+((parseInt(window.location.search.split('?saved=')[1]) == (this.get().current||{id:null}).id)?"?id="+this.get().current.id:""),
                  dataType : 'json',
                  contentType: 'application/json',
                  data:  JSON.stringify(function(){
                    let temp = this.form.get();
                    temp._state = JSON.stringify(temp._state);
                    return temp;
                  }.call(this)),
                  type: 'POST',
                  success  : function(data){
                    $('.flow-title .status').html('All Changes Saved').removeClass('label-danger').addClass('label-success')
                    $g.waiting = false
                    this.id = data.id;
                    if(typeof this.Dropzone == "undefined" && this.get().workflow.version.code.form.files && _.find(this.get().workflow.version.code.flow,{name:this.get().workflow.configuration.initial}).uploads){
                      if($('#myId').length){
                        $('#myId').html('');
                        this.Dropzone = new Dropzone("div#myId", {timeout:60000, url: "/api/workflowsubmissions/"+this.id+"/files", init: function() {
                          this.on("success", update);
                        }});
                      }

                    }
                    this.initialstate = data.data;
                    data.data.files = this.form.collections.get('files')
                    this.set({current:data});
                  }.bind(this),
                  error:function(){
                    $g.waiting = false
                    $('.flow-title .status').html('Error Saving').addClass('label-danger')

                    this.form.find('_state').el.style.opacity = 1
                    // gform.types.fieldset.edit.call(e.form.find('_state'),true)
                
                    $('.gform-footer').show();
                    toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
                
                
                  }.bind(this)
                })
              }

            }.bind(this)
            if(!this.id){
              $('.flow-title .status').html('Saving...').removeClass('label-success');
              interval();
            }
          }.bind(this),
          function(error) { /* code if some error */ }
        );
      }.bind(this);
      if(typeof instance !== 'undefined'){

        this.load()
      }else{
        $.ajax({
          url:'/api/workflowinstances/'+this.get().instance_id,
          type: 'GET',
          success  : function(workflow){
            this.set({workflow:workflow})
            instance = this.get().workflow;
            this.load();
          }.bind(this),
          error:function(){
          }
        })
      }
		}
	}
}



// Cobler.types.WorkflowSummary = function(container){
//   function get() {
// 		item.widgetType = 'WorkflowSummary';
// 		return item;
// 	}
// 	var item = {
// 		guid: generateUUID()}
//   var fields = {
// 		Title: {},
// 		'Workflow ID': {type: 'select', choices: '/api/groups/'+group_id+'/workflowinstances'},
// 	}
// 	return {
//     container:container,
// 		fields: fields,
// 		render: function() {
//       return gform.renderString(workflow_report.workflow_summary_container, get());
//     },
// 		edit: defaultCobEditor.call(this, container),
// 		toJSON: get,
//     get: get,
//     redraw:function(newItem){
//       if(typeof newItem !== 'undefined')this.set(newItem)
//       this.ractive.set(item);
//     },
// 		set: function (newItem) {
//       // if(typeof newItem.current == 'undefined' || !_.isEqual(_.pick(newItem.current,'created_at','updated_at','title','comment'),_.pick(item.current,'created_at','updated_at','title','comment'))){
//         $.extend(item, newItem);
//         item.current = $g.formatDates(item.current)

        
//       //   if(this.container.getItems().length)this.container.update(item,this);
//       // }
// 		},
//     saveFlow:function(e,data){
//       $.ajax({
//         url:'/api/workflowsubmissions/'+this.get().instance_id,
//         dataType : 'json',
//         contentType: 'application/json',
//         data: JSON.stringify(data),
//         type: 'POST',
//         success  : function(data){
//           e.form.find('_state').el.style.opacity = 1
//           document.location = "/workflows/report/"+data.id;
//         }.bind(this),
//         error:function(){
//           e.form.find('_state').el.style.opacity = 1
//           gform.types.fieldset.edit.call(e.form.find('_state'),true)
//           $('.gform-footer').show();
//           toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
//         }
//       })
//     },
// 		initialize: function(el) {

//   this.ractive = new Ractive({el: this.container.elementOf(this), template: workflow_report.workflow_summary, data:  this.get(), partials: {}});

//   $('.current-panel').on('click','.error-field, .missing-field',function(e){
//     gform.instances.workflow.find({id:e.currentTarget.dataset.id}).focus()
//   })

//   $('.saved-panel').on('click','[data-id]',function(e){

//     // console.log(_.find(this.get().all,{id:parseInt(e.currentTarget.dataset.id)} ));
//     var data = _.extend({},_.find(this.get().all,{id:parseInt(e.currentTarget.dataset.id)} ))
//     if(!_.isEmpty(data)){
//         data = $g.formatDates(data);
//         var modal = new gform({legend:"Previously started workflow",actions:[{type:"cancel",action:"discard","modifiers": "btn btn-danger",label:'<i class="fa fa-times"></i> Discard instance'},{type:"button",action:"switch",label:'<i class="fa fa-check"></i> Switch to this instance'},{type:"button",action:"update",label:'<i class="fa fa-check"></i> Update Comment'}],data:data,name:"modal",fields:[{label:false,name:"title",
//         type:"output",format:{value:`{{#owner.options.data}}
//         <dl class="dl-horizontal">
// <dt>Title</dt>
// <dd>{{{title}}}</dd>
// <dt>Comment</dt>
// <dd>{{{comment}}}</dd>
// <dt>Started</dt>
// <dd>{{created_at.date}} @ {{{created_at.time}}}</dd>
// <dt>Last Updated</dt>
// <dd>{{updated_at.date}} @ {{{updated_at.time}}}</dd>
// </dl>
//         {{/owner.options.data}}`}
//       },{

//         label:"New Comment",name:"comment"
//       }]}).on('discard',function(e){
//         if(confirm('Are you sure you want to discard this submission? This can not be undone')){
//           $.ajax({
//             url:'/api/workflowsubmissions/'+e.form.options.data.id
// ,
//             type: 'delete',
//             success  : function(){

//               location.reload();
//             },
//             error:function(){

//             }
//           })
//         }
//       }).on('update',function(e){
//         $g.waiting = "Updating Comment..."

//         e.form.trigger('close')

//           $.ajax({
//             url:'/api/workflowsubmissions/'+e.form.options.data.workflow_id+'/save',
//             dataType : 'json',
//             contentType: 'application/json',
//             data: JSON.stringify(_.extend(e.form.options.data,{comment:e.form.get('comment')})),
//             type: 'POST',
//             success  : function(form,result){
//               form.trigger('close')

//               this.get().all[_.findIndex(this.get().all,{id:result.id})] = result
//               // this.container.update(this.get(),this)
//               this.redraw();
//               $g.waiting = false;

//               // location.reload();
//               // myResolve();
//               //  $('.flow-title .status').html('All Changes Saved').addClass('label-success')
//               // this.id = data.id;
//               // if(typeof this.Dropzone == "undefined" && this.get().workflow.version.code.form.files && _.find(this.get().workflow.version.code.flow,{name:this.get().workflow.configuration.initial}).uploads){
//               //   $('#myId').html('');
//               //   this.Dropzone = new Dropzone("div#myId", {timeout:60000, url: "/api/workflowsubmissions/"+this.id+"/files", init: function() {
//               //     this.on("success", update);
//               //   }});
//               // }
//               // this.initialstate = data.data;
//               // data.data.files = this.form.collections.get('files')
//               // this.set({current:data});
//             }.bind(this,e.form),
//             error:function(){
          
//               // this.form.find('_state').el.style.opacity = 1
//               // gform.types.fieldset.edit.call(e.form.find('_state'),true)
          
//               // $('.gform-footer').show();
//               // toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
          
          
//             }})
           
//       }.bind(this)).on('switch',function(context,e){
//         // context.form.set({_state:_.find(context.get().all,{id:e.form.options.data.id}).data})
//         // context.container.elementOf(context).querySelector('.submission-title').innerHTML = e.form.get('title')
//         e.form.trigger('cancel');
//         document.location = "?saved="+e.form.options.data.id
//       }.bind(null,this)).modal()

//     }
//   }.bind(this))
  
//     $g.on('workflow_summary',function(e){
//       this.redraw(e.data);
//     }.bind(this))

// 		}
// 	}
// }



// Cobler.types.Workflows = function(container){
// 	function get() {
// 		item.widgetType = 'Workflows';
// 		return item;
// 	}
// 	var item = {
// 		guid: generateUUID()}
// 	var fields = {
//     Title: {},

//     // 'User Options':{name:'user_edit',type:'checkbox'}
// 	}
// 	return {
//     container:container,
// 		fields: fields,
// 		render: function() {
//       var temp = get();
//       temp.workflow_admin = group_admin;
//       // this.id = gform.getUID();
//       // temp.id = this.id;
//       // return templates['widgets_microapp'].render(temp, templates);
//       return gform.renderString(workflow_report.workflows,temp);

// 		},
// 		edit: defaultCobEditor.call(this, container),
// 		toJSON: get,
// 		get: get,
// 		set: function (newItem) {
//       $.extend(item, newItem);
//     },
// 		initialize: function(el){
//       if(this.container.owner.options.disabled && this.get().enable_min){
//           var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
//           this.set({collapsed:collapsed});
//           $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
//       }
//   }}}
  
//   Cobler.types.WorkflowStatus = function(container){
//       function get() {
//           item.widgetType = 'WorkflowStatus';
//           return item;
//       }
//       var item = {
//           guid: generateUUID()}
//       var fields = {
//           Title: {},
//       }
//       return {
//       container:container,
//           fields: fields,
//           render: function() {
//         var temp = get();
//         temp.workflow_admin = group_admin;
//         return gform.renderString(workflow_report.status, temp);
//           },
//           edit: defaultCobEditor.call(this, container),
//           toJSON: get,
//           get: get,
//           set: function (newItem) {
//               $.extend(item, newItem);
//           },
//           initialize: function(el){
//         if(this.container.owner.options.disabled && this.get().enable_min){
//             var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
//             this.set({collapsed:collapsed});
//             $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
//         }
  
//         $.ajax({
//           url:'/api/workflowsubmissions/user',
//           dataType : 'json',
//           type: 'GET',
//           success  : function(newdata){
//             this.container.elementOf(this).querySelector('.collapsible').innerHTML = gform.renderString('<h5>These are all of the workflows you have ever submitted</h5><div id="mygrid"></div>',{open:newdata});
//             myGrid = new GrapheneDataGrid({
//               el: "#mygrid",
//               autoSize: 50, 
//               data: newdata,
//               actions:[],
//               upload:false,download:false,columns:false,
//               sortBy:"updated_at",
//               reverse:true,
//               form:{
//                 fields:[
//                   {label:"Workflow Name",name:"name",type:"select",options:function(data){
//                     return _.uniq(_.map(data,function(item){return item.workflow.name}))
//                   }.bind(null,newdata),template:"{{attributes.workflow.name}}"},
//                   {label:"Submitted",name:"submitted_at",template:"<div>{{attributes.submitted_at}}</div> by {{attributes.user.first_name}} {{attributes.user.last_name}}"},
//                   {label:"Last Updated",name:"updated_at",template:'<div>{{attributes.updated_at}}</div> <div class="label label-default">{{attributes.logs.0.action}}</div>'},
//                   {label:"Assigned",name:"assignment_type",type:"select",options:[{value:'group',label:'Group'},{value:'user',label:'User'}],template:'<span style="text-transform:capitalize">{{attributes.assignee.name}}{{attributes.assignee.first_name}} {{attributes.assignee.last_name}} <div>({{attributes.assignment_type}})</div></span>'},
//                   {label:"Status",name:"status",type:"select",options:['open','closed'],template:'<span style="text-transform:capitalize">{{attributes.status}}</span>'},
//                   {label:"State",name:"state",type:"select",options:function(data){
//                     return _.uniq(_.map(data,function(item){return item.state}))
//                   }.bind(null,newdata)},
//                   {label:"ID",name:"id",type:"text"}
//                 ]
//               }
//             }).on('click',function(e){
//                 document.location = "/workflows/report/"+e.model.attributes.id;
//             })
//           }.bind(this)
//         })
//           }
//       }
//   }
  
  
//   Cobler.types.WorkflowAssignments = function(container){
//       function get() {
//           item.widgetType = 'WorkflowAssignments';
//           return item;
//       }
//       var item = {
//           guid: generateUUID()}
//       var fields = {
//           Title: {},
//       }
//       return {
//       container:container,
//           fields: fields,
//           render: function() {
//         var temp = get();
//         temp.workflow_admin = group_admin;
//         return gform.renderString(workflow_report.status, temp);
//           },
//           edit: defaultCobEditor.call(this, container),
//           toJSON: get,
//           get: get,
//           set: function (newItem) {
//               $.extend(item, newItem);
//           },
//           initialize: function(el){
//         if(this.container.owner.options.disabled && this.get().enable_min){
//             var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
//             this.set({collapsed:collapsed});
//             $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
//         }
//         $.ajax({
//           url:'/api/workflowsubmissions/user/assignments',
//           dataType : 'json',
//           type: 'GET',
//           success  : function(assignments){
  
//             this.container.elementOf(this).querySelector('.collapsible').innerHTML = gform.renderString('<h5>These are all of the workflows which require your action</h5><div id="assignmentgrid"></div>');
//             assignmentGrid = new GrapheneDataGrid({
//               el: "#assignmentgrid",
//               autoSize: 50, 
//               data: assignments,
//               actions:[],upload:false,download:false,columns:false,
//               sortBy:"updated_at",
//               reverse:true,
//               form:{
//                 fields:[
//                   {label:"Workflow Name",name:"name",type:"select",options:function(data){
//                     return _.uniq(_.map(data,function(item){return item.workflow.name}))
//                   }.bind(null,assignments),template:"{{attributes.workflow.name}}"},
//                   {label:"Submitted",name:"submitted_at",template:"<div>{{attributes.submitted_at}}</div> by {{attributes.user.first_name}} {{attributes.user.last_name}}"},
//                   {label:"Last Updated",name:"updated_at",template:'<div>{{attributes.updated_at}}</div> <div class="label label-default">{{attributes.logs.0.action}}</div> '},
//                   {label:"Assigned",name:"assignment_type",type:"select",options:[{value:'group',label:'Group'},{value:'user',label:'User'}],template:'<span style="text-transform:capitalize">{{attributes.assignee.name}}{{attributes.assignee.first_name}} {{attributes.assignee.last_name}} ({{attributes.assignment_type}})</span>'},
//                   {label:"State",name:"state",type:"select",options:function(data){
//                     return _.uniq(_.map(data,function(item){return item.state}))
//                   }.bind(null,assignments)},
//                   {label:"ID",name:"id",type:"text"}
//                 ]
//               }
//             }).on('click',function(e){
//               document.location = "/workflows/report/"+e.model.attributes.id;
//             }).on("*",function(e){
//               if(e.event.startsWith("click_") && !e.model.waiting()){
//                 e.model.waiting(true);
//                 if(_.find(e.model.attributes.actions,{name:e.event.split("click_")[1]}).form){
//                   e.model.waiting(false);
//                   new gform(
//                     {
//                       "legend":e.model.attributes.workflow.name,
//                       "data":e.model.attributes.data,
//                       "events":e.model.attributes.workflow_version.code.form.events||{},
//                       "actions": [
//                         {
//                           "type": "cancel",
//                           "name": "submitted",
//                           "action":"canceled",
//                         },
//                         {
//                           "type": "save",
//                           "name": "submit",
//                           "label": "<i class='fa fa-check'></i> Submit"
//                         },{
//                           "type": "hidden",
//                           "name": "_flowstate",
//                           "value":e.model.attributes.state
//                         },{
//                           "type": "hidden",
//                           "name": "_flowstate_history",
//                           "value": e.model.attributes.state
//                         }
  
//                       ],
//                       "fields":[
//                         {"name":"_state","label":false,"type":"fieldset","fields": e.model.attributes.workflow_version.code.form.fields},                                
//                         {"name":"comment","type":"textarea","length":255}
//                       ]
//                     }).on('save',function(e,eForm){
//                       if(!eForm.form.validate(true))return;
                      
//                       e.model.waiting(true);
  
//                       eForm.form.trigger('close')
                      
//                       $.ajax({
//                         url:'/api/workflowsubmissions/'+e.model.attributes.id,
//                         type: 'PUT',
//                         dataType : 'json',
//                         contentType: 'application/json',
//                         data: JSON.stringify({_state:eForm.form.get()._state,comment:eForm.form.get().comment,action:e.event.split("click_")[1]},),
//                         success  : function(e,data){
//                           e.model.waiting(false);
                          
//                           data.actions = (_.find(data.workflow_version.code.flow,{name:data.state}) || {"actions": []}).actions;
//                           // data.updated_at = moment(data.updated_at).fromNow()
//                           e.model.set(data)
    
//                           }.bind(null,e)
//                       })
//                     }.bind(null,e)).on('canceled',function(eForm){
//                       eForm.form.trigger('close')
//                     }).modal();
//                 }else{
//                   new gform(
//                     {
//                       "legend":e.model.attributes.workflow.name,
//                       "data":e.model.attributes.data,
//                       "events":e.model.attributes.workflow_version.code.form.events||{},
//                       "actions": [
//                         {
//                           "type": "cancel",
//                           "name": "submitted",
//                           "action":"canceled",
//                         },
//                         {
//                           "type": "save",
//                           "name": "submit",
//                           "label": "<i class='fa fa-check'></i> Submit"
//                         },{
//                           "type": "hidden",
//                           "name": "_flowstate",
//                           "value":e.model.attributes.state
//                         }
//                       ],
//                       "fields":[
//                         {"name":"comment","type":"textarea","length":255}
//                       ]
//                     }).on('save',function(e,eForm){
  
//                       e.model.waiting(true);
  
//                       eForm.form.trigger('close')
//                   $.ajax({
//                     url:'/api/workflowsubmissions/'+e.model.attributes.id,
//                     dataType : 'json',
//                     type: 'PUT',
//                     contentType: 'application/json',
//                     data: JSON.stringify({_state:e.model.attributes.data,comment:eForm.form.get().comment,action:e.event.split("click_")[1]}),
//                     success  : function(e,data){
//                       e.model.waiting(false);
//                       data.actions = (_.find(data.workflow_version.code.flow,{name:data.state}) || {"actions": []}).actions;
//                       e.model.set(data)
//                       }.bind(null,e)
//                   })
  
//                 }.bind(null,e)).on('canceled',function(eForm){
//                   eForm.form.trigger('close')
//                 }).modal();
  
//               }
  
  
//               }
//             })
          
//           }.bind(this)
//         })
//           }
//       }
//   }
  
  
  