import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Search, FilePlus, FileEdit, Trash2, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isAfter, isBefore, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import ViewDetailsModal from "./ViewDetailsModal";

const MOCK_LEASES = [
  {
    id: "L001",
    propertyId: "P001",
    propertyName: "Oakwood Tower",
    tenantName: "Acme Corporation",
    unit: "Suite 1200",
    startDate: new Date("2022-01-15"),
    endDate: new Date("2027-01-14"),
    currentRent: 38500,
    renewalNoticeDate: new Date("2026-07-14"),
    hasTroubleTerms: true,
  },
  {
    id: "L002",
    propertyId: "P002",
    propertyName: "Riverfront Plaza",
    tenantName: "Global Tech Solutions",
    unit: "Floor 8",
    startDate: new Date("2021-06-01"),
    endDate: new Date("2026-05-31"),
    currentRent: 42000,
    renewalNoticeDate: new Date("2025-11-30"),
    hasTroubleTerms: false,
  },
  {
    id: "L003",
    propertyId: "P001",
    propertyName: "Oakwood Tower",
    tenantName: "Financial Partners LLC",
    unit: "Suite 850",
    startDate: new Date("2023-03-01"),
    endDate: new Date("2028-02-28"),
    currentRent: 31200,
    renewalNoticeDate: new Date("2027-08-31"),
    hasTroubleTerms: false,
  },
  {
    id: "L004",
    propertyId: "P003",
    propertyName: "Metro Business Center",
    tenantName: "Legal Associates Group",
    unit: "Suite 400",
    startDate: new Date("2020-10-15"),
    endDate: new Date("2025-10-14"),
    currentRent: 28500,
    renewalNoticeDate: new Date("2025-04-14"),
    hasTroubleTerms: true,
  },
  {
    id: "L005",
    propertyId: "P004",
    propertyName: "Parkside Office Park",
    tenantName: "Healthcare Solutions Inc.",
    unit: "Building C, Floor 2",
    startDate: new Date("2022-08-01"),
    endDate: new Date("2027-07-31"),
    currentRent: 34800,
    renewalNoticeDate: new Date("2026-01-31"),
    hasTroubleTerms: false,
  }
];

const getDaysUntil = (date: Date) => {
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getDateStatus = (date: Date) => {
  const daysUntil = getDaysUntil(date);
  if (daysUntil < 0) return "expired";
  if (daysUntil <= 30) return "urgent";
  if (daysUntil <= 90) return "warning";
  if (daysUntil <= 180) return "notice";
  return "normal";
};

const LeaseIntelligence = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("all");
  const [filterTimeframe, setFilterTimeframe] = useState("all");
  const [isAddLeaseOpen, setIsAddLeaseOpen] = useState(false);
  const [leases, setLeases] = useState(MOCK_LEASES);
  const [selectedLease, setSelectedLease] = useState(null);
  const [isViewLeaseOpen, setIsViewLeaseOpen] = useState(false);
  const [isEditLeaseOpen, setIsEditLeaseOpen] = useState(false);
  const [isDeleteLeaseOpen, setIsDeleteLeaseOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    propertyId: "",
    propertyName: "",
    tenantName: "",
    unit: "",
    startDate: "",
    endDate: "",
    currentRent: "",
    renewalNoticeDate: "",
    notes: "",
  });

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = 
      lease.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.unit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProperty = filterProperty === "all" || lease.propertyId === filterProperty;
    
    let matchesTimeframe = true;
    const today = new Date();
    const daysUntil = getDaysUntil(lease.endDate);
    
    if (filterTimeframe === "30days") {
      matchesTimeframe = daysUntil <= 30 && daysUntil >= 0;
    } else if (filterTimeframe === "90days") {
      matchesTimeframe = daysUntil <= 90 && daysUntil >= 0;
    } else if (filterTimeframe === "180days") {
      matchesTimeframe = daysUntil <= 180 && daysUntil >= 0;
    }
    
    return matchesSearch && matchesProperty && matchesTimeframe;
  });

  const getUpcomingDates = () => {
    const today = new Date();
    const next180Days = addDays(today, 180);
    
    return MOCK_LEASES
      .filter(lease => {
        const endDateInRange = isAfter(lease.endDate, today) && isBefore(lease.endDate, next180Days);
        const renewalNoticeInRange = isAfter(lease.renewalNoticeDate, today) && isBefore(lease.renewalNoticeDate, next180Days);
        return endDateInRange || renewalNoticeInRange;
      })
      .map(lease => {
        const endDaysRemaining = getDaysUntil(lease.endDate);
        const renewalDaysRemaining = getDaysUntil(lease.renewalNoticeDate);
        
        const dates = [];
        if (endDaysRemaining >= 0 && endDaysRemaining <= 180) {
          dates.push({
            leaseId: lease.id,
            propertyName: lease.propertyName,
            tenantName: lease.tenantName,
            date: lease.endDate,
            type: "Lease Expiration",
            daysRemaining: endDaysRemaining,
            status: getDateStatus(lease.endDate)
          });
        }
        
        if (renewalDaysRemaining >= 0 && renewalDaysRemaining <= 180) {
          dates.push({
            leaseId: lease.id,
            propertyName: lease.propertyName,
            tenantName: lease.tenantName,
            date: lease.renewalNoticeDate,
            type: "Renewal Notice",
            daysRemaining: renewalDaysRemaining,
            status: getDateStatus(lease.renewalNoticeDate)
          });
        }
        
        return dates;
      })
      .flat()
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  };

  const upcomingDates = getUpcomingDates();

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

  const handleAddLease = () => {
    const newLease = {
      id: `L${(leases.length + 1).toString().padStart(3, '0')}`,
      propertyId: formData.propertyId,
      propertyName: formData.propertyName,
      tenantName: formData.tenantName,
      unit: formData.unit,
      startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
      endDate: formData.endDate ? new Date(formData.endDate) : new Date(),
      currentRent: parseFloat(formData.currentRent) || 0,
      renewalNoticeDate: formData.renewalNoticeDate ? new Date(formData.renewalNoticeDate) : new Date(),
      hasTroubleTerms: false,
    };

    setLeases([...leases, newLease]);
    setIsAddLeaseOpen(false);
    setFormData({
      propertyId: "",
      propertyName: "",
      tenantName: "",
      unit: "",
      startDate: "",
      endDate: "",
      currentRent: "",
      renewalNoticeDate: "",
      notes: "",
    });

    toast({
      title: "Lease added",
      description: `New lease for ${newLease.tenantName} has been added successfully.`
    });
  };

  const handleEditLease = () => {
    if (!selectedLease) return;

    const updatedLeases = leases.map(lease => 
      lease.id === selectedLease.id 
        ? {
            ...lease,
            propertyId: formData.propertyId || lease.propertyId,
            propertyName: formData.propertyName || lease.propertyName,
            tenantName: formData.tenantName || lease.tenantName,
            unit: formData.unit || lease.unit,
            startDate: formData.startDate ? new Date(formData.startDate) : lease.startDate,
            endDate: formData.endDate ? new Date(formData.endDate) : lease.endDate,
            currentRent: parseFloat(formData.currentRent) || lease.currentRent,
            renewalNoticeDate: formData.renewalNoticeDate ? new Date(formData.renewalNoticeDate) : lease.renewalNoticeDate,
          }
        : lease
    );

    setLeases(updatedLeases);
    setIsEditLeaseOpen(false);
    setSelectedLease(null);
    
    toast({
      title: "Lease updated",
      description: `Lease for ${formData.tenantName} has been updated successfully.`
    });
  };

  const handleDeleteLease = () => {
    if (!selectedLease) return;
    
    const updatedLeases = leases.filter(lease => lease.id !== selectedLease.id);
    setLeases(updatedLeases);
    setIsDeleteLeaseOpen(false);
    setSelectedLease(null);
    
    toast({
      title: "Lease deleted",
      description: `Lease has been deleted successfully.`
    });
  };

  const handleViewLease = (lease) => {
    setSelectedLease(lease);
    setIsViewLeaseOpen(true);
  };

  const handleEditLeaseClick = (lease) => {
    setSelectedLease(lease);
    setFormData({
      propertyId: lease.propertyId,
      propertyName: lease.propertyName,
      tenantName: lease.tenantName,
      unit: lease.unit,
      startDate: format(lease.startDate, 'yyyy-MM-dd'),
      endDate: format(lease.endDate, 'yyyy-MM-dd'),
      currentRent: lease.currentRent.toString(),
      renewalNoticeDate: format(lease.renewalNoticeDate, 'yyyy-MM-dd'),
      notes: "",
    });
    setIsEditLeaseOpen(true);
  };

  const handleDeleteLeaseClick = (lease) => {
    setSelectedLease(lease);
    setIsDeleteLeaseOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Critical Dates Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-yellow-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Next 30 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {upcomingDates.filter(d => d.daysRemaining <= 30).length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">31-90 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {upcomingDates.filter(d => d.daysRemaining > 30 && d.daysRemaining <= 90).length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">91-180 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {upcomingDates.filter(d => d.daysRemaining > 90 && d.daysRemaining <= 180).length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingDates.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-3">Upcoming Critical Dates</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Days Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingDates.slice(0, 5).map((event, index) => (
                    <TableRow key={`${event.leaseId}-${event.type}-${index}`}>
                      <TableCell>{event.propertyName}</TableCell>
                      <TableCell>{event.tenantName}</TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{format(event.date, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            event.status === 'urgent' ? 'bg-red-500' : 
                            event.status === 'warning' ? 'bg-amber-500' : 
                            event.status === 'notice' ? 'bg-blue-500' : 'bg-green-500'
                          }
                        >
                          {event.daysRemaining} {event.daysRemaining === 1 ? 'day' : 'days'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {upcomingDates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No upcoming critical dates</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span className="flex items-center">Lease Records</span>
            <Button onClick={() => setIsAddLeaseOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Add Lease
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by property, tenant or unit..."
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

              <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Timeframes</SelectItem>
                  <SelectItem value="30days">Next 30 Days</SelectItem>
                  <SelectItem value="90days">Next 90 Days</SelectItem>
                  <SelectItem value="180days">Next 180 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Unit/Suite</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Current Rent</TableHead>
                  <TableHead>Renewal Notice</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeases.map((lease) => (
                  <TableRow key={lease.id}>
                    <TableCell>{lease.propertyName}</TableCell>
                    <TableCell>{lease.tenantName}</TableCell>
                    <TableCell>{lease.unit}</TableCell>
                    <TableCell>{format(lease.startDate, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <span className="flex items-center">
                        {format(lease.endDate, 'MMM dd, yyyy')}
                        {getDateStatus(lease.endDate) === 'urgent' && (
                          <Badge className="ml-2 bg-red-500">
                            {getDaysUntil(lease.endDate)} days
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>${lease.currentRent.toLocaleString()}</TableCell>
                    <TableCell>{format(lease.renewalNoticeDate, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewLease(lease)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditLeaseClick(lease)}>
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteLeaseClick(lease)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLeases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No lease records found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddLeaseOpen} onOpenChange={setIsAddLeaseOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Lease</DialogTitle>
            <DialogDescription>Enter lease details below. Fields marked with * are required.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property">Property*</Label>
                <Select onValueChange={handlePropertySelect}>
                  <SelectTrigger id="property">
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
                <Label htmlFor="tenant">Tenant Name*</Label>
                <Input 
                  id="tenantName" 
                  placeholder="Enter tenant name" 
                  value={formData.tenantName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit/Suite*</Label>
              <Input 
                id="unit" 
                placeholder="Enter unit or suite identifier"
                value={formData.unit}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Lease Start Date*</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Lease End Date*</Label>
                <Input 
                  id="endDate" 
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentRent">Current Rent (Monthly)*</Label>
                <Input 
                  id="currentRent" 
                  type="number" 
                  placeholder="0.00"
                  value={formData.currentRent}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="renewalNotice">Renewal Notice Date*</Label>
                <Input 
                  id="renewalNoticeDate" 
                  type="date"
                  value={formData.renewalNoticeDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Key Clauses / Notes</Label>
              <Input 
                id="notes" 
                placeholder="Enter any important clauses or notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLeaseOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLease}>Add Lease</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditLeaseOpen} onOpenChange={setIsEditLeaseOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Lease</DialogTitle>
            <DialogDescription>Update lease details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property">Property</Label>
                <Select onValueChange={handlePropertySelect} defaultValue={formData.propertyId}>
                  <SelectTrigger id="property">
                    <SelectValue placeholder={formData.propertyName} />
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
                <Label htmlFor="tenant">Tenant Name</Label>
                <Input 
                  id="tenantName" 
                  placeholder="Enter tenant name" 
                  value={formData.tenantName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit/Suite</Label>
              <Input 
                id="unit" 
                placeholder="Enter unit or suite identifier"
                value={formData.unit}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Lease Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Lease End Date</Label>
                <Input 
                  id="endDate" 
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentRent">Current Rent (Monthly)</Label>
                <Input 
                  id="currentRent" 
                  type="number" 
                  placeholder="0.00"
                  value={formData.currentRent}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="renewalNotice">Renewal Notice Date</Label>
                <Input 
                  id="renewalNoticeDate" 
                  type="date"
                  value={formData.renewalNoticeDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Key Clauses / Notes</Label>
              <Input 
                id="notes" 
                placeholder="Enter any important clauses or notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditLeaseOpen(false)}>Cancel</Button>
            <Button onClick={handleEditLease}>Update Lease</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteLeaseOpen} onOpenChange={setIsDeleteLeaseOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lease? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteLeaseOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteLease}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedLease && (
        <ViewDetailsModal
          isOpen={isViewLeaseOpen}
          onClose={() => setIsViewLeaseOpen(false)}
          title="Lease Details"
          description={`${selectedLease.propertyName} - ${selectedLease.tenantName}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Property</h3>
                <p className="text-base">{selectedLease.propertyName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Tenant</h3>
                <p className="text-base">{selectedLease.tenantName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Unit/Suite</h3>
                <p className="text-base">{selectedLease.unit}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Current Rent</h3>
                <p className="text-base font-semibold">${selectedLease.currentRent.toLocaleString()}/month</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lease Start Date</h3>
                <p className="text-base">{format(selectedLease.startDate, 'MMMM d, yyyy')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lease End Date</h3>
                <p className="text-base">
                  {format(selectedLease.endDate, 'MMMM d, yyyy')}
                  {getDateStatus(selectedLease.endDate) === 'urgent' && (
                    <Badge className="ml-2 bg-red-500">
                      {getDaysUntil(selectedLease.endDate)} days remaining
                    </Badge>
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Renewal Notice Date</h3>
                <p className="text-base">
                  {format(selectedLease.renewalNoticeDate, 'MMMM d, yyyy')}
                  {getDateStatus(selectedLease.renewalNoticeDate) === 'urgent' && (
                    <Badge className="ml-2 bg-red-500">
                      {getDaysUntil(selectedLease.renewalNoticeDate)} days remaining
                    </Badge>
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lease Term</h3>
                <p className="text-base">
                  {Math.round((selectedLease.endDate.getTime() - selectedLease.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                </p>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Clauses & Notes</h3>
              <div className="bg-muted p-3 rounded-md">
                {selectedLease.hasTroubleTerms ? (
                  <div className="text-red-500">⚠️ This lease contains terms that require attention</div>
                ) : (
                  <p className="text-muted-foreground italic">No special clauses or notes recorded.</p>
                )}
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => handleEditLeaseClick(selectedLease)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteLeaseClick(selectedLease)}>Delete</Button>
            </div>
          </div>
        </ViewDetailsModal>
      )}
    </div>
  );
};

export default LeaseIntelligence;
