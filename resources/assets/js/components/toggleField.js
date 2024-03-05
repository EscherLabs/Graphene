import { props } from "./adminProject.vue";

export const toggleField = field => {
  props.status = "changed";
  field.include = !field.include;

  props.fields = _.orderBy(
    props.fields,
    ["include", "order", "name"],
    ["desc", "asc", "asc"]
  );

  props.reports[3].config.schema = _.map(_.filter(props.fields, "include"), i =>
    _.omit(i, "key")
  );
  // props.report = props.reports[0];
  // props.report = props.report.id
  props.report = props.reports[3];
  debugger;
};
