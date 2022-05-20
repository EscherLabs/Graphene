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

attributes = {};
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
          array: {
            min: 0,
            max: 100,
          },
          type: "fieldset",
          fields: [
            // "database": {}
            // {label: false, name:'database',type:'select', required: true,choices:'/api/proxy/databases',label_key:'name',value_key:'id'}
            { label: "Name", name: "name", required: false, columns: 6 },
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
        options: ["ALL", "GET", "POST", "PUT", "DELETE"],
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
        array: { max: 100 },
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
        array: { max: 100 },
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
          this.update(e.form.get());
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
          this.update(e.form.get());
          e.form.dispatch("close");
        }.bind(e.model)
      )
      .on("cancel", function (e) {
        e.form.dispatch("close");
      })
      .modal();
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
}
load(loaded);
orig = $.extend({}, loaded);

$(document).keydown(function (e) {
  if ((e.which == "115" || e.which == "83") && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    $("#save").click();
  }
  return true;
});

$("#save").on("click", function () {
  script_errors = filepage.errors();
  script_errors += functionpage.errors();
  var data = attributes;
  data.routes = grid.toJSON();
  data.resources = gform.instances.resources.get().resources;
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
      if (!orig.stable) {
        data.unshift({ id: orig.id, summary: "Working Version" });
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
