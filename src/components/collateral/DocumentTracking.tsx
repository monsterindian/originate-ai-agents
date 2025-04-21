import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, FilePlus, FileUp, FileEdit, Trash2, AlertTriangle, Download, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isAfter, isBefore, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import ViewDetailsModal from "./ViewDetailsModal";

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
    description: "",
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
    description: "",
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
    description: "",
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
    description: "",
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
    description: "",
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
    description: "",
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
    description: "",
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
    description: "",
  }
];

const getDocumentStatus = (doc) => {
  if (!doc.expirationDate) return "permanent";
  
  const today = new Date();
  const daysUntilExpiration = differenceInDays(doc.expirationDate, today);
  
  if (daysUntilExpiration < 0) return "expired";
  if (daysUntilExpiration <= 30) return "expiring-soon";
  return "active";
};

const DocumentTracking = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("all");
  const [filterDocType, setFilterDocType] = useState("all");
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isViewDocumentOpen, setIsViewDocumentOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [isDeleteDocumentOpen, setIsDeleteDocumentOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    propertyId: "",
    documentType: "",
    description: "",
    expirationDate: "",
    fileName: "",
    fileSize: "1.0 MB",
  });

  const getDocumentStats = () => {
    const total = documents.length;
    const today = new Date();
    
    const expiringSoon = documents.filter(doc => {
      if (!doc.expirationDate) return false;
      const daysUntilExpiration = differenceInDays(doc.expirationDate, today);
      return daysUntilExpiration > 0 && daysUntilExpiration <= 90;
    }).length;
    
    const expired = documents.filter(doc => {
      if (!doc.expirationDate) return false;
      return isBefore(doc.expirationDate, today);
    }).length;
    
    return { total, expiringSoon, expired };
  };

  const documentStats = getDocumentStats();

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProperty = filterProperty === "all" || doc.propertyId === filterProperty;
    
    const matchesDocType = filterDocType === "all" || doc.documentType === filterDocType;
    
    return matchesSearch && matchesProperty && matchesDocType;
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePropertySelect = (value) => {
    const propertyName = {
      "P001": "Oakwood Tower",
      "P002": "Riverfront Plaza",
      "P003": "Metro Business Center",
      "P004": "Parkside Office Park"
    }[value] || "";

    setFormData(prev => ({
      ...prev,
      propertyId: value,
      propertyName
    }));
  };

  const handleDocTypeSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      documentType: value
    }));
  };

  const handleAddDocument = () => {
    const fileName = formData.fileName || `${formData.documentType.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
    
    const newDocument = {
      id: `D${(documents.length + 1).toString().padStart(3, '0')}`,
      propertyId: formData.propertyId,
      propertyName: {
        "P001": "Oakwood Tower",
        "P002": "Riverfront Plaza",
        "P003": "Metro Business Center",
        "P004": "Parkside Office Park"
      }[formData.propertyId] || "",
      documentType: formData.documentType,
      fileName: fileName,
      uploadDate: new Date(),
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : null,
      fileSize: formData.fileSize,
      description: formData.description || "",
    };

    setDocuments([...documents, newDocument]);
    setIsAddDocumentOpen(false);
    setFormData({
      propertyId: "",
      documentType: "",
      description: "",
      expirationDate: "",
      fileName: "",
      fileSize: "1.0 MB",
    });

    toast({
      title: "Document uploaded",
      description: `${newDocument.documentType} for ${newDocument.propertyName} has been uploaded successfully.`
    });
  };

  const handleEditDocument = () => {
    if (!selectedDocument) return;

    const updatedDocuments = documents.map(doc => 
      doc.id === selectedDocument.id 
        ? {
            ...doc,
            propertyId: formData.propertyId || doc.propertyId,
            propertyName: {
              "P001": "Oakwood Tower",
              "P002": "Riverfront Plaza",
              "P003": "Metro Business Center",
              "P004": "Parkside Office Park"
            }[formData.propertyId] || doc.propertyName,
            documentType: formData.documentType || doc.documentType,
            expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : doc.expirationDate,
            description: formData.description || doc.description,
          }
        : doc
    );

    setDocuments(updatedDocuments);
    setIsEditDocumentOpen(false);
    setSelectedDocument(null);
    
    toast({
      title: "Document updated",
      description: `${formData.documentType || selectedDocument.documentType} has been updated successfully.`
    });
  };

  const handleDeleteDocument = () => {
    if (!selectedDocument) return;
    
    const updatedDocuments = documents.filter(doc => doc.id !== selectedDocument.id);
    setDocuments(updatedDocuments);
    setIsDeleteDocumentOpen(false);
    setSelectedDocument(null);
    
    toast({
      title: "Document deleted",
      description: `Document has been deleted successfully.`
    });
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setIsViewDocumentOpen(true);
  };

  const handleEditDocumentClick = (doc) => {
    setSelectedDocument(doc);
    setFormData({
      propertyId: doc.propertyId,
      documentType: doc.documentType,
      description: doc.description || "",
      expirationDate: doc.expirationDate ? format(doc.expirationDate, 'yyyy-MM-dd') : "",
      fileName: doc.fileName,
      fileSize: doc.fileSize,
    });
    setIsEditDocumentOpen(true);
  };

  const handleDeleteDocumentClick = (doc) => {
    setSelectedDocument(doc);
    setIsDeleteDocumentOpen(true);
  };

  const handleDownloadDocument = (doc) => {
    toast({
      title: "Downloading document",
      description: `${doc.fileName} is being downloaded.`
    });
  };

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
                          <Button variant="ghost" size="icon" onClick={() => handleViewDocument(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDownloadDocument(doc)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditDocumentClick(doc)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteDocumentClick(doc)}>
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

      <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a new document to the library.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doc-property">Property*</Label>
                <Select onValueChange={handlePropertySelect}>
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
                <Label htmlFor="doc-type">Document Type*</Label>
                <Select onValueChange={handleDocTypeSelect}>
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
              <Input 
                id="description" 
                placeholder="Enter optional description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doc-expiration">Expiration Date (if applicable)</Label>
                <Input 
                  id="expirationDate" 
                  type="date"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-filename">File Name (optional)</Label>
                <Input 
                  id="fileName" 
                  placeholder="Auto-generated if left blank"
                  value={formData.fileName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-file">File*</Label>
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
            <Button onClick={handleAddDocument}>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDocumentOpen} onOpenChange={setIsEditDocumentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>Update document details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doc-property">Property*</Label>
                <Select onValueChange={handlePropertySelect}>
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
                <Label htmlFor="doc-type">Document Type*</Label>
                <Select onValueChange={handleDocTypeSelect}>
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
              <Input 
                id="description" 
                placeholder="Enter optional description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doc-expiration">Expiration Date (if applicable)</Label>
                <Input 
                  id="expirationDate" 
                  type="date"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-filename">File Name (optional)</Label>
                <Input 
                  id="fileName" 
                  placeholder="Auto-generated if left blank"
                  value={formData.fileName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDocumentOpen(false)}>Cancel</Button>
            <Button onClick={handleEditDocument}>Update Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDocumentOpen} onOpenChange={setIsDeleteDocumentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDocumentOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteDocument}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedDocument && (
        <ViewDetailsModal
          isOpen={isViewDocumentOpen}
          onClose={() => setIsViewDocumentOpen(false)}
          title="Document Details"
          description={`${selectedDocument.documentType} - ${selectedDocument.propertyName}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Property</h3>
                <p className="text-base">{selectedDocument.propertyName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Document Type</h3>
                <p className="text-base">{selectedDocument.documentType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">File Name</h3>
                <p className="text-base font-mono text-sm">{selectedDocument.fileName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">File Size</h3>
                <p className="text-base">{selectedDocument.fileSize}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Upload Date</h3>
                <p className="text-base">{format(selectedDocument.uploadDate, 'MMMM d, yyyy')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Expiration Date</h3>
                <p className="text-base">
                  {selectedDocument.expirationDate 
                    ? format(selectedDocument.expirationDate, 'MMMM d, yyyy')
                    : 'Not applicable'
                  }
                  {selectedDocument.expirationDate && getDocumentStatus(selectedDocument) === 'expired' && (
                    <Badge className="ml-2 bg-red-500">Expired</Badge>
                  )}
                  {selectedDocument.expirationDate && getDocumentStatus(selectedDocument) === 'expiring-soon' && (
                    <Badge className="ml-2 bg-amber-500">Expiring Soon</Badge>
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <p className="text-base">
                  {getDocumentStatus(selectedDocument) === 'expired' && <Badge className="bg-red-500">Expired</Badge>}
                  {getDocumentStatus(selectedDocument) === 'expiring-soon' && <Badge className="bg-amber-500">Expiring Soon</Badge>}
                  {getDocumentStatus(selectedDocument) === 'active' && <Badge className="bg-green-500">Active</Badge>}
                  {getDocumentStatus(selectedDocument) === 'permanent' && <Badge className="bg-blue-500">Permanent</Badge>}
                </p>
              </div>
            </div>
            {selectedDocument.description && (
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p>{selectedDocument.description}</p>
                </div>
              </div>
            )}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => handleEditDocumentClick(selectedDocument)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteDocumentClick(selectedDocument)}>Delete</Button>
            </div>
          </div>
        </ViewDetailsModal>
      )}
    </div>
  );
};

export default DocumentTracking;
