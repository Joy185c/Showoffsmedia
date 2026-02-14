import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import CrudTable, { FieldConfig } from "@/components/admin/CrudTable";

interface GenericCrudPageProps {
  tableName: string;
  fields: FieldConfig[];
  title: string;
  orderBy?: string;
}

const GenericCrudPage = ({ tableName, fields, title, orderBy = "sort_order" }: GenericCrudPageProps) => {
  const [data, setData] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    const { data: rows } = await (supabase.from(tableName as any) as any)
      .select("*")
      .order(orderBy, { ascending: true });
    setData(rows ?? []);
  }, [tableName, orderBy]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return <CrudTable tableName={tableName} fields={fields} data={data} onRefresh={fetchData} title={title} />;
};

export default GenericCrudPage;
