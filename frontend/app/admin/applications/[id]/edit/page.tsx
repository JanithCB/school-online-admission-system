"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getApplication, updateApplicationStatus } from "@/lib/api";
import { Application } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ExternalLink, User, GraduationCap, Users, Activity } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// ── Detail row ────────────────────────────────────────────────────────────────
function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#f0efea] last:border-0">
      <div className="h-8 w-8 rounded-md bg-[#f5f5f2] flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-[#555550]" />
      </div>
      <div>
        <p className="text-xs text-[#888882] mb-0.5">{label}</p>
        <p className="text-sm font-medium text-[#1a1a1a]">{value}</p>
      </div>
    </div>
  );
}

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Processing: "bg-[#fef3c7] text-[#92400e]",
    Accepted: "bg-[#dcfce7] text-[#166534]",
    Rejected: "bg-[#fee2e2] text-[#991b1b]",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-[#f0efea] text-[#555550]"
      }`}
    >
      {status}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
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
      } catch {
        toast.error("Failed to load application.");
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleSave = async () => {
    if (!application || status === application.status) {
      toast.info("No changes to save.");
      return;
    }
    setSaving(true);
    try {
      await updateApplicationStatus(id, status);
      toast.success("Status updated successfully.");
      router.push("/admin/applications");
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-sm text-[#888882]">Loading application…</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-sm text-[#888882]">Application not found.</p>
        <Link href="/admin/applications">
          <Button variant="outline" className="mt-4 border-[#d0d0ca] text-[#1a1a1a]">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const statusChanged = status !== application.status;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Back + heading */}
      <div className="space-y-4">
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-1.5 text-xs text-[#888882] hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to applications
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#888882] mb-2">
              Application #{application.id}
            </p>
            <h1 className="text-3xl font-bold text-[#1a1a1a]">
              {application.full_name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <StatusPill status={application.status} />
              <p className="text-xs text-[#888882]">
                Submitted{" "}
                {new Date(application.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#e5e5e0]" />

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left – applicant details */}
        <div className="space-y-6">
          {/* Personal info */}
          <div className="bg-white border border-[#e5e5e0] rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e5e5e0] bg-[#fafaf8]">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#888882]">
                Personal Details
              </p>
            </div>
            <div className="px-6">
              <DetailRow icon={User} label="Full Name" value={application.full_name} />
              <DetailRow icon={GraduationCap} label="Grade Level" value={application.grade_level} />
              <DetailRow icon={Users} label="Gender" value={application.gender} />
              <DetailRow
                icon={Activity}
                label="Extracurricular Activities"
                value={
                  application.activities?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {application.activities.map((a) => (
                        <span
                          key={a}
                          className="px-2 py-0.5 bg-[#f0efea] text-[#333330] rounded text-xs"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[#aaa]">None listed</span>
                  )
                }
              />
            </div>
          </div>

          {/* Uploaded files */}
          <div className="bg-white border border-[#e5e5e0] rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e5e5e0] bg-[#fafaf8]">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#888882]">
                Uploaded Files
              </p>
            </div>
            <div className="px-6 py-4 space-y-3">
              {/* Photo */}
              <div className="flex items-center justify-between p-4 border border-[#e5e5e0] rounded-md bg-[#fafaf8]">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold tracking-wide">
                      IMG
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      Applicant Photo
                    </p>
                    <p className="text-xs text-[#888882]">Image file</p>
                  </div>
                </div>
                <a href={application.photo} target="_blank" rel="noreferrer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-[#d0d0ca] text-[#1a1a1a] hover:bg-[#f5f5f2] gap-1.5"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>

              {/* Document */}
              <div className="flex items-center justify-between p-4 border border-[#e5e5e0] rounded-md bg-[#fafaf8]">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold tracking-wide">
                      DOC
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      Supporting Document
                    </p>
                    <p className="text-xs text-[#888882]">PDF / DOC / DOCX</p>
                  </div>
                </div>
                <a href={application.document} target="_blank" rel="noreferrer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-[#d0d0ca] text-[#1a1a1a] hover:bg-[#f5f5f2] gap-1.5"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right – decision panel */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e5e5e0] rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e5e5e0] bg-[#fafaf8]">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#888882]">
                Admission Decision
              </p>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div>
                <p className="text-xs text-[#888882] mb-2">Current Status</p>
                <StatusPill status={application.status} />
              </div>

              <div className="h-px bg-[#f0efea]" />

              <div className="space-y-2">
                <p className="text-xs text-[#888882]">Change to</p>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-10 border-[#d0d0ca] bg-[#fafaf8] text-sm">
                    <SelectValue />
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
                disabled={saving || !statusChanged}
                className="w-full h-10 bg-[#1a1a1a] text-white hover:bg-[#333] text-sm font-semibold rounded-md disabled:opacity-40 transition-colors"
              >
                {saving ? "Saving…" : "Save Decision"}
              </Button>

              {!statusChanged && (
                <p className="text-xs text-[#aaa] text-center">
                  Select a different status to enable saving.
                </p>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="bg-white border border-[#e5e5e0] rounded-md px-6 py-5 space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#888882]">
              Timeline
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888882]">Submitted</span>
                <span className="text-[#1a1a1a] font-medium">
                  {new Date(application.created_at).toLocaleDateString("en-GB")}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#888882]">Last Updated</span>
                <span className="text-[#1a1a1a] font-medium">
                  {new Date(application.updated_at).toLocaleDateString("en-GB")}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#888882]">Application ID</span>
                <span className="text-[#1a1a1a] font-medium">
                  #{application.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
