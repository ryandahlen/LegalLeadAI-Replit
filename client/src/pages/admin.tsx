import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Lead } from "@shared/schema";
import { LeadTable } from "@/components/admin/LeadTable";
import { LeadDetails } from "@/components/admin/LeadDetails";

export default function Admin() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["/api/leads"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-4" />
          <div className="space-y-3">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LeadTable leads={leads} onSelectLead={setSelectedLead} />
      <LeadDetails lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
