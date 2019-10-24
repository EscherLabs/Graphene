
/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.6.3
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2017, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowPast: true,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      autoDispose: true,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        inPast: 'any moment now',
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },

    inWords: function(distanceMillis) {
      if (!this.settings.allowPast && ! this.settings.allowFuture) {
          throw 'timeago allowPast and allowFuture settings can not both be set to false.';
      }

      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      if (!this.settings.allowPast && distanceMillis >= 0) {
        return this.settings.strings.inPast;
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) { separator = " "; }
      return $.trim([prefix, words, suffix].join(separator));
    },

    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      s = s.replace(/([\+\-]\d\d)$/," $100"); // +09 -> +0900
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function() {
      functions.dispose.call(this);
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function(timestamp) {
      var date = (timestamp instanceof Date) ? timestamp : $t.parse(timestamp);
      $(this).data('timeago', { datetime: date });
      if ($t.settings.localeTitle) {
        $(this).attr("title", date.toLocaleString());
      }
      refresh.apply(this);
    },
    updateFromDOM: function() {
      $(this).data('timeago', { datetime: $t.parse( $t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title") ) });
      refresh.apply(this);
    },
    dispose: function () {
      if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
      }
    }
  };

  $.fn.timeago = function(action, options) {
    var fn = action ? functions[action] : functions.init;
    if (!fn) {
      throw new Error("Unknown function name '"+ action +"' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function() {
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    var $s = $t.settings;

    //check if it's still visible
    if ($s.autoDispose && !$.contains(document.documentElement,this)) {
      //stop if it has been removed
      $(this).timeago("dispose");
      return this;
    }

    var data = prepareData(this);

    if (!isNaN(data.datetime)) {
      if ( $s.cutoff === 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      } else {
        if ($(this).attr('title').length > 0) {
            $(this).text($(this).attr('title'));
        }
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr("title", element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6
  document.createElement("abbr");
  document.createElement("time");
}));


Cobler.types.Workflow = function(container){
	function get() {
		item.widgetType = 'Workflow';
		return item;
	}
	var item = {
		guid: generateUUID()}
	var fields = {
		Title: {},
		'Workflow ID': {type: 'select', choices: '/api/groups/'+group_id+'/workflowinstances'},
	}
	return {
    container:container,
		fields: fields,
		render: function() {
      var temp = get();
      temp.workflow_admin = group_admin;
      return gform.renderString(`

      <div class="btn-group pull-right slice-actions parent-hover">
	    {{#enable_min}}<span class="btn btn-default btn-sm min-item fa fa-toggle" data-event="min" title="Minimize"></span>{{/enable_min}}
      </div>
      {{#container}}

      <div class="panel panel-default">
        <div class="panel-heading{{^titlebar}} hide{{/titlebar}}" style="position:relative">
          <h3 class="panel-title">{{title}}{{^title}}{{{widgetType}}}{{/title}}</h3>
        </div>
        {{>widgets__header}}
        <div class="collapsible panel-body">
          <h3 class="flow-title"></h3>
          <div>
          <!-- Nav tabs -->
          {{#workflow.version.code.form.files}}

          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#form" aria-controls="form" role="tab" data-toggle="tab">Form</a></li>
            <li role="presentation"><a href="#files" aria-controls="files" role="tab" data-toggle="tab">Documents</a></li>
          </ul>
          {{/workflow.version.code.form.files}}
        
          <!-- Tab panes -->
          <div class="tab-content" style="padding-top:15px">
            <div role="tabpanel" class="tab-pane active" id="form">
              <div class="g_{{guid}}">
                <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
              </div>
            </div>
            {{#workflow.version.code.form.files}}
            <div role="tabpanel" class="tab-pane" id="files">
            <div class="f_{{guid}}"></div>
            </div>
            {{/workflow.version.code.form.files}}
          </div>
        
        </div>
        {{#workflow.version.code.form.files}}
        </div>
        <div class="dropzone" id="myId"><center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
        </div>
        {{/workflow.version.code.form.files}}
      </div>



      {{/container}}
      {{^container}}

        <div class="collapsible">
        <h3 class="flow-title"></h3>
        <div class="g_{{guid}}"></div>
        </div>
      {{/container}}
      `, temp);
		},
		edit: berryEditor.call(this, container),
		toJSON: get,
		get: get,
		set: function (newItem) {
			$.extend(item, newItem);
		},
		initialize: function(el) {
      if(typeof this.get().workflow_id == 'undefined'){return false;};
        this.fields['Workflow ID'].enabled = false;
      if(this.container.owner.options.disabled && this.get().enable_min){
        var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
        this.set({collapsed:collapsed});
        $(el).find('.widget').toggleClass('cob-collapsed', collapsed)
      }
      
      var instance = this.get().workflow;
      this.container.elementOf(this).querySelector('.flow-title').innerHTML = instance.workflow.name+'<span class="badge pull-right status"></span>';
      var formSetup = {
        "data":{_state:(this.get().current||this.get()).data},
        "actions": [
          {
            "type": "cancel",
            "name": "cancel",
            "action":"canceled",
            "label": "<i class='fa fa-times'></i> Clear"
          },{
            "type": "hidden",
            "name": "_flowstate",
            "value":instance.configuration.initial
          }
        ],
        "fields":[
            {"name":"_state","label":false,"type":"fieldset","fields": instance.version.code.form.fields
          }
        ]
      }

      //create actions buttons that are active in current(initial) state
      _.each((_.find(instance.version.code.flow,{name:instance.configuration.initial}) || {"actions": []}).actions,function(action){
        action.modifiers = 'btn btn-'+action.type;
        action.action = 'save';
        action.type = 'button';
        formSetup.actions.push(action);
      });

      this.form = new gform(formSetup, '.g_'+get().guid);
      if(this.get().current != null){
        this.initialstate = this.get().current.data;
        this.id = this.get().current.id;
        gform.collections.add('files', this.get().current.files)
      }else{
        this.initialstate = gform.instances.f0.get();
        gform.collections.add('files', [])
      }

      update = function(file,response){
        if(typeof response !== 'undefined'){
          var exists = _.find(this.get().current.files,{id:response.id});
          if(typeof exists !== 'undefined'){
            _.merge(exists,response);
          }else{
            this.get().current.files.push(response)
          }
        }
        this.get().current.files = _.map(this.get().current.files,function(file){
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
        $('.f_'+get().guid).html(gform.renderString(`
        <div class="list-group">
        {{#files}}
        <a style="height:60px;padding-left:70px" href="{{path}}" target="_blank" class="list-group-item {{#deleted_at}}list-group-item-danger{{/deleted_at}}">
        <div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}background-image: url('{{path}}');background-size: contain;background-repeat: no-repeat;background-position: center;{{/icon}}position:absolute;top:5px;left:5px">
        {{{icon}}}
        </div>{{name}}
        <div style="margin-top:5px" class="text-muted">{{mime_type}}<span class="pull-right">{{date}}</span></div>
          {{^deleted_at}}
          <div style="position: absolute;right: 10px;top: 5px;" class="btn-group parent-hover">
            <span data-id="{{id}}" data-action="edit" class="edit-item btn btn-default fa fa-pencil" data-title="Edit"></span>
            <span data-id="{{id}}" data-action="delete" class="remove-item btn btn-danger fa fa-trash-o" data-title="Delete"></span>
          </div>
          {{/deleted_at}}
        </a>
        {{/files}}
        {{^files}}
          No files yet...click below or drop some files there to begin.
        {{/files}}
        </div>
        `,this.get().current))
        gform.collections.update('files', this.get().current.files)

      }.bind(this)
      if(this.id && this.get().workflow.version.code.form.files){
        $('#myId').html('');
        this.Dropzone = new Dropzone("div#myId", { url: "/api/workflowsubmissions/"+this.id+"/files", init: function() {
          this.on("success", update);
        }});
        
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
        if(!e.form.validate(true))return;
        gform.types.fieldset.edit.call(e.form.find('_state'),false)
        e.form.find('_state').el.style.opacity = .7
        $('.gform-footer').hide();
        var data = e.form.toJSON();
        data.action = e.field.name;
        $.ajax({
          url:'/api/workflowsubmissions/'+this.get().workflow_id,
          dataType : 'json',
          contentType: 'application/json',
          data: JSON.stringify(data),
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
      }.bind(this))
      .on('canceled',function(e){
        e.form.set('_state',this.initialstate._state)
      }.bind(this))
      this.form.on('input canceled', function() {
        if(!_.isEqual(this.initialstate,gform.instances.f0.get())){
          if($('.flow-title .status').html() != 'Changed'){
            $('.flow-title .status').html('Changed')
            setTimeout(interval, 5000);
          }
        }else{
          $('.flow-title .status').html('')
        }
      }.bind(this))


      interval = function() {
        if($('.flow-title .status').html() == 'Changed'){
          $.ajax({
            url:'/api/workflowsubmissions/'+this.get().workflow_id+'/save',
            dataType : 'json',
            contentType: 'application/json',
            data: JSON.stringify(this.form.get()),
            type: 'POST',
            success  : function(data){
              $('.flow-title .status').html('')
              // debugger;
              this.id = data.id;
              if(typeof this.Dropzone == "undefined" && this.get().workflow.version.code.form.files){
                $('#myId').html('');

                this.Dropzone = new Dropzone("div#myId", { url: "/workflowsubmissions/"+this.id+"/files"});
              }
              this.initialstate = data.data;
            }.bind(this),
            error:function(){
          
              this.form.find('_state').el.style.opacity = 1
              gform.types.fieldset.edit.call(e.form.find('_state'),true)
          
              $('.gform-footer').show();
              toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
          
          
            }
          })
        }

      }.bind(this)
      if(!this.id){
        $('.flow-title .status').html('Changed');
        interval();
      }
		}
	}
}




Cobler.types.Workflows = function(container){
	function get() {
		item.widgetType = 'Workflows';
		return item;
	}
	var item = {
		guid: generateUUID()}
	var fields = {
    Title: {},

    // 'User Options':{name:'user_edit',type:'checkbox'}
	}
	return {
    container:container,
		fields: fields,
		render: function() {
      var temp = get();
      temp.workflow_admin = group_admin;
      // this.id = gform.getUID();
      // temp.id = this.id;
      // return templates['widgets_microapp'].render(temp, templates);
      return gform.renderString(`
      <div class="btn-group pull-right slice-actions parent-hover">
	{{#enable_min}}<span class="btn btn-default btn-sm min-item fa fa-toggle" data-event="min" title="Minimize"></span>{{/enable_min}}
</div>

      {{#container}}
      <div class="panel panel-default">
      <div class="panel-heading{{^titlebar}} hide{{/titlebar}}" style="position:relative">
	<h3 class="panel-title">{{title}}{{^title}}{{{widgetType}}}{{/title}}</h3>
</div>
      {{>widgets__header}}
        <div class="collapsible panel-body">
        
        <h3 class="flow-title"></h3>
        <div class="g_{{guid}}">
        <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
        </div>
        </div>
      </div>
      {{/container}}
      {{^container}}

        <div class="collapsible">
  
        </div>
      {{/container}}`,temp);

		},
		edit: berryEditor.call(this, container),
		toJSON: get,
		get: get,
		set: function (newItem) {
			$.extend(item, newItem);
		},
		initialize: function(el){
      if(this.container.owner.options.disabled && this.get().enable_min){
          var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
          this.set({collapsed:collapsed});
          $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
      }
      $.ajax({
        url:'/api/workflowinstances/user',
        dataType : 'json',
        type: 'GET',
    //     data: (Lockr.get('/api/apps/instances/'+this.get().app_id+'/user_options')|| {options:{}}),
        success  : function(data){
          this.container.elementOf(this).querySelector('.collapsible').innerHTML = gform.renderString(` 
          <label for="link_filter" class="sr-only">Filter</label><input id="link_filter" type="text" class="form-control filter" data-selector=".available_workflow" name="filter" placeholder="Filter...">
          <ul class="list-group available_workflow" style="margin:10px 0 0">
          {{#data}}<a class="filterable list-group-item" target="_blank" href="/workflow/{{group_id}}/{{slug}}">{{name}}</a>{{/data}}
          </ul>`,{data:data});
          }.bind(this)
      })
		}
	}
}

Cobler.types.WorkflowStatus = function(container){
	function get() {
		item.widgetType = 'WorkflowStatus';
		return item;
	}
	var item = {
		guid: generateUUID()}
	var fields = {
		Title: {},
    // 'User Options':{name:'user_edit',type:'checkbox'}
	}
	return {
    container:container,
		fields: fields,
		render: function() {
      var temp = get();
      temp.workflow_admin = group_admin;
      // this.id = gform.getUID();
      // temp.id = this.id;
      // return templates['widgets_microapp'].render(temp, templates);
      return gform.renderString(`
      <div class="btn-group pull-right slice-actions parent-hover">
	{{#enable_min}}<span class="btn btn-default btn-sm min-item fa fa-toggle" data-event="min" title="Minimize"></span>{{/enable_min}}
</div>

      {{#container}}
      <div class="panel panel-default">
      <div class="panel-heading{{^titlebar}} hide{{/titlebar}}" style="position:relative">
	<h3 class="panel-title">{{title}}{{^title}}{{{widgetType}}}{{/title}}</h3>
</div>
      {{>widgets__header}}
        <div class="collapsible panel-body">
        
        <h3 class="flow-title"></h3>
        <div class="g_{{guid}}">
        <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
        </div>
        </div>
      </div>
      {{/container}}
      {{^container}}

        <div class="collapsible">
  
        </div>
      {{/container}}`,temp);

		},
		edit: berryEditor.call(this, container),
		toJSON: get,
		get: get,
		set: function (newItem) {
			$.extend(item, newItem);
		},
		initialize: function(el){
      if(this.container.owner.options.disabled && this.get().enable_min){
          var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
          this.set({collapsed:collapsed});
          $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
      }
      $.ajax({
        url:'/api/workflowinstances/user',
        dataType : 'json',
        type: 'GET',
    //     data: (Lockr.get('/api/apps/instances/'+this.get().app_id+'/user_options')|| {options:{}}),
        success  : function(data){

          $.ajax({
            url:'/api/workflowsubmissions/user',
            dataType : 'json',
            type: 'GET',
        //     data: (Lockr.get('/api/apps/instances/'+this.get().app_id+'/user_options')|| {options:{}}),
            success  : function(newdata){

              newdata = _.each(newdata, function(item){
                item.created_at = moment(item.created_at).fromNow()
                item.updated_at = moment(item.updated_at).fromNow()
              })
              $.ajax({
                url:'/api/workflowsubmissions/user/assignments',
                dataType : 'json',
                type: 'GET',
            //     data: (Lockr.get('/api/apps/instances/'+this.get().app_id+'/user_options')|| {options:{}}),
                success  : function(assignments){
                  // var total = assignments.direct.length+assignments.group.length;
                  // $('.notificationCount').toggle(!!total).html(total)
                  
                  var getActions = function(item){
                    item.actions = (_.find(item.workflow_version.code.flow,{name:item.state}) || {"actions": []}).actions;
                    // item.updated_at = moment(item.updated_at).fromNow()
                  }

                  assignments.direct = _.each(assignments.direct, getActions)
                  assignments.group = _.each(assignments.group, getActions)

                //   this.container.elementOf(this).querySelector('.collapsible').innerHTML = gform.renderString(`
                //   <div>
        
                //   <!-- Nav tabs -->
                //   <ul class="nav nav-tabs" role="tablist">
                //     <li role="presentation" class="active"><a href="#workflows" aria-controls="workflows" role="tab" data-toggle="tab">Available Workflows</a></li>
                //     <li role="presentation"><a href="#open" aria-controls="open" role="tab" data-toggle="tab">My Workflows</a></li>
                //     <li role="presentation"><a href="#assignments" aria-controls="assignments" role="tab" data-toggle="tab">Assignments</a></li>
                //   </ul>
                
                //   <!-- Tab panes -->
                //   <div class="tab-content">
                //     <div role="tabpanel" class="tab-pane active" id="workflows">
                //       <ul class="list-group">
                //       {{#data}}<a class="list-group-item" target="_blank" href="/workflow/{{group_id}}/{{slug}}">{{name}}</a>{{/data}}
                //       </ul>
                //     </div>
                //     <div role="tabpanel" class="tab-pane" id="open">
                //     <ul class="list-group">
                //     {{#open}}<a class="list-group-item" target="_blank" href="/api/workflow/{{id}}"><time class="timeago" datetime="{{created_at}}" title="{{created_at}}"></time> - {{workflow.name}} <span style="text-transform: capitalize;" class="badge">{{status}}</span></a>{{/open}}
                //     </ul>
                //     </div>
                //     <div role="tabpanel" class="tab-pane" id="assignments">
                //     <ul class="list-group">
                //     {{#assignments}}
                //     {{#direct}}
                //     <a class="list-group-item" target="_blank" href="/api/workflow/{{id}}"><time class="timeago" datetime="{{created_at}}" title="{{created_at}}"></time> - {{workflow.name}} <span style="text-transform: capitalize;" class="badge">{{status}}</span>{{#actions}}<span class="btn btn-default" data-action="{{name}}">{{label}}</span>{{/actions}}</a>
                //     {{/direct}}
                //     {{#group}}
                //     <a class="list-group-item" target="_blank" href="/api/workflow/{{id}}"><time class="timeago" datetime="{{created_at}}" title="{{created_at}}"></time> - {{workflow.name}} <span style="text-transform: capitalize;" class="badge">{{status}}</span>{{#actions}}<span class="btn btn-default" data-action="{{name}}">{{label}}</span>{{/actions}}</a>
                //     {{/group}}
                //     {{/assignments}}
                //     </ul>
                //     </div>
                //   </div>
                
                // </div>
                //   `,{data:data,open:newdata,assignments:assignments});

                  this.container.elementOf(this).querySelector('.collapsible').innerHTML = gform.renderString(`
                  <ul class="nav nav-tabs" role="tablist">
                    <li role="presentation" class="active"><a href="#workflows" aria-controls="workflows" role="tab" data-toggle="tab">My Workflows</a></li>
                    <li role="presentation"><a href="#assignments" aria-controls="assignments" role="tab" data-toggle="tab">My Assignments</a></li>
                  </ul>
                  <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="workflows">
                    <h5>Your workflows</h5><div id="mygrid"></div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="assignments">
                    <h5>These workflows waiting for your action</h5><div id="assignmentgrid"></div>
                    </div>
                  </div>`,{data:data,open:newdata,assignments:assignments});
                  assignmentData = assignments.direct.concat(assignments.group);

                  assignmentData = _.each(assignmentData, function(item){
                    item.created_at = moment(item.created_at).fromNow()
                    item.updated_at = moment(item.updated_at).fromNow()
                    item.is_open = (item.status == 'open')
                  })
                  assignmentGrid = new GrapheneDataGrid({
                    el: "#assignmentgrid",
                    autoSize: 50, 
                    data: assignmentData,
                    actions:[],upload:false,download:false,columns:false,
                    form:{
                      fields:[
                        {label:"Workflow Name",name:"name",type:"select",options:function(data){
                          return _.uniq(_.map(data,function(item){return item.workflow.name}))
                        }.bind(null,newdata),template:"{{attributes.workflow.name}}"},
                        {label:"Initiated",name:"created_at",template:"{{attributes.created_at}} by {{attributes.user.first_name}} {{attributes.user.last_name}}"},
                        {label:"Last Action",name:"updated_at",template:'<div class="label label-default">{{attributes.logs.0.action}}</div> <time class="timeago" datetime="{{attributes.updated_at}}" title="{{attributes.updated_at}}">{{attributes.updated_at}}</time>'},
                        {label:"Assigned",name:"assignment_type",type:"select",options:[{value:'group',label:'Group'},{value:'user',label:'User'}],template:'<span style="text-transform:capitalize">{{attributes.assignee.name}}{{attributes.assignee.first_name}} {{attributes.assignee.last_name}} ({{attributes.assignment_type}})</span>'},
                        {label:"Status",name:"status",type:"select",options:['open','closed'],template:'<span style="text-transform:capitalize">{{attributes.status}}</span>'},
                        {label:"State",name:"state",type:"select",options:function(data){
                          return _.uniq(_.map(data,function(item){return item.state}))
                        }.bind(null,newdata),template:'<span style="text-transform:capitalize">{{attributes.state}}</span>'},
                        // {label:"Actions",name:"actions",template:'{{#attributes.actions}}<span class="btn btn-{{type}}{{^type}}default{{/type}}" style="margin:2px 5px 2px 0" data-id="{{id}}" data-event="click_{{name}}">{{label}}</span>{{/attributes.actions}}'}
                      ]
                    }
                  }).on('click',function(e){
                    document.location = "/workflows/report/"+e.model.attributes.id;
                  }).on("*",function(e){
                    if(e.event.startsWith("click_") && !e.model.waiting()){
                      e.model.waiting(true);
                      // e.event.split("click_")[1]
                      if(_.find(e.model.attributes.actions,{name:e.event.split("click_")[1]}).form){
                        e.model.waiting(false);
                        new gform(
                          {
                            "legend":e.model.attributes.workflow.name,
                            "data":e.model.attributes.data,
                            "actions": [
                              {
                                "type": "cancel",
                                "name": "submitted",
                                "action":"canceled",
                                // "label": "<i class='fa fa-check'></i> Submit"
                              },
                              {
                                "type": "save",
                                "name": "submit",
                                "label": "<i class='fa fa-check'></i> Submit"
                              },{
                                "type": "hidden",
                                "name": "_flowstate",
                                "value":e.model.attributes.state
                              }

                            ],
                            "fields":[
                              {"name":"_state","label":false,"type":"fieldset","fields": e.model.attributes.workflow_version.code.form.fields},                                
                              {"name":"comment","type":"textarea","length":255}
                            ]
                          }).on('save',function(e,eForm){
                            if(!eForm.form.validate(true))return;

                            e.model.waiting(true);

                            eForm.form.trigger('close')
                            
                            $.ajax({
                              url:'/api/workflowsubmissions/'+e.model.attributes.id,
                              type: 'PUT',
                              dataType : 'json',
                              contentType: 'application/json',
                              data: JSON.stringify({_state:eForm.form.get()._state,comment:eForm.form.get().comment,action:e.event.split("click_")[1]},),
                              success  : function(e,data){
                                e.model.waiting(false);
                                
                                data.actions = (_.find(data.workflow_version.code.flow,{name:data.state}) || {"actions": []}).actions;
                                data.updated_at = moment(data.updated_at).fromNow()
                                e.model.set(data)
                                
                                // console.log(data);
                                // this.container.elementOf(this).querySelector('.collapsible').innerHTML = gform.renderString(` 
                                // <label for="link_filter" class="sr-only">Filter</label><input id="link_filter" type="text" class="form-control filter" data-selector=".available_workflow" name="filter" placeholder="Filter...">
                                // <ul class="list-group available_workflow" style="margin:10px 0 0">
                                // {{#data}}<a class="filterable list-group-item" target="_blank" href="/workflow/{{group_id}}/{{slug}}">{{name}}</a>{{/data}}
                                // </ul>`,{data:data});
                                }.bind(null,e)
                            })
                          }.bind(null,e)).on('canceled',function(eForm){
                            eForm.form.trigger('close')
                          }).modal();
                      }else{



                        new gform(
                          {
                            "legend":e.model.attributes.workflow.name,
                            "data":e.model.attributes.data,
                            "actions": [
                              {
                                "type": "cancel",
                                "name": "submitted",
                                "action":"canceled",
                                // "label": "<i class='fa fa-check'></i> Submit"
                              },
                              {
                                "type": "save",
                                "name": "submit",
                                "label": "<i class='fa fa-check'></i> Submit"
                              },{
                                "type": "hidden",
                                "name": "_flowstate",
                                "value":e.model.attributes.state
                              }
                            ],
                            "fields":[
                              // {"name":"_state","label":false,"type":"fieldset","fields": JSON.parse(_.find(e.model.attributes.workflow_version.code.forms,{name:'Initial Form'}).content).fields},                                
                              {"name":"comment","type":"textarea","length":255}
                            ]
                          }).on('save',function(e,eForm){

                            e.model.waiting(true);

                            eForm.form.trigger('close')
                        $.ajax({
                          url:'/api/workflowsubmissions/'+e.model.attributes.id,
                          dataType : 'json',
                          type: 'PUT',
                          contentType: 'application/json',
                          data: JSON.stringify({_state:e.model.attributes.data,comment:eForm.form.get().comment,action:e.event.split("click_")[1]}),
                          success  : function(e,data){
                            e.model.waiting(false);
                            data.actions = (_.find(data.workflow_version.code.flow,{name:data.state}) || {"actions": []}).actions;
                            data.updated_at = moment(data.updated_at).fromNow()
                            e.model.set(data)
                            // console.log(data);
                            // this.container.elementOf(this).querySelector('.collapsible').innerHTML = gform.renderString(` 
                            // <label for="link_filter" class="sr-only">Filter</label><input id="link_filter" type="text" class="form-control filter" data-selector=".available_workflow" name="filter" placeholder="Filter...">
                            // <ul class="list-group available_workflow" style="margin:10px 0 0">
                            // {{#data}}<a class="filterable list-group-item" target="_blank" href="/workflow/{{group_id}}/{{slug}}">{{name}}</a>{{/data}}
                            // </ul>`,{data:data});
                            }.bind(null,e)
                        })


                      }.bind(null,e)).on('canceled',function(eForm){
                        eForm.form.trigger('close')
                      }).modal();

                    }


                    }
                  })
                  myGrid = new GrapheneDataGrid({
                    el: "#mygrid",
                    autoSize: 50, 
                    data: newdata,
                    // actions:[{name:"delete"}],
                    actions:[],
                    upload:false,download:false,columns:false,
                    form:{
                      fields:[
                        {label:"Workflow Name",name:"name",type:"select",options:function(data){
                          return _.uniq(_.map(data,function(item){return item.workflow.name}))
                        }.bind(null,newdata),template:"{{attributes.workflow.name}}"},
                        {label:"Initiated",name:"created_at",template:"{{attributes.created_at}} by {{attributes.user.first_name}} {{attributes.user.last_name}}"},
                        // {label:"Last Action",name:"updated_at",template:'<time class="timeago" datetime="{{attributes.created_at}}" title="{{attributes.created_at}}">{{attributes.created_at}}</time>'},
                        {label:"Last Action",name:"updated_at",template:'<div class="label label-default">{{attributes.logs.0.action}}</div> <time class="timeago" datetime="{{attributes.updated_at}}" title="{{attributes.updated_at}}">{{attributes.updated_at}}</time>'},
                        {label:"Assigned",name:"assignment_type",type:"select",options:[{value:'group',label:'Group'},{value:'user',label:'User'}],template:'<span style="text-transform:capitalize">{{attributes.assignee.name}}{{attributes.assignee.first_name}} {{attributes.assignee.last_name}} ({{attributes.assignment_type}})</span>'},
                        
                        {label:"Status",name:"status",type:"select",options:['open','closed'],template:'<span style="text-transform:capitalize">{{attributes.status}}</span>'},
                        {label:"State",name:"state",type:"select",options:function(data){
                          return _.uniq(_.map(data,function(item){return item.state}))
                        }.bind(null,newdata),template:'<span style="text-transform:capitalize">{{attributes.state}}</span>'},
                        // {label:"Assignment",name:"assignment_type",template:'<span style="text-transform:capitalize">{{attributes.assignment_type}}</span>'},
                        // {label:"Actions",name:"actions",template:'{{#attributes.actions}}<span class="btn btn-default" style="margin:2px 0" data-event="{{name}}">{{label}}</span>{{/attributes.actions}}'}
                      ]
                    }
                  }).on('click',function(e){
                    document.location = "/workflows/report/"+e.model.attributes.id;
                  }).on('model:delete',function(e){
                  
                    $.ajax({
                      url:'/api/workflowsubmissions/'+e.model.attributes.id,
                      dataType : 'json',
                      type: 'delete',
                      // data: {_state:e.model.attributes.data,action:e.event.split("click_")[1]},
                      success  : function(e,data){
                        // e.model.waiting(false);
                        // data.actions = (JSON.parse(data.workflow_version.code.flow)[data.state] || {"actions": []}).actions;
                        // data.updated_at = moment(data.updated_at).fromNow()
                        // e.model.set(data)
                        // console.log(data);
                        // this.container.elementOf(this).querySelector('.collapsible').innerHTML = gform.renderString(` 
                        // <label for="link_filter" class="sr-only">Filter</label><input id="link_filter" type="text" class="form-control filter" data-selector=".available_workflow" name="filter" placeholder="Filter...">
                        // <ul class="list-group available_workflow" style="margin:10px 0 0">
                        // {{#data}}<a class="filterable list-group-item" target="_blank" href="/workflow/{{group_id}}/{{slug}}">{{name}}</a>{{/data}}
                        // </ul>`,{data:data});
                        }.bind(null,e)
                    })

                  })
    
                  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    assignmentGrid.draw()
                  })

                }.bind(this)
                
              })


            }.bind(this)

          })

        
        }.bind(this)
      })
		}
	}
}

