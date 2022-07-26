workflow = true;
gform.collections.add("files", []);
renderBuilder = function () {
  var target = document.querySelector(".target");
  $(target).html(
    '<div data-map="" style="padding:15px;width: 100%;text-overflow: ellipsis;overflow: hidden;" class="btn btn-default">Form Root</div>'
  );
  var form = myform;
  var map = "";
  _.each(path, function (p) {
    form = _.find(form.fields, { name: p });
    map += form.name + ",";
    $(target).append(
      '<div style="text-align:center;padding:5px;color: #555;"><i class="fa fa-long-arrow-down fa-2x"> </i></div><div style="padding:15px;width: 100%;text-overflow: ellipsis;overflow: hidden;" data-map="' +
        map +
        '" class="btn btn-default">' +
        (form.label || form.name) +
        "</div>"
    );
  });
  target.querySelectorAll(".btn-default")[
    target.querySelectorAll(".btn-default").length - 1
  ].style.border = "solid 2px #d85e16";

  $(target).append("<hr>");

  if (typeof cb === "undefined") {
    cb = new Cobler({
      formTarget: $("#form"),
      sortSelected: true,
      disabled: false,
      targets: [document.getElementById("editor")],
      items: [[]],
    });
    list = document.getElementById("sortableList");
    cb.addSource(list);
    cb.on("activate", function (e) {
      // if(list.className.indexOf('hidden') == -1){
      //   list.className += ' hidden';
      // }
      $("#form").removeClass("hidden");
    });
    cb.on("deactivate", function () {
      if (typeof gform.instances.editor !== "undefined") {
        gform.instances.editor.destroy();
      }
      // list.className = list.className.replace('hidden', '');
      $("#form").addClass("hidden");
      mainForm();
    });
    document
      .getElementById("sortableList")
      .addEventListener("click", function (e) {
        cb.deactivate();
        cb.collections[0].addItem(
          e.target.dataset.type || e.target.parentElement.dataset.type
        );
      });
    cb.on("change", function () {
      var workingForm = myform;
      _.each(path, function (p) {
        workingForm = _.find(workingForm.fields, { name: p });
      });
      workingForm.fields = cb.toJSON()[0];
    });
    cb.on("remove", function (e) {
      if (
        typeof gform.instances.editor !== "undefined" &&
        gform.instances.editor.options.cobler == e[0]
      ) {
        cb.deactivate();
      }
    });
  }

  if (typeof form !== "undefined") {
    var temp = $.extend(true, {}, form);
    _.each(temp.fields, function (field) {
      field.widgetType = (gform.types[field.type] || {}).base || "input";
    });
    // for(var i in temp.fields){
    // var mapOptions = new gform.mapOptions(temp.fields[i],undefined,0,gform.collections)
    // temp.fields[i].options = mapOptions.getobject()

    // switch(temp.fields[i].type) {
    //   case "select":
    //   case "radio":
    //   case "scale":
    //   case "range":
    //   // case "grid":
    //   case "user":
    //   case "user_email":
    //   case "group":
    //   case "groups":
    //   case "combobox":
    //   case "files":
    //   case "base64_file":
    //     temp.fields[i].widgetType = 'collection';
    //     break;
    //   case "checkbox":
    //   case "switch":
    //     temp.fields[i].widgetType = 'bool';
    //     break;
    //   case "fieldset":
    //   case "table":
    //   case "template":
    //   case "grid":
    //     temp.fields[i].widgetType = 'section';
    //     break;
    //   default:
    //     temp.fields[i].widgetType = 'input';
    // }
    // }

    list.className = list.className.replace("hidden", "");
    cb.collections[0].load(temp.fields);
  }
  // mainForm(form,map);

  if (typeof gform.instances.editor !== "undefined") {
    gform.instances.editor.destroy();
  }

  mainForm();
};
mainForm = function () {
  var form = myform;
  _.each(path, function (p) {
    form = _.find(form.fields, { name: p });
  });
  if (!path.length) {
    new gform(
      {
        name: "editor",
        data: form,
        actions: [],
        fields: [
          // {name:"legend",label:"Label"},
          // {name:"name",label:"Name"},
          {
            name: "default",
            label: false,
            type: "fieldset",
            fields: [
              {
                name: "horizontal",
                horizontal: true,
                label: "Horizontal",
                type: "switch",
                format: { label: "" },
              },
            ],
          },
          {
            name: "files",
            label: "Allow File uploads",
            type: "switch",
            horizontal: true,
            format: { label: "" },
          },
          {
            name: "horizontal",
            label: "Horizontal",
            value: true,
            type: "checkbox",
            show: false,
            parse: true,
          },
          {
            name: "resource",
            label: "Initial Data Source",
            type: "select",
            options: [
              "None",
              { type: "optgroup", min: 0, max: 4, show: false },
              {
                type: "optgroup",
                label: "Methods",
                options: "methods",
                format: { label: "{{label}}" },
              },
              { type: "optgroup", label: "Resources", options: "resources" },
            ],
          },
          {
            parse: false,
            type: "output",
            label: false,
            value: "<h3>Events</h3>",
          },
          {
            type: "fieldset",
            label: false,
            name: "events",
            array: { min: 1, max: 100 },
            fields: [
              {
                type: "text",
                label: "Event",
                name: "event",
                parse: [{ type: "requires" }],
                target: "#collapseEvents .panel-body",
              },

              {
                type: "select",
                label: "Method",
                name: "handler",
                target: "#collapseEvents .panel-body",
                options: [
                  "None",
                  { type: "optgroup", min: 0, max: 4, show: false },
                  {
                    type: "optgroup",
                    options: "methods",
                    format: { label: "Method: {{label}}" },
                  },
                ],
                parse: [{ name: "event", value: "", type: "not_matches" }],
              },
            ],
          },
          // {type: 'switch', label: 'Custom Actions', name: 'actions',parse:false, show:[{name:"type",value:['output'],type:"not_matches"}]},
          // {type: 'fieldset',columns:12,array:true, label:false,name:"actions",parse:'show', show:[{name:"actions",value:true,type:"matches"}],fields:[

          //   {name:"type",columns:6,label:"Type",type:"combobox",options:["cancel","save"]},
          //   // {name:"name",columns:6,label:"Name"},
          //   {name:"action",columns:6,label:"Action"},
          //   {name:"label",columns:6,label:"Label"},
          //   {name:"modifiers",columns:6,label:"Classes",type:"combobox",options:[
          //     {label:"Danger",value:"btn btn-danger"},
          //     {label:"Success",value:"btn btn-success"},
          //     {label:"Info",value:"btn btn-info"}]}

          // ]},
        ],
        legend: false,
      },
      "#mainform"
    )
      .on("input:type", function (e) {
        if (e.field.value == "cancel") {
          e.field.parent.set({
            label: '<i class="fa fa-times"></i> Cancel',
            action: "cancel",
            modifiers: "btn btn-danger",
          });
        }
      })
      .on(
        "input",
        _.throttle(function (e) {
          form = _.extend(form, e.form.get());
          // if(typeof e.form.get().actions == 'undefined'){
          //   delete form.actions;
          // }
          // if(typeof e.field !== 'undefined' && e.field.name == 'horizontal'){
          //   renderBuilder()
          // }
        })
      )
      .on("input:horizontal", function () {
        renderBuilder();
      });
  } else {
    var formConfig = new Cobler.types[gform.types[form.type].base]();
    $("#mainform").html(gform.renderString(accordion));

    $(".panelOptions").toggle(
      !!_.find(formConfig.fields, { target: "#collapseOptions .panel-body" })
    );
    $(".panelValidation").toggle(
      !!_.find(formConfig.fields, { target: "#collapseValidation .panel-body" })
    );
    $(".panelBasic").toggle(
      !!_.find(formConfig.fields, { target: "#collapseBasic .panel-body" })
    );
    $(".panelConditions").toggle(
      !!_.find(formConfig.fields, { target: "#collapseConditions .panel-body" })
    );
    $(".panelDisplay").toggle(
      !!_.find(formConfig.fields, { target: "#collapseDisplay .panel-body" })
    );
    $(".panelEvents").toggle(
      !!_.find(formConfig.fields, { target: "#collapseEvents .panel-body" })
    );
    $(".panelGrid").toggle(
      !!_.find(formConfig.fields, { target: "#collapseGrid .panel-body" })
    );

    new gform(
      {
        name: "editor",
        nomanage: true,
        data: form,
        actions: [],
        clear: false,
        fields: formConfig.fields,
        legend: "Edit Fieldset",
      },
      "#mainform"
    )
      .on("change", function (e) {
        var workingForm = myform;
        _.each(path, p => {
          workingForm = _.find(workingForm.fields, { name: p });
        });

        _.extend(workingForm, e.form.get());
      })
      .on("destroyed", e => {
        e.form.el.innerHTML = "";
      });
  }
};

// $('#cobler').on('click', function(e) {

// });

$(".target").on("click", "[data-map]", function (e) {
  cb.deactivate();
  path = _.compact(e.currentTarget.dataset.map.split(","));

  renderBuilder();
});

document.addEventListener("DOMContentLoaded", function () {
  // myform = JSON.parse(($.jStorage.get('form') || "{}"));
  myform = attributes.code.form || {};
  // $('#cobler').click();
  path = [];
  // $(e.target).siblings().removeClass('active');
  // $(e.target).addClass('active');
  // $('#form').addClass('hidden');
  // $('.view_source').removeClass('hidden');
  renderBuilder();
});

// gform.stencils.ace = `
// <div class="row clearfix form-group" name="{{name}}">
// 	{{>_label}}
// 	{{#label}}
// 	{{#inline}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
// 	{{^inline}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
// 	{{/label}}
// 	{{^label}}
// 	<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
// 	{{/label}}
// 		<div class="formcontrol"><div placeholder="{{placeholder}}" style="min-height: 250px;outline:none;border:solid 1px #cbd5dd;{{^unstyled}}background:#fff;padding:10px{{/unstyled}}" id="{{id}}container"></div></div>
// 	</div>
// </div>`;

// gform.types['ace'] = _.extend({}, gform.types['input'], {
//   create: function(){
//     var tempEl = document.createElement("span");
//     tempEl.setAttribute("id", this.id);
//     if(this.owner.options.clear){
//       tempEl.setAttribute("class", ''+gform.columnClasses[this.columns]);
//     }
//     tempEl.innerHTML = this.render();
//     return tempEl;
// },
// // render:function(){
// //   return gform.render('textarea',this)
// // },
//   initialize: function(){
//     //   this.iel = this.el.querySelector('input[name="' + this.name + '"]')
//     //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
//       this.onchangeEvent = function(input){
//         //   this.input = input;
//           this.value = this.get();
//           if(this.el.querySelector('.count') != null){
//             var text = this.value.length;
//             if(this.limit){text+='/'+this.limit;}
//             this.el.querySelector('.count').innerHTML = text;
//           }
//         //   this.update({value:this.get()},true);
//         //   gform.types[this.type].focus.call(this)
//           this.owner.trigger(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});

//         //   this.owner.pub('change:'+this.name, this,{input:this.value});
//         //   this.owner.pub('change', this,{input:this.value});
//         //   this.owner.pub('input:'+this.name, this,{input:this.value});
//         //   this.owner.pub('input', this,{input:this.value});
//       }.bind(this)
//       this.input = this.input || false;
//       // this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

//       // this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
//     this.editor = ace.edit(this.id+"container");
//     this.editor.setTheme(this.item.theme || "ace/theme/chrome");
//     this.editor.getSession().setMode({path: this.owner.options.default.mode || this.item.mode || "ace/mode/handlebars", inline:this.owner.options.default.inlinemode || this.item.inlinemode});
//     this.editor.session.setValue(this.value);
//     this.editor.on("change",this.onchangeEvent.bind(null,false))

//   },
//   // update: function(item, silent) {
//   //   if(typeof item !== 'undefined' && (
//   //       typeof item.options !== undefined ||
//   //       typeof item.max !== undefined ||
//   //       typeof item.action !== undefined
//   //       )
//   //       && typeof this.mapOptions !== 'undefined'){
//   //       delete this.mapOptions;
//   //       this.item = _.defaults({},item,this.item);

//   //       // this.item.options = _.assign([],this.item.options,item.options);
//   //       this.options = _.extend([],this.item.options);
//   //       this.max = this.item.max;
//   //       this.min = this.item.min;
//   //       this.path = this.item.path;
//   //       this.action = this.item.action;
//   //   }
//   //   // else if(typeof this.mapOptions !== 'undefined'){
//   //   // }
//   //   if(typeof item === 'object') {
//   //       _.extend(item,this);
//   //   }
//   //   this.label = gform.renderString((item||{}).label||this.item.label, this);

//   //   // var oldDiv = document.getElementById(this.id);
//   //   // var oldDiv = this.owner.el.querySelector('#'+this.id);
//   //   var oldDiv = this.el;
//   //   this.destroy();
//   //   this.el = gform.types[this.type].create.call(this);
//   //   oldDiv.parentNode.replaceChild(this.el,oldDiv);
//   //   gform.types[this.type].initialize.call(this);

//   //   if(!silent) {
//   //       this.owner.pub(['change:'+this.name,'change'], this);
//   //   }
//   //   if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}

//   // },
//   set:function(value){
//     this.editor.session.setValue(value);
//   },
//   get:function(){
//     return this.editor.getValue()
//   },
//   focus: function(){
//     this.editor.focus();
//   }
// });

/**
 * jQuery Plugin: Sticky Tabs
 *
 * @author Aidan Lister <aidan@php.net>
 * @version 1.2.0
 */
(function ($) {
  $.fn.stickyTabs = function (options) {
    var context = this;

    var settings = $.extend(
      {
        getHashCallback: function (hash, btn) {
          return hash;
        },
      },
      options
    );

    // Show the tab corresponding with the hash in the URL, or the first tab.
    var showTabFromHash = function () {
      var hash = window.location.hash;
      var selector = hash ? 'a[href="' + hash + '"]' : "li.active > a";
      $(selector, context).tab("show");
    };

    // We use pushState if it's available so the page won't jump, otherwise a shim.
    var changeHash = function (hash) {
      if (history && history.pushState) {
        history.pushState(null, null, "#" + hash);
      } else {
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;
        window.location.hash = hash;
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
      }
    };

    // Set the correct tab when the page loads
    showTabFromHash(context);

    // Set the correct tab when a user uses their back/forward button
    $(window).on("hashchange", showTabFromHash);

    // Change the URL when tabs are clicked
    $("a", context).on("click", function (e) {
      var hash = this.href.split("#")[1];
      var adjustedhash = settings.getHashCallback(hash, this);
      changeHash(adjustedhash);
    });

    return this;
  };
})(jQuery);

const isDirty = () => {
  // $('[href="#templates"]').toggleClass("isDirty", templatePage.isDirty);
  // $('[href="#methods"]').toggleClass("isDirty", methodPage.isDirty);
  // $('[href="#resources"]').toggleClass("isDirty", resource_grid.isDirty);

  // $('[href="#form"]').toggleClass("isDirty", formPage.isDirty);
  // $('[href="#flow"]').toggleClass("isDirty", flow.isDirty);
  // $('[href="#map"]').toggleClass("isDirty", mapPage.isDirty);

  return (
    templatePage.isDirty ||
    methodPage.isDirty ||
    resource_grid.isDirty ||
    flowPage.isDirty ||
    formPage.isDirty ||
    mapPage.isDirty
  );
};
var flowPage = {
  toJSON: function () {
    return flow_states;
  },
};
Object.defineProperty(flowPage, "isDirty", {
  get: () => !_.isEqual(attributes.code.flow, flowPage.toJSON()),
});

var formPage = {
  toJSON: function () {
    return myform;
  },
};
Object.defineProperty(formPage, "isDirty", {
  get: () => !_.isEqual(attributes.code.form, formPage.toJSON()),
});

var mapPage = {
  toJSON: function () {
    return map.toJSON().map;
  },
};
Object.defineProperty(mapPage, "isDirty", {
  get: () => !_.isEqual(attributes.code.map, mapPage.toJSON()),
});

window.onbeforeunload = () => {
  return isDirty()
    ? "You have unsaved changes, are you sure you want to leave?"
    : undefined;
};

const attributes = {};
$('[href="/admin/workflows"]').parent().addClass("active");

var root = "/api/workflows/";

function setSize() {
  var temp2 = $(window).height() - $(".nav-tabs").offset().top - 77;
  var temp = $(window).height() - $("#flow-form").offset().top;
  $("body").append("<style>#flow-form { height: " + temp + "px; }</style>");
  $("body").append("<style>.ace_editor { height: " + temp2 + "px; }</style>");
}

window.onresize = setSize;
function load(workflow_version) {
  // loaded.code = ;

  $.extend(
    true,
    attributes,
    {
      code: $.extend(
        true,
        {
          templates: [{ name: "Preview", content: "", disabled: true }],
          methods: [{ name: "Action", content: "", disabled: false }],
        },
        workflow_version
      ),
    },
    loaded
  );
  $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
    var temp = new gform(myform);
    gform.collections.update("form_users", temp.filter({ type: "user" }, 20));
    gform.collections.update("form_groups", temp.filter({ type: "group" }, 20));
    gform.collections.update(
      "resources",
      _.pluck(
        _.map(resource_grid.models, function (model) {
          return model.attributes;
        }),
        "name"
      )
    );
    gform.collections.update(
      "methods",
      _.map(_.pluck(methodPage.toJSON(), "name"), function (item, i) {
        return { value: "method_" + i, label: item };
      })
    );
    gform.collections.update(
      "templates",
      _.map(_.pluck(templatePage.toJSON(), "name"), function (item, i) {
        return { value: "template_" + i, label: item };
      })
    );
    resource_grid.fixStyle();
  });
  // wf_form = "{}";
  // if(typeof workflow_version.form !== 'undefined'){
  //   wf_form = workflow_version.form
  //   if(typeof wf_form !== 'string'){
  //     wf_form = JSON.stringify(wf_form,null,2);
  //   }
  //   workflow_version.forms =[];
  // }else{
  //   // wf_form = workflow_version.code.forms[0].content

  // }

  $(".navbar-header .nav a h4").html("Workflow - " + attributes.workflow.name);

  $("#version").html(attributes.summary || "Working Version");

  var tableConfig = {
    entries: [25, 50, 100],
    count: 25,
    autoSize: -20,
    el: ".resources",
  };

  tableConfig.schema = [
    { label: "Name", name: "name" },
    {
      label: "Modifier",
      name: "modifier",
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "XML", value: "xml" },
        { label: "CSV", value: "csv" },
        { label: "Include as Script", value: "script" },
        { label: "Include as CSS", value: "css" },
      ],
    },
    { label: "Path", name: "path" },
    {
      label: "Fetch",
      type: "checkbox",
      name: "fetch",
      options: [
        { label: "No", value: "false" },
        { label: "Yes", value: "true" },
      ],
    },
    // { label: 'Cache', type: 'checkbox', name: 'cache', options: [{ label: 'No', value: "false" }, { label: "Yes", value: "true" }] }
  ];
  tableConfig.data = attributes.code.resources;
  tableConfig.multiEdit = ["fetch", "cache", "path", "modifier"];
  if (typeof resource_grid !== "undefined") {
    resource_grid.destroy();
  }
  resource_grid = new $g.grid(tableConfig);

  setSize();

  // templatePage = new paged('.templates',{name:'templates', items:attributes.code.templates, label:'Template'});
  templatePage = new fileManager(".templates", {
    name: "templates",
    items: attributes.code.templates,
    label: "Template",
  });
  methodPage = new fileManager(".methods", {
    name: "methods",
    items: attributes.code.methods,
    label: "Method",
    mode: "ace/mode/javascript",
  });

  // scriptPage = new paged('.scripts',{name:'scripts', items:attributes.code.scripts, mode:'ace/mode/javascript', label:'Script'});
  // formPage = new paged('.forms',{name:'forms', items:attributes.code.forms, mode:'ace/mode/javascript', label:'Form',extra: function(item){

  //   item.content = this.berry.fields[this.active].toJSON();
  //   if (!_.some(JSON.parse(item.content||'{}').fields, function(o) { return _.has(o, "fields"); })) {
  //     modalForm(item.content, item.name, function() {
  //       var old = formPage.getCurrent();
  //       formPage.update(old.key, JSON.stringify($.extend(false, {}, JSON.parse(old.content||'{}'),{"fields":cb.toJSON({editor:false})[0]}), null, 2 ))
  //     });
  //   }else{
  //     toastr.error('If you would like to continue using the form builder UI you will need to remove any fieldsets', 'Fieldsets Not Currently Supported');
  //   }
  // }});
  r_options = {
    data: attributes.code,
    actions: [],
    fields: [
      {
        label: false,
        value: '<h4 style="border-bottom:solid 1px #ccc">Key</h4>',
        columns: 9,
        type: "output",
      },
      {
        label: false,
        value: '<h4 style="border-bottom:solid 1px #ccc">Type</h4>',
        columns: 3,
        type: "output",
      },

      {
        name: "map",
        label: false,
        array: { min: 0, max: 100, append: { enable: true } },
        type: "fieldset",
        fields: [
          { name: "name", label: false, columns: 9, placeholder: "Key" },
          {
            name: "type",
            label: false,
            type: "select",
            columns: 3,
            options: [
              { label: "String", value: "string" },
              { label: "Group", value: "group" },
              { label: "User", value: "user" },
              { label: "Email", value: "email" },
              // {label:"Endpoint",value:"endpoint"}
            ],
          },
        ],
      },
    ],
  };
  map = new gform(r_options, ".map")
    .on("input:type", function (e) {
      gform.collections.update(
        "endpoints",
        _.where(e.form.get().map, { type: "endpoint" })
      );
      gform.collections.update(
        "map_users",
        _.where(e.form.get().map, { type: "user" })
      );
      gform.collections.update(
        "map_groups",
        _.where(e.form.get().map, { type: "group" })
      );
      gform.collections.update(
        "map_emails",
        _.where(e.form.get().map, { type: "email" })
      );
    })
    .on(
      "input:name",
      _.throttle(function (e) {
        switch (e.field.parent.find("type").value) {
          case "endpoint":
            gform.collections.update(
              "endpoints",
              _.where(e.form.get().map, { type: "endpoint" })
            );
            break;
          case "user":
            gform.collections.update(
              "map_users",
              _.where(e.form.get().map, { type: "user" })
            );
            break;
          case "group":
            gform.collections.update(
              "map_groups",
              _.where(e.form.get().map, { type: "group" })
            );
            break;
          case "email":
            gform.collections.update(
              "map_emails",
              _.where(e.form.get().map, { type: "email" })
            );
            break;
        }
      })
    );
}

$(".nav-tabs").stickyTabs();
orig = $.extend({}, loaded);
load(loaded.code);

$(document).keydown(function (e) {
  if ((e.which == "115" || e.which == "83") && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    $("#save").click();
  }
  return true;
});

function createFlow() {
  try {
    var graph = _.map(flow_states, function (state, i, j) {
      state.name = state.name || state.state_id;
      var graph = "\n" + state.name.split(" ").join("_") + "";
      if (i) {
        if (state.logic) {
          graph += '{"' + state.name + '"}';
        } else {
          graph += '["' + state.name + '"]';
        }
      } else {
        graph += '(("' + state.name + '"))';
      }

      if (state.status == "closed") {
        graph = gform.renderString(
          "\n{{graph}}({{name}})\nclass {{graph}} closedClass",
          { graph: state.name.split(" ").join("_"), name: state.name }
        );
        // graph = graph+= gform.renderString('\nclass {{name}} closedClass', {name:state.name.split(' ').join('_')});
      }

      var stuff = _.map(state.actions, function (action) {
        var graph = "\n" + state.name.split(" ").join("_") + "";
        if (!i) {
          graph += '(("' + state.name + '"))';
        } else if (state.status == "closed") {
          graph += '("' + state.name + '")';
        } else {
          if (state.logic) {
            graph += '{"' + state.name + '"}';
          } else {
            graph += '["' + state.name + '"]';
          }
        }

        return (
          graph +
          "-->|" +
          action.label +
          "|" +
          " " +
          (action.to || "").split(" ").join("_") +
          ""
        );
      });
      return graph + stuff.join("");
    });
    if (typeof flowForm !== "undefined" && flowForm.isActive) {
      graph.push(
        "\nclass " +
          (flowForm.get("name") || flowForm.get("state_id"))
            .split(" ")
            .join("_") +
          " selectedClass"
      );
    }
    myfunc("graph TB" + "" + graph.join(""));
  } catch (e) {}
}

flow_states = attributes.code.flow || '[{"name":"origin"}]';
if (typeof flow_states == "string") {
  flow_states = JSON.parse(flow_states);
}
flow_states = _.map(flow_states, function (state) {
  if (typeof state.state_id == "undefined") {
    state.state_id = gform.getUID();
  }
  return state;
});
createFlow();

function drawForm(name) {
  if (typeof flowForm !== "undefined") {
    flowForm.destroy();
  }
  gform.collections.update("flowstates", _.pluck(flow_states, "name"));

  formConfig = {
    name: "state_editor",
    actions: [
      {
        target: "#display",
        type: "button",
        name: "delete",
        action: "delete",
        modifiers: "btn btn-danger pull-left",
        label: '<i class="fa fa-times"></i> Delete',
      },
      {
        target: "#display",
        type: "button",
        modifiers: "btn btn-info pull-right",
        label: '<i class="fa fa-check"></i>',
        action: "done",
      },
    ],
    clear: false,
    data: _.find(flow_states, { name: name }),
  };
  myconditions = [
    {
      label: "Type",
      name: "type",
      type: "select",
      options: ["matches", "not_matches", "contains", "requires", "conditions"],
    },
    {
      label: "Name",
      name: "name",
      show: [
        {
          type: "matches",
          name: "type",
          value: ["matches", "not_matches", "contains", "requires"],
        },
      ],
    },
    {
      label: "Value{{#index}}({{index}}){{/index}}",
      name: "value",
      array: { min: 1 },
      show: [
        {
          type: "matches",
          name: "type",
          value: ["matches", "not_matches", "contains"],
        },
      ],
    },
    {
      label: false,
      columns: 12,
      name: "op",
      type: "switch",
      format: { label: "{{label}}" },
      options: [
        { label: "or", value: "or" },
        { label: "and", value: "and" },
      ],
      value: "and",
      show: [{ type: "matches", name: "type", value: "conditions" }],
    },
    {
      label: "Condition",
      name: "conditions",
      columns: 10,
      offset: 1,
      type: "fieldset",
      array: { min: 1, max: 10 },
      show: [{ type: "matches", name: "type", value: "conditions" }],
      fields: [
        {
          label: "Type",
          name: "type",
          type: "select",
          options: ["matches", "not_matches", "contains", "requires"],
        },
        { label: "Name", name: "name" },
        {
          label: "Value{{#index}}({{index}}){{/index}}",
          name: "value",
          array: { min: 1 },
        },
      ],
    },
  ];

  formConfig.fields = _.map(
    _.map(
      [
        {
          type: "switch",
          label: "Logic",
          name: "hasLogic",
          format: { label: "" },
          parse: false,
          show: false,
          value: function (e) {
            return typeof e.initial.owner.options.data.logic !== "undefined";
          },
        },
        {
          type: "select",
          label: false,
          other: true,
          name: "logic",
          target: "#collapseEvents .panel-body",
          options: [
            { label: "Conditions", value: "other" },
            { type: "optgroup", min: 0, max: 4, show: false },
            {
              type: "optgroup",
              options: "methods",
              format: { label: "Method: {{label}}" },
            },
          ],
          show: [{ name: "hasLogic", value: true, type: "matches" }],
        },
        {
          type: "fieldset",
          name: "logic",
          label: false,
          fields: myconditions,
          show: [
            { name: "hasLogic", value: true, type: "matches" },
            { name: "logic", value: ["other"], type: "matches" },
          ],
        },
      ],
      function (item) {
        item.target = "#collapseLogic .panel-body";
        return item;
      }
    )
      .concat(
        _.map(
          [
            {
              type: "fieldset",
              name: "assignment",
              label: false,
              fields: [
                {
                  name: "type",
                  inline: false,
                  label: "Type",
                  type: "combobox",
                  options: [
                    { value: "user", label: "User" },
                    { value: "group", label: "Group" },
                  ],
                },

                // gform.types['user']= _.extend({}, gform.types['combobox'], {
                //   defaults:{search:"/api/users/search/{{search}}{{value}}",format:{title:'User <span class="text-success pull-right">{{value}}</span>',label:"{{first_name}} {{last_name}}",value:"{{unique_id}}", display:"{{first_name}} {{last_name}}<div>{{email}}</div>"}}
                // })

                {
                  type: "user",
                  strict: false,
                  label: "ID",
                  show: [{ type: "matches", name: "type", value: "user" }],
                  options: [
                    {
                      first_name: "Owner",
                      unique_id: "{{owner.unique_id}}",
                      email: "User that initiated workflow",
                    },
                    {
                      first_name: "Actor",
                      unique_id: "{{actor.unique_id}}",
                      email: "User that is taking an action",
                    },
                    {
                      type: "optgroup",
                      options: "map_users",
                      format: {
                        display:
                          '{{name}}<div style="color:#aaa">Mapped value</div>',
                        value: function (option) {
                          return "{{datamap." + option.name + "}}";
                        },
                        label: "{{name}}",
                      },
                    },
                    {
                      type: "optgroup",
                      options: "form_users",
                      format: {
                        display:
                          '{{name}}<div style="color:#aaa">Form value</div>',
                        value: function (option) {
                          var path = option.data.name;
                          var search = option.data;
                          while (search.ischild) {
                            path = search.parent.name + "." + path;
                            search = search.parent;
                          }
                          // var temp = new gform(myform)
                          // temp.find(path).array
                          if (option.array) {
                            return (
                              "{{#form." +
                              path +
                              "}}{{.}},{{/form." +
                              path +
                              "}}"
                            );
                          } else {
                            return "{{form." + path + "}}";
                          }
                        },
                        label: "{{label}}{{^label}}{{name}}{{/label}}",
                      },
                    },
                  ],
                },
                {
                  type: "group",
                  label: "ID",
                  show: [{ type: "matches", name: "type", value: "group" }],
                  options: [
                    {
                      type: "optgroup",
                      options: "map_groups",
                      format: {
                        display:
                          '{{name}}<div style="color:#aaa">Mapped value</div>',
                        value: function (option) {
                          return "{{datamap." + option.name + "}}";
                        },
                        label: "{{name}}",
                      },
                    },
                    {
                      type: "optgroup",
                      options: "form_groups",
                      format: {
                        display:
                          '{{name}}<div style="color:#aaa">Form value</div>',
                        value: function (option) {
                          var path = option.data.name;
                          var search = option.data;
                          while (search.ischild) {
                            path = search.parent.name + "." + path;
                            search = search.parent;
                          }
                          return "{{form." + path + "}}";
                        },
                        label: "{{label}}{{^label}}{{name}}{{/label}}",
                      },
                    },
                    {
                      type: "optgroup",
                      options: "/api/groups?members=20",
                      format: { label: "{{name}}", value: "{{id}}" },
                    },
                  ],
                },
                {
                  name: "id",
                  inline: false,
                  label: "ID (template)",
                  type: "text",
                  show: [
                    {
                      type: "not_matches",
                      name: "type",
                      value: ["user", "group"],
                    },
                  ],
                },
                {
                  name: "resource",
                  type: "select",
                  label: "Resource",
                  placeholder: "None",
                  options: "resources",
                },
              ],
            },
          ],
          function (item) {
            item.target = "#collapseAssignment .panel-body";
            return item;
          }
        )
      )
      .concat([
        {
          target: "#collapseBasic .panel-body",
          name: "state_id",
          type: "hidden",
          label: false,
        },
        {
          target: "#collapseBasic .panel-body",
          name: "name",
          inline: false,
          label: "Name",
        },
        {
          target: "#collapseBasic .panel-body",
          name: "status",
          inline: false,
          label: "Status",
          type: "select",
          options: ["open", "closed"],
        },
        {
          target: "#collapseBasic .panel-body",
          name: "uploads",
          type: "checkbox",
          inline: false,
          help: "NOTE: Uploads must also be turned on in the form",
          label: "Allow File uploads/management in this state",
          show: [{ name: "hasLogic", value: false, type: "matches" }],
        },
        {
          target: "#collapseOnenter .panel-body",
          name: "onEnter",
          label: false,
          type: "fieldset",
          fields: taskForm,
          array: { min: 1, max: 10 },
        }, // show:[{type: "matches", name: "hasOnEnter", value: true}]},
        {
          target: "#collapseOnleave .panel-body",
          name: "onLeave",
          label: false,
          type: "fieldset",
          fields: taskForm,
          array: { min: 1, max: 10 },
        }, // show: [{type: "matches", name: "hasOnLeave", value: true}]},
        !formConfig.data.logic
          ? {
              target: "#collapseActions .panel-body",
              name: "actions",
              show: [{ name: "hasLogic", value: false, type: "matches" }],
              label: false,
              type: "fieldset",
              fields: [
                { name: "label", label: "Label", columns: 6 },
                { name: "name", label: "Name", columns: 6, required: true },
                {
                  name: "type",
                  label: "Type",
                  type: "select",
                  columns: 6,
                  options: [
                    { value: "success", label: "Success" },
                    { value: "danger", label: "Danger" },
                    { value: "info", label: "Info" },
                    { value: "warning", label: "Warning" },
                    { value: "default", label: "Default" },
                    { value: "primary", label: "Primary" },
                    { value: "link", label: "Simple" },
                  ] /*, show: [{type: "not_matches", name: "label", value: ""}]*/,
                },
                {
                  name: "to",
                  label: "To",
                  columns: 6,
                  type: "select",
                  options:
                    "flowstates" /*, show: [{type: "not_matches", name: "label", value: ""}]*/,
                },
                {
                  name: "assignment",
                  type: "fieldset",
                  parse: [{ type: "requires" }],
                  label: false,
                  fields: [
                    {
                      name: "type",
                      inline: false,
                      label: "Actor(s)",
                      parse: [{ type: "requires" }],
                      type: "combobox",
                      options: [
                        { value: "internal", label: "Inactivity Based" },
                        { value: "", label: "Assignee" },
                        { value: "user", label: "User" },
                        { value: "group", label: "Group" },
                      ],
                    },
                    {
                      type: "number",
                      min: 1,
                      name: "delay",
                      label: "Days of Inactivity",
                      show: [
                        { type: "matches", name: "type", value: "internal" },
                      ],
                    },
                    {
                      type: "user",
                      label: "ID",
                      show: [{ type: "matches", name: "type", value: "user" }],
                      options: [
                        {
                          first_name: "Owner",
                          unique_id: "{{owner.unique_id}}",
                          email: "User that initiated workflow",
                        },
                        {
                          first_name: "Actor",
                          unique_id: "{{actor.unique_id}}",
                          email: "User that is taking an action",
                        },
                        {
                          type: "optgroup",
                          options: "map_users",
                          format: {
                            display:
                              '{{name}}<div style="color:#aaa">Mapped value</div>',
                            value: function (option) {
                              return "{{datamap." + option.name + "}}";
                            },
                            label: "{{name}}",
                          },
                        },
                        {
                          type: "optgroup",
                          options: "form_users",
                          format: {
                            display:
                              '{{name}}<div style="color:#aaa">Form value</div>',
                            value: function (option) {
                              var path = option.data.name;
                              var search = option.data;
                              while (search.ischild) {
                                path = search.parent.name + "." + path;
                                search = search.parent;
                              }
                              return "{{form." + path + "}}";
                            },
                            label: "{{label}}{{^label}}{{name}}{{/label}}",
                          },
                        },
                      ],
                    },
                    {
                      type: "group",
                      label: "ID",
                      show: [{ type: "matches", name: "type", value: "group" }],
                      options: [
                        {
                          type: "optgroup",
                          options: "map_groups",
                          format: {
                            display:
                              '{{name}}<div style="color:#aaa">Mapped value</div>',
                            value: function (option) {
                              return "{{datamap." + option.name + "}}";
                            },
                            label: "{{name}}",
                          },
                        },
                        {
                          type: "optgroup",
                          options: "form_groups",
                          format: {
                            display:
                              '{{name}}<div style="color:#aaa">Form value</div>',
                            value: function (option) {
                              var path = option.data.name;
                              var search = option.data;
                              while (search.ischild) {
                                path = search.parent.name + "." + path;
                                search = search.parent;
                              }
                              return "{{form." + path + "}}";
                            },
                            label: "{{label}}{{^label}}{{name}}{{/label}}",
                          },
                        },
                        {
                          type: "optgroup",
                          options: "/api/groups?members=20",
                          format: { label: "{{name}}", value: "{{id}}" },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "form",
                  label: "Show Form",
                  type: "switch",
                  format: { label: "" },
                  columns: 6,
                },
                {
                  name: "signature",
                  label: "Require Signature",
                  type: "switch",
                  format: { label: "" },
                  columns: 6,
                },
                {
                  name: "signature_text",
                  label: "Signature Text",
                  placeholder: "Sign Above",
                  help: "This text will show up below the signature box <br>(default text is 'Please Sign Above')",
                  type: "text",
                  columns: 12,
                  show: [{ name: "signature", value: true, type: "matches" }],
                },
                {
                  name: "validate",
                  label: "Validate",
                  value: true,
                  type: "switch",
                  format: { label: "" },
                  columns: 6,
                },
                {
                  name: "invalid_submission",
                  label: "Allow Invalid Submission",
                  value: false,
                  type: "switch",
                  format: { label: "" },
                  columns: 6,
                  show: [{ name: "validate", value: true, type: "matches" }],
                },
                {
                  type: "select",
                  other: true,
                  columns: 12,
                  label: "Show Action",
                  value: true,
                  name: "show",
                  parse: [{ type: "not_matches", name: "show", value: true }],
                  options: [
                    {
                      type: "optgroup",
                      options: [
                        { label: "Always", value: true },
                        { label: "Never", value: false },
                        { label: "Conditionally", value: "other" },
                      ],
                    },
                  ],
                },
                {
                  type: "fieldset",
                  columns: 11,
                  offset: "1",
                  label: false,
                  name: "show",
                  fields: myconditions,
                  array: { min: 1, max: 1 },
                  show: [{ name: "show", value: ["other"], type: "matches" }],
                },
                {
                  name: "task_label",
                  label: "<h4>Tasks</h4>",
                  type: "output",
                  parse: false,
                },

                {
                  name: "tasks",
                  label: false,
                  type: "fieldset",
                  fields: taskForm,
                  array: { min: 1, max: 10 },
                },
              ],
              array: { max: 100 },
            }
          : {
              target: "#collapseLogic .panel-body",
              name: "actions",
              show: [{ name: "hasLogic", value: true, type: "matches" }],
              label: false,
              type: "fieldset",
              fields: [
                {
                  name: "name",
                  label: false,
                  parse: true,
                  type: "output",
                  format: { value: "<b>Logic Result: <i>{{value}}</i></b>" },
                },
                { name: "label", label: "Label", columns: 6 },

                {
                  name: "to",
                  label: "To",
                  columns: 6,
                  type: "select",
                  options:
                    "flowstates" /*, show: [{type: "not_matches", name: "label", value: ""}]*/,
                },
                {
                  name: "task_label",
                  label: "<h4>Tasks</h4>",
                  type: "output",
                  parse: false,
                },

                {
                  name: "tasks",
                  label: false,
                  type: "fieldset",
                  fields: taskForm,
                  array: { min: 1, max: 10 },
                },
              ],
              array: { min: 3, max: 3 },
            },
      ])
  );
  $("#flow-form").html(gform.renderString(flowAccordion));

  $(".panelAssignment").toggle(
    !!_.find(formConfig.fields, {
      target: "#collapseAssignment .panel-body",
    }) && !formConfig.data.logic
  );
  $(".panelBasic").toggle(
    !!_.find(formConfig.fields, { target: "#collapseBasic .panel-body" })
  );
  $(".panelLogic").toggle(
    !!_.find(formConfig.fields, { target: "#collapseLogic .panel-body" }) &&
      !!formConfig.data.logic
  );
  $(".panelOnleave").toggle(
    !!_.find(formConfig.fields, { target: "#collapseOnleave .panel-body" }) &&
      !formConfig.data.logic
  );
  $(".panelActions").toggle(
    !!_.find(formConfig.fields, { target: "#collapseActions .panel-body" }) &&
      !formConfig.data.logic
  );

  flowForm = new gform(formConfig, "#flow-form")
    .on("input", function (e) {
      var temp = e.form.get();
      temp.onEnter = _.compact(
        _.map(temp.onEnter, function (e) {
          if (e.task) {
            return e;
          }
        })
      );
      temp.onLeave = _.compact(
        _.map(temp.onLeave, function (e) {
          if (e.task) {
            return e;
          }
        })
      );
      temp.actions = _.compact(
        _.map(temp.actions, function (e) {
          if (e.name && e.label) {
            return e;
          }
        })
      );

      _.each(temp.actions, function (action) {
        action.tasks = _.compact(
          _.map(action.tasks, function (e) {
            if (e.task) {
              return e;
            }
          })
        );
      });

      flow_states[
        _.findIndex(flow_states, {
          state_id: e.form.options.data.state_id || e.form.get("state_id"),
        })
      ] = temp;

      gform.collections.update("flowstates", _.pluck(flow_states, "name"));
      var tempName = e.form.get("name") || temp.state_id;

      if (tempName != e.form.options.data.name) {
        _.each(flow_states, function (state) {
          _.each(state.actions, function (action, i) {
            if (action.to == e.form.options.data.name) {
              action.to = tempName;
              if (tempName == state.name) {
                _.where(e.form.fields, { name: "actions" })
                  [i].find("to")
                  .set(action.to);
              }
            }
          });
        });
      }

      e.form.options.data.name = tempName;

      createFlow();
    })
    .on("delete", function (e) {
      var removed = flow_states.splice(
        _.findIndex(flow_states, {
          state_id: e.form.options.data.state_id || e.form.get("state_id"),
        }),
        1
      );
      _.each(flow_states, function (state) {
        _.each(state.actions, function (action) {
          if (action.from == removed[0].name) {
            action.from = state.name;
          }
          if (action.to == removed[0].name) {
            action.to = state.name;
          }
        });
      });
      if (typeof flowForm !== "undefined") {
        flowForm.destroy();
      }
      gform.collections.update("flowstates", _.pluck(flow_states, "name"));

      createFlow();
    })
    .on("done", function (e) {
      if (typeof flowForm !== "undefined") {
        flowForm.destroy();
      }
      e.stopPropagation();
      e.preventDefault();
      gform.collections.update("flowstates", _.pluck(flow_states, "name"));

      createFlow();
    });
  flowForm.trigger("input");
}

gform.collections.add(
  "endpoints",
  _.where(attributes.code.map, { type: "endpoint" })
);
gform.collections.add(
  "map_users",
  _.where(attributes.code.map, { type: "user" })
);
gform.collections.add(
  "map_emails",
  _.where(attributes.code.map, { type: "email" })
);
gform.collections.add(
  "map_groups",
  _.where(attributes.code.map, { type: "group" })
);
gform.collections.add("flowstates", _.pluck(flow_states, "name"));
gform.collections.add("resources", _.pluck(attributes.code.resources, "name"));
gform.collections.add(
  "methods",
  _.map(_.pluck(attributes.code.methods, "name"), function (item, i, j) {
    return { value: "method_" + i, label: item };
  })
);
gform.collections.add(
  "templates",
  _.map(_.pluck(attributes.code.templates, "name"), function (item, i) {
    return { value: "template_" + i, label: item };
  })
);

var temp = new gform(attributes.code.form || {});
gform.collections.add("form_users", temp.filter({ type: "user" }, 20));
gform.collections.add("form_groups", temp.filter({ type: "group" }, 20));
var valueField = {
  label: 'Value <span class="text-success pull-right">{{value}}</span>',
};

var taskForm = [
  {
    name: "task",
    label: "Task",
    type: "select",
    options: [
      { value: "", label: "None" },
      { value: "email", label: "Email" },
      { value: "resource", label: "Resource" },
      { value: "purge_files", label: "Purge All Files" },
      { value: "purge_fields_by_name", label: "Purge Fields By Name" },
    ],
  },

  {
    name: "to",
    label: "To",
    show: [{ type: "matches", name: "task", value: "email" }],
    array: { min: 1, max: 10 },
    type: "fieldset",
    fields: [
      {
        name: "email_type",
        label: "Type",
        type: "select",
        options: [
          { label: "Email Address", value: "email" },
          { label: "User", value: "user" },
          { label: "Group", value: "group" },
        ],
      },
      /* Begin Email Address Field */
      _.extend(
        {
          label:
            'Email Address <span class="text-success pull-right">{{value}}</span>',
          name: "email_address",
          show: [{ type: "matches", name: "email_type", value: "email" }],
          type: "user_email",
          options: [
            {
              first_name: "Owner",
              email: "{{owner.email}}",
              display: "User that initiated workflow",
            },
            {
              first_name: "Actor",
              email: "{{actor.email}}",
              display: "User that is taking an action",
            },
            {
              type: "optgroup",
              options: "map_emails",
              format: {
                display: '{{name}}<div style="color:#aaa">Mapped value</div>',
                value: function (option) {
                  return "{{datamap." + option.name + "}}";
                },
                label: "{{name}}",
              },
            },
          ],
          strict: false,
          search: "/api/users/search/{{search}}{{value}}",
          format: {
            label: "{{first_name}} {{last_name}}",
            value: "{{email}}",
            display:
              "{{first_name}} {{last_name}}<div>{{display}}{{^display}}{{email}}{{/display}}</div>",
          },
        },
        valueField
      ),
      /* End Email Address Field */
      /* Begin User Field */
      {
        name: "user",
        type: "user",
        strict: false,
        label: "ID",
        show: [{ type: "matches", name: "email_type", value: "user" }],
        options: [
          {
            first_name: "Owner",
            unique_id: "{{owner.unique_id}}",
            email: "User that initiated workflow",
          },
          {
            first_name: "Actor",
            unique_id: "{{actor.unique_id}}",
            email: "User that is taking an action",
          },
          {
            type: "optgroup",
            options: "map_users",
            format: {
              display: '{{name}}<div style="color:#aaa">Mapped value</div>',
              value: function (option) {
                return "{{datamap." + option.name + "}}";
              },
              label: "{{name}}",
            },
          },
          {
            type: "optgroup",
            options: "form_users",
            format: {
              display: '{{name}}<div style="color:#aaa">Form value</div>',
              value: function (option) {
                var path = option.data.name;
                var search = option.data;
                while (search.ischild) {
                  path = search.parent.name + "." + path;
                  search = search.parent;
                }
                return "{{form." + path + "}}";
              },
              label: "{{label}}{{^label}}{{name}}{{/label}}",
            },
          },
        ],
      },
      /* End Email Field */
      /* Begin Group Field */
      {
        name: "group",
        type: "group",
        label: "ID",
        show: [{ type: "matches", name: "email_type", value: "group" }],
        options: [
          {
            type: "optgroup",
            options: "map_groups",
            format: {
              display: '{{name}}<div style="color:#aaa">Mapped value</div>',
              value: function (option) {
                return "{{datamap." + option.name + "}}";
              },
              label: "{{name}}",
            },
          },
          {
            type: "optgroup",
            options: "form_groups",
            format: {
              display: '{{name}}<div style="color:#aaa">Form value</div>',
              value: function (option) {
                var path = option.data.name;
                var search = option.data;
                while (search.ischild) {
                  path = search.parent.name + "." + path;
                  search = search.parent;
                }
                return "{{form." + path + "}}";
              },
              label: "{{label}}{{^label}}{{name}}{{/label}}",
            },
          },
          {
            type: "optgroup",
            options: "/api/groups?members=20",
            format: { label: "{{name}}", value: "{{id}}" },
          },
        ],
      },
      /* End Email Field */
    ],
  },

  {
    name: "subject",
    type: "text",
    label: "Subject",
    show: [{ type: "matches", name: "task", value: "email" }],
  },
  {
    name: "template",
    type: "combobox",
    value: "",
    options: [
      { value: "", label: "Custom body template" },
      {
        type: "optgroup",
        options: "templates",
        format: { label: "Template: {{label}}" },
      },
    ],
    label: "Body Template",
    show: [{ type: "matches", name: "task", value: "email" }],
    strict: true,
  },
  {
    name: "content",
    type: "textarea",
    label: "Custom Body",
    show: [
      { type: "matches", name: "task", value: "email" },
      { type: "matches", name: "template", value: "" },
    ],
  },
  {
    name: "resource",
    columns: 8,
    type: "select",
    label: "Resource",
    placeholder: "None",
    options: "resources",
    show: [{ type: "matches", name: "task", value: "resource" }],
  },
  {
    name: "verb",
    columns: 4,
    label: "Verb",
    type: "select",
    options: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    show: [{ type: "matches", name: "task", value: "resource" }],
  },
  {
    name: "resource",
    type: "select",
    label: "Resource",
    placeholder: "None",
    options: "resources",
    show: [{ type: "matches", name: "task", value: "api" }],
  },
  {
    type: "output",
    value:
      "This task purges all values of a specified name from the form data, and throughout the workflow history",
    show: [{ type: "matches", name: "task", value: "purge_fields_by_name" }],
  },
  {
    name: "dataset",
    label: "Data",
    type: "fieldset",
    array: { min: 1, max: 100 },
    show: [{ type: "matches", name: "task", value: "resource" }],
    fields: [{ label: "Key" }, { label: "Value" }],
  },
  {
    label: "Field Name",
    name: "field_names",
    type: "text",
    array: { min: null, max: null },
    show: [{ type: "matches", name: "task", value: "purge_fields_by_name" }],
  },
];

$("#flow-preview").on("click", ".nodes .node", function (e) {
  // console.log(e.currentTarget.id);
  // drawForm(e.currentTarget.id);
  drawForm(e.currentTarget.textContent);
  createFlow();
});

$("#add-state").on("click", function () {
  i = 0;
  while (
    typeof _.find(flow_states, {
      name: gform.renderString("newState{{i}}", { i: i }),
    }) !== "undefined"
  ) {
    i++;
  }
  flow_states.push({
    name: gform.renderString("newState{{i}}", { i: i }),
    state_id: gform.getUID(),
    actions: [],
  });
  drawForm(gform.renderString("newState{{i}}", { i: i }));
  gform.collections.update("flowstates", _.pluck(flow_states, "name"));

  createFlow();
});
$("#add-logic").on("click", function () {
  i = 0;
  while (
    typeof _.find(flow_states, {
      name: gform.renderString("newLogic{{i}}", { i: i }),
    }) !== "undefined"
  ) {
    i++;
  }
  flow_states.push({
    name: gform.renderString("newLogic{{i}}", { i: i }),
    state_id: gform.getUID(),
    logic: {},
    actions: [
      { label: "True", name: "true" },
      { label: "False", name: "false" },
      { label: "Error", name: "error" },
    ],
  });
  drawForm(gform.renderString("newLogic{{i}}", { i: i }));
  gform.collections.update("flowstates", _.pluck(flow_states, "name"));

  createFlow();
});
$("#save").on("click", function () {
  if (!isDirty()) {
    toastr.success("All up to date!", "No Changes");
    return;
  }
  var data = { code: { flow: flow_states } };
  if (true || !errorCount) {
    // data.code.form = JSON.parse(formPage.toJSON()[0].content);

    // template_errors = templatePage.errors();
    data.updated_at = attributes.updated_at;

    data.code.form = JSON.stringify(myform);
    data.code.map = map.toJSON().map;
    data.code.templates = templatePage.toJSON();
    data.code.methods = methodPage.toJSON();
    data.code.resources = resource_grid.toJSON();
    $.ajax({
      url: root + attributes.workflow_id + "/code",
      method: "put",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (e) {
        attributes.updated_at = e.updated_at;
        attributes.code = e.code;

        templatePage.items = e.code.templates;
        methodPage.items = e.code.methods;
        resource_grid.items = e.code.resources;

        isDirty();
        loadInstances();
        toastr.success("", "Successfully Saved");
      },
      error: function (e) {
        toastr.error(e.statusText, "ERROR");
      },
      statusCode: {
        404: function () {
          toastr.error("You are no longer logged in", "Logged Out");
        },
        409: function (error) {
          test = JSON.parse(JSON.parse(error.responseText).error.message);
          toastr.warning("conflict detected:" + error.statusText, "NOT SAVED");
          conflictResults = {};

          conflictResults.options =
            JSON.stringify(test.options) !== JSON.stringify(this.model.options);
          modal({
            headerClass: "bg-danger",
            title: "Conflict(s) detected",
            content: render("conflict", conflictResults),
          }); //, footer:'<div class="btn btn-danger">Force Save</div>'})
        }.bind(this),
        401: function () {
          toastr.error(
            "You are not authorized to perform this action",
            "Not Authorized"
          );
        },
      },
    });
  } else {
    toastr.error(
      "Please correct the compile/syntax errors (" + errorCount + ")",
      "Errors Found"
    );
    modal({
      headerClass: "danger",
      title: "Syntax Error(s)",
      content: render("error", {
        count: errorCount,
        temp: template_errors,
        script: script_errors /*, css: css_errors*/,
      }),
    }); //, footer:'<div class="btn btn-danger">Force Save</div>'})
  }
});

$("#import").on("click", function () {
  new gform({
    name: "update",
    legend: '<i class="fa fa-cube"></i> Update Workflow',
    fields: [{ label: "Descriptor", type: "textarea" }],
  })
    .on("save", e => {
      var descriptor = JSON.parse(e.form.get()["descriptor"]);
      descriptor.code.form = JSON.stringify(descriptor.code.form);
      $.ajax({
        url: root + attributes.workflow_id + "/code",
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ force: true, updated_at: "", ...descriptor }),
        success: () => {
          e.form.trigger("close");
          window.location.reload();
        },
        error: e => {
          toastr.error(e.statusText, "ERROR");
        },
      });
    })
    .on("cancel", function (e) {
      e.form.dispatch("close");
    })
    .modal();
});

$("#publish").on("click", function () {
  new gform({
    name: "publish",
    legend: '<i class="fa fa-cube"></i> Publish Workflow',
    fields: [
      { label: "Summary", required: true },
      { label: "Description", type: "textarea" },
    ],
  })
    .on("save", e => {
      if (e.form.validate()) {
        $.ajax({
          url: root + attributes.workflow_id + "/publish",
          contentType: "application/json",
          data: JSON.stringify(e.form.get()),
          method: "PUT",
          success: () => {
            e.form.trigger("close");
            toastr.success("", "Successfully Published");
          },
          error: e => {
            toastr.error(e.responseJSON.message, "ERROR");
          },
        });
      }
    })
    .on("cancel", e => {
      e.form.trigger("close");
    })
    .modal();
});

loadInstances = function () {
  $.get(
    "/api/workflowinstances?workflow_id=" + attributes.workflow_id,
    function (workflow_instances) {
      if (workflow_instances.length > 0) {
        // viewTemplate = Hogan.compile();

        // modal({title: 'This workflow has the following instances', content: viewTemplate.render({items: data})});

        workflow_instances = _.map(workflow_instances, function (instance) {
          if (instance.configuration !== null) {
            if (instance.version !== null) {
              instance.configuration.resources = _.map(
                instance.configuration.resources,
                function (instance, resource, i) {
                  // var group = _.find(loaded.group_admins,{group_id:instance.group_id})
                  // if(typeof group !== 'undefined'){
                  resource.endpoint = _.find(instance.group.endpoints, {
                    id: parseInt(resource.endpoint),
                  });
                  // }

                  resource.resource = _.find(instance.version.code.resources, {
                    name: resource.name,
                  });
                  return resource;
                }.bind(null, instance)
              );

              instance.version_summary =
                instance.version.summary || "Working Version";

              instance.version_id =
                instance.workflow_version_id !== null
                  ? instance.workflow_version_id == 0
                    ? "Latest Published"
                    : instance.version.summary +
                      " (" +
                      instance.workflow_version_id +
                      ")"
                  : "Latest Saved";
              // instance.configuration.initial
              instance.error =
                !(
                  _.pluck(instance.version.code.flow, "name").indexOf(
                    instance.configuration.initial
                  ) + 1
                ) ||
                !!_.difference(
                  _.pluck(instance.version.code.map, "name"),
                  _.pluck(instance.configuration.map, "name")
                ).length ||
                !!_.difference(
                  _.pluck(instance.configuration.map, "name"),
                  _.pluck(instance.version.code.map, "name")
                ).length ||
                _.reduce(
                  instance.version.code.map,
                  function (config, result, item) {
                    var configItem = _.find(config, { name: item.name });
                    return (
                      result ||
                      typeof configItem.value == "undefined" ||
                      configItem.value == null ||
                      configItem.value == "" ||
                      configItem.type !== item.type
                    );
                  }.bind(null, instance.configuration.map),
                  false
                );
              // instance.error = !!_.difference(_.pluck(instance.version.resources ,'name'),_.pluck(instance.resources,'name')).length
            }

            instance.configuration.map = _.map(
              instance.configuration.map,
              function (instance, map, i) {
                // var group = _.find(loaded.group_admins,{group_id:instance.group_id})
                map.display = map.value;

                if (map.type == "group") {
                  var finder = _.find(
                    gform.collections.get("/api/groups?members=20") || [],
                    { id: parseInt(map.value) }
                  );
                  if (finder != null) {
                    map.display = finder.name;
                  }
                }
                if (map.type == "endpoint") {
                  var finder = _.find(instance.group.endpoints, {
                    id: parseInt(map.value),
                  });
                  if (finder != null) {
                    map.display = finder.config.url + " (" + finder.name + ")";
                  }
                }
                if (
                  typeof map.display == "undefined" ||
                  map.display == null ||
                  map.display == ""
                ) {
                  map.display = '<span class="text-danger"> - None - </span>';
                }
                return map;
              }.bind(null, instance)
            );
          }

          return instance;
        });
      }
      // gform.addClass(document.querySelector('.nav-sidebar'),'hidden');
      if (
        document.querySelector(".sidebar").querySelector("#instances") !== null
      ) {
        document.querySelector(".sidebar").querySelector("#instances").remove();
      }
      document.querySelector(".sidebar").appendChild(
        gform.create(
          gform.m(
            `<div id="instances" style="margin: 0 -15px">
      <hr><h5 style="color:#fefefe">Instances</h5>
      <style>.workflowInstance{
        color: #ddd;
        text-decoration: none;
        border:solid 1px #333;
        border-width:1px 0;
        cursor: pointer;
        background: #666;
        padding: 5px;
        position:relative;
      }
      .workflowInstance  #dLabel{
        color: #ddd;
      }
      .workflowInstance .fa-warning.text-danger{
        position: absolute;
        left: 70px;
        top: 20px;
        font-size: 50px;
        text-shadow: 0px 0px 3px #fff;
      }
      .fa-lock-0:before{
        content:"\f023";
      }
      .fa-lock-:before{
        content:"\f09c";
      }
      
    </style>
      {{#workflow_instances}}
      <div class="workflowInstance">
        {{#error}}<a href="/admin/workflowinstances/{{id}}" target="_blank" class="fa fa-warning text-danger"></a>{{/error}}
        <div class="btn-group parent-hover" style="position: absolute;right: 2px;top:2px">
        <a class="btn btn-xs btn-default" target="_blank" href="/workflow/{{group_id}}/{{slug}}"><i class="fa fa-external-link"></i></a>
        <a class="btn btn-xs btn-default" href="/admin/workflowinstances/{{id}}"><i class="fa fa-pencil"></i></a>
      </div>
        <div data-workflowID={{id}}>
        
        <div style="overflow:hidden">
          {{group.name}}

        </div> 
        <div> <i class="pull-right fa {{#workflow_version_id}}fa-lock{{/workflow_version_id}} {{^workflow_version_id}}fa-lock-{{workflow_version_id}}{{/workflow_version_id}}" style="padding-top:3px"></i> {{name}}</div>
          <div style="border-top:solid 1px #e4e4e4;border-bottom:solid 0px #ddd;padding:5px 0 0px;margin:5px 0">
          {{#unlisted}}
          <i class="fa fa-unlink"></i>
          {{/unlisted}}
          {{^unlisted}}
          <i class="fa fa-link"></i>
          {{/unlisted}}
          {{#public}}
          <i class=" fa fa-eye"></i>
          {{/public}}
          {{^public}}
          <i class="fa fa-eye-slash"></i>
          {{/public}}

          {{#composite_limit}}
          <i class="fa fa-user"></i>
          {{/composite_limit}}
          {{^composite_limit}}
          <i class="fa fa-users"></i>
          {{/composite_limit}}

          {{^hidden_xs}}
          <i class="pull-right fa fa-phone"></i>
          {{/hidden_xs}}
          {{^hidden_sm}}
          <i class="pull-right fa fa-mobile"></i>
          {{/hidden_sm}}
          {{^hidden_md}}
          <i class="pull-right fa fa-desktop"></i>
          {{/hidden_md}}

          <!--i class="pull-right device_{{device}}"></i-->

          </div>
        </a>
        </div>
      
      </div>
        
      {{/workflow_instances}}
      {{^workflow_instances}}
      <div class="workflowInstance">No instances</div>
      {{/workflow_instances}}</div>`,
            { workflow_instances: workflow_instances }
          )
        )
      );
      $("#instances").on(
        "click",
        "[data-workflowID]",
        function (workflow_instances, e) {
          var temp = _.find(workflow_instances, {
            id: parseInt(e.currentTarget.dataset.workflowid),
          });
          modal({
            title: temp.name,
            content: gform.m(
              `

        <div class="">
          <div class="row">
            <dl class="dl-horizontal col-md-6">
              <dt>Group:</dt>
              <dd>{{group.name}} <span class="text-muted">({{group.id}})</span></dd>
              <dt>Name:</dt>
              <dd>{{name}}</dd>
              <dt>Slug:</dt>
              <dd>{{slug}}</dd>
              <dt>Icon:</dt>
              <dd><i class="{{icon}}"></i> ({{^icon}} - None - {{/icon}}{{icon}})</dd>
              
              <dt>Version Selected:</dt>
              <dd>{{version_id}}</dd>
              <dt>Using Version:</dt>
              <dd>{{version_summary}}<p class="text-muted">{{description}}</p></dd><dt></dt>
              <dt>Initial State:</dt>
              <dd>{{configuration.initial}}{{^configuration.initial}}<span class="text-danger"> - None - </span>{{/configuration.initial}}</dd>

            </dl>
            <dl class="dl-horizontal col-md-6">
              <dt>Included in menu:</dt>
              <dd>          
              {{#unlisted}}
              No <i class="text-warning pull-right fa fa-unlink"></i>
              {{/unlisted}}
              {{^unlisted}}
              Yes <i class="pull-right fa fa-link"></i>
              {{/unlisted}}
              </dd>
              <dt>Public:</dt>
              <dd>          
              {{#public}}
              Yes <i class="pull-right text-success fa fa-eye"></i>
              {{/public}}
              {{^public}}
              No <i class="pull-right text-danger fa fa-eye-slash"></i>
              {{/public}}</dd>
              <dt>Limit To Composites:</dt>
              <dd>
              {{#composite_limit}}
              Yes <i class="pull-right fa fa-user"></i>
              {{/composite_limit}}
              {{^composite_limit}}
              No, Open to all Group Members <i class="pull-right fa fa-users"></i>
              {{/composite_limit}}
              </dd>

              <dt>Phone:</dt>
              <dd>
              {{^hidden_xs}}
              Yes
              {{/hidden_xs}}
              {{#hidden_xs}}
              No
              {{/hidden_xs}}
              </dd>
              <dt>Tablet:</dt>
              <dd>
              {{^hidden_sm}}
              Yes
              {{/hidden_sm}}
              {{#hidden_sm}}
              No
              {{/hidden_sm}}
              </dd>
              <dt>Desktop:</dt>
              <dd>
              {{^hidden_md}}
              Yes
              {{/hidden_md}}
              {{#hidden_md}}
              No
              {{/hidden_md}}
              </dd>

              <dt>Emails:</dt>
              <dd>
              {{#configuration.suppress_emails}}
              Do not send (Emails will not be sent) <i class="pull-right fa fa-envelope text-success"></i>
              {{/configuration.suppress_emails}}
              {{^configuration.suppress_emails}}
              Send default Emails <i class="pull-right fa fa-envelope text-danger"></i>
              {{/configuration.suppress_emails}}
              </dd>
            </dl>
          </div>
    
          <div style="overflow:scroll">
            <p class="text-muted">{{version.description}}</p>
    
              {{#configuration.resources.length}}
              <div style="border-bottom:solid 1px #aaa;margin:5px 0"></div>
              <table>
              <tr><th colspan="2" style="color:#666">Resources Map</th><tr>
              {{#configuration.resources}}
              <tr>
              <td valign="top">{{name}}:&nbsp;</td><td class="text-muted">{{{endpoint.config.url}}}{{{resource.path}}}</td>
              </tr>
              {{/configuration.resources}} 
            </table>
              {{/configuration.resources.length}}
    
              {{#configuration.map.length}}                      
              <div style="border-bottom:solid 1px #aaa;margin:5px 0"></div>
    
              <table style="min-width:100%">
              <tr><th colspan="2" style="color:#666">Data Map</th><th>Type</th><tr>
              {{#configuration.map}}
              <tr>
              <td valign="top" style="text-align:right;width:100px">{{name}}:&nbsp;</td><td class="text-muted">{{{display}}}</td><td class="text-muted;width:100px">({{type}})</td>
              </tr>
              {{/configuration.map}}                         
              </table>                      
    
              {{/configuration.map.length}}
          </div>
        </div>`,
              temp
            ),
          });
        }.bind(null, workflow_instances)
      );
    }
  );
};
$.get("/api/groups?members=20", function (groups) {
  gform.collections.add("/api/groups?members=20", groups);
  loadInstances();
});

$("#versions").on("click", function () {
  $.ajax({
    url: root + attributes.workflow_id + "/versions",
    success: function (data) {
      if (!orig.stable) {
        data.unshift({ id: orig.id, label: "Working Version" });
      }

      new gform({
        actions: [{ type: "cancel" }, { type: "save", label: "Switch" }],
        name: "modal",
        data: { workflow_version_id: attributes.id },
        legend: "Select Version",
        fields: [
          {
            label: "Version",
            name: "workflow_version_id",
            options: data,
            type: "select",
            format: {
              label: "{{label}}",
              value: version => version.id,
            },
          },
        ],
      })
        .on("save", e => {
          // switch version
          e.form.trigger("close");

          $.ajax({
            url:
              root +
              attributes.workflow_id +
              "/versions/" +
              e.form.get("workflow_version_id"),
            method: "get",
            success: function (version) {
              version.workflow = loaded.workflow;
              loaded = version;
              load(loaded.code);
            },
          });
        })
        .on("cancel", e => {
          e.form.trigger("close");
        })
        .modal();
    },
  });
});

flowAccordion = `



<form>
<div id="display" style="padding-bottom:15px"></div>
<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

<div class="panel panel-default panelBasic">
  <div class="panel-heading" role="tab" id="headingBasic">
    <h4 class="panel-title">
      <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseBasic" aria-expanded="true" aria-controls="collapseBasic">
Basic
      </a>
    </h4>
  </div>
  <div id="collapseBasic" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingBasic">
    <div class="panel-body">
    </div>
  </div>
</div>


<div class="panel panel-default panelAssignment">
  <div class="panel-heading" role="tab" id="headingAssignment">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseAssignment" aria-expanded="false" aria-controls="collapseAssignment">
      Assignment
      </a>
    </h4>
  </div>
  <div id="collapseAssignment" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingAssignment">
    <div class="panel-body">
    </div>
  </div>
</div>




<div class="panel panel-default panelOnenter">
  <div class="panel-heading" role="tab" id="headingOnenter">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOnenter" aria-expanded="false" aria-controls="collapseOnenter">
On Enter
      </a>
    </h4>
  </div>
  <div id="collapseOnenter" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOnenter">
    <div class="panel-body">
    </div>
  </div>
</div>


<div class="panel panel-default panelOnleave">
  <div class="panel-heading" role="tab" id="headingOnleave">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOnleave" aria-expanded="false" aria-controls="collapseOnleave">
On Leave
      </a>
    </h4>
  </div>
  <div id="collapseOnleave" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOnleave">
    <div class="panel-body">
    </div>
  </div>
</div>



<div class="panel panel-default panelActions">
  <div class="panel-heading" role="tab" id="headingActions">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseActions" aria-expanded="false" aria-controls="collapseActions">
Actions
      </a>
    </h4>
  </div>
  <div id="collapseActions" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingActions">
    <div class="panel-body">
    </div>
  </div>
</div>

<div class="panel panel-default panelLogic">
  <div class="panel-heading" role="tab" id="headingLogic">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseLogic" aria-expanded="false" aria-controls="collapseLogic">
      Logic
      </a>
    </h4>
  </div>
  <div id="collapseLogic" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingLogic">
    <div class="panel-body">
    </div>
  </div>
</div>

</div>
</form>
`;
