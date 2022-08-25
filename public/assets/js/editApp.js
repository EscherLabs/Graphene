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
  // $('[href="#scripts"]').toggleClass("isDirty", scriptPage.isDirty);
  // $('[href="#resources"]').toggleClass("isDirty", resource_grid.isDirty);
  // $('[href="#forms"]').toggleClass("isDirty", formsPage.isDirty);
  // $('[href="#styles"]').toggleClass("isDirty", stylesPage.isDirty);
  return (
    templatePage.isDirty ||
    scriptPage.isDirty ||
    resource_grid.isDirty ||
    stylesPage.isDirty ||
    formsPage.isDirty
  );
};

const page = function ({ label, type = "file", name }) {
  let ref;
  switch (type) {
    case "grid":
      break;
    case "files":
      break;
    case "form":
      break;
    default:
  }
  const api = {};

  return api;
};

const pages = function (options) {
  const pages = _.map(options.pages, currentPage => new page(page));
  const api = {};

  Object.defineProperty(api, "isDirty", {
    get: () =>
      templatePage.isDirty ||
      scriptPage.isDirty ||
      resource_grid.isDirty ||
      stylesPage.isDirty ||
      formsPage.isDirty,
  });
  return api;
};

window.onbeforeunload = () => {
  return isDirty()
    ? "You have unsaved changes, are you sure you want to leave?"
    : undefined;
};

attributes = {};
$('[href="/admin/apps"]').parent().addClass("active");

var root = "/api/apps/";
function load(app_version) {
  $(".nav-tabs").stickyTabs();
  $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
    resource_grid.fixStyle();
  });

  loaded.code = $.extend(
    true,
    {
      scripts: [{ name: "Main", content: "", disabled: true }],
      templates: [{ name: "Main", content: "", disabled: true }],
      forms: [
        { name: "Options", content: "", disabled: true },
        { name: "User Options", content: "", disabled: true },
      ],
    },
    app_version
  );

  attributes = $.extend(
    true,
    {},
    { code: { user_preference_form: "", form: "", css: "" } },
    loaded
  );
  $(".navbar-header .nav a h4").html("MicroApp - " + attributes.app.name);

  $("#version").html(attributes.summary || "Working Version");

  new gform(
    {
      actions: [],
      name: "style",
      data: attributes,
      fields: [
        {
          name: "code",
          label: false,
          type: "fieldset",
          fields: [
            { label: false, name: "css", type: "ace", mode: "ace/mode/scss" },
          ],
        },
      ],
    },
    ".styles"
  );

  var tableConfig = {
    entries: [25, 50, 100],
    count: 25,
    autoSize: -20,
    el: ".resources",
    // edit:true,delete:true,add:true
  };

  tableConfig.schema = [
    {
      label: "Name",
      name: "name",
      required: true,
      validate: [
        {
          type: "custom",
          test: function (e) {
            let models = resource_grid.models;
            if (e.form.get("_method") == "edit") {
              models = _.reject(models, e.form.options.model);
            }
            return _.includes(_.map(models, "attributes.name"), e.value)
              ? "Name already used - please choose a unique name"
              : false;
          }.bind(null),
        },
      ],
    },
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
    { label: "Path", name: "path", required: true },
    {
      label: "Fetch",
      type: "checkbox",
      name: "fetch",
      options: [
        { label: "No", value: "false" },
        { label: "Yes", value: "true" },
      ],
    },
    {
      label: "Cache",
      type: "checkbox",
      name: "cache",
      options: [
        { label: "No", value: "false" },
        { label: "Yes", value: "true" },
      ],
    },
  ];
  tableConfig.data = attributes.code.resources;
  if (typeof resource_grid !== "undefined") {
    resource_grid.destroy();
  }
  resource_grid = new $g.grid(tableConfig);

  var temp = $(window).height() - $(".nav-tabs").offset().top - 77;

  $("body").append(
    "<style>.ace_editor { height: " +
      temp +
      "px; }" +
      `.avatar{
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
  }` +
      "</style>"
  );

  // templatePage = new paged('.templates', {name:'templates', items:attributes.code.templates, label:'Template'});
  // scriptPage = new paged('.scripts',{name:'scripts', items:attributes.code.scripts, mode:'ace/mode/javascript', label:'Script'});
  // formPage = new paged('.forms',{name:'forms', items:attributes.code.forms, mode:'ace/mode/javascript', label:'Form',extra: function(item){
  templatePage = new fileManager(".templates", {
    name: "templates",
    items: attributes.code.templates,
    label: "Template",
  });
  scriptPage = new fileManager(".scripts", {
    name: "scripts",
    items: attributes.code.scripts,
    label: "Script",
    mode: "ace/mode/javascript",
  });

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
  formIndex = 0;
  working_forms = _.each(loaded.code.forms, function (form, i) {
    if (typeof form.content == "string") {
      form.content = JSON.parse(form.content || '{"fields":[]}');
      if (_.isArray(form.content) && form.content.length) {
        form.content = { fields: [] };
      }
    }
    form.content.name = form.name || form.content.name;
    form.i = i + "";
    form.label = form.content.legend || form.content.name;
  });
  setupform();
}
var formsPage = {
  toJSON: function () {
    return _.map(working_forms, function (original_form) {
      var form = JSON.parse(JSON.stringify(original_form));
      if (typeof form.content == "object") {
        form.content = JSON.stringify(form.content);
      }
      return _.omit(form, "i");
    });
  },
};
Object.defineProperty(formsPage, "isDirty", {
  get: () => !_.isEqual(formsPage.toJSON(), attributes.code.forms),
});

var stylesPage = {
  toJSON: function () {
    return $g.forms.style.get().code.css;
  },
};
Object.defineProperty(stylesPage, "isDirty", {
  get: () => !_.isEqual(attributes.code.css, stylesPage.toJSON()),
});

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

  //   if(typeof cb === 'undefined'){
  //     if(typeof form === 'string'){
  //       form = JSON.parse(form || '{}');
  //     }
  //     form = form || {};
  //     $('#myModal').remove();
  //     this.onSave = onSave;
  //     this.ref = $(templates.modal.render({title: 'Form Editor: '+ name}));
  //     $(this.ref).appendTo('body');
  //     this.ref.find('.modal-body').html(templates.formEditor.render());
  //     this.ref.find('.modal-footer').html('<div id="saveForm" class="btn btn-success"><i class="fa fa-check"></i> Save</div>');
  //     this.ref.on('hide.bs.modal', function(){
  //       cb.destroy();
  //       delete cb;
  //     });
  //     this.ref.find('#saveForm').on('click', function(){
  //       this.onSave.call(this)
  //       this.ref.modal('hide');

  //     }.bind(this))
  //     this.ref.modal({backdrop: 'static'});

  //     cb = new Cobler({formOptions:{inline:true},formTarget:$('#form'), disabled: false, targets: [document.getElementById('editor')],items:[[]]});
  //     $('.modal #form').keydown(function(event) {
  //       switch(event.keyCode) {
  //         case 27://escape
  //             event.stopPropagation();
  //             cb.deactivate();
  //             return false;
  //           break;
  //       }
  //     });
  //     list = document.getElementById('sortableList');
  //     cb.addSource(list);
  //     cb.on('activate', function(){
  //       if(list.className.indexOf('hidden') == -1){
  //         list.className += ' hidden';
  //       }
  //       $('#form').removeClass('hidden');
  //     })
  //     cb.on('deactivate', function(){
  //       list.className = list.className.replace('hidden', '');
  //       $('#form').addClass('hidden');
  //     })
  //     document.getElementById('sortableList').addEventListener('click', function(e) {
  //       cb.collections[0].addItem(e.target.dataset.type);
  //     })
  //   }

  //   if(typeof form !== 'undefined'){
  //     var temp = $.extend(true, {}, form);
  //     for(var i in temp.fields){

  //       temp.fields[i] = Berry.normalizeItem(temp.fields[i], i);
  //       switch(temp.fields[i].type) {
  //         case "select":
  //         case "radio":
  //           temp.fields[i].widgetType = 'select';
  //           break;
  //         case "checkbox":
  //           temp.fields[i].widgetType = 'checkbox';
  //           break;
  //         default:
  //           temp.fields[i].widgetType = 'textbox';
  //       }

  //     }

  //     list.className = list.className.replace('hidden', '');
  //     cb.collections[0].load(temp.fields);
  //   }
  // }

  // $("#save").on("click", function () {
  template_errors = templatePage.errors();
  script_errors = scriptPage.errors();
  var data = { code: {} };

  data.code.css = stylesPage.toJSON();
  data.code.resources = resource_grid.toJSON();
  data.code.templates = templatePage.toJSON();

  try {
    _.each(data.code.templates, function (partial) {
      try {
        Ractive.parse(partial.content);
      } catch (e) {
        template_errors.push({
          type: e.name,
          name: partial.name,
          message: e.message,
        });
      }
    });
  } catch (e) {
    toastr.error(e.message, e.name);
    return false;
  }
  var errorCount = template_errors.length + script_errors.length; //+ css_errors.length

  if (!errorCount) {
    data.code.scripts = scriptPage.toJSON();
    data.code.forms = _.map(working_forms, function (original_form) {
      var form = JSON.parse(JSON.stringify(original_form));
      if (typeof form.content == "object") {
        form.content = JSON.stringify(form.content);
      }
      return _.omit(form, "i");
    });
    // data.code.forms = formsPage.toJSON();

    data.updated_at = attributes.updated_at;

    $.ajax({
      url: root + attributes.app_id + "/code",
      method: "put",
      data: data,
      success: function (e) {
        templatePage.items = e.code.templates;
        scriptPage.items = e.code.scripts;
        resource_grid.items = e.code.resources;

        //sync style
        attributes.code.css = e.code.css;

        //sync forms
        attributes.code.forms = e.code.forms;

        attributes.updated_at = e.updated_at;
        loadInstances();
        toastr.success("", "Successfully Saved");
        isDirty();
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
          conflictResults.sources =
            JSON.stringify(test.sources) !== JSON.stringify(this.model.sources);
          conflictResults.css =
            JSON.stringify(test.css) !== JSON.stringify(this.model.css);
          conflictResults.options =
            JSON.stringify(test.options) !== JSON.stringify(this.model.options);
          conflictResults.scripts =
            JSON.stringify(test.script) !== JSON.stringify(this.model.script);
          conflictResults.template =
            JSON.stringify(test.template) !==
            JSON.stringify(this.model.template);
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
    legend: '<i class="fa fa-cube"></i> Update Microapp',
    fields: [{ label: "Descriptor", type: "textarea" }],
  })
    .on("save", e => {
      $.ajax({
        url: root + attributes.app_id + "/code",
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
    legend: '<i class="fa fa-cube"></i> Publish Microapp',
    fields: [
      { label: "Summary", required: true },
      { label: "Description", type: "textarea" },
    ],
  })
    .on("save", e => {
      if (e.form.validate()) {
        $.ajax({
          url: root + attributes.app_id + "/publish",
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
    .on("cancel", e => {
      e.form.trigger("close");
    })
    .modal();
});

loadInstances = function () {
  $.get("/api/appinstances?app_id=" + loaded.app_id, function (app_instances) {
    if (app_instances.length > 0) {
      // viewTemplate = Hogan.compile();

      // modal({title: 'This App has the following instances', content: viewTemplate.render({items: data})});

      app_instances = _.map(app_instances, function (instance) {
        instance.options = _.each(instance.options, function (option, i) {
          return { key: i, value: option };
        });
        instance.user_options_default = _.map(
          instance.options,
          function (user_option, i) {
            return { key: i, value: user_option };
          }
        );
        if (instance.version !== null) {
          instance.resources = _.map(
            instance.resources,
            function (instance, resource, i) {
              // var group = _.find(loaded.group_admins,{group_id:instance.group_id})
              // if(typeof group !== 'undefined'){
              resource.endpoint = _.find(instance.group.endpoints, {
                id: parseInt(resource.endpoint),
              });
              // }

              resource.resource = _.find(instance.version.resources, {
                name: resource.name,
              });
              return resource;
            }.bind(null, instance)
          );
        }
        instance.version_summary =
          instance.version.summary || "Working Version";

        instance.version_id =
          instance.app_version_id !== null
            ? instance.app_version_id == 0
              ? "Latest Published"
              : instance.version.summary + " (" + instance.app_version_id + ")"
            : "Latest Saved";

        instance.error =
          !!_.difference(
            _.pluck(instance.version.resources, "name"),
            _.pluck(instance.resources, "name")
          ).length ||
          !!_.difference(
            _.pluck(instance.resources, "name"),
            _.pluck(instance.version.resources, "name")
          ).length;
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
      <style>.appInstance{
        color: #ddd;
        text-decoration: none;
        border:solid 1px #333;
        border-width:1px 0;
        cursor: pointer;
        background: #666;
        padding: 5px;
        position:relative;
      }
      .appInstance  #dLabel{
        color: #ddd;
      }
      .appInstance .fa-warning.text-danger{
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
      {{#app_instances}}
      <div class="appInstance">
        {{#error}}<a href="/admin/appinstances/{{id}}" target="_blank" class="fa fa-warning text-danger"></a>{{/error}}
        <div class="btn-group parent-hover" style="position: absolute;right: 2px;top:2px">
        <a class="btn btn-xs btn-default" target="_blank" href="/app/{{group_id}}/{{slug}}"><i class="fa fa-external-link"></i></a>
        <a class="btn btn-xs btn-default" href="/admin/appinstances/{{id}}"><i class="fa fa-pencil"></i></a>
      </div>
        <div data-appID={{id}}>
        
        <div style="overflow:hidden">
          {{group.name}}

        </div> 
        <div> <i class="pull-right fa {{#app_version_id}}fa-lock{{/app_version_id}} {{^app_version_id}}fa-lock-{{app_version_id}}{{/app_version_id}}" style="padding-top:3px"></i> {{name}}</div>
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
        
      {{/app_instances}}
      {{^app_instances}}
      <div class="appInstance">No instances</div>
      {{/app_instances}}</div>`,
          { app_instances: app_instances }
        )
      )
    );
    $("#instances").on(
      "click",
      "[data-appID]",
      function (app_instances, e) {
        var temp = _.find(app_instances, {
          id: parseInt(e.currentTarget.dataset.appid),
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
              <dd>{{version_summary}}<p class="text-muted">{{description}}</p></dd>
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
            </dl>
          </div>
    
          <div style="overflow:scroll">
            <p class="text-muted">{{version.description}}</p>
            {{#resources.length}}
              <div style="border-top:solid 1px #aaa;margin:5px 0;font-size:16px;font-weithg:bold">Resources Map</div>
            
              <dl class="dl-horizontal">
              {{#resources}}
              <dt>{{name}}:</dt><dd class="text-muted">{{{endpoint.config.url}}}{{{resource.path}}}</dd>
              {{/resources}}
              </dl>
            {{/resources.length}}
  
            {{#options.length}}                
              <div style="border-top:solid 1px #aaa;margin:5px 0;font-size:16px;font-weithg:bold">Admin Options</div>            
              <dl class="dl-horizontal">
              {{#options}}
              <dt>{{key}}:</dt><dd class="text-muted">{{value}}</dd>
              {{/options}}
              </dl>               
            {{/options.length}}

            {{#user_options_default.length}}               
              <div style="border-top:solid 1px #aaa;margin:5px 0;font-size:16px;font-weithg:bold">Default User Options</div>            
              <dl class="dl-horizontal">
              {{#user_options_default}}
              <dt>{{key}}:</dt><dd class="text-muted">{{value}}</dd>
              {{/user_options_default}}
              </dl>               
            {{/user_options_default.length}}

          </div>
        </div>`,
            temp
          ),
        });
      }.bind(null, app_instances)
    );
  });

  // $('#instances').on('click', function() {
  //   viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a href="/app/{{group_id}}/{{slug}}" rel=”noopener noreferrer” target="_blank">{{name}}</a><a class="btn btn-warning" style="position: absolute;top: 3px;right: 3px;" href="/admin/appinstances/{{id}}" target="_blank"><i class="fa fa-pencil"></i></a></div>{{/items}}</div>');
  //   $.get('/api/appinstances?app_id=' + loaded.app_id, function(data) {
  //     if(data.length > 0){
  //       modal({title: 'This App has the following instances', content: viewTemplate.render({items: data})});
  //     }else{
  //       modal({title: 'No instances Found', content: 'This App is not currently instantiated.'});
  //     }
  //   })
  // });
};
loadInstances();
$("#versions").on("click", function () {
  $.ajax({
    url: root + loaded.app_id + "/versions",
    success: function (versions) {
      if (!orig.stable) {
        versions.unshift({ ...orig, summary: "Working Version" });
      }
      versions.forEach($g.formatDates);
      versions.forEach(version => {
        // version.live = !(version.stable == 0);
        version.label = $g.render(
          "{{updated_at.date}} - {{summary}} ({{user.last_name}})",
          version
        );
        version.user = version.user || { first_name: "-", last_name: "-" };
        version.initials =
          version.user.first_name[0] + version.user.last_name[0];
      });
      let versionList = $g.render(
        `<div class="list-group" >
        {{#versions}}
        <a href="?v={{id}}" target="_blank" class="list-group-item {{#stable}}list-group-item-warning{{/stable}}" >
          {{#stable}}<span class="pull-right"><i class="fa fa-lock fa-lg"></i></span>{{/stable}}

          <!--div class="btn-group parent-hover hidden" style="position: absolute;right: 15px;bottom:5px">
            <div class="btn btn-default" data-id="{{id}}" data-click="download"><i class="fa fa-download"></i></div>
            <a class="btn btn-default" target="_blank" href="?v={{id}}"><i class="fa fa-eye"></i></a>
          </div-->
          <div style="display:flex;">
            <div class="avatar" title="" data-toggle="tooltip" data-placement="top" style="background:" data-original-title="{{user.first_name}} {{user.last_name}}">{{initials}}</div>
            <span style="padding-left:15px;flex-grow: 1;">
              <b>{{summary}}</b>
              <p>{{description}}</p>
              <div style=""><span>{{#stable}}<i class="fa fa-calendar-check-o"></i> {{/stable}}{{updated_at.date}}</span></div>
            </span>
          </div>
        </a> {{/versions}}
      </div>`,
        { versions }
      );
      $g.modal({ content: versionList, title: "Versions" });
      $('[data-toggle="tooltip"]').tooltip();

      _.each(document.querySelectorAll("[data-click]"), el => {
        el.addEventListener("click", e => {
          let { id, click } = e.currentTarget.dataset;
          if (click == "download") {
            $.ajax({
              url: "/api/apps/" + attributes.app_id + "/versions/" + id,
              method: "get",
              success: function (version) {
                let title = "version_" + id;
                var link = document.createElement("a");
                link.setAttribute(
                  "href",
                  "data:application/json;charset=utf-8," +
                    encodeURIComponent(JSON.stringify(version))
                  // "data:text/txt;charset=utf-8," + encodeURIComponent(JSON.stringify(version))
                );
                link.setAttribute("download", (title || "version") + ".json");
                document.body.appendChild(link); // Required for FF
                link.click();
                document.body.removeChild(link);
              },
            });
          }
        });
      });

      console.table(versions);
      // new gform({
      //   actions: [{ type: "cancel" }, { type: "save", label: "Switch" }],
      //   name: "modal",
      //   data: { app_version_id: loaded.id },
      //   legend: "Select Version",
      //   fields: [
      //     {
      //       label: "Version",
      //       name: "app_version_id",
      //       options: versions,
      //       type: "select",
      //       format: {
      //         label: "{{label}}",
      //         value: version => version.id,
      //       },
      //     },
      //   ],
      // })
      //   .on("save", e => {
      //     // switch version
      //     e.form.trigger("close");

      //     $.ajax({
      //       url:
      //         root +
      //         attributes.app_id +
      //         "/versions/" +
      //         e.form.get("app_version_id"),
      //       method: "get",
      //       success: function (version) {
      //         version.app = loaded.app;
      //         loaded = version;
      //         load(loaded.code);
      //       },
      //     });
      //   })
      //   .on("cancel", e => {
      //     e.form.trigger("close");
      //   })
      //   .modal();
    },
  });
});

renderBuilder = function () {
  var target = document.querySelector(".target");
  $(target).html(
    '<div data-map="" style="padding:15px;width: 100%;text-overflow: ellipsis;overflow: hidden;" class="btn btn-default">' +
      working_forms[formIndex].label +
      "</div>"
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
      working_forms[formIndex].content = myform;
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
    //   // var mapOptions = new gform.mapOptions(temp.fields[i],undefined,0,gform.collections)
    //   // temp.fields[i].options = mapOptions.getobject()
    //   switch(temp.fields[i].type) {
    //     case "select":
    //     case "radio":
    //     case "scale":
    //     case "range":
    //     // case "grid":
    //     case "user":
    //     case "user_email":
    //     case "group":
    //     case "groups":
    //     case "combobox":
    //       temp.fields[i].widgetType = 'collection';
    //       break;
    //     case "checkbox":
    //     case "switch":
    //       temp.fields[i].widgetType = 'bool';
    //       break;
    //     case "fieldset":
    //     case "table":
    //     case "template":
    //     case "grid":
    //       temp.fields[i].widgetType = 'section';
    //       break;
    //     default:
    //       temp.fields[i].widgetType = 'input';
    //   }
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
          { name: "legend", label: "Label", columns: 6 },
          {
            name: "name",
            label: "Name",
            columns: 6,
            edit: false,
            // edit: [{ type: "matches", name: "disabled", value: false }],
          },
          {
            name: "autoFocus",
            horizontal: true,
            columns: 12,
            label: "Auto Focus",
            value: true,
            type: "switch",
            format: { label: "" },
          },

          {
            name: "default",
            label: false,
            columns: 12,
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
            name: "disabled",
            show: false,
            label: false,
            type: "checkbox",
            value: (
              _.find(working_forms, { name: form.name }) || { disabled: false }
            ).disabled,
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
            type: "switch",
            format: { label: "" },
            horizontal: true,
            label: "Custom Actions",
            name: "actions",
            parse: [{ value: true, type: "matches" }],
          },
          {
            type: "fieldset",
            columns: 12,
            array: true,
            label: false,
            name: "actions",
            show: [{ name: "actions", value: true, type: "matches" }],
            fields: [
              {
                name: "type",
                columns: 6,
                label: "Type",
                type: "combobox",
                options: ["cancel", "save", "button"],
                parse: [{ type: "requires" }],
              },
              // {name:"name",columns:6,label:"Name"},
              {
                name: "action",
                columns: 6,
                label: "Action",
                parse: [{ type: "requires" }],
              },
              {
                name: "label",
                columns: 6,
                label: "Label",
                parse: [{ type: "requires" }],
              },
              {
                name: "modifiers",
                columns: 6,
                label: "Classes",
                parse: [{ type: "requires" }],
                type: "combobox",
                options: [
                  { label: "Danger", value: "btn btn-danger" },
                  { label: "Success", value: "btn btn-success" },
                  { label: "Info", value: "btn btn-info" },
                ],
              },
            ],
            parse: [{ name: "actions", value: true, type: "matches" }],
          },
          {
            type: "switch",
            format: { label: "" },
            parse: [{ value: true, type: "matches" }],
            horizontal: true,
            label: "Events",
            name: "events",
          },

          {
            parse: false,
            type: "output",
            label: false,
            value: "<h3>Events</h3>",
            show: [{ name: "events", value: true, type: "matches" }],
          },

          {
            type: "fieldset",
            show: [{ name: "events", value: true, type: "matches" }],
            parse: [{ name: "events", value: true, type: "matches" }],
            label: false,
            name: "events",
            array: { max: 100 },
            fields: [
              {
                type: "text",
                label: "Event",
                name: "event",
                parse: [{ type: "requires" }],
                target: "#collapseEvents .panel-body",
              },

              {
                type: "text",
                label: "Method",
                name: "handler",
                target: "#collapseEvents .panel-body", //,
                // options:[
                //   "None",{type:'optgroup',options:'methods',format:{label:"Method: {{label}}"}}]
                parse: [{ name: "event", value: "", type: "not_matches" }],
              },
            ],
          },
          {
            target: "#display",
            columns: 9,
            type: "button",
            modifiers: "btn btn-danger pull-right margin-bottom",
            label: '<i class="fa fa-times"></i> Delete Form',
            action: "delete",
            name: "delete",
            show: [{ type: "matches", name: "disabled", value: false }],
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
          var temp = e.form.get();
          temp.fields = form.fields || [];

          // if(typeof temp.actions !== 'undefined' && temp.actions.length == 1 && _.isEmpty(temp.actions[0])){
          //   delete temp.actions;
          // }
          // if(typeof temp.events !== 'undefined' && temp.events.length == 1 && _.isEmpty(temp.events[0])){
          //   delete temp.events;
          // }
          myform = temp;
          form = myform;
          working_forms[formIndex].content = myform;

          // form = _.extend(form,e.form.get());
          // if(typeof e.form.get().actions == 'undefined'){
          //   delete form.actions;
          // }
          // if(typeof e.field !== 'undefined' && e.field.name == 'horizontal'){
          //   renderBuilder()
          // }
        })
      )
      .on("input:horizontal", function () {})
      .on("input:name input:legend", function (e) {
        working_forms[formIndex].content.name = e.form.get("name");
        working_forms[formIndex].content.legend = e.form.get("legend");
        working_forms[formIndex].name = e.form.get("name");
        working_forms[formIndex].label =
          working_forms[formIndex].content.legend ||
          working_forms[formIndex].content.name;
        // setupform(formIndex);
        myform = working_forms[formIndex].content || {};
        $("#formlist").html(
          gform.renderString(
            `<div class="btn-group">
            <button type="button" class="btn btn-info go pages_new">New Form</span></button>
            <button type="button" class="btn btn-primary rename_form">Rename Form</span></button>

            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class=""> Select Form</span> <span class="caret"></span>
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
            {{#forms}}
              <li><a href="javascript:void(0);" data-index="{{i}}" class="form_edit" >{{label}}</a></li>
            {{/forms}}
            </ul>
            </div>
          `,
            { forms: working_forms }
          )
        );
        var target = document.querySelector(".target");
        $(target).html(
          '<div data-map="" style="padding:15px;width: 100%;text-overflow: ellipsis;overflow: hidden;" class="btn btn-default">' +
            working_forms[formIndex].label +
            "</div>"
        );
        target.querySelectorAll(".btn-default")[
          target.querySelectorAll(".btn-default").length - 1
        ].style.border = "solid 2px #d85e16";
      })
      .on("delete", function (e) {
        if (
          confirm(
            "Are you sure you want to delete the form: '" +
              working_forms[formIndex].label +
              "'?"
          )
        ) {
          working_forms.splice(formIndex, 1);
          working_forms = _.map(working_forms, function (form, i) {
            form.i = i + "";
            return form;
          });
          setupform(0);
        }
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
    ).on("change", function (e) {
      // form = _.extend(form,e.form.get())
      var workingForm = myform;
      _.each(path, function (p) {
        workingForm = _.find(workingForm.fields, { name: p });
      });

      _.extend(workingForm, e.form.get());
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

setupform = function (index) {
  formIndex = typeof index !== "undefined" ? index : formIndex;
  myform = working_forms[formIndex].content || {};
  $("#formlist").html(
    gform.renderString(
      `<div class="btn-group">
        <button type="button" class="btn btn-info go pages_new">New Form</span></button>
        <button type="button" class="btn btn-primary rename_form">Rename</span></button>

        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span class=""> Select Form</span> <span class="caret"></span>
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-right">
        {{#forms}}
          <li><a href="javascript:void(0);" data-index="{{i}}" class="form_edit" >{{label}}</a></li>
        {{/forms}}
        </ul>
        </div>
      `,
      { forms: working_forms }
    )
  );

  // $('#cobler').click();
  path = [];

  renderBuilder();
};

document.addEventListener("DOMContentLoaded", function () {
  // myform = JSON.parse(($.jStorage.get('form') || "{}"));

  // working_forms = _.each(working_forms,function(form,i){
  //   form.content = JSON.parse(form.content);
  //   form.content.name = form.name || form.content.name;
  //   form.i = i+'';
  //   form.label = form.content.legend||form.content.name;
  // })
  $("#formlist").on("click", ".form_edit", function (e) {
    setupform(parseInt(e.target.dataset.index));
  });
  $("#formlist").on("click", ".rename_form", function (e) {
    if (working_forms[formIndex].disabled) return;
    new gform({
      name: "renameform",
      legend: "Rename Form",
      fields: [{ name: "name", label: "Form Name" }],
      data: working_forms[formIndex],
    })
      .on("save", function (e) {
        debugger;
        let el = gform.instances.editor.find("name");
        el.set(e.form.get("name"));
        el.trigger("input", el);
        e.form.trigger("close");
      })
      .on("cancel", function () {
        e.form.trigger("close");
      })
      .modal();
  });

  $("#formlist").on("click", ".pages_new", function (e) {
    new gform({
      name: "page_name",
      legend: "New Form",
      fields: [{ label: "Name" }],
      actions: [
        { type: "cancel" },
        { type: "save", label: '<i class="fa fa-check"></i> Create' },
      ],
    })
      .on("save", function (e) {
        // this.add(e.form.get().name,'')
        working_forms.push({
          name: e.form.get().name,
          content: { name: e.form.get().name },
          i: working_forms.length + "",
          label: e.form.get().name,
        });
        setupform(working_forms.length - 1);
        e.form.dispatch("close");
      })
      .on("cancel", function (e) {
        e.form.dispatch("close");
      })
      .modal();
  });
  $(".viewform").on("click", function (e) {
    new gform(_.extend({}, myform, { name: "modal" }))
      .modal()
      .on("cancel", function (e) {
        e.form.trigger("close");
      });
  });
  $(".edit").on("click", function (e) {
    new gform({
      actions: [
        { type: "cancel" },
        { type: "save", label: '<i class="fa fa-check"></i> Update' },
      ],
      legend: "Edit Form",
      fields: [
        { type: "textarea", name: "descriptor", label: false, size: 25 },
      ],
      data: { descriptor: JSON.stringify(myform, null, "\t") },
    })
      .modal()
      .on("save", function (e) {
        myform = JSON.parse(e.form.get("descriptor"));
        working_forms[formIndex].content = JSON.parse(e.form.get("descriptor"));
        e.form.trigger("close");
        renderBuilder();
      })
      .on("cancel", function (e) {
        e.form.trigger("close");
      });
  });
  // setupform(formIndex);
});
$(document).ready(function () {
  load(loaded.code);
  orig = $.extend({}, loaded);
});
