"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitApplication } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const extracurricularOptions = [
  "Sports",
  "Music/Band",
  "Drama/Theater",
  "Debate Club",
  "Science Fair",
  "Volunteering"
];

// Custom file validators
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOC_TYPES = [
  "application/pdf", 
  "application/msword", 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  grade_level: z.string().min(1, "Please select a grade."),
  gender: z.string().min(1, "Please select a gender."),
  activities: z.array(z.string()).default([]),
  photo: z.any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  document: z.any()
    .refine((files) => files?.length == 1, "Document is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_DOC_TYPES.includes(files?.[0]?.type),
      "Only .pdf, .doc, and .docx formats are supported."
    ),
});

export default function ApplyPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      grade_level: "",
      gender: "",
      activities: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("grade_level", values.grade_level);
      formData.append("gender", values.gender);
      formData.append("activities", JSON.stringify(values.activities));
      formData.append("photo", values.photo[0]);
      formData.append("document", values.document[0]);

      await submitApplication(formData);
      setSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to submit. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-emerald-500">
          <CardHeader className="text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Application Submitted</CardTitle>
            <CardDescription>Thank you for applying! We will review your application soon.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => router.push("/")} className="mt-4">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admission Form</h1>
          <p className="mt-2 text-lg text-slate-600">Join our school community for the upcoming academic year.</p>
        </div>

        <Card className="shadow-2xl border-0 ring-1 ring-slate-200">
          <CardContent className="p-6 sm:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Applicant Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jane Doe" className="h-12 text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Applying for Grade *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-lg">
                            <SelectValue placeholder="Select a grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold">Gender *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="Male" /></FormControl>
                            <FormLabel className="font-normal text-md">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="Female" /></FormControl>
                            <FormLabel className="font-normal text-md">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="Other" /></FormControl>
                            <FormLabel className="font-normal text-md">Other</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activities"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Extracurricular Interests</FormLabel>
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {extracurricularOptions.map((activity) => (
                          <FormField
                            key={activity}
                            control={form.control}
                            name="activities"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={activity}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(activity)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, activity])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== activity
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-md cursor-pointer">
                                    {activity}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Recent Photo *</FormLabel>
                        <FormControl>
                          <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50 transition-colors relative group overflow-hidden">
                            {imagePreview ? (
                              <div className="text-center w-full">
                                <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-full shadow-md" />
                                <p className="mt-3 text-sm text-slate-500 truncate">{value?.[0]?.name}</p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                                  <span className="font-semibold text-indigo-600">Upload a file</span>
                                </div>
                                <p className="text-xs leading-5 text-slate-500">PNG, JPG up to 5MB</p>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/jpeg, image/jpg, image/png, image/webp"
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              onChange={(e) => handleImageChange(e, onChange)}
                              {...rest}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Supporting Document *</FormLabel>
                        <FormControl>
                          <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50 transition-colors relative">
                            <div className="text-center">
                              <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${value?.[0] ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                {value?.[0] ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <UploadCloud className="h-6 w-6 text-slate-400" />}
                              </div>
                              <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                                <span className="font-semibold text-indigo-600">{value?.[0] ? "Change File" : "Upload Document"}</span>
                              </div>
                              <p className="text-xs leading-5 text-slate-500 mt-1 truncate max-w-[150px]">
                                {value?.[0] ? value[0].name : "PDF, DOC, DOCX"}
                              </p>
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              onChange={(e) => onChange(e.target.files)}
                              {...rest}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Submitting Application..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
