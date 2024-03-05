import { onMounted } from "vue";
import { props, formContainer, emit } from "./configBar.vue";

onMounted(() => {
  $g.collections.add("_states", []);
  // $g.collections.on("_states", e => console.log(e));
  // console.log(formContainer.value);
  // debugger;
  // const data = _.extend({}, toRaw(props.query));
  // gform.instances.f19.find('created_at').set([{"search":[{"raw":"[2023-11-01 - 2023-11-04]"}]}])
  const data = props.query;
  if (typeof data.sort == "string") {
    data.sort = data.sort.split(",");
  }

  if (typeof data.state == "string") {
    data.state = data.state.split(",");
  }
  const filter = new gform(
    {
      // name: get().config.resource.id,
      actions: [],
      data,
      collections: $g.collections,
      fields: [
        {
          type: "custom_radio",
          label: false,
          name: "status",
          options: [
            {
              type: "optgroup",
              options: [
                {
                  label: "All",
                  value: "",
                },
                {
                  label: "Open",
                  value: "open",
                },
                {
                  label: "New",
                  value: "new",
                  visible: false,
                },
                {
                  label: "Closed",
                  value: "closed",
                },
              ],
            },
          ],
          parse: [{ type: "not_matches", value: "" }],
        },
        {
          type: "smallcombo",
          // type: "filter",
          hideLabel: true,
          parse: false,
          show: false,
          label: "Group by",
          name: "group_by",
          options: [
            {
              type: "optgroup",
              options: [
                // {
                //   label: "Created At",
                //   value: "created_at",
                // },
                // {
                //   label: "Updated At",
                //   value: "updated_at",
                // },
                // {
                //   label: "Submitted At",
                //   value: "opened_at",
                // },
                {
                  label: "State",
                  value: "state",
                },
                {
                  label: "Status",
                  value: "status",
                },
                // {
                //   label: "Title",
                //   value: "title",
                // },
                {
                  label: "Assigned",
                  value: "user_id",
                },
              ],
            },
          ],
          // parse: [{ type: "requires" }],
        },
        {
          // type: "radio",
          type: "tristateCollection",
          // hideLabel: true,
          parse: [{ type: "requires" }],
          multiple: true,
          label: "Sort by",
          name: "sort",
          options: [
            {
              type: "optgroup",
              options: [
                {
                  label: "Created At",
                  value: "created_at",
                },
                {
                  label: "Updated At",
                  value: "updated_at",
                },
                {
                  label: "Submitted At",
                  value: "opened_at",
                },
                {
                  label: "State",
                  value: "state",
                },
                {
                  label: "Status",
                  value: "status",
                },
                {
                  label: "Title",
                  value: "title",
                },
                {
                  label: "Assigned",
                  value: "user_id",
                },
              ],
            },
          ],
          // parse: [{ type: "requires" }],
        },
        {
          type: "tristateCollection",
          multiple: true,
          // hideLabel: true,
          // parse: false,
          parse: [{ type: "requires" }],
          label: "State",
          options: [
            {
              type: "optgroup",
              // path: get().config.resource.id + "_states",
              path: "_states",
            },
          ],
        },
        {
          type: "date_range",
          label: "Created",
          name: "created_at",
          search: "created_at",
          key: "created_at",
          parse: false,
        },
        {
          type: "date_range",
          label: "Updated",
          name: "updated_at",
          search: "updated_at",
          key: "updated_at",
          parse: false,
        },
      ],
    },
    formContainer.value
  );

  // debugger;
  _.each(["created_at", "updated_at"], field => {
    filter.find(field).set([
      {
        search: [
          {
            raw: "[" + (props.query[field] || "").split(",").join(" - ") + "]",
          },
        ],
      },
    ]);
  });
  // data.created_at = ;
  // debugger;
  // filter.find('created_at').set(data.created_at)
  // filter.find('updated_at').set(data.updated_at)
  filter.on("input", ({ form }) => {
    // const filters = _.reduce(
    //   form.filter({ type: "filter" }),
    //   (result, { name, value }) => {
    //     _.each(value, item => {
    //       result.push({
    //         name,
    //         invert: item.invert,
    //         search: _.map(item.search, "raw"),
    //       });
    //     });
    //     return result;
    //   },
    //   []
    // // );
    // const filters = _.reduce(
    //   form.filter({ type: "tristateCollection" }),
    //   (result, { name, value }) => {
    //     _.each(value[0], search => {
    //       result.push({
    //         name,
    //         invert: false,
    //         search: [search],
    //       });
    //     });
    //     _.each(value[1], search => {
    //       result.push({
    //         name,
    //         invert: true,
    //         search: [search],
    //       });
    //     });
    //     // _.each(value, item => {
    //     //   result.push({
    //     //     name,
    //     //     invert: item.invert,
    //     //     search: _.map(item.search, "raw"),
    //     //   });
    //     // });
    //     return result;
    //   },
    //   []
    // );
    debugger;
    const filters = [];
    _.reduce(
      _.map(form.filter({ type: "date_range" }), field => ({
        name: field.name,
        value: field.get(),
      })),
      (result, { name, value }) => {
        _.each(value, item => {
          result.push({
            name,
            invert: item.invert,
            search: _.map(item.search, ({ raw }) => {
              return _.trim(raw, ["]", "["]).split(" - ");
            }),
          });
        });
        return result;

        // if (typeof value !== "undefined" && value !== "") {
        //   // const { key } = value[0];
        //   // const { raw } = value[0].search[0];
        //   _.each(
        //     _.trim(value[0].search[0].raw, ["]", "["]).split(" - "),
        //     (date, i) => {
        //       if (date) query.push(`${name}[${i}]=${date}`);
        //     }
        //   );
        // }
        // return query;
      },
      filters
    );
    const queryObj = form.toJSON();

    _.reduce(
      filters,
      (result, { name, invert, search }) => {
        // result[invert ? `![${name}]` : `${name}`] = search.join(",");
        result[name] = result[name] ? result[name] + "," : "";
        result[name] += (invert ? "!" : "") + search.join(invert ? ",!" : ",");
        return result;
      },
      form.toJSON()
    );

    emit("query", queryObj);
    return;
    // console.log(QueryString);
    const newQ = _.reduce(
      form.filter({ type: "filter" }),
      (query, { name, value }) => {
        _.each(value, ({ invert, search }) => {
          const pre = invert ? "1" : "0";
          const t = `${name}[${pre}][]=`;
          _.each(search, ({ raw }) => {
            query.push(t + _.trim(raw, '"'));
          });
        });
        return query;
      },
      [new URLSearchParams(form.toJSON()).toString()]
    );
    _.reduce(
      _.map(form.filter({ type: "date_range" }), field => ({
        name: field.name,
        value: field.get(),
      })),
      (query, { name, value }) => {
        if (typeof value !== "undefined" && value !== "") {
          // const { key } = value[0];
          // const { raw } = value[0].search[0];
          _.each(
            _.trim(value[0].search[0].raw, ["]", "["]).split(" - "),
            (date, i) => {
              if (date) query.push(`${name}[${i}]=${date}`);
            }
          );
        }
        return query;
      },
      newQ
    );
    // console.log(newQ.join("&"));
    emit("filter", newQ.join("&"));

    //     api.engine.app.getPage({
    //       page: api.engine.app.page,
    //       id: form.options.name,
    //       filter: api.engine.app.data.searchFilter,
  });
});
