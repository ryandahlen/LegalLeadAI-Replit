import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema, type InsertLead } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Loader2 } from "lucide-react";

const CASE_TYPES = [
  "Personal Injury",
  "Family Law",
  "Criminal Defense",
  "Estate Planning",
  "Business Law",
  "Other"
];

const URGENCY_LEVELS = [
  "Immediate",
  "Within 24 hours",
  "Within a week",
  "Not urgent"
];

export default function ChatInterface() {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  
  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      caseType: "",
      caseDetails: "",
      urgency: "",
      notes: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertLead) => {
      const res = await apiRequest("POST", "/api/leads", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you for reaching out!",
        description: "A legal professional will review your case and contact you soon.",
      });
      form.reset();
      setStep(0);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    }
  });

  const questions = [
    {
      field: "name",
      label: "What is your name?",
      component: (
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    },
    {
      field: "email",
      label: "What is your email address?",
      component: (
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    },
    {
      field: "phone",
      label: "What is your phone number?",
      component: (
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="(555) 555-5555" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    },
    {
      field: "caseType",
      label: "What type of legal assistance do you need?",
      component: (
        <FormField
          control={form.control}
          name="caseType"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CASE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    },
    {
      field: "caseDetails",
      label: "Please briefly describe your situation:",
      component: (
        <FormField
          control={form.control}
          name="caseDetails"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Provide details about your case..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    },
    {
      field: "urgency",
      label: "How urgent is your matter?",
      component: (
        <FormField
          control={form.control}
          name="urgency"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {URGENCY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    },
    {
      field: "notes",
      label: "Is there anything else you'd like us to know?",
      component: (
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Additional notes (optional)"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    }
  ];

  const currentQuestion = questions[step];

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Legal Assistant</h2>
        </div>

        <Form {...form}>
          <form className="space-y-4">
            <div className="min-h-[200px]">
              <FormLabel className="text-lg mb-4 block">
                {currentQuestion.label}
              </FormLabel>
              {currentQuestion.component}
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
              >
                Previous
              </Button>

              <Button
                type="button"
                onClick={() => {
                  const field = currentQuestion.field;
                  form.trigger(field).then((valid) => {
                    if (valid) {
                      if (step === questions.length - 1) {
                        mutation.mutate(form.getValues());
                      } else {
                        setStep(step + 1);
                      }
                    }
                  });
                }}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : step === questions.length - 1 ? (
                  <>
                    Submit <Send className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
