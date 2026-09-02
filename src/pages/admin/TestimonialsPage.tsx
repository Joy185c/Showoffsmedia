import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "name", label: "Client Name", required: true },
  { key: "role", label: "Designation & Company" },
  { key: "picture_url", label: "Profile Picture URL" },
  { key: "quote", label: "Testimonial (Pitch)", type: "textarea" },
  { key: "generated_views", label: "Generated Views (e.g. 1M+)" },
  { key: "subscribers", label: "Subscribers (e.g. 500K+)" },
  { key: "video_url", label: "Video File / Video URL (Optional)", type: "video" },
  { key: "sort_order", label: "Order", type: "number" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const TestimonialsPage = () => <GenericCrudPage tableName="testimonials" fields={fields} title="Testimonials" />;
export default TestimonialsPage;
