import { type Lead } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Mail, Phone } from "lucide-react";
import { format } from "date-fns";

interface LeadDetailsProps {
  lead: Lead | null;
  onClose: () => void;
}

const STATUSES = ["new", "contacted", "qualified", "unqualified"];

export function LeadDetails({ lead, onClose }: LeadDetailsProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { status: string; reviewed: boolean }) => {
      if (!lead) return;
      const res = await apiRequest("PATCH", `/api/leads/${lead.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
  });

  if (!lead) return null;

  return (
    <Sheet open={!!lead} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <Label className="text-sm text-muted-foreground">Status</Label>
            <Select
              value={lead.status}
              onValueChange={(value) =>
                mutation.mutate({ status: value, reviewed: lead.reviewed })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Reviewed</Label>
            <Switch
              checked={lead.reviewed}
              onCheckedChange={(checked) =>
                mutation.mutate({ status: lead.status, reviewed: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Created</Label>
              <p>{format(new Date(lead.createdAt), "PPpp")}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Name</Label>
              <p className="font-medium">{lead.name}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Contact</Label>
              <div className="space-y-1">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center text-primary hover:underline"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {lead.email}
                </a>
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center text-primary hover:underline"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {lead.phone}
                </a>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Case Type</Label>
              <p>{lead.caseType}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Urgency</Label>
              <p>{lead.urgency}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Details</Label>
              <p className="whitespace-pre-wrap">{lead.caseDetails}</p>
            </div>

            {lead.notes && (
              <div>
                <Label className="text-sm text-muted-foreground">Notes</Label>
                <p className="whitespace-pre-wrap">{lead.notes}</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
