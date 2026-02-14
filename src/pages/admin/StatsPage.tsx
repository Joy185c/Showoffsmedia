import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "value", label: "Value", required: true },
  { key: "label", label: "Label", required: true },
  { key: "sub", label: "Subtitle" },
  { key: "sort_order", label: "Order", type: "number" },
];

const StatsPage = () => <GenericCrudPage tableName="stats" fields={fields} title="Stats" />;
export default StatsPage;
