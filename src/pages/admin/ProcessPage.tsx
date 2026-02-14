import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "num", label: "Number", required: true },
  { key: "label", label: "Label", required: true },
  { key: "title", label: "Title", required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "sort_order", label: "Order", type: "number" },
];

const ProcessPage = () => <GenericCrudPage tableName="process_steps" fields={fields} title="Process Steps" />;
export default ProcessPage;
