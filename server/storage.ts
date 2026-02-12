import { leads, type Lead, type InsertLead, type UpdateLead } from "@shared/schema";

export interface IStorage {
  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, update: UpdateLead): Promise<Lead>;
  exportLeads(): Promise<string>;
}

export class MemStorage implements IStorage {
  private leads: Map<number, Lead>;
  private currentId: number;

  constructor() {
    this.leads = new Map();
    this.currentId = 1;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentId++;
    const lead: Lead = {
      ...insertLead,
      id,
      status: "new",
      reviewed: false,
      createdAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: number, update: UpdateLead): Promise<Lead> {
    const lead = this.leads.get(id);
    if (!lead) throw new Error("Lead not found");
    
    const updatedLead = { ...lead, ...update };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  async exportLeads(): Promise<string> {
    const leads = Array.from(this.leads.values());
    const headers = ["ID", "Name", "Email", "Phone", "Case Type", "Case Details", "Urgency", "Notes", "Status", "Reviewed", "Created At"];
    const rows = leads.map(lead => [
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      lead.caseType,
      lead.caseDetails,
      lead.urgency,
      lead.notes || "",
      lead.status,
      lead.reviewed ? "Yes" : "No",
      lead.createdAt.toISOString()
    ]);
    
    return [headers, ...rows].map(row => row.join(",")).join("\n");
  }
}

export const storage = new MemStorage();
