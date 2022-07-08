$(".navbar-header .nav a h4").html("Members");
$('[href="/admin/groups"]').parent().addClass("active");

$g.getData("/api/groups/" + resource_id + "/members", members => {
  routes.create = routes.delete =
    "/api/groups/{{resource_id}}/members/{{user_id}}";

  new GrapheneDataGrid({
    ...tableConfig,
    schema: [
      // {label: 'User',type:"user_id", name:'user_id',show:[{type:'matches',value:"create",name:"_method"}]},
      {
        label: "User",
        type: "user_id",
        name: "user_id",
        show: [{ type: "matches", value: "create", name: "_method" }],
      },
    ],
    actions: [
      { name: "delete" },
      "|",
      "|",
      { name: "create" },
      { name: "export", label: '<i class="fa fa-file"></i> Export' },
    ],
    data: members,
    name: "members",
  }).on("export", e => {
    $.get("/api/groups/" + resource_id + "/members?all", all_members => {
      _.csvify(
        all_members,
        [
          { label: "ID", name: "unique_id" },
          { label: "First Name", name: "first_name" },
          { label: "Last Name", name: "last_name" },
          { label: "Email", name: "email" },
        ],
        group.name
      );
    });
  });
});
