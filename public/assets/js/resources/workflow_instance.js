$(".navbar-header .nav a h4").html("Workflow Instance");
$('[href="/admin/workflowinstances"]').parent().addClass("active");
document.body.appendChild(
  gform.create(`<style>

[data-type="switch"]{
  border-top: solid 1px #fff;
  padding: 15px 0;
  display: flex;
  grid-auto-flow: column;
  justify-content: start;

}
[data-type="switch"] > label.control-label.col-md-4 {

  flex-grow:1;
}

[data-type="switch"] > label.control-label.col-md-4 div{
  font-size: small;
  opacity: .8;
  margin-top: 3px;
}


[data-type="switch"] > div.col-md-8 {
  width: auto;
  flex-shrink:0;
  margin: auto !important;
}
  </style>`)
);
root = "/api/workflowinstances/" + resource_id;

$g.getData(
  [root, "/assets/data/icons.json", "/api/groups/" + group.id + "/endpoints"],
  (workflowinstance, icons, endpoints) => {
    $(".navbar-header .nav a h4").append(
      " - " + workflowinstance.workflow.name + ""
    );
    workflowinstance.configuration = workflowinstance.configuration || {};
    const {
      configuration = {},
      workflow = {},
      version = {},
    } = workflowinstance;
    const { map = [], resources = [] } = workflow.code;
    $.ajax({
      url: "/api/workflows/" + workflowinstance.workflow_id + "/versions",
      success: function (versions) {
        versions.forEach($g.formatDates);

        $("#table").html(templates.workflow_instance.render(workflowinstance));
        viewTemplate =
          '<div class="list-group">{{#items}}<div class="list-group-item"><a target="_blank" href="/page/{{group.slug}}/{{slug}}">{{name}}</a></div>{{/items}}</div>';

        $("#find").on("click", function () {
          $.get(root + "/pages", pages => {
            if (pages.length > 0) {
              modal({
                title:
                  "This Workflow Instance was found on the following pages",
                content: $g.render(viewTemplate, { items: pages }),
              });
            } else {
              modal({
                title: "No pages Found",
                content:
                  "This Workflow Instance is not currently placed on any pages.",
              });
            }
          });
        });

        $("body").on("click", "#version", function () {
          new gform({
            name: "versionForm",
            data: workflowinstance,
            legend: "Select Version",
            fields: [
              {
                label: "Version",
                name: "workflow_version_id",
                required: true,
                options: [
                  { id: null, label: "Latest (Working or Published)" },
                  ...(versions.length
                    ? [{ id: 0, label: "Latest Published" }]
                    : []),
                  ...versions,
                ],
                type: "select",
                format: {
                  value: version => version.id,
                  label:
                    "{{label}}{{^label}}{{updated_at.date}} - {{summary}} ({{user.last_name}}){{/label}}",
                },
              },
            ],
          })
            .on("save", e => {
              $.ajax({
                url: root,
                type: "PUT",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(e.form.get()),
                success: () => {
                  window.location.reload();
                },
                error: e => {
                  toastr.error(e.statusText, "ERROR");
                },
              });
            })
            .on("cancel", e => {
              e.form.trigger("close");
            })
            .modal();
        });

        new gform(
          {
            fields: [
              { name: "group_id", required: true, type: "hidden" },
              {
                label: "Version",
                name: "workflow_version_id",
                edit: false,
                options: [
                  { id: null, label: "Latest (Working or Published)" },
                  ...(versions.length
                    ? [{ id: 0, label: "Latest Published" }]
                    : []),
                  ...versions,
                ],
                type: "select",
                format: {
                  value: version => version.id,
                  label:
                    "{{label}}{{^label}}{{updated_at.date}} - {{summary}} ({{user.last_name}}){{/label}}",
                },
                post: '<i class="fa fa-pencil" id="version"></i>',
              },
              ...fieldLibrary.content,
              { name: "workflow_id", required: true, type: "hidden" },
              { name: "id", type: "hidden" },
            ],
            data: workflowinstance,
            actions: [],
            name: "main",
          },
          "#main .col-sm-9"
        );

        var valueField = {
          columns: 8,
          name: "value",
          label: "Value",
          title: 'Value <span class="text-success pull-right">{{value}}</span>',
        };
        var flagField = {
          columns: 12,
          horizontal: true,
          inline: true,
          forceRow: true,
          type: "switch",
          options: [
            { label: "Off", value: false },
            { label: "On", value: true },
          ],
        };

        r_options = {
          name: "map",
          data: {
            // suppress_emails:configuration.suppress_emails,
            // suppress_email_tasks:configuration.suppress_email_tasks,
            // default_email_options:configuration.default_email_options,
            // encrypted:configuration.encrypted,
            // initial:configuration.initial,
            // title:configuration.title,
            ...configuration,
            map: _.map(map, function (resource) {
              var r = _.find(configuration.map, { name: resource.name });
              if (typeof r !== "undefined" && r.type == resource.type) {
                resource.value = r.value;
              }
              return resource;
            }),
          },
          actions: [],
          fields: [
            {
              columns: 4,
              name: "initial",
              label: "Initial State",
              options: _.pluck(version.code.flow, "name"),
              type: "combobox",
            },
            {
              columns: 4,
              name: "title",
              label: "Default Submission Title",
              placeholder: workflow.name,
            },
            {
              columns: 4,
              name: "template",
              label: "Template",
              type: "combobox",
              options: "/admin/sites/" + workflow.site_id + "/templates",
              value: "main",
            },
            {
              columns: 12,
              name: "instructions",
              label: "Instructions",
              type: "textarea",
              placeholder: "Instructions to help filling out the form",
            },
            {
              ...flagField,
              name: "encrypted",
              title: `Encrypt Data at Rest
							{{#value}}<div class="text-danger">Data will be encrypted at rest</div>{{/value}}
							{{^value}}<div class="text-success">Data will NOT be encrypted at rest</div>{{/value}}`,
            },
            {
              ...flagField,
              name: "allow_multiple_new",
              value: false,
              title: `Allow Multiple submissions in initial state
							{{#value}}<div class="text-success">Multiple Submissions will be allowed in initial state</div>{{/value}}
							{{^value}}<div class="text-danger">Only one Submission can be unsubmitted at a time</div>{{/value}}`,
            },
            {
              ...flagField,
              name: "display_required_list",
              value: false,
              title: `Display the Required List Summary
						<div>Will {{^value}}<span class="text-danger">not </span>{{/value}}be Shown</div>`,
            },
            {
              ...flagField,
              name: "display_error_list",
              value: false,
              title: `Display the Error List Summary
							<div>Will {{^value}}<span class="text-danger">not </span>{{/value}}be Shown</div>`,
            },
            {
              ...flagField,
              name: "suppress_email_tasks",
              title: `Suppress Email Tasks
							{{#value}}<div class="text-danger">Custom emails (from email "Tasks") will not be sent</div>{{/value}}
							{{^value}}<div class="text-success">Custom emails (from email "Tasks") will be sent</div>{{/value}}`,
            },
            {
              ...flagField,
              name: "suppress_emails",
              title: `Suppress Default Emails
							{{#value}}<div class="text-danger">Default emails will not be sent</div>{{/value}}
							{{^value}}<div class="text-success">Default emails will be sent</div>{{/value}}`,
            },
            {
              type: "radio",
              name: "default_email_options",
              label: "Default Email Options",
              horizontal: true,
              multiple: true,
              columns: 10,
              showColumn: true,
              show: [
                { name: "suppress_emails", type: "matches", value: false },
              ],
              parse: "show",
              value: [
                "notify_owner_open",
                "notify_owner_closed",
                "notify_asignee",
              ],
              options: [
                {
                  label: "",
                  type: "optgroup",
                  options: [
                    {
                      label:
                        "Notify Owner of transition from 'initial' to 'open' status (on original submit)",
                      value: "notify_owner_open",
                    },
                    {
                      label:
                        "Notify Owner of transition from 'open' to 'closed' status",
                      value: "notify_owner_closed",
                    },
                    {
                      label: "Notify Owner of <i>All</i> Actions",
                      value: "notify_owner_all",
                    },
                    {
                      label: "Notify Assignee(s) of Assignment",
                      value: "notify_asignee",
                    },
                    {
                      label: "Notify Actors of their own actions",
                      value: "notify_actor",
                    },
                  ],
                },
              ],
            },
            {
              target: () => document.querySelector("#datamap .col-sm-9"),
              name: "map",
              label: false,
              edit: !!map.length,
              array: {
                target: "#datamap .col-sm-9",
                min: map.length,
                max: map.length,
              },
              type: "fieldset",
              fields: [
                {
                  name: "name",
                  label: false,
                  columns: 8,
                  type: "output",
                  parse: true,
                  format: {
                    value:
                      '<h4>{{value}} <span class="text-muted pull-right">({{parent.initialValue.type}})</span></h4>',
                  },
                },

                { columns: 0, name: "type", label: false, edit: false },

                {
                  ...valueField,
                  show: [{ value: "string", type: "matches", name: "type" }],
                },
                {
                  ...valueField,
                  show: [{ value: "user", type: "matches", name: "type" }],
                  type: "user",
                },
                {
                  ...valueField,
                  show: [{ value: "email", type: "matches", name: "type" }],
                  type: "user_email",
                },
                {
                  ...valueField,
                  show: [{ value: "group", type: "matches", name: "type" }],
                  type: "group",
                },
                {
                  ...valueField,
                  show: [{ value: "date", type: "matches", name: "type" }],
                  type: "date",
                },
                {
                  ...valueField,
                  show: [{ value: "endpoint", type: "matches", name: "type" }],
                  type: "select",
                  options: "endpoints",
                  format: { label: "{{name}}", value: "{{id}}" },
                },
              ],
            },
          ],
        };
        new gform(r_options, "#config .col-sm-9");

        if (
          typeof workflow.code.map !== "undefined" &&
          workflow.code.map.length
        ) {
          $("#datamaptab").show();
        }
        if (resources.length && resources[0].name !== "") {
          $("#resourcestab").show();
          new gform(
            {
              fields: [
                {
                  name: "resources",
                  label: false,
                  type: "fieldset",
                  array: { min: 0, max: 100, duplicate: false, remove: false },
                  fields: [
                    { label: false, name: "name", columns: 0, type: "hidden" },
                    { name: "endpoint", type: "endpoint", required: true },
                  ],
                },
              ],
              name: "resources",
              actions: [],
              data: {
                resources: resources.map(resource => {
                  return {
                    ...resource,
                    endpoint: (
                      (workflowinstance.configuration.resources || []).find(
                        r => r.name == resource.name
                      ) || { enpoint: "none" }
                    ).endpoint,
                  };
                }),
              },
            },
            "#resources .col-sm-9"
          ).on("input:endpoint", function (e) {
            let endpoint = $g.collections
              .get("endpoints")
              .find(endpoint => endpoint.id == e.field.value);
            let help =
              typeof endpoint !== "undefined" ? endpoint.config.url : "";
            let resource = resources.find(
              resource => (resource.name = e.field.parent.get("name"))
            );

            help += typeof resource !== "undefined" ? resource.path : "";

            if (e.field.help !== help) {
              e.field.update({ help: help }, true);
              e.field.focus();
            }
          });
        }

        $("#save").on("click", function () {
          if (!$g.forms.main.validate()) {
            $g.alert({ status: "error", content: "Check Configuration" });
            return;
          }

          var item = {
            ...$g.forms.main.get(),
            configuration: $g.forms.map.get(),
          };
          if (typeof $g.forms.resources !== "undefined") {
            if (!$g.forms.resources.validate()) {
              $g.alert({ status: "error", content: "Check Resources" });
              return;
            }
            item.configuration.resources = $g.forms.resources.get().resources;
          }
          $.ajax({
            url: root,
            type: "PUT",
            dataType: "json",
            contentType: "application/json",
            // data: JSON.stringify(data),
            data: JSON.stringify(item),
            success: () => {
              toastr.success("", "Successfully updated Workflow Instance");
            },
            error: e => {
              toastr.error(e.statusText, "ERROR");
            },
          });
        });
      },
    });
  }
);

$(document).keydown(function (e) {
  if ((e.which == "115" || e.which == "83") && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    $("#save").click();
  }
  return true;
});
