import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "number", label: "#" },
  { key: "headline", label: "Headline", type: "textarea", required: true },
  { key: "stat1_value", label: "Stat 1 Value" },
  { key: "stat1_label", label: "Stat 1 Label" },
  { key: "stat2_value", label: "Stat 2 Value" },
  { key: "stat2_label", label: "Stat 2 Label" },
  { key: "sort_order", label: "Order", type: "number" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const CaseStudiesPage = () => <GenericCrudPage tableName="case_studies" fields={fields} title="Case Studies" />;
export default CaseStudiesPage;
