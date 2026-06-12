"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitApplication } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";

const extracurricularOptions = [
  "Sports",
  "Music/Band",
  "Drama/Theater",
  "Debate Club",
  "Science Fair",
  "Volunteering"
];

export default function ApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [gender, setGender] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  
  // File State
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [document, setDocument] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (validExtensions.includes(file.type)) {
        setDocument(file);
        setError(null);
      } else {
        setDocument(null);
        setError("Invalid document type. Only PDF, DOC, and DOCX are allowed.");
      }
    }
  };

  const handleActivityToggle = (activity: string) => {
    setActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !grade || !gender || !image || !document) {
      setError("Please fill in all required fields and upload both files.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("applicant_name", name);
    formData.append("grade_level", grade);
    formData.append("gender", gender);
    // Send as JSON string to the backend
    formData.append("extracurricular_activities", JSON.stringify(activities));
    formData.append("applicant_image", image);
    formData.append("applicant_document", document);

    try {
      await submitApplication(formData);
      setSuccess(true);
      // Optional: Redirect to dashboard after a delay
      // setTimeout(() => router.push('/'), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to submit the application. Please try again.");
    } finally {
      setLoading(false);
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
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Applicant Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">Applicant Full Name *</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Jane Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="h-12 text-lg transition-shadow focus-visible:ring-indigo-500"
                />
              </div>

              {/* Grade Level */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Applying for Grade *</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Gender *</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male" className="font-normal text-md cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female" className="font-normal text-md cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="other" />
                    <Label htmlFor="other" className="font-normal text-md cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Extracurriculars */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Extracurricular Interests</Label>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {extracurricularOptions.map((activity) => (
                    <div key={activity} className="flex items-center space-x-3">
                      <Checkbox 
                        id={activity} 
                        checked={activities.includes(activity)}
                        onCheckedChange={() => handleActivityToggle(activity)}
                      />
                      <Label htmlFor={activity} className="font-normal text-md cursor-pointer">
                        {activity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Recent Photo *</Label>
                  <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50 transition-colors relative group overflow-hidden">
                    {imagePreview ? (
                      <div className="text-center w-full">
                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-full shadow-md" />
                        <p className="mt-3 text-sm text-slate-500">{image?.name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                          </label>
                        </div>
                        <p className="text-xs leading-5 text-slate-500">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    {imagePreview && (
                      <input id="file-upload-change" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={handleImageChange} />
                    )}
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Supporting Document *</Label>
                  <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50 transition-colors relative">
                    <div className="text-center">
                      <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${document ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        {document ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <UploadCloud className="h-6 w-6 text-slate-400" />}
                      </div>
                      <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                        <label htmlFor="doc-upload" className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 hover:text-indigo-500">
                          <span>{document ? "Change File" : "Upload Document"}</span>
                          <input id="doc-upload" name="doc-upload" type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={handleDocumentChange} />
                        </label>
                      </div>
                      <p className="text-xs leading-5 text-slate-500 mt-1">
                        {document ? document.name : "PDF, DOC, DOCX"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all" disabled={loading}>
                  {loading ? "Submitting Application..." : "Submit Application"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
