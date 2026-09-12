import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Zap, ShieldCheck, CheckCircle2, ChevronLeft, Building, User, Phone, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateEmobilityRegistration, useGetVerificationChallenge } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(9, "Phone number is required"),
  businessName: z.string().min(2, "Business/Fleet name is required"),
  operatorType: z.string().min(2, "Select an operator type"),
  county: z.string().min(2, "County is required"),
  mpesaNumber: z.string().min(9, "M-Pesa number is required for the fee"),
  verificationAnswer: z.string().min(1, "Please answer the security question"),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EMobilityRegister() {
  const { toast } = useToast();
  const [formStartedAt] = useState<number>(Date.now());
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { data: challenge, isLoading: challengeLoading } = useGetVerificationChallenge();
  const createRegistration = useCreateEmobilityRegistration();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      businessName: "",
      operatorType: "",
      county: "",
      mpesaNumber: "",
      verificationAnswer: "",
      website: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!challenge) {
      toast({
        title: "Security Check Failed",
        description: "Could not load verification challenge. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    createRegistration.mutate(
      {
        data: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          businessName: values.businessName,
          operatorType: values.operatorType,
          county: values.county,
          mpesaNumber: values.mpesaNumber,
          verificationToken: challenge.token,
          verificationAnswer: values.verificationAnswer,
          formStartedAt,
          website: values.website,
        },
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          window.scrollTo(0, 0);
        },
        onError: (error: any) => {
          toast({
            title: "Registration Failed",
            description: error.message || "Please check your inputs and try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-muted/20 py-12 md:py-24">
        <div className="app-shell max-w-2xl mx-auto">
          <Button variant="ghost" asChild className="mb-6 -ml-4" data-testid="button-back-to-emobility">
            <Link href="/e-mobility"><ChevronLeft className="w-4 h-4 mr-2" /> Back to E-Mobility Hub</Link>
          </Button>
          
          <Card className="border-border overflow-hidden shadow-lg border-t-4 border-t-emerald-500" data-testid="card-registration-success">
            <CardHeader className="text-center pb-8 pt-10">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-3xl font-black mb-2">Application Received</CardTitle>
              <CardDescription className="text-base text-foreground">
                Your E-Mobility operator registration is pending verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-md mx-auto">
              <div className="bg-muted/50 rounded-xl p-5 border shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <span className="text-muted-foreground text-sm font-medium">Registration Fee</span>
                  <span className="font-bold text-lg">KSh 150</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm font-medium">Application Status</span>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 border-amber-200" data-testid="badge-status">pending_payment</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm font-medium">Payment Status</span>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 border-amber-200" data-testid="badge-payment-status">pending_verification</Badge>
                </div>
              </div>
              
              <div className="flex gap-3 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  <strong>Important:</strong> Your registration is not active until BNAK confirms the payment process and verifies the provider payment. BNAK will provide approved payment instructions; do not send money using unconfirmed details.
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-6 pb-10 flex justify-center">
              <Button asChild size="lg" className="font-bold bg-emerald-600 hover:bg-emerald-700 w-full max-w-xs" data-testid="button-return-home">
                <Link href="/">Return to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="bg-black text-white py-12 md:py-16 relative overflow-hidden flag-border-bottom">
        <div className="absolute inset-0 z-0">
          <img src="/images/e-mobility-matatu.png" alt="E-Mobility Background" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-black/80 to-black/90" />
        </div>
        <div className="app-shell relative z-10">
          <div className="max-w-3xl">
            <Button variant="ghost" asChild className="mb-6 -ml-4 text-white/70 hover:text-white hover:bg-white/10" data-testid="button-back-to-emobility">
              <Link href="/e-mobility"><ChevronLeft className="w-4 h-4 mr-2" /> Back to E-Mobility Hub</Link>
            </Button>
            <Badge className="bg-emerald-500 text-white border-0 font-bold mb-4 px-3 py-1 flex w-max items-center gap-2" data-testid="badge-emobility-register">
              <Zap className="w-4 h-4" /> BNAK E-MOBILITY
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Operator Registration
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
              Apply to join the BNAK E-Mobility network and connect with future approved partners, financing pathways and infrastructure information. Registration requires a processing fee of KSh 150.
            </p>
          </div>
        </div>
      </div>

      <div className="app-shell py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border-border shadow-md" data-testid="card-registration-form">
            <CardHeader className="bg-muted/30 border-b pb-6">
              <CardTitle className="text-2xl font-bold flex items-center gap-2"><User className="w-5 h-5 text-emerald-600" /> Apply for Access</CardTitle>
              <CardDescription className="text-base mt-2">
                Provide your operator details. BNAK will verify this information before granting access to our partner network.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="form-emobility-registration">
                  
                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl><Input {...field} tabIndex={-1} autoComplete="off" /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} data-testid="input-fullname" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" placeholder="07XX XXX XXX" {...field} data-testid="input-phone" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="county"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Operating County</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" placeholder="e.g. Nairobi" {...field} data-testid="input-county" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 border-t pt-8">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Business or Fleet Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" placeholder="Fast Riders Ltd" {...field} data-testid="input-business-name" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="operatorType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Operator Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-operator-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="E-Boda Rider">E-Boda Rider</SelectItem>
                              <SelectItem value="E-Boda Fleet Owner">E-Boda Fleet Owner</SelectItem>
                              <SelectItem value="E-Matatu / Bus">E-Matatu / Bus Operator</SelectItem>
                              <SelectItem value="Commercial Delivery">Commercial / Delivery</SelectItem>
                              <SelectItem value="Infrastructure Provider">Infrastructure Provider</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl p-6 space-y-6">
                    <div className="flex gap-3">
                      <Zap className="w-6 h-6 text-emerald-600 mt-1 shrink-0" />
                      <div>
                        <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-100 mb-1">Processing Fee: KSh 150</h3>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                          Provide the M-Pesa number you will use to pay the registration fee. We will verify the payment against this number before approving your application.
                        </p>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="mpesaNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-emerald-900 dark:text-emerald-100">M-Pesa Number for Payment</FormLabel>
                          <FormControl>
                            <Input placeholder="07XX XXX XXX" className="bg-white dark:bg-black max-w-sm" {...field} data-testid="input-mpesa-number" />
                          </FormControl>
                          <FormDescription className="text-emerald-600/80 dark:text-emerald-400/80">
                            Must match the number making the payment.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-muted/40 border rounded-xl p-6">
                    <div className="flex gap-3 mb-4">
                      <ShieldCheck className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Security Check</h3>
                        <p className="text-xs text-muted-foreground">Verify you are human to proceed.</p>
                      </div>
                    </div>
                    {challengeLoading ? (
                      <div className="h-20 flex items-center justify-center text-sm text-muted-foreground">Loading challenge...</div>
                    ) : challenge ? (
                      <FormField
                        control={form.control}
                        name="verificationAnswer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">{challenge.question}</FormLabel>
                            <FormControl>
                              <Input placeholder="Your answer" className="max-w-sm" {...field} data-testid="input-verification-answer" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="text-sm text-destructive">Failed to load security challenge.</div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 h-14 text-base" 
                    disabled={createRegistration.isPending || !challenge}
                    data-testid="button-submit-registration"
                  >
                    {createRegistration.isPending ? "Submitting..." : "Submit Registration & Proceed to Payment"}
                  </Button>
                  
                  <div className="text-center text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    By submitting, you agree to BNAK's verification process. Registration implies joining the network but does not guarantee immediate vehicle or loan approval from partners.
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}