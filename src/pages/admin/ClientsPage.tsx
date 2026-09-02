import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "name", label: "Name", required: true },
  { key: "niche", label: "Designation / Niche" },
  { key: "quote", label: "Quote / Pitch", type: "textarea" },
  { key: "picture_url", label: "Profile Picture URL" },
  { key: "video_url", label: "Video URL (Optional)", type: "video" },
  { key: "views", label: "Generated Views" },
  { key: "subs", label: "Subscribers" },
  { key: "sort_order", label: "Order", type: "number" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const ClientsPage = () => <GenericCrudPage tableName="client_results" fields={fields} title="Feedback" />;
export default ClientsPage;
