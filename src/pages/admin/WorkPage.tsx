import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import CrudTable from "@/components/admin/CrudTable";
import type { FieldConfig } from "@/components/admin/CrudTable";

const categoryFields: FieldConfig[] = [
  { key: "name", label: "Category Name", required: true },
  { key: "sort_order", label: "Order", type: "number" },
];

const WorkPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [catOptions, setCatOptions] = useState<{ label: string; value: string }[]>([]);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from("work_categories").select("*").order("sort_order");
    setCategories(data ?? []);
    setCatOptions((data ?? []).map((c) => ({ label: c.name, value: c.id })));
  }, []);

  const fetchItems = useCallback(async () => {
    const { data } = await supabase.from("work_items").select("*").order("sort_order");
    setItems(data ?? []);
  }, []);

  useEffect(() => { fetchCategories(); fetchItems(); }, [fetchCategories, fetchItems]);

  const itemFields: FieldConfig[] = [
    { key: "category_id", label: "Category", type: "select", options: catOptions, required: true },
    { key: "title", label: "Title", required: true },
    { key: "description", label: "Description" },
    { key: "sort_order", label: "Order", type: "number" },
  ];

  return (
    <div className="space-y-10">
      <CrudTable tableName="work_categories" fields={categoryFields} data={categories} onRefresh={fetchCategories} title="Work Categories" />
      <CrudTable tableName="work_items" fields={itemFields} data={items} onRefresh={fetchItems} title="Work Items" />
    </div>
  );
};

export default WorkPage;
