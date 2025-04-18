
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, FilePlus, FileUp, FileEdit, Trash2, AlertTriangle, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isAfter, isBefore, differenceInDays } from "date-fns";

// Mock data for initial UI
const MOCK_DOCUMENTS = [
  {
    id: "D001",
    propertyId: "P001",
    propertyName: "Oakwood Tower",
    documentType: "Deed",
    fileName: "Oakwood_Tower_Deed.pdf",
    uploadDate: new Date("2023-01-15"),
    expirationDate: null,
    fileSize: "1.2 MB",
  },
  {
    id: "D002",
    propertyId: "P001",
    propertyName: "Oakwood Tower",
    documentType: "Insurance Certificate",
    fileName: "Oakwood_Tower_Insurance_2023.pdf",
    uploadDate: new Date("2023-02-10"),
    expirationDate: new Date("2024-02-10"),
    fileSize: "890 KB",
  },
  {
    id: "D003",
    propertyId: "P002",
    propertyName: "Riverfront Plaza",
    documentType: "Title Report",
    fileName: "Riverfront_Plaza_Title_Report_2023.pdf",
    uploadDate: new Date("2023-03-22"),
    expirationDate: null,
    fileSize: "2.4 MB",
  },
  {
    id: "D004",
    propertyId: "P002",
    propertyName: "Riverfront Plaza",
    documentType: "Environmental Report",
    fileName: "Riverfront_Plaza_Phase1_ESA.pdf",
    uploadDate: new Date("2022-11-05"),
    expirationDate: new Date("2025-11-05"),
    fileSize: "5.7 MB",
  },
  {
    id: "D005",
    propertyId: "P003",
    propertyName: "Metro Business Center",
    documentType: "Appraisal",
    fileName: "Metro_Business_Center_Appraisal_2023.pdf",
    uploadDate: new Date("2023-05-18"),
    expirationDate: null,
    fileSize: "3.1 MB",
  },
  {
    id: "D006",
    propertyId: "P003",
    propertyName: "Metro Business Center",
    documentType: "Insurance Certificate",
    fileName: "Metro_Business_Center_Insurance_2023.pdf",
    uploadDate: new Date("2023-06-30"),
    expirationDate: new Date("2024-06-30"),
    fileSize: "950 KB",
  },
  {
    id: "D007",
    propertyId: "P004",
    propertyName: "Parkside Office Park",
    documentType: "Loan Agreement",
    fileName: "Parkside_Loan_Agreement.pdf",
    uploadDate: new Date("2022-08-12"),
    expirationDate: new Date("2032-08-12"),
    fileSize: "4.3 MB",
  },
  {
    id: "D008",
    propertyId: "P004",
    propertyName: "Parkside Office Park",
    documentType: "Survey",
    fileName: "Parkside_ALTA_Survey.pdf",
    uploadDate: new Date("2022-09-03"),
    expirationDate: null,
    fileSize: "8.5 MB",
  }
];

// Helper function to determine document status
const getDocumentStatus = (doc) => {
  if (!doc.expirationDate) return "permanent";
  
  const today = new Date();
  const daysUntilExpiration = differenceInDays(doc.expirationDate, today);
  
  if (daysUntilExpiration < 0) return "expired";
  if (daysUntilExpiration <= 30) return "expiring-soon";
  return "active";
};

const DocumentTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("all");
  const [filterDocType, setFilterDocType] = useState("all");
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  
  // Filter documents based on search and filters
  const filteredDocuments = MOCK_DOCUMENTS.filter(doc => {
    // Search term filtering
    const matchesSearch = 
      doc.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Property filtering
    const matchesProperty = filterProperty === "all" || doc.propertyId === filterProperty;
    
    // Document type filtering
    const matchesDocType = filterDocType === "all" || doc.documentType === filterDocType;
    
    return matchesSearch && matchesProperty && matchesDocType;
  });

  // Get stats for the dashboard
  const getDocumentStats = () => {
    const expiringDocs = MOCK_DOCUMENTS.filter(doc => {
      if (!doc.expirationDate) return false;
      
      const today = new Date();
      const daysUntilExpiration = differenceInDays(doc.expirationDate, today);
      return daysUntilExpiration >= 0 && daysUntilExpiration <= 90;
    });
    
    const expiredDocs = MOCK_DOCUMENTS.filter(doc => {
      if (!doc.expirationDate) return false;
      
      const today = new Date();
      return doc.expirationDate < today;
    });
    
    return {
      total: MOCK_DOCUMENTS.length,
      expiringSoon: expiringDocs.length,
      expired: expiredDocs.length
    };
  };

  const documentStats = getDocumentStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Document Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documentStats.total}</div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documentStats.expiringSoon}</div>
                <p className="text-xs text-muted-foreground mt-1">Documents expiring in next 90 days</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expired</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documentStats.expired}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span className="flex items-center">Document Library</span>
            <Button onClick={() => setIsAddDocumentOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="P001">Oakwood Tower</SelectItem>
                  <SelectItem value="P002">Riverfront Plaza</SelectItem>
                  <SelectItem value="P003">Metro Business Center</SelectItem>
                  <SelectItem value="P004">Parkside Office Park</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDocType} onValueChange={setFilterDocType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Document Types</SelectItem>
                  <SelectItem value="Deed">Deed</SelectItem>
                  <SelectItem value="Title Report">Title Report</SelectItem>
                  <SelectItem value="Appraisal">Appraisal</SelectItem>
                  <SelectItem value="Environmental Report">Environmental Report</SelectItem>
                  <SelectItem value="Insurance Certificate">Insurance Certificate</SelectItem>
                  <SelectItem value="Loan Agreement">Loan Agreement</SelectItem>
                  <SelectItem value="Survey">Survey</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => {
                  const status = getDocumentStatus(doc);
                  return (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.propertyName}</TableCell>
                      <TableCell>{doc.documentType}</TableCell>
                      <TableCell className="font-medium">{doc.fileName}</TableCell>
                      <TableCell>{format(doc.uploadDate, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        {doc.expirationDate ? format(doc.expirationDate, 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {status === 'expired' && <Badge className="bg-red-500">Expired</Badge>}
                        {status === 'expiring-soon' && <Badge className="bg-amber-500">Expiring Soon</Badge>}
                        {status === 'active' && <Badge className="bg-green-500">Active</Badge>}
                        {status === 'permanent' && <Badge className="bg-blue-500">Permanent</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredDocuments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No documents found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Document Dialog */}
      <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doc-property">Property</Label>
                <Select>
                  <SelectTrigger id="doc-property">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P001">Oakwood Tower</SelectItem>
                    <SelectItem value="P002">Riverfront Plaza</SelectItem>
                    <SelectItem value="P003">Metro Business Center</SelectItem>
                    <SelectItem value="P004">Parkside Office Park</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-type">Document Type</Label>
                <Select>
                  <SelectTrigger id="doc-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Deed">Deed</SelectItem>
                    <SelectItem value="Title Report">Title Report</SelectItem>
                    <SelectItem value="Appraisal">Appraisal</SelectItem>
                    <SelectItem value="Environmental Report">Environmental Report</SelectItem>
                    <SelectItem value="Insurance Certificate">Insurance Certificate</SelectItem>
                    <SelectItem value="Loan Agreement">Loan Agreement</SelectItem>
                    <SelectItem value="Survey">Survey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-description">Document Description</Label>
              <Input id="doc-description" placeholder="Enter optional description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doc-expiration">Expiration Date (if applicable)</Label>
                <Input id="doc-expiration" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-file">File</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                <FileUp className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag and drop your file here, or click to browse</p>
                <Input id="doc-file" type="file" className="hidden" />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('doc-file').click()}>
                  Choose File
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDocumentOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddDocumentOpen(false)}>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentTracking;
