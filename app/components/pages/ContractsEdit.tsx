import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AddContractForm from "../AddContractForm";

const ContractsEdit: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const contractId = params?.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contractId) return;
    const fetchDetail = async () => {
      setLoading(true);
      const res = await fetch(`/api/contract/detail?id=${contractId}`);
      const data = await res.json();
      if (data.success) setInitialData(data.contract);
      setLoading(false);
    };
    fetchDetail();
  }, [contractId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!initialData)
    return (
      <div className="p-8 text-center text-red-500">
        Data kontrak tidak ditemukan.
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      <AddContractForm
        initialData={initialData}
        isEditMode={true}
        onBack={() => router.push("/contracts")}
        onSave={() => router.push("/contracts")}
      />
    </div>
  );
};

export default ContractsEdit;
