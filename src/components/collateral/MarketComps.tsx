
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Building, FilePlus, FileEdit, Trash2, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import ViewDetailsModal from "./ViewDetailsModal";

// Mock data for initial UI
const MOCK_SALE_COMPS = [
  {
    id: "SC001",
    propertyName: "Tech Tower",
    address: "123 Main St, San Francisco, CA",
    propertyType: "Office",
    size: 45000,
    salePrice: 22500000,
    pricePerSF: 500,
    saleDate: new Date("2023-02-15"),
    notes: "Class A office building with recent renovations."
  },
  {
    id: "SC002",
    propertyName: "The Grand Plaza",
    address: "456 Market Ave, San Francisco, CA",
    propertyType: "Retail",
    size: 28000,
    salePrice: 12600000,
    pricePerSF: 450,
    saleDate: new Date("2023-05-10"),
    notes: "Corner lot with high foot traffic."
  },
  {
    id: "SC003",
    propertyName: "Ridgeway Industrial",
    address: "789 Commerce Pkwy, Oakland, CA",
    propertyType: "Industrial",
    size: 120000,
    salePrice: 18000000,
    pricePerSF: 150,
    saleDate: new Date("2023-01-30"),
    notes: "Distribution facility with 24' clear heights."
  }
];

const MOCK_LEASE_COMPS = [
  {
    id: "LC001",
    propertyName: "Centennial Tower",
    address: "100 Pine St, San Francisco, CA",
    propertyType: "Office",
    size: 5500,
    leaseRate: 65,
    rateType: "Annual",
    leaseType: "Full Service",
    term: 60,
    leaseDate: new Date("2023-03-20"),
    notes: "Corner office suite with bay views."
  },
  {
    id: "LC002",
    propertyName: "Sunset Shopping Center",
    address: "2200 Market St, San Francisco, CA",
    propertyType: "Retail",
    size: 3200,
    leaseRate: 48,
    rateType: "Annual",
    leaseType: "NNN",
    term: 120,
    leaseDate: new Date("2023-04-05"),
    notes: "Anchor tenant space in high-traffic center."
  },
  {
    id: "LC003",
    propertyName: "Harbor Logistics Center",
    address: "500 Port Way, Oakland, CA",
    propertyType: "Industrial",
    size: 25000,
    leaseRate: 1.25,
    rateType: "Monthly",
    leaseType: "NNN",
    term: 36,
    leaseDate: new Date("2023-06-15"),
    notes: "Warehouse space with dock high loading."
  }
];

const MarketComps = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPropertyType, setFilterPropertyType] = useState("all");
  const [activeTab, setActiveTab] = useState("sale");
  
  // Sale comps state
  const [saleComps, setSaleComps] = useState(MOCK_SALE_COMPS);
  const [isAddSaleCompOpen, setIsAddSaleCompOpen] = useState(false);
  const [selectedSaleComp, setSelectedSaleComp] = useState(null);
  const [isViewSaleCompOpen, setIsViewSaleCompOpen] = useState(false);
  const [isEditSaleCompOpen, setIsEditSaleCompOpen] = useState(false);
  const [isDeleteSaleCompOpen, setIsDeleteSaleCompOpen] = useState(false);
  
  // Lease comps state
  const [leaseComps, setLeaseComps] = useState(MOCK_LEASE_COMPS);
  const [isAddLeaseCompOpen, setIsAddLeaseCompOpen] = useState(false);
  const [selectedLeaseComp, setSelectedLeaseComp] = useState(null);
  const [isViewLeaseCompOpen, setIsViewLeaseCompOpen] = useState(false);
  const [isEditLeaseCompOpen, setIsEditLeaseCompOpen] = useState(false);
  const [isDeleteLeaseCompOpen, setIsDeleteLeaseCompOpen] = useState(false);
  
  // Form state for sale comp
  const [saleFormData, setSaleFormData] = useState({
    propertyName: "",
    address: "",
    propertyType: "",
    size: "",
    salePrice: "",
    saleDate: "",
    notes: ""
  });
  
  // Form state for lease comp
  const [leaseFormData, setLeaseFormData] = useState({
    propertyName: "",
    address: "",
    propertyType: "",
    size: "",
    leaseRate: "",
    rateType: "Annual",
    leaseType: "Full Service",
    term: "",
    leaseDate: "",
    notes: ""
  });
  
  // Filter sale comps based on search and filters
  const filteredSaleComps = saleComps.filter(comp => {
    const matchesSearch = 
      comp.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPropertyType = filterPropertyType === "all" || comp.propertyType === filterPropertyType;
    
    return matchesSearch && matchesPropertyType;
  });
  
  // Filter lease comps based on search and filters
  const filteredLeaseComps = leaseComps.filter(comp => {
    const matchesSearch = 
      comp.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPropertyType = filterPropertyType === "all" || comp.propertyType === filterPropertyType;
    
    return matchesSearch && matchesPropertyType;
  });

  // Handle form input changes for sale comp
  const handleSaleFormChange = (e) => {
    const { id, value } = e.target;
    setSaleFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle form input changes for lease comp
  const handleLeaseFormChange = (e) => {
    const { id, value } = e.target;
    setLeaseFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle property type selection for sale comp
  const handleSalePropertyTypeSelect = (value) => {
    setSaleFormData(prev => ({
      ...prev,
      propertyType: value
    }));
  };

  // Handle property type, rate type and lease type selection for lease comp
  const handleLeasePropertyTypeSelect = (value) => {
    setLeaseFormData(prev => ({
      ...prev,
      propertyType: value
    }));
  };

  const handleRateTypeSelect = (value) => {
    setLeaseFormData(prev => ({
      ...prev,
      rateType: value
    }));
  };

  const handleLeaseTypeSelect = (value) => {
    setLeaseFormData(prev => ({
      ...prev,
      leaseType: value
    }));
  };

  // Add new sale comp
  const handleAddSaleComp = () => {
    // Calculate price per SF
    const size = parseFloat(saleFormData.size) || 0;
    const salePrice = parseFloat(saleFormData.salePrice) || 0;
    const pricePerSF = size > 0 ? Math.round(salePrice / size) : 0;
    
    const newSaleComp = {
      id: `SC${(saleComps.length + 1).toString().padStart(3, '0')}`,
      propertyName: saleFormData.propertyName,
      address: saleFormData.address,
      propertyType: saleFormData.propertyType,
      size: parseFloat(saleFormData.size) || 0,
      salePrice: parseFloat(saleFormData.salePrice) || 0,
      pricePerSF: pricePerSF,
      saleDate: saleFormData.saleDate ? new Date(saleFormData.saleDate) : new Date(),
      notes: saleFormData.notes
    };

    setSaleComps([...saleComps, newSaleComp]);
    setIsAddSaleCompOpen(false);
    setSaleFormData({
      propertyName: "",
      address: "",
      propertyType: "",
      size: "",
      salePrice: "",
      saleDate: "",
      notes: ""
    });

    toast({
      title: "Sale comparable added",
      description: `${newSaleComp.propertyName} has been added successfully.`
    });
  };

  // Add new lease comp
  const handleAddLeaseComp = () => {
    const newLeaseComp = {
      id: `LC${(leaseComps.length + 1).toString().padStart(3, '0')}`,
      propertyName: leaseFormData.propertyName,
      address: leaseFormData.address,
      propertyType: leaseFormData.propertyType,
      size: parseFloat(leaseFormData.size) || 0,
      leaseRate: parseFloat(leaseFormData.leaseRate) || 0,
      rateType: leaseFormData.rateType,
      leaseType: leaseFormData.leaseType,
      term: parseInt(leaseFormData.term) || 0,
      leaseDate: leaseFormData.leaseDate ? new Date(leaseFormData.leaseDate) : new Date(),
      notes: leaseFormData.notes
    };

    setLeaseComps([...leaseComps, newLeaseComp]);
    setIsAddLeaseCompOpen(false);
    setLeaseFormData({
      propertyName: "",
      address: "",
      propertyType: "",
      size: "",
      leaseRate: "",
      rateType: "Annual",
      leaseType: "Full Service",
      term: "",
      leaseDate: "",
      notes: ""
    });

    toast({
      title: "Lease comparable added",
      description: `${newLeaseComp.propertyName} has been added successfully.`
    });
  };

  // Edit sale comp
  const handleEditSaleComp = () => {
    if (!selectedSaleComp) return;

    // Calculate price per SF
    const size = parseFloat(saleFormData.size) || selectedSaleComp.size;
    const salePrice = parseFloat(saleFormData.salePrice) || selectedSaleComp.salePrice;
    const pricePerSF = size > 0 ? Math.round(salePrice / size) : 0;
    
    const updatedSaleComps = saleComps.map(comp => 
      comp.id === selectedSaleComp.id 
        ? {
            ...comp,
            propertyName: saleFormData.propertyName || comp.propertyName,
            address: saleFormData.address || comp.address,
            propertyType: saleFormData.propertyType || comp.propertyType,
            size: parseFloat(saleFormData.size) || comp.size,
            salePrice: parseFloat(saleFormData.salePrice) || comp.salePrice,
            pricePerSF: pricePerSF,
            saleDate: saleFormData.saleDate ? new Date(saleFormData.saleDate) : comp.saleDate,
            notes: saleFormData.notes || comp.notes
          }
        : comp
    );

    setSaleComps(updatedSaleComps);
    setIsEditSaleCompOpen(false);
    setSelectedSaleComp(null);
    
    toast({
      title: "Sale comparable updated",
      description: `${saleFormData.propertyName || selectedSaleComp.propertyName} has been updated successfully.`
    });
  };

  // Edit lease comp
  const handleEditLeaseComp = () => {
    if (!selectedLeaseComp) return;
    
    const updatedLeaseComps = leaseComps.map(comp => 
      comp.id === selectedLeaseComp.id 
        ? {
            ...comp,
            propertyName: leaseFormData.propertyName || comp.propertyName,
            address: leaseFormData.address || comp.address,
            propertyType: leaseFormData.propertyType || comp.propertyType,
            size: parseFloat(leaseFormData.size) || comp.size,
            leaseRate: parseFloat(leaseFormData.leaseRate) || comp.leaseRate,
            rateType: leaseFormData.rateType || comp.rateType,
            leaseType: leaseFormData.leaseType || comp.leaseType,
            term: parseInt(leaseFormData.term) || comp.term,
            leaseDate: leaseFormData.leaseDate ? new Date(leaseFormData.leaseDate) : comp.leaseDate,
            notes: leaseFormData.notes || comp.notes
          }
        : comp
    );

    setLeaseComps(updatedLeaseComps);
    setIsEditLeaseCompOpen(false);
    setSelectedLeaseComp(null);
    
    toast({
      title: "Lease comparable updated",
      description: `${leaseFormData.propertyName || selectedLeaseComp.propertyName} has been updated successfully.`
    });
  };

  // Delete sale comp
  const handleDeleteSaleComp = () => {
    if (!selectedSaleComp) return;
    
    const updatedSaleComps = saleComps.filter(comp => comp.id !== selectedSaleComp.id);
    setSaleComps(updatedSaleComps);
    setIsDeleteSaleCompOpen(false);
    setSelectedSaleComp(null);
    
    toast({
      title: "Sale comparable deleted",
      description: `The sale comparable has been deleted successfully.`
    });
  };

  // Delete lease comp
  const handleDeleteLeaseComp = () => {
    if (!selectedLeaseComp) return;
    
    const updatedLeaseComps = leaseComps.filter(comp => comp.id !== selectedLeaseComp.id);
    setLeaseComps(updatedLeaseComps);
    setIsDeleteLeaseCompOpen(false);
    setSelectedLeaseComp(null);
    
    toast({
      title: "Lease comparable deleted",
      description: `The lease comparable has been deleted successfully.`
    });
  };

  // Open view sale comp modal
  const handleViewSaleComp = (comp) => {
    setSelectedSaleComp(comp);
    setIsViewSaleCompOpen(true);
  };

  // Open edit sale comp modal
  const handleEditSaleCompClick = (comp) => {
    setSelectedSaleComp(comp);
    setSaleFormData({
      propertyName: comp.propertyName,
      address: comp.address,
      propertyType: comp.propertyType,
      size: comp.size.toString(),
      salePrice: comp.salePrice.toString(),
      saleDate: format(comp.saleDate, 'yyyy-MM-dd'),
      notes: comp.notes
    });
    setIsEditSaleCompOpen(true);
  };

  // Open delete sale comp modal
  const handleDeleteSaleCompClick = (comp) => {
    setSelectedSaleComp(comp);
    setIsDeleteSaleCompOpen(true);
  };

  // Open view lease comp modal
  const handleViewLeaseComp = (comp) => {
    setSelectedLeaseComp(comp);
    setIsViewLeaseCompOpen(true);
  };

  // Open edit lease comp modal
  const handleEditLeaseCompClick = (comp) => {
    setSelectedLeaseComp(comp);
    setLeaseFormData({
      propertyName: comp.propertyName,
      address: comp.address,
      propertyType: comp.propertyType,
      size: comp.size.toString(),
      leaseRate: comp.leaseRate.toString(),
      rateType: comp.rateType,
      leaseType: comp.leaseType,
      term: comp.term.toString(),
      leaseDate: format(comp.leaseDate, 'yyyy-MM-dd'),
      notes: comp.notes
    });
    setIsEditLeaseCompOpen(true);
  };

  // Open delete lease comp modal
  const handleDeleteLeaseCompClick = (comp) => {
    setSelectedLeaseComp(comp);
    setIsDeleteLeaseCompOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Market Comparables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sale" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between mb-4">
              <TabsList>
                <TabsTrigger value="sale">Sale Comps</TabsTrigger>
                <TabsTrigger value="lease">Lease Comps</TabsTrigger>
              </TabsList>
              
              {activeTab === "sale" ? (
                <Button onClick={() => setIsAddSaleCompOpen(true)}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Sale Comp
                </Button>
              ) : (
                <Button onClick={() => setIsAddLeaseCompOpen(true)}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Lease Comp
                </Button>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search comparables..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Property Types</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Multifamily">Multifamily</SelectItem>
                  <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="sale">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size (SF)</TableHead>
                      <TableHead>Sale Price</TableHead>
                      <TableHead>Price/SF</TableHead>
                      <TableHead>Sale Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSaleComps.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p>{comp.propertyName}</p>
                            <p className="text-xs text-muted-foreground">{comp.address}</p>
                          </div>
                        </TableCell>
                        <TableCell>{comp.propertyType}</TableCell>
                        <TableCell>{comp.size.toLocaleString()}</TableCell>
                        <TableCell>${comp.salePrice.toLocaleString()}</TableCell>
                        <TableCell>${comp.pricePerSF.toLocaleString()}</TableCell>
                        <TableCell>{format(comp.saleDate, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewSaleComp(comp)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditSaleCompClick(comp)}>
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSaleCompClick(comp)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredSaleComps.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No sale comparables found matching your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="lease">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size (SF)</TableHead>
                      <TableHead>Lease Rate</TableHead>
                      <TableHead>Terms</TableHead>
                      <TableHead>Lease Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaseComps.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p>{comp.propertyName}</p>
                            <p className="text-xs text-muted-foreground">{comp.address}</p>
                          </div>
                        </TableCell>
                        <TableCell>{comp.propertyType}</TableCell>
                        <TableCell>{comp.size.toLocaleString()}</TableCell>
                        <TableCell>
                          ${comp.leaseRate.toFixed(2)} {comp.rateType === "Annual" ? "PSF/yr" : "PSF/mo"}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{comp.leaseType}</p>
                            <p className="text-xs text-muted-foreground">{comp.term} months</p>
                          </div>
                        </TableCell>
                        <TableCell>{format(comp.leaseDate, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewLeaseComp(comp)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditLeaseCompClick(comp)}>
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteLeaseCompClick(comp)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredLeaseComps.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No lease comparables found matching your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Sale Comp Dialog */}
      <Dialog open={isAddSaleCompOpen} onOpenChange={setIsAddSaleCompOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Sale Comparable</DialogTitle>
            <DialogDescription>Enter sale comparable details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyName">Property Name*</Label>
                <Input 
                  id="propertyName" 
                  placeholder="Enter property name" 
                  value={saleFormData.propertyName}
                  onChange={handleSaleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type*</Label>
                <Select onValueChange={handleSalePropertyTypeSelect}>
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Multifamily">Multifamily</SelectItem>
                    <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Property Address*</Label>
              <Input 
                id="address" 
                placeholder="Enter property address"
                value={saleFormData.address}
                onChange={handleSaleFormChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Size (SF)*</Label>
                <Input 
                  id="size" 
                  type="number" 
                  placeholder="0"
                  value={saleFormData.size}
                  onChange={handleSaleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price ($)*</Label>
                <Input 
                  id="salePrice" 
                  type="number" 
                  placeholder="0"
                  value={saleFormData.salePrice}
                  onChange={handleSaleFormChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="saleDate">Sale Date*</Label>
              <Input 
                id="saleDate" 
                type="date"
                value={saleFormData.saleDate}
                onChange={handleSaleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input 
                id="notes" 
                placeholder="Enter any notable property features or transaction details"
                value={saleFormData.notes}
                onChange={handleSaleFormChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSaleCompOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSaleComp}>Add Sale Comparable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Lease Comp Dialog */}
      <Dialog open={isAddLeaseCompOpen} onOpenChange={setIsAddLeaseCompOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Lease Comparable</DialogTitle>
            <DialogDescription>Enter lease comparable details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyName">Property Name*</Label>
                <Input 
                  id="propertyName" 
                  placeholder="Enter property name" 
                  value={leaseFormData.propertyName}
                  onChange={handleLeaseFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type*</Label>
                <Select onValueChange={handleLeasePropertyTypeSelect}>
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Multifamily">Multifamily</SelectItem>
                    <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Property Address*</Label>
              <Input 
                id="address" 
                placeholder="Enter property address"
                value={leaseFormData.address}
                onChange={handleLeaseFormChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Size (SF)*</Label>
                <Input 
                  id="size" 
                  type="number" 
                  placeholder="0"
                  value={leaseFormData.size}
                  onChange={handleLeaseFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseRate">Lease Rate ($)*</Label>
                <Input 
                  id="leaseRate" 
                  type="number" 
                  placeholder="0"
                  value={leaseFormData.leaseRate}
                  onChange={handleLeaseFormChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rateType">Rate Type*</Label>
                <Select defaultValue={leaseFormData.rateType} onValueChange={handleRateTypeSelect}>
                  <SelectTrigger id="rateType">
                    <SelectValue placeholder="Select rate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual">Annual (per year)</SelectItem>
                    <SelectItem value="Monthly">Monthly (per month)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseType">Lease Type*</Label>
                <Select defaultValue={leaseFormData.leaseType} onValueChange={handleLeaseTypeSelect}>
                  <SelectTrigger id="leaseType">
                    <SelectValue placeholder="Select lease type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Service">Full Service</SelectItem>
                    <SelectItem value="Modified Gross">Modified Gross</SelectItem>
                    <SelectItem value="NNN">NNN (Triple Net)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="term">Lease Term (months)*</Label>
                <Input 
                  id="term" 
                  type="number"
                  placeholder="0"
                  value={leaseFormData.term}
                  onChange={handleLeaseFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseDate">Lease Date*</Label>
                <Input 
                  id="leaseDate" 
                  type="date"
                  value={leaseFormData.leaseDate}
                  onChange={handleLeaseFormChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input 
                id="notes" 
                placeholder="Enter any notable property features or lease details"
                value={leaseFormData.notes}
                onChange={handleLeaseFormChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLeaseCompOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLeaseComp}>Add Lease Comparable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialogs, delete confirmation dialogs, and view details modals for both sale and lease comps */}
      {/* For brevity, these are very similar to the add dialogs, with small modifications */}
      
      {/* View Sale Comp Details Modal */}
      {selectedSaleComp && (
        <ViewDetailsModal
          isOpen={isViewSaleCompOpen}
          onClose={() => setIsViewSaleCompOpen(false)}
          title="Sale Comparable Details"
          description={selectedSaleComp.propertyName}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Property Name</h3>
                <p className="text-base">{selectedSaleComp.propertyName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Property Type</h3>
                <p className="text-base">{selectedSaleComp.propertyType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                <p className="text-base">{selectedSaleComp.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                <p className="text-base">{selectedSaleComp.size.toLocaleString()} SF</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Sale Price</h3>
                <p className="text-base font-semibold">${selectedSaleComp.salePrice.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Price Per Square Foot</h3>
                <p className="text-base">${selectedSaleComp.pricePerSF.toLocaleString()} PSF</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Sale Date</h3>
                <p className="text-base">{format(selectedSaleComp.saleDate, 'MMMM d, yyyy')}</p>
              </div>
            </div>
            {selectedSaleComp.notes && (
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p>{selectedSaleComp.notes}</p>
                </div>
              </div>
            )}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => handleEditSaleCompClick(selectedSaleComp)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteSaleCompClick(selectedSaleComp)}>Delete</Button>
            </div>
          </div>
        </ViewDetailsModal>
      )}
      
      {/* View Lease Comp Details Modal */}
      {selectedLeaseComp && (
        <ViewDetailsModal
          isOpen={isViewLeaseCompOpen}
          onClose={() => setIsViewLeaseCompOpen(false)}
          title="Lease Comparable Details"
          description={selectedLeaseComp.propertyName}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Property Name</h3>
                <p className="text-base">{selectedLeaseComp.propertyName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Property Type</h3>
                <p className="text-base">{selectedLeaseComp.propertyType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                <p className="text-base">{selectedLeaseComp.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                <p className="text-base">{selectedLeaseComp.size.toLocaleString()} SF</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lease Rate</h3>
                <p className="text-base font-semibold">${selectedLeaseComp.leaseRate.toFixed(2)} PSF/{selectedLeaseComp.rateType === "Annual" ? "yr" : "mo"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lease Type</h3>
                <p className="text-base">{selectedLeaseComp.leaseType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lease Term</h3>
                <p className="text-base">{selectedLeaseComp.term} months</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lease Date</h3>
                <p className="text-base">{format(selectedLeaseComp.leaseDate, 'MMMM d, yyyy')}</p>
              </div>
            </div>
            {selectedLeaseComp.notes && (
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p>{selectedLeaseComp.notes}</p>
                </div>
              </div>
            )}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => handleEditLeaseCompClick(selectedLeaseComp)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteLeaseCompClick(selectedLeaseComp)}>Delete</Button>
            </div>
          </div>
        </ViewDetailsModal>
      )}

      {/* Additional dialogs for sale comp edit and delete, lease comp edit and delete would be included here */}
    </div>
  );
};

export default MarketComps;
