// @ts-nocheck
/**
 * Admin Dashboard Page
 * 
 * This page acts as the main dashboard for administrators. It displays summary cards 
 * for application statuses (Processing, Accepted, Rejected) and a tabular list of all 
 * submitted applications. Admins can view documents/photos, change statuses directly 
 * from the table, edit applications, or delete them.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getApplications,
  getStatusSummary,
  deleteApplication,
  updateApplicationStatus,
} from "@/lib/api";
import { Application, StatusSummary } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Image as ImageIcon, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="bg-white border border-[#e5e5e0] rounded-md p-5">
      <p className="text-xs font-semibold tracking-widest uppercase text-[#888882] mb-2">
        {label}
      </p>
      <p className={`text-3xl font-bold ${accent ?? "text-[#1a1a1a]"}`}>
        {value}
      </p>
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
export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<StatusSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const [appsData, summaryData] = await Promise.all([
        getApplications(),
        getStatusSummary(),
      ]);
      setApplications(appsData);
      setSummary(summaryData);
    } catch {
      toast.error("Failed to fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Delete this application? This action cannot be undone."
      )
    )
      return;
    try {
      await deleteApplication(id.toString());
      toast.success("Application deleted.");
      fetchData();
    } catch {
      toast.error("Failed to delete application.");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateApplicationStatus(id.toString(), newStatus);
      toast.success("Status updated.");
      fetchData();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-sm text-[#888882]">Loading dashboard…</p>
      </div>
    );
  }

  // ── Derived State ────────────────────────────────────────────────────────────
  const filteredApplications = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      app.full_name.toLowerCase().includes(q) ||
      app.grade_level.toLowerCase().includes(q) ||
      app.status.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#888882] mb-2">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">
            Applications Dashboard
          </h1>
          <p className="text-sm text-[#555550] mt-1">
            Review, update, and manage all submitted applications.
          </p>
        </div>
        <Link href="/apply">
          <Button className="bg-[#1a1a1a] text-white hover:bg-[#333] text-sm h-10 px-5 rounded-md">
            + New Application
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={summary.Total} />
          <StatCard label="Processing" value={summary.Processing} accent="text-[#92400e]" />
          <StatCard label="Accepted"   value={summary.Accepted}   accent="text-[#166534]" />
          <StatCard label="Rejected"   value={summary.Rejected}   accent="text-[#991b1b]" />
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-[#e5e5e0]" />

      {/* Table */}
      <div className="bg-white border border-[#e5e5e0] rounded-md overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e5e5e0] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">
            All Submissions
            <span className="ml-2 text-[#888882] font-normal">
              ({filteredApplications.length})
            </span>
          </h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#888882]" />
            <Input
              placeholder="Search name, grade..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-8 h-8 w-[200px] sm:w-[250px] text-xs bg-[#fafaf8] border-[#e5e5e0] focus-visible:ring-[#1a1a1a]"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#e5e5e0] bg-[#fafaf8]">
              <TableHead className="text-xs font-semibold tracking-wide uppercase text-[#888882] py-3">
                Applicant
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide uppercase text-[#888882]">
                Grade
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide uppercase text-[#888882]">
                Submitted
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide uppercase text-[#888882]">
                Files
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide uppercase text-[#888882]">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide uppercase text-[#888882] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedApplications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-20 text-center text-sm text-[#888882]"
                >
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedApplications.map((app) => (
                <TableRow
                  key={app.id}
                  className="border-b border-[#f0efea] hover:bg-[#fafaf8] transition-colors"
                >
                  {/* Name + gender */}
                  <TableCell className="py-4">
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      {app.full_name}
                    </p>
                    <p className="text-xs text-[#888882] mt-0.5">{app.gender}</p>
                  </TableCell>

                  {/* Grade */}
                  <TableCell className="text-sm text-[#333330]">
                    {app.grade_level}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-sm text-[#555550]">
                    {new Date(app.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>

                  {/* File links */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {app.photo && (
                        <a
                          href={app.photo}
                          target="_blank"
                          rel="noreferrer"
                          title="View photo"
                          className="text-[#aaa] hover:text-[#1a1a1a] transition-colors"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </a>
                      )}
                      {app.document && (
                        <a
                          href={app.document}
                          target="_blank"
                          rel="noreferrer"
                          title="View document"
                          className="text-[#aaa] hover:text-[#1a1a1a] transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <StatusPill status={app.status} />
                      <Select
                        value={app.status}
                        onValueChange={(val) =>
                          handleStatusChange(app.id, val as string)
                        }
                      >
                        <SelectTrigger className="h-7 text-xs w-[120px] border-[#d0d0ca] bg-[#fafaf8]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Accepted">Accepted</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/applications/${app.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-[#d0d0ca] text-[#1a1a1a] hover:bg-[#f5f5f2] text-xs"
                        >
                          <Pencil className="h-3 w-3 mr-1.5" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[#991b1b] hover:bg-[#fee2e2] hover:text-[#991b1b] text-xs"
                        onClick={() => handleDelete(app.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#e5e5e0] flex items-center justify-between bg-[#fafaf8]">
            <span className="text-xs text-[#888882]">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 text-xs border-[#d0d0ca] text-[#1a1a1a]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 text-xs border-[#d0d0ca] text-[#1a1a1a]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
