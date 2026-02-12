import { type Lead } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { format } from "date-fns";

interface LeadTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export function LeadTable({ leads, onSelectLead }: LeadTableProps) {
  const downloadCsv = async () => {
    const res = await fetch("/api/leads/export/csv");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Leads</h2>
        <Button onClick={downloadCsv}>
          <FileDown className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Case Type</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reviewed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectLead(lead)}
            >
              <TableCell>
                {format(new Date(lead.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.caseType}</TableCell>
              <TableCell>{lead.urgency}</TableCell>
              <TableCell>
                <Badge
                  variant={lead.status === "new" ? "default" : "secondary"}
                >
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={lead.reviewed ? "default" : "outline"}
                >
                  {lead.reviewed ? "Yes" : "No"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
