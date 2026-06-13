"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getApplication, updateApplicationStatus } from "@/lib/api";
import { Application } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ApplicationEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [application, setApplication] = useState<Application | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchApp = async () => {
      try {
        const data = await getApplication(id);
        setApplication(data);
        setStatus(data.status);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleSave = async () => {
    if (!application || status === application.status) {
      toast.info("No changes made.");
      return;
    }
    
    setSaving(true);
    try {
      await updateApplicationStatus(id, status);
      toast.success("Application status updated successfully!");
      router.push("/admin/applications");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!application) {
    return <div className="p-10 text-center">Application not found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/applications">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Application</h1>
          <p className="text-slate-500">#{application.id} - {application.full_name}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Applicant Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-slate-500">Full Name</div>
              <div className="font-medium text-lg">{application.full_name}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-500">Grade Level</div>
                <div className="font-medium">{application.grade_level}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Gender</div>
                <div className="font-medium">{application.gender}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Extracurriculars</div>
              <div className="flex flex-wrap gap-2">
                {application.activities?.length > 0 ? (
                  application.activities.map((act) => (
                    <span key={act} className="px-2 py-1 bg-slate-100 rounded-md text-sm">{act}</span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">None</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Submitted On</div>
              <div className="font-medium">{new Date(application.created_at).toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-xs">IMG</span>
                  </div>
                  <div className="text-sm font-medium">Applicant Photo</div>
                </div>
                <a href={application.photo} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="sm" className="h-8">
                    View <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </a>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-xs">DOC</span>
                  </div>
                  <div className="text-sm font-medium">Supporting Document</div>
                </div>
                <a href={application.document} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="sm" className="h-8">
                    View <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-100 shadow-md">
            <CardHeader>
              <CardTitle>Admission Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm font-medium">Update Status</div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={saving || status === application.status}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {saving ? "Saving Changes..." : "Save Decision"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
