$(".navbar-header .nav a h4").html("Projects");
$g.getData([url], projects => {
  new GrapheneDataGrid({
    ...tableConfig,
    schema: [
      {
        label: "Name",
        name: "name",
        required: true,
        enabled: resource_id == "",
        value: resource_id,
      },
      {
        label: "Description",
        name: "description",
        required: false,
        type: "textarea",
        limit: 1000,
      },
      { label: "Tags", name: "tags", required: false },

      { name: "id", type: "hidden" },
    ],
    actions: [
      { name: "delete" },
      "|",
      { name: "edit", max: 1 },
      {
        name: "developers",
        max: 1,
        min: 1,
        label: '<i class="fa fa-code"></i> Developers',
      },
      "|",
      { name: "create" },
    ],
    name: "projects",
    data: projects,
  }).on("click", e => {
    window.location = "/admin/" + route + "/" + e.model.attributes.id;
  });
});
