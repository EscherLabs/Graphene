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
  // $('[href="#files"]').toggleClass("isDirty", filepage.isDirty);
  // $('[href="#functions"]').toggleClass("isDirty", functionpage.isDirty);
  // $('[href="#routes"]').toggleClass("isDirty", grid.isDirty);
  // $('[href="#resources"]').toggleClass("isDirty", resourcePage.isDirty);

  return (
    filepage.isDirty ||
    functionpage.isDirty ||
    grid.isDirty ||
    resourcePage.isDirty ||
    optionsPage.isDirty
  );
};

var resourcePage = {
  toJSON: function () {
    return gform.instances.resources.get().resources;
  },
};
Object.defineProperty(resourcePage, "isDirty", {
  get: () =>
    !_.isEqual(attributes.resources || false, resourcePage.toJSON() || false),
});

var optionsPage = {
  toJSON: function () {
    return myform;
  },
};
Object.defineProperty(optionsPage, "isDirty", {
  get: () => !_.isEqual(attributes.options, optionsPage.toJSON()),
});

window.onbeforeunload = () => {
  return isDirty()
    ? "You have unsaved changes, are you sure you want to leave?"
    : undefined;
};
attributes = $.extend({}, loaded);
var root = "/api/apps/";
function load(app_version) {
  $(".nav-tabs").stickyTabs();
  $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
    grid.fixStyle();
  });

  attributes = app_version;

  attributes.files = $.extend(
    true,
    [{ name: "Main", content: "", disabled: true }],
    attributes.files
  );
  attributes.functions = $.extend(
    true,
    [{ name: "Constructor", content: "", disabled: true }],
    attributes.functions
  );
  debugger;
  attributes.options = $.extend(true, { name: "options" }, attributes.options);

  $(".navbar-header .nav a h4").html("API - " + api.name);

  $("#version").html(attributes.summary || "Working Version");

  new gform(
    {
      name: "resources",
      data: attributes,
      actions: [],
      fields: [
        // {type:'output',name:'test',format:{value:'<div></div>'},label:false},
        {
          name: "resources",
          label: false,
          legend: "Resources",
          array: {
            min: 0,
            max: 100,
          },
          type: "fieldset",
          fields: [
            // "database": {}
            // {label: false, name:'database',type:'select', required: true,choices:'/api/proxy/databases',label_key:'name',value_key:'id'}
            {
              label: false,
              placeholder: "Resource Name",
              name: "name",
              required: false,
              columns: 6,
              required: true,
              validate: [
                {
                  type: "required",
                  name: "name",
                  message:
                    "Resource name is required - if you no longer need this Resource, please delete it",
                },
                {
                  type: "unique",
                  name: "resources",
                  message: "Resource name must be unique",
                },
              ],
            },
            // {label: 'Type', name:'type', type:'select',options:[
            //   {label: 'MySQL Database',value: 'mysql'},
            //   {label: 'Oracle Database', value:'oracle'},
            //   {label: 'Value', value:'value'},
            //   {label: 'Secret Value (Encrypted at Rest)', value:'secret'}
            // ], columns:6}
          ],
        },
      ],
    },
    ".resources"
  );

  var options = {
    data: attributes.routes,
    el: ".routes",
    schema: [
      { label: "Description", name: "description" },
      {
        label: "Path",
        name: "path",
        required: true,
        validate: [
          {
            type: "custom",
            test: e => {
              if (!/^[\/][a-zA-Z0-9_\/-]*[a-zA-Z0-9]$/.test(e.value)) {
                return "Must be a valid url path begining with a / and ending in a number or letter. Please see examples in help text";
              }
            },
          },
          {
            type: "custom",
            test: function (e) {
              let models = grid.models;
              if (e.form.get("_method") == "edit") {
                models = _.reject(models, e.form.options.model);
              }

              // _.includes(
              //   _.map(models, "attributes.verb"),
              //   e.form.get(verb),
              //   "ALL"
              // );
              // debugger;
              let pathMatches = _.filter(_.map(models, "attributes"), {
                path: e.value,
              });

              return (e.form.get("verb") == "ALL" && pathMatches.length) ||
                _.intersection(_.pluck(pathMatches, "verb"), [
                  e.form.get("verb"),
                  "ALL",
                ]).length
                ? "This 'Path' and 'Verb' combination already has a function defined to it - please change the path or assign to an available 'Verb'"
                : false;

              // console.log(filtered);
              // return _.includes(_.map(models, "attributes.path"), e.value)
              //   ? "Name already used - please choose a unique name"
              //   : false;
            }.bind(null),
          },
        ],
        help: "i.e. /example/route or /my-example_2",
      },
      {
        label: "Function Name",
        name: "function_name",
        required: true,
        validate: [
          {
            type: "custom",
            test: e => {
              if (!/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/.test(e.value)) {
                return "API name must be a valid php function name";
              }
            },
          },
        ],
      },
      {
        label: "Verb",
        name: "verb",
        type: "select",
        options: ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"],
        required: true,
      },
      {
        show: false,
        name: "parameters",
        label: "Parameters",
        template:
          "{{#attributes.required}}<b>{{name}}</b><br> {{/attributes.required}}{{#attributes.optional}}{{#name}}{{name}}<br>{{/name}} {{/attributes.optional}}",
      },
      {
        type: "fieldset",
        label: "Required",
        name: "required",
        show: false,
        parse: true,
        showColumn: false,
        array: { min: 0, max: 100 },
        fields: [
          { name: "name", label: "Name", inline: true, columns: 6 },
          { name: "example", label: "Example", inline: true, columns: 6 },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            inline: true,
          },
          // {'name':'required','label':'Required?','type':'checkbox',falsestate:0,"inline":true,columns:4},
        ],
      },
      {
        type: "fieldset",
        label: "Optional",
        name: "optional",
        show: false,
        parse: true,
        showColumn: false,
        array: { min: 0, max: 100 },
        fields: [
          { name: "name", label: "Name", inline: true, columns: 6 },
          { name: "example", label: "Example", inline: true, columns: 6 },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            inline: true,
          },
          // {'name':'required','label':'Required?','type':'checkbox',falsestate:0,"inline":true,columns:4},
        ],
      },
    ],
    actions: [
      { name: "create" },
      "|",
      { name: "edit" },
      {
        name: "required",
        label: '<i class="fa fa-lock"></i> Required Parameters',
        min: 1,
        max: 1,
      },
      {
        name: "optional",
        label: '<i class="fa fa-info"></i> Optional Parameters',
        min: 1,
        max: 1,
      },
      "|",
      { name: "sort", label: '<i class="fa fa-sort"></i> Sort' },
      { name: "delete" },
    ],
  };

  if (typeof grid !== "undefined") {
    grid.destroy();
  }
  grid = new GrapheneDataGrid(options);
  grid.on("model:edited", e => {
    debugger;
  });
  grid.on("model:required", function (e) {
    new gform({
      data: e.model.attributes,
      legend: "Required Parameters",
      name: "required",
      fields: [
        {
          name: "required",
          label: false,
          array: { min: 0, max: 100 },
          type: "fieldset",
          fields: [
            { name: "name", label: "Name", inline: true, columns: 6 },
            { name: "example", label: "Example", inline: true, columns: 6 },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              inline: true,
            },
            // {'name':'required','label':'Required?','type':'checkbox',falsestate:0,"inline":true,columns:4},
          ],
        },
      ],
    })
      .on(
        "save",
        function (e) {
          this.set({
            ..._.omit(this.attributes, "required"),
            ...e.form.get(),
          });
          e.form.dispatch("close");
        }.bind(e.model)
      )
      .on("cancel", function (e) {
        e.form.dispatch("close");
      })
      .modal();
  });
  grid.on("model:optional", function (e) {
    new gform({
      data: e.model.attributes,
      legend: "Optional Parameters",
      name: "optional",
      fields: [
        {
          name: "optional",
          label: false,
          array: { min: 0, max: 100 },
          type: "fieldset",
          fields: [
            { name: "name", label: "Name", inline: true, columns: 6 },
            { name: "example", label: "Example", inline: true, columns: 6 },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              inline: true,
            },
            // {'name':'required','label':'Required?','type':'checkbox',falsestate:0,"inline":true,columns:4},
          ],
        },
      ],
    })
      .on(
        "save",
        function (e) {
          this.set({
            ..._.omit(this.attributes, "optional"),
            ...e.form.get(),
          });
          e.form.dispatch("close");
        }.bind(e.model)
      )
      .on("cancel", function (e) {
        e.form.dispatch("close");
      })
      .modal();
  });

  grid.on("sort", e => {
    var tempdata = _.map(e.grid.models, ({ id, attributes }) => ({
      id,
      ...attributes,
    })).reverse();

    templates["sortroutes"] = {
      render: templates_render,
      template: `<ol id="sorter" class="list-group" style="margin: -15px;">
        {{#items}}
        <li id="list_{{id}}" data-id="{{id}}" class="list-group-item filterable">
          <div class="sortableContent">
          <div class="handle" style="position:absolute;top:0;left:0;bottom:0;margin:0"></div>
          <div style="padding-left:45px"><div><b>{{description}}</b><span class="pull-right">{{verb}}</span></div>
          <div>{{function_name}}<span class="pull-right">{{path}}</span></div></div>
          </div>
        </li>
        {{/items}}
      </ol>`,
    };
    debugger;
    mymodal = modal({
      title: "Sort Routes",
      content: templates.sortroutes.render({ items: tempdata }, templates),
      footer: '<div class="btn btn-success save-sort">Save</div>',
    });
    Sortable.create($(mymodal.ref.container).find("#sorter")[0], {
      draggable: "li",
    });
  });

  //adjust ace height to fill page
  $("body").append(
    "<style>.ace_editor { height: " +
      ($(window).height() - $(".nav-tabs").offset().top - 77) +
      "px; }</style>"
  );

  //add file managers here
  filepage = new fileManager(".files", {
    name: "scripts",
    items: attributes.files,
    mode: "ace/mode/php",
    label: "File",
  });
  functionpage = new fileManager(".functions", {
    name: "functions",
    items: attributes.functions,
    mode: "ace/mode/php",
    label: "Function",
    inlinemode: true,
  });
  myform = _.extend({}, attributes.options);
  // $('#cobler').click();
  path = [];
  renderBuilder();
  // optionpage = new fileManager(".options", {
  //   name: "options",
  //   items: attributes.options,
  //   mode: "ace/mode/php",
  //   label: "Options",
  //   inlinemode: true,
  // });
}

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

load(loaded);
// orig = $.extend({}, loaded);

$(document).keydown(function (e) {
  if ((e.which == "115" || e.which == "83") && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    $("#save").click();
  }
  return true;
});

$("#save").on("click", function () {
  if (!isDirty()) {
    toastr.info("All up to date!", "No Changes");
    return;
  }

  if (!gform.instances.resources.validate()) return;
  script_errors = filepage.errors();
  script_errors += functionpage.errors();
  var data = attributes;
  data.routes = grid.toJSON();
  data.resources = gform.instances.resources.get().resources;
  data.options = myform;
  var errorCount = script_errors.length; //+ css_errors.length

  if (!errorCount) {
    data.files = filepage.toJSON();
    data.functions = functionpage.toJSON();
    data.updated_at = attributes.updated_at;
    toastr.info("", "Saving...");

    $.ajax({
      url: "/api/proxy/" + slug + "/apis/" + attributes.api_id + "/code",
      method: "PUT",
      data: data,
      success: function (e) {
        if (typeof e.updated_at !== "undefined") {
          attributes.updated_at = e.updated_at;

          // attributes = e;

          functionpage.items = e.functions;
          filepage.items = e.files;
          grid.items = e.routes;
          attributes.resources = e.resources;
          attributes.options = e.options;
          grid.isDirty = false;
        }
        toastr.clear();

        toastr.success("", "Successfully Saved");
      },
      error: function (e) {
        toastr.error(e.statusText, "ERROR");
      },
      // statusCode: {
      //   404: function() {
      //     toastr.error('You are no longer logged in', 'Logged Out')
      //   },
      //   409: function(error) {
      //     test = JSON.parse(JSON.parse(error.responseText).error.message);
      //     toastr.warning('conflict detected:'+error.statusText, 'NOT SAVED')
      //     conflictResults = {};
      //     conflictResults.sources = (JSON.stringify(test.sources) !== JSON.stringify(this.model.sources));
      //     conflictResults.css = (JSON.stringify(test.css) !== JSON.stringify(this.model.css));
      //     conflictResults.options = (JSON.stringify(test.options) !== JSON.stringify(this.model.options));
      //     conflictResults.scripts = (JSON.stringify(test.script) !== JSON.stringify(this.model.script));
      //     conflictResults.template = (JSON.stringify(test.template) !== JSON.stringify(this.model.template));
      //     modal({headerClass:'bg-danger' ,title: 'Conflict(s) detected', content: render('conflict', conflictResults)})//, footer:'<div class="btn btn-danger">Force Save</div>'})
      //   }.bind(this),
      //   401: function() {
      //     toastr.error('You are not authorized to perform this action', 'Not Authorized')
      //   }
      // }
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
    legend: '<i class="fa fa-cube"></i> Update API',
    fields: [{ label: "Descriptor", type: "textarea" }],
  })
    .on("save", e => {
      $.ajax({
        url: "/api/proxy/" + slug + "/apis/" + attributes.api_id + "/code",
        method: "PUT",
        data: {
          force: true,
          updated_at: "",
          ...JSON.parse(e.form.get("descriptor")),
        },
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
    legend: '<i class="fa fa-cube"></i> Publish API',
    fields: [
      { label: "Summary", required: true },
      { label: "Description", type: "textarea" },
    ],
  })
    .on("save", e => {
      if (e.form.validate()) {
        $.ajax({
          url: "/api/proxy/" + slug + "/apis/" + attributes.api_id + "/publish",
          data: e.form.get(),
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
    .on("cancel", function (e) {
      e.form.dispatch("close");
    })
    .modal();
});

$("#instances").on("click", function () {
  viewTemplate = Hogan.compile(
    '<div class="list-group">{{#items}}<div class="list-group-item"><a href="https://{{environment.domain}}/{{slug}}" target="_blank">{{name}} ({{environment.name}})</a><a class="btn btn-warning" style="position: absolute;top: 3px;right: 3px;" href="/admin/apiserver/' +
      slug +
      '/api_instance/{{id}}" target="_blank"><i class="fa fa-pencil"></i></a></div>{{/items}}</div>'
  );
  $.get("/api/proxy/" + slug + "/api_instances", function (data) {
    data = _.where(data, { api_id: api.id });
    if (data.length > 0) {
      modal({
        title: "This API has the following instances",
        content: viewTemplate.render({ items: data }),
      });
    } else {
      modal({
        title: "No instances Found",
        content: "This App not currently instantiated.",
      });
    }
  });
});

$("#versions").on("click", function () {
  $.ajax({
    url: "/api/proxy/" + slug + "/apis/" + api.id + "/versions",
    success: function (data) {
      console.log(data);
      data = _.where(data, { stable: 1 });
      if (!loaded.stable) {
        data.unshift({ id: loaded.id, summary: "Working Version" });
      }

      new gform({
        actions: [{ type: "cancel" }, { type: "save", label: "Switch" }],
        name: "modal",
        data: { api_version_id: loaded.id },
        legend: "Select Version",
        fields: [
          {
            label: "Version",
            name: "api_version_id",
            options: data,
            type: "select",
            format: {
              label: "{{summary}}",
              value: versions => versions.id,
            },
          },
        ],
      })
        .on("save", e => {
          // switch version
          e.form.trigger("close");

          $.ajax({
            url:
              "/api/proxy/" +
              slug +
              "/api_versions/" +
              e.form.get("api_version_id"),
            method: "get",
            success: function (data) {
              loaded = data;
              load(loaded);
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
$("body").on("click", ".save-sort", () => {
  debugger;
  // console.log(
  //   _.map($("#sorter").children(), (item, index) => {
  //     return { id: item.dataset.id, index: index };
  //   })
  // );

  grid.load(
    _.map($("#sorter").children(), ({ dataset }) => {
      return _.find(grid.models, { id: dataset.id }).attributes;
    }).reverse()
  );
  mymodal.ref.modal("hide");

  // grid.load(
  //   _.map(grid.models, ({ id, attributes }) => ({
  //     id,
  //     ...attributes,
  //   }))
  // );

  // $.ajax({
  //   url: $g.render(routes.sort, { resource_id: resource_id }),
  //   type: "POST",
  //   data: {
  //     order: _.map($("#sorter").children(), (item, index) => {
  //       return { id: item.dataset.id, index: index };
  //     }),
  //   },
  //   success: response => {
  //     _.each(response, function (item) {
  //       var temp = grid.find({ id: parseInt(item.id) });
  //       if (typeof temp !== "undefined" && temp.length) {
  //         temp[0].update({ order: item.index }, true);
  //       }
  //     });
  //     toastr.success("", "Order successfully updated");
  //     mymodal.ref.modal("hide");
  //     grid.state.set({ sort: "order", reverse: true });
  //   },
  // });
});
