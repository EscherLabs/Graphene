$(".navbar-header .nav a h4").html("App Instances");
$('[href="/admin/groups"]').parent().addClass("active");

$g.getData(
  [
    url,
    "/assets/data/icons.json",
    "/api/groups",
    "/api/apps" + (resource_id !== "" ? "/group/" + resource_id : ""),
  ],
  (appinstances, icons, groups, apps) => {
    grid = new GrapheneDataGrid({
      ...tableConfig,
      schema: [
        fieldLibrary.group,
        {
          label: "App",
          name: "app_id",
          type: "select",
          options: "apps",
          format: {
            label: "{{name}}",
            value: function (e) {
              return e.id;
            },
          },
        },
        // {label: 'Version', name:'app_version_id', type:'hidden'},
        ...fieldLibrary.content,
        { name: "app", type: "hidden" },
        { name: "id", type: "hidden" },
      ],
      actions: [{ name: "delete" }].concat(
        resource_id !== ""
          ? [
              "|",
              { name: "edit", max: 1 },
              {
                name: "version",
                max: 1,
                min: 1,
                label: '<i class="fa fa-cogs"></i> Version',
              },
              "|",
              { name: "create" },
              { name: "sort", label: '<i class="fa fa-sort"></i> Sort' },
            ]
          : []
      ),
      data: appinstances.map(instance => {
        instance.groups = instance.groups || [];
        return instance;
      }),
      name: "appinstances",
      sortBy: "order",
    })
      .on("click", e => {
        window.location.href = "/admin/appinstances/" + e.model.attributes.id;
      })
      .on("sort", e => {
        var tempdata = _.map(e.grid.models, function (item) {
          return item.attributes;
        }).reverse(); //[].concat.apply([],pageData)
        mymodal = modal({
          title: "Sort App Instances",
          content: templates.sortlist.render({ items: tempdata }, templates),
          footer: '<div class="btn btn-success save-sort">Save</div>',
        });
        Sortable.create($(mymodal.ref.container).find("#sorter")[0], {
          draggable: "li",
        });
      })
      .on("model:version", e => {
        $.ajax({
          url: "/api/apps/" + e.model.attributes.app_id + "/versions",
          success: function (e, data) {
            data.forEach($g.formatDates);

            new gform({
              name: "version",
              data: e.model.attributes,
              legend: "Select Version",
              fields: [
                {
                  label: "Version",
                  name: "app_version_id",
                  required: true,
                  options: [
                    {
                      type: "optgroup",
                      options: [
                        { id: null, label: "Latest (working or stable)" },
                        { id: 0, label: "Latest Stable" },
                      ],
                    },
                    { type: "optgroup", options: data },
                  ],
                  type: "select",
                  format: {
                    value: function (e) {
                      return e.id;
                    },
                    label:
                      "{{label}}{{^label}}{{updated_at.date}} - {{summary}} ({{user.last_name}}){{/label}}",
                  },
                },
              ],
            })
              .on(
                "save",
                function (e, g) {
                  e.model.update(g.form.toJSON());
                  e.model.owner.eventBus.dispatch("model:edited", e.model);
                  e.model.owner.draw();
                  g.form.trigger("close");
                }.bind(null, e)
              )
              .on("cancel", function (e) {
                e.form.trigger("close");
              })
              .modal();
          }.bind(null, e),
        });
      });
  }
);
