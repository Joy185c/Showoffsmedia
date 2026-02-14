import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "type", label: "Type", type: "select", options: [
    { label: "Us", value: "us" },
    { label: "Others", value: "others" },
    { label: "Bonus", value: "bonus" },
  ], required: true },
  { key: "text", label: "Text", required: true },
  { key: "sort_order", label: "Order", type: "number" },
];

const ComparisonPage = () => <GenericCrudPage tableName="comparison_features" fields={fields} title="Comparison Features" />;
export default ComparisonPage;
