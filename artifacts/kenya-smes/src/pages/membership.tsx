import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetMemberCategories, useRegisterMember } from "@workspace/api-client-react";
import { KENYA_COUNTIES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(2, "Business type is required"),
  category: z.string().min(1, "Please select a category"),
  county: z.string().min(1, "Please select a county"),
  constituency: z.string().min(2, "Constituency is required"),
  ward: z.string().min(2, "Ward is required"),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Business Info" },
  { id: 3, title: "Location" },
];

export default function Membership() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const { data: categories, isLoading: categoriesLoading } = useGetMemberCategories();
  const registerMutation = useRegisterMember();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      businessName: "",
      businessType: "",
      category: "",
      county: "",
      constituency: "",
      ward: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    registerMutation.mutate({ data }, {
      onSuccess: () => {
        setIsSuccess(true);
        window.scrollTo(0, 0);
      },
      onError: () => {
        toast({
          title: "Registration Failed",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const nextStep = async () => {
    const fieldsToValidate = 
      step === 1 ? ["fullName", "email", "phone"] as const : 
      step === 2 ? ["businessName", "businessType", "category"] as const : 
      [];
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to the Association!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your membership application has been received successfully. Our team will review it and contact you shortly with your membership details.
        </p>
        <Button onClick={() => window.location.href = "/"} size="lg" className="bg-primary text-white">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">SME Membership Registration</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of Kenyan entrepreneurs. Access exclusive training, advocacy representation, and networking opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Categories Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="font-bold text-xl mb-4">Membership Categories</h3>
            {categoriesLoading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
            ) : (
              categories?.map((cat) => (
                <Card key={cat.id} className="border-l-4 border-l-primary">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{cat.name}</CardTitle>
                    <CardDescription className="text-primary font-bold">KES {cat.annualFee.toLocaleString()} / year</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                    <ul className="space-y-1 list-disc list-inside ml-4">
                      {cat.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Form Area */}
          <div className="md:col-span-8">
            <Card className="bg-background shadow-lg border-none">
              <CardHeader className="bg-primary/5 border-b pb-6">
                <div className="flex items-center justify-between mb-4">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        step >= s.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {s.id}
                      </div>
                      <span className={`ml-2 text-sm font-medium hidden sm:block ${
                        step >= s.id ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {s.title}
                      </span>
                      {i < STEPS.length - 1 && (
                        <div className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 rounded-full ${
                          step > s.id ? "bg-primary" : "bg-muted"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* STEP 1 */}
                    <div className={step === 1 ? "block" : "hidden"}>
                      <h2 className="text-2xl font-bold mb-6 text-foreground">Personal Information</h2>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input placeholder="0712345678" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* STEP 2 */}
                    <div className={step === 2 ? "block" : "hidden"}>
                      <h2 className="text-2xl font-bold mb-6 text-foreground">Business Details</h2>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name</FormLabel>
                              <FormControl><Input placeholder="Acme Enterprises" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="businessType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Industry / Sector</FormLabel>
                                <FormControl><Input placeholder="e.g. Retail, Agriculture" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Membership Tier</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select tier" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories?.map((cat) => (
                                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* STEP 3 */}
                    <div className={step === 3 ? "block" : "hidden"}>
                      <h2 className="text-2xl font-bold mb-6 text-foreground">Location</h2>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="county"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>County</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select county" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {KENYA_COUNTIES.map((county) => (
                                    <SelectItem key={county} value={county}>{county}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="constituency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Constituency</FormLabel>
                                <FormControl><Input placeholder="e.g. Westlands" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ward"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ward</FormLabel>
                                <FormControl><Input placeholder="e.g. Parklands" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-6 border-t mt-8">
                      {step > 1 ? (
                        <Button type="button" variant="outline" onClick={prevStep}>
                          <ChevronLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                      ) : <div />}
                      
                      {step < 3 ? (
                        <Button type="button" className="bg-primary text-white" onClick={nextStep}>
                          Continue <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white" disabled={registerMutation.isPending}>
                          {registerMutation.isPending ? "Submitting..." : "Complete Registration"}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
