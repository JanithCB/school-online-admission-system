"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApplications, getStatusSummary, deleteApplication, updateApplicationStatus } from "@/lib/api";
import { Application, StatusSummary } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<StatusSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [appsData, summaryData] = await Promise.all([
        getApplications(),
        getStatusSummary()
      ]);
      setApplications(appsData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this application? This cannot be undone.")) return;
    
    try {
      await deleteApplication(id.toString());
      toast.success("Application deleted successfully.");
      fetchData(); // Refresh the list
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete application.");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateApplicationStatus(id.toString(), newStatus);
      toast.success("Status updated successfully.");
      fetchData(); // Refresh the list and summary
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Accepted": return "default";
      case "Rejected": return "destructive";
      default: return "secondary"; // Processing
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading applications dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage and review student admissions.</p>
      </div>

      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.Total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-600">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.Processing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.Accepted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.Rejected}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                    No applications found. 
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      <div>{app.full_name}</div>
                      <div className="text-xs text-slate-500">{app.gender}</div>
                    </TableCell>
                    <TableCell>{app.grade_level}</TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {app.photo && (
                          <a href={app.photo} target="_blank" rel="noreferrer" title="View Photo" className="text-slate-400 hover:text-indigo-600">
                            <ImageIcon className="h-5 w-5" />
                          </a>
                        )}
                        {app.document && (
                          <a href={app.document} target="_blank" rel="noreferrer" title="View Document" className="text-slate-400 hover:text-indigo-600">
                            <FileText className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2 items-start">
                        <Badge variant={getStatusBadgeVariant(app.status)} className="mb-1">
                          {app.status}
                        </Badge>
                        <Select 
                          defaultValue={app.status} 
                          onValueChange={(val) => handleStatusChange(app.id, val)}
                        >
                          <SelectTrigger className="h-8 text-xs w-[130px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Accepted">Accepted</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/applications/${app.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(app.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
