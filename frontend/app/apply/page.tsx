"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitApplication } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadCloud, CheckCircle2, ArrowLeft, FileCheck2 } from "lucide-react";
import { toast } from "sonner";

const ACTIVITIES = [
  "Sports",
  "Music / Band",
  "Drama / Theater",
  "Debate Club",
  "Science Fair",
  "Volunteering",
];

const MAX_SIZE = 5_000_000;
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const schema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters."),
  grade_level: z.string().min(1, "Please select a grade."),
  gender: z.string().min(1, "Please select a gender."),
  activities: z.array(z.string()).default([]),
  photo: z
    .any()
    .refine((f) => f?.length === 1, "A photo is required.")
    .refine((f) => f?.[0]?.size <= MAX_SIZE, "Max file size is 5 MB.")
    .refine(
      (f) => IMAGE_TYPES.includes(f?.[0]?.type),
      "Only JPG, PNG, or WEBP images are accepted."
    ),
  document: z
    .any()
    .refine((f) => f?.length === 1, "A document is required.")
    .refine((f) => f?.[0]?.size <= MAX_SIZE, "Max file size is 5 MB.")
    .refine(
      (f) => DOC_TYPES.includes(f?.[0]?.type),
      "Only PDF, DOC, or DOCX files are accepted."
    ),
});

type FormValues = z.infer<typeof schema>;

// ── Reusable upload zone ──────────────────────────────────────────────────────
function UploadZone({
  label,
  hint,
  accept,
  preview,
  fileName,
  hasFile,
  onChange,
}: {
  label: string;
  hint: string;
  accept: string;
  preview?: string | null;
  fileName?: string;
  hasFile: boolean;
  onChange: (files: FileList | null) => void;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-3 border border-dashed border-[#c8c8c2] rounded-md p-8 bg-white hover:bg-[#fafaf8] transition-colors cursor-pointer text-center">
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="h-28 w-28 rounded-full object-cover border border-[#e5e5e0]"
        />
      ) : hasFile ? (
        <FileCheck2 className="h-10 w-10 text-[#1a1a1a]" />
      ) : (
        <UploadCloud className="h-10 w-10 text-[#aaa]" />
      )}

      <div>
        <p className="text-sm font-medium text-[#1a1a1a]">
          {hasFile ? (
            <span className="truncate block max-w-[180px]">{fileName}</span>
          ) : (
            label
          )}
        </p>
        <p className="text-xs text-[#888882] mt-0.5">{hint}</p>
      </div>

      {/* Invisible full-area file input */}
      <input
        type="file"
        accept={accept}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => onChange(e.target.files)}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ApplyPage() {
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", grade_level: "", gender: "", activities: [] },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const fd = new FormData();
      fd.append("full_name", values.full_name);
      fd.append("grade_level", values.grade_level);
      fd.append("gender", values.gender);
      fd.append("activities", JSON.stringify(values.activities));
      fd.append("photo", values.photo[0]);
      fd.append("document", values.document[0]);
      await submitApplication(fd);
      setSuccess(true);
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || "Submission failed. Please try again."
      );
    }
  };

  const handlePhotoChange = (
    files: FileList | null,
    onChange: (v: FileList | null) => void
  ) => {
    onChange(files);
    if (files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-6">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#1a1a1a] mb-6">
            <CheckCircle2 className="h-8 w-8 text-[#1a1a1a]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">
            Application received.
          </h2>
          <p className="text-[#555550] text-sm leading-relaxed mb-8">
            Thank you for submitting your application. Our team will review it
            and update the status within 5 business days.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" className="border-[#d0d0ca] text-[#1a1a1a] hover:bg-[#f5f5f2]">
                Go to Home
              </Button>
            </Link>
            <Link href="/admin/applications">
              <Button className="bg-[#1a1a1a] text-white hover:bg-[#333]">
                View All Applications
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-16">

        {/* Left column – context */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#888882] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#888882] mb-3">
              Online Application
            </p>
            <h1 className="text-3xl font-bold text-[#1a1a1a] leading-tight mb-4">
              Admission Form
            </h1>
            <p className="text-sm text-[#555550] leading-relaxed">
              Fill in the form carefully. All fields marked with{" "}
              <span className="text-[#1a1a1a] font-medium">*</span> are
              required. Your application will be reviewed by our admissions
              team.
            </p>
          </div>

          <div className="border-t border-[#e5e5e0] pt-6 space-y-3">
            {[
              ["Photo", "JPG or PNG, max 5 MB"],
              ["Document", "PDF, DOC, or DOCX, max 5 MB"],
              ["Status", "Processing by default"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-[#888882]">{k}</span>
                <span className="text-[#1a1a1a] font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column – form */}
        <div className="bg-white border border-[#e5e5e0] rounded-md p-8 md:p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* ── Personal details ── */}
              <fieldset className="space-y-6">
                <legend className="text-xs font-semibold tracking-widest uppercase text-[#888882] pb-3 border-b border-[#e5e5e0] w-full">
                  Personal Details
                </legend>

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#1a1a1a]">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Jane Doe"
                          className="h-11 border-[#d0d0ca] focus-visible:ring-[#1a1a1a] bg-[#fafaf8]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="grade_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#1a1a1a]">
                          Grade Applying For *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-[#d0d0ca] bg-[#fafaf8]">
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                                Grade {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-medium text-[#1a1a1a]">
                          Gender *
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col gap-2 pt-1"
                          >
                            {["Male", "Female", "Other"].map((g) => (
                              <FormItem
                                key={g}
                                className="flex items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={g} />
                                </FormControl>
                                <FormLabel className="font-normal text-sm text-[#333330] cursor-pointer">
                                  {g}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              {/* ── Activities ── */}
              <fieldset className="space-y-4">
                <legend className="text-xs font-semibold tracking-widest uppercase text-[#888882] pb-3 border-b border-[#e5e5e0] w-full">
                  Extracurricular Activities
                  <span className="ml-2 normal-case font-normal tracking-normal text-[#aaa]">
                    (optional)
                  </span>
                </legend>

                <FormField
                  control={form.control}
                  name="activities"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 gap-3">
                        {ACTIVITIES.map((activity) => (
                          <FormField
                            key={activity}
                            control={form.control}
                            name="activities"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2.5 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(activity)}
                                    onCheckedChange={(checked) =>
                                      checked
                                        ? field.onChange([...field.value, activity])
                                        : field.onChange(
                                            field.value?.filter((v) => v !== activity)
                                          )
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm text-[#333330] cursor-pointer">
                                  {activity}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </fieldset>

              {/* ── File uploads ── */}
              <fieldset className="space-y-4">
                <legend className="text-xs font-semibold tracking-widest uppercase text-[#888882] pb-3 border-b border-[#e5e5e0] w-full">
                  Documents
                </legend>

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#1a1a1a]">
                          Recent Photo *
                        </FormLabel>
                        <FormControl>
                          <UploadZone
                            label="Click to upload photo"
                            hint="JPG, PNG or WEBP — max 5 MB"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            preview={imagePreview}
                            fileName={value?.[0]?.name}
                            hasFile={!!value?.[0]}
                            onChange={(files) => handlePhotoChange(files, onChange)}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#1a1a1a]">
                          Supporting Document *
                        </FormLabel>
                        <FormControl>
                          <UploadZone
                            label="Click to upload document"
                            hint="PDF, DOC or DOCX — max 5 MB"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            fileName={value?.[0]?.name}
                            hasFile={!!value?.[0]}
                            onChange={(files) => onChange(files)}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-12 bg-[#1a1a1a] text-white hover:bg-[#333] text-sm font-semibold rounded-md transition-colors"
              >
                {form.formState.isSubmitting
                  ? "Submitting…"
                  : "Submit Application"}
              </Button>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
