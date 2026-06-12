"use client";

import { useEffect, useState } from "react";
import { getApplications, getSummary, updateApplicationStatus, deleteApplication } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Eye, Edit, Trash2, FileText, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { useRouter } from "next/navigation";

type Application = {
  id: number;
  applicant_name: string;
  grade_level: string;
  gender: string;
  extracurricular_activities: string;
  status: string;
  applicant_image: string;
  applicant_document: string;
  created_at: string;
};

type Summary = {
  Processing: number;
  Accepted: number;
  Rejected: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<Summary>({ Processing: 0, Accepted: 0, Rejected: 0 });
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsData, summaryData] = await Promise.all([getApplications(), getSummary()]);
      setApplications(appsData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedApp || !newStatus) return;
    try {
      await updateApplicationStatus(selectedApp.id, newStatus);
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedApp) return;
    try {
      await deleteApplication(selectedApp.id);
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to delete application", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Accepted":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Accepted</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500 hover:bg-amber-600">Processing</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage school admission applications.</p>
          </div>
          <Button onClick={() => router.push("/apply")} className="bg-indigo-600 hover:bg-indigo-700">
            Submit New Application
          </Button>
        </div>

        {/* Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-amber-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Processing</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{summary.Processing}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{summary.Accepted}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{summary.Rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-40 flex items-center justify-center text-slate-500">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-center">
                <FileText className="h-10 w-10 text-slate-300 mb-2" />
                <p>No applications found.</p>
              </div>
            ) : (
              <div className="rounded-md border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Date Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <img src={app.applicant_image} alt={app.applicant_name} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                            {app.applicant_name}
                          </div>
                        </TableCell>
                        <TableCell>{app.grade_level}</TableCell>
                        <TableCell>{app.gender}</TableCell>
                        <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                              onClick={() => window.open(app.applicant_document, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-1" /> Doc
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8"
                              onClick={() => {
                                setSelectedApp(app);
                                setNewStatus(app.status);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Status
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              onClick={() => {
                                setSelectedApp(app);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Status Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change the admission status for <strong>{selectedApp?.applicant_name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block text-sm font-medium">Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleStatusUpdate}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the application for <strong>{selectedApp?.applicant_name}</strong> and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Yes, delete application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
