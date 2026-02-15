import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "name", label: "Name", required: true },
  { key: "role", label: "Role" },
  { key: "quote", label: "Quote", type: "textarea" },
  { key: "video_url", label: "Video", type: "video" },
  { key: "sort_order", label: "Order", type: "number" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const TestimonialsPage = () => <GenericCrudPage tableName="testimonials" fields={fields} title="Testimonials" />;
export default TestimonialsPage;
