import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "name", label: "Name", required: true },
  { key: "niche", label: "Niche" },
  { key: "views", label: "Views" },
  { key: "subs", label: "Subscribers" },
  { key: "sort_order", label: "Order", type: "number" },
  { key: "is_active", label: "Active", type: "boolean" },
];

const ClientsPage = () => <GenericCrudPage tableName="client_results" fields={fields} title="Client Results" />;
export default ClientsPage;
