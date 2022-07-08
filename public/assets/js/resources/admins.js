$(".navbar-header .nav a h4").html("Admins");
$('[href="/admin/groups"]').parent().addClass("active");

$g.getData("/api/groups/" + resource_id + "/admins", admins => {
  routes.create =
    routes.delete =
    routes.update =
      "/api/groups/{{resource_id}}/admins/{{user_id}}";
  verbs.update = "POST";
  new GrapheneDataGrid({
    ...tableConfig,
    schema: [
      {
        label: "User",
        type: "user_id",
        name: "user_id",
        template:
          "{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}",
        parse: true,
        show: [{ type: "matches", value: "create", name: "_method" }],
      },
      {
        name: "apps_admin",
        label: "App/Workflow Admin",
        type: "checkbox",
        options: [
          { label: "No", value: 0 },
          { label: "Yes", value: 1 },
        ],
      },
      {
        name: "content_admin",
        label: "Content Admin",
        type: "checkbox",
        options: [
          { label: "No", value: 0 },
          { label: "Yes", value: 1 },
        ],
      },
    ],
    actions: [
      { name: "delete" },
      "|",
      {
        name: "edit",
        max: 1,
        label: '<i class="fa fa-lock"></i> Admin Types',
        type: "default",
      },
      "|",
      { name: "create" },
    ],
    data: admins,
  });
});
