@extends('default.admin')
@section('content')

<div id="content">
</div>
@endsection

@section('end_body_scripts_top')
  <script src='/assets/js/vendor/ractive.min.js?cb={{ config("app.cache_bust_id") }}'></script>    
@endsection

@section('end_body_scripts_bottom')

<script>
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
</script>
  <script>var loaded = {!! $user !!};

loaded.params = _.map(loaded.params, function(param,i){
  return {key: i, value: param};
})
loaded.app_developers = _.map(loaded.app_developers.reverse(), function(loaded, item){
    if(item.app !== null){
    item.date = item.app.versions[0].updated_at;
    
    item.app.app_instances = _.map(item.app.app_instances, function(loaded, instance){
      instance.options = _.each(instance.options, function(option, i){
        return {key: i, value: option};
      })
      instance.user_options_default = _.map(instance.options, function(user_option, i){
        return {key: i, value: user_option};
      })
      if(instance.version !== null) {
        instance.resources = _.map(instance.resources, function(loaded, instance, resource, i){
          var group = _.find(loaded.group_admins,{group_id:instance.group_id})
          if(typeof group !== 'undefined'){
            resource.endpoint = _.find(group.group.endpoints,{id:parseInt(resource.endpoint)})
            
          }
          resource.resource = _.find(instance.version.resources,{name:resource.name})
          return resource;
        }.bind(null, loaded, instance))
      }
      return instance;
    }.bind(null, loaded))
    item.app.tags = item.app.tags.split(',');

    item.app.user = item.app.user || {first_name:'Not',last_name:"Assigned", unknown:'#ffb8b8'};
    item.app.user.initials = item.app.user.first_name.substr(0,1)+item.app.user.last_name.substr(0,1)
  }
    return item;
  }.bind(null,loaded))

  loaded.app_developers = _.orderBy(loaded.app_developers,"date",'desc');

  loaded.workflow_developers = _.map(loaded.workflow_developers.reverse(), function(loaded, item){
    if(item.workflow !== null){
    item.date = item.workflow.versions[0].updated_at;
    
    item.workflow.workflow_instances = _.map(item.workflow.workflow_instances, function(loaded, instance){
      instance.options = _.each(instance.options, function(option, i){
        return {key: i, value: option};
      })
      instance.user_options_default = _.map(instance.options, function(user_option, i){
        return {key: i, value: user_option};
      })
      if(instance.version !== null) {
        instance.resources = _.map(instance.resources, function(loaded, instance, resource, i){
          var group = _.find(loaded.group_admins,{group_id:instance.group_id})
          if(typeof group !== 'undefined'){
            resource.endpoint = _.find(group.group.endpoints,{id:parseInt(resource.endpoint)})
            
          }
          resource.resource = _.find(instance.version.resources,{name:resource.name})
          return resource;
        }.bind(null, loaded, instance))
      }
      return instance;
    }.bind(null, loaded))
    item.workflow.tags = item.workflow.tags.split(',');

    item.workflow.user = item.workflow.user || {first_name:'Not',last_name:"Assigned", unknown:'#ffb8b8'};
    item.workflow.user.initials = item.workflow.user.first_name.substr(0,1)+item.workflow.user.last_name.substr(0,1)
  }
    return item;
  }.bind(null,loaded))

  loaded.workflow_developers = _.orderBy(loaded.workflow_developers,"date",'desc');

  
  </script>
  <script>
    $(document).ready(function() {
  $('#content').html(templates.admin_dashboard.render(loaded));
  $('.navbar-header .nav a h4').html('My Dashboard');

      new gform({
				name:'user_search',
				actions:[],
				horizontal:false,
				label:false,
				fields:[
					{name:'query',label:false,placeholder:'Search', pre:'<i class="fa fa-filter"></i>'},
					{type:'output',value:'',name:'results',label:false}
				]},'#search').on('change:query',function(e){
          processFilter({currentTarget:e.field.el.querySelector('input')});
				})
    $("time.timeago").timeago();
    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

@verbatim
	viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a target="_blank" href="/page/{{group.slug}}/{{slug}}">{{name}}</a></div>{{/items}}</div>');
@endverbatim
  $('.find').on('click', function(e){
    $.get('/api/appinstances/'+e.currentTarget.dataset.id+'/pages', function(data){
      if(data.length > 0){
        modal({title:'This App Instance was found on the following pages', content:viewTemplate.render({items:data})});
      }else{
        modal({title: 'No pages Found', content:'This App Instance is not currently placed on any pages.'});
      }
    })
  })	
  })
  </script>
@endsection

@section('bottom_page_styles')

  <style>

div.masonry-grid { 
  display: flex; 
  flex-direction: row; 
  flex-wrap: wrap;
  /* height: 100vw; */
  max-height: 80vh;
  justify-content: space-between;
  overflow:scroll;
}
div.masonry-grid .grid-item {  
  width: 49%;
} 

/* fallback for earlier versions of Firefox */

@supports not (flex-wrap: wrap) {
  div.masonry-grid { display: block; }
  div.masonry-grid .grid-item {  
  display: inline-block;
  vertical-align: top;
  }
}

.fa-collapse {
  display: inline-block;
    width: 0;
    height: 0;
    /* margin-left: 2px; */
    position:absolute;
    top:12px;
    left:7px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-top: 4px solid\9;
    border-right: 4px solid #0000;
    border-left: 4px solid #0000;
}
.collapsed .fa-collapse {
    border-left: 4px dashed;
    border-left: 4px solid\9;
    border-bottom: 4px solid #0000;
    border-top: 4px solid #0000;
}

.appInstance,.workflowInstance{
  position:relative;
  margin: 0 0 5px;
  background: #f6f8fa;
  padding: 5px 5px 5px 20px;
}
.device_0:before{
  content: 'All'
}
.device_1:before{
  content: 'Desktop Only'
}
.device_2:before{
  content: 'Tablet and Desktop'
}
.device_3:before{
  content: 'Tablet and Phone'
}
.device_4:before{
  content: 'Phone Only'
}

.avatar{
  width: 40px;
    height: 40px;
    background: #b4cde0;
    text-align: center;
    border-radius: 50%;
    line-height: 40px;
    font-size: 20px;
    color: #fff;
    float: left;
    margin: 5px;
}
.avatar.self{
  background:#cab4e0;
}
.appInstance i{padding:5px;
/* color:#666 */
}

.fa-lock-0:before{
  content:"\f023";/*"\f09c"*/
  color:#8a6d3b;
}
.fa-lock-:before{
  content:"\f09c";
  color:#a94442;
}

.appInstance .fa-lock:before,.workflowInstance .fa-lock:before{
  color:#3c763d;
}
.appInstance a,.workflowInstance a{color:#666;text-decoration:none}
.tab-pane{padding-top:15px}
.panel-default >.panel-heading .badge{background:#8391f3}
.badge-notify{
  background: #afafaf;
  position: relative;
  top: 10px;
  left: -18px;
  margin-right: -18px;
}
.group-info{
  opacity:.8;
}
.grid-item:hover .group-info{
  opacity:1
}

  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{font-size: 21px}
  #myModal .modal-dialog{width:900px}
  </style>
@endsection