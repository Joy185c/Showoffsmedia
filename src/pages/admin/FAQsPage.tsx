import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "question", label: "Question", required: true },
  { key: "answer", label: "Answer", type: "textarea", required: true },
  { key: "sort_order", label: "Order", type: "number" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const FAQsPage = () => <GenericCrudPage tableName="faqs" fields={fields} title="FAQs" />;
export default FAQsPage;
