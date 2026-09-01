import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "name", label: "Client Name", required: true },
  { key: "role", label: "Designation & Company" },
  { key: "video_url", label: "Video File / Video URL", type: "video" },
  { key: "sort_order", label: "Order", type: "number" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const TestimonialsPage = () => <GenericCrudPage tableName="testimonials" fields={fields} title="Testimonials" />;
export default TestimonialsPage;
