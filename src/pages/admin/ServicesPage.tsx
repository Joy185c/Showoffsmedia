import GenericCrudPage from "./GenericCrudPage";
import type { FieldConfig } from "@/components/admin/CrudTable";

const fields: FieldConfig[] = [
  { key: "icon_name", label: "Icon", type: "select", options: [
    { label: "Play", value: "Play" },
    { label: "Film", value: "Film" },
    { label: "Monitor", value: "Monitor" },
    { label: "Megaphone", value: "Megaphone" },
    { label: "Video", value: "Video" },
    { label: "Mic", value: "Mic" },
  ] },
  { key: "title", label: "Title", required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "sort_order", label: "Order", type: "number" },
];

const ServicesPage = () => <GenericCrudPage tableName="services" fields={fields} title="Services" />;
export default ServicesPage;
