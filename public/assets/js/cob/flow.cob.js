
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

  // fix for IE6 suckage
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
        <h3 class="flow-title"></h3>
        <div class="g_{{guid}}"></div>
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
    if(typeof this.get().workflow_id == 'undefined'){return false;};
      this.fields['Workflow ID'].enabled = false;
      if(this.container.owner.options.disabled && this.get().enable_min){
          var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
          this.set({collapsed:collapsed});
          $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
      }
      $.ajax({
        url:'/api/workflowinstances/'+this.get().workflow_id,
        dataType : 'json',
        type: 'GET',
    //     data: (Lockr.get('/api/apps/instances/'+this.get().app_id+'/user_options')|| {options:{}}),
        success  : function(data){
          loaded = data;
          this.container.elementOf(this).querySelector('.flow-title').innerText = data.workflow.name;
          // debugger;
          this.form = new gform(
            {
              "data":{},
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
                  "value":null
                }
              ],
              "fields":[
                  {"name":"_state","type":"fieldset","fields": JSON.parse(_.find(data.version.code.forms,{name:'Initial Form'}).content).fields
                }
                  ]
            }
            
            ,'.g_'+get().guid);
          this.form.on('save',function(e){
            if(!e.form.validate(true))return;
            e.field.update({label:'<i class="fa fa-spinner fa-spin"></i> Saveing',"modifiers": "btn btn-warning"})
            gform.types.fieldset.edit.call(e.form.find('_state'),false)
            e.form.find('_state').el.style.opacity = .7
            gform.types.button.edit.call(e.field,false)

            $.ajax({
              url:'/api/workflow/'+group_id+'/'+this.get().workflow_id,
              dataType : 'json',
              type: 'POST',
              data: e.form.toJSON(),
              success  : function(data){
                e.form.find('_state').el.style.opacity = 1
                e.form.destroy();
                document.querySelector('.g_'+this.get().guid).innerHTML = gform.renderString('Thanks for your submission! <br> Track your results <a href="/api/workflow/{{id}}">here</a>',data)
                // gform.types.fieldset.edit.call(e.form.find('_state'),true)
                // gform.types.button.edit.call(e.form.find('submit'),true)
                // e.form.find('submit').update({label:'<i class="fa fa-check"></i> Submit',"modifiers": "btn btn-success"})
              }.bind(this)
            })

          }.bind(this)).on('canceled',function(e){
            // gform.types.fieldset.edit.call(e.form.find('_state'), false);
            // gform.types.button.edit.call(e.field, false);
            e.form.trigger('clear');

          })
          // .on('submitted',function(e){
          //   e.form.find('_state').el.style.opacity = 1
          //   gform.types.fieldset.edit.call(e.form.find('_state'),true)
          //   gform.types.button.edit.call(e.form.find('submit'),true)
          //   e.form.find('submit').update({label:'<i class="fa fa-check"></i> Submit',"modifiers": "btn btn-success"})
          //   e.form.set({_state:{first_name:"hello"}})
          // })
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
            url:'/api/workflow/submissions',
            dataType : 'json',
            type: 'GET',
        //     data: (Lockr.get('/api/apps/instances/'+this.get().app_id+'/user_options')|| {options:{}}),
            success  : function(newdata){

              newdata = _.each(newdata, function(item){item.created_at = moment(item.created_at).fromNow()})
              $.ajax({
                url:'/api/workflow/assignments',
                dataType : 'json',
                type: 'GET',
            //     data: (Lockr.get('/api/apps/instances/'+this.get().app_id+'/user_options')|| {options:{}}),
                success  : function(assignments){
                  var getActions = function(item){
                    item.actions = (JSON.parse(item.workflow_version.code.flow)[item.state] || {"actions": []}).actions;
                    item.updated_at = moment(item.updated_at).fromNow()

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
                  assignmentGrid = new GrapheneDataGrid({
                    el: "#assignmentgrid",
                    autoSize: 50, 
                    data: assignmentData,
                    actions:[],upload:false,download:false,columns:false,
                    form:{
                      fields:[
                        {label:"Workflow Name",name:"name",type:"text",//options:_.uniq(_.map(assignmentData,function(item){return item.workflow.name})),
                        template:"{{attributes.workflow.name}}"},
                        // {label:"Created At",name:"created_at"},
                        {label:"Last Action",name:"updated_at",template:'<time class="timeago" datetime="{{attributes.updated_at}}" title="{{attributes.updated_at}}">{{attributes.updated_at}}</time>'},
                        {label:"Status",name:"status",type:"select",options:['open','closed'],template:'<span style="text-transform:capitalize">{{attributes.status}}</span>'},
                        {label:"Assignment",name:"assignment_type",type:"select",options:['group','user'],template:'<span style="text-transform:capitalize">{{attributes.assignment_type}}</span>'},
                        {label:"Actions",name:"actions",template:'{{#attributes.actions}}<span class="btn btn-{{type}}{{^type}}default{{/type}}" style="margin:2px 5px 2px 0" data-id="{{id}}" data-event="click_{{name}}">{{label}}</span>{{/attributes.actions}}'}
                      ]
                    }
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
                                {"name":"_state","type":"fieldset","fields": JSON.parse(_.find(e.model.attributes.workflow_version.code.forms,{name:'Initial Form'}).content).fields
                              }
                                ]
                          }).on('save',function(e,eForm){
                            if(!e.form.validate(true))return;

                            e.model.waiting(true);

                            eForm.form.trigger('close')
                            
                            $.ajax({
                              url:'/api/workflow/'+e.model.attributes.id,
                              dataType : 'json',
                              type: 'PUT',
                              data: {_state:eForm.form.get(),action:e.event.split("click_")[1]},
                              success  : function(e,data){
                                e.model.waiting(false);
                                data.actions = (JSON.parse(data.workflow_version.code.flow)[data.state] || {"actions": []}).actions;
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
                            debugger;
                            eForm.form.trigger('close')


                          }).modal();
                      }else{
                        $.ajax({
                          url:'/api/workflow/'+e.model.attributes.id,
                          dataType : 'json',
                          type: 'PUT',
                          data: {_state:e.model.attributes.data,action:e.event.split("click_")[1]},
                          success  : function(e,data){
                            e.model.waiting(false);
                            data.actions = (JSON.parse(data.workflow_version.code.flow)[data.state] || {"actions": []}).actions;
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
                    }


                    }
                  })
                  myGrid = new GrapheneDataGrid({
                    el: "#mygrid",
                    autoSize: 50, 
                    data: newdata,
                    actions:[{name:"delete"}],upload:false,download:false,columns:false,
                    form:{
                      fields:[
                        {label:"Workflow Name",name:"name",template:"{{attributes.workflow.name}}"},
                        {label:"Initiated",name:"created_at"},
                        // {label:"Last Action",name:"updated_at",template:'<time class="timeago" datetime="{{attributes.created_at}}" title="{{attributes.created_at}}">{{attributes.created_at}}</time>'},
                        {label:"Status",name:"status",type:"select",options:['open','closed'],template:'<span style="text-transform:capitalize">{{attributes.status}}</span>'},
                        // {label:"Assignment",name:"assignment_type",template:'<span style="text-transform:capitalize">{{attributes.assignment_type}}</span>'},
                        // {label:"Actions",name:"actions",template:'{{#attributes.actions}}<span class="btn btn-default" style="margin:2px 0" data-event="{{name}}">{{label}}</span>{{/attributes.actions}}'}
                      ]
                    }
                  }).on('model:delete',function(e){
                  

                    $.ajax({
                      url:'/api/workflow/'+e.model.attributes.id,
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
