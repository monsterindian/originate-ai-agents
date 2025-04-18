
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Search, FilePlus, FileEdit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isAfter, isBefore, isSameDay } from "date-fns";

// Mock data for initial UI
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

// Get status based on upcoming date
const getDateStatus = (date: Date) => {
  const daysUntil = getDaysUntil(date);
  if (daysUntil < 0) return "expired";
  if (daysUntil <= 30) return "urgent";
  if (daysUntil <= 90) return "warning";
  if (daysUntil <= 180) return "notice";
  return "normal";
};

const LeaseIntelligence = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("all");
  const [filterTimeframe, setFilterTimeframe] = useState("all");
  const [isAddLeaseOpen, setIsAddLeaseOpen] = useState(false);
  
  // Filter leases based on search term and filters
  const filteredLeases = MOCK_LEASES.filter(lease => {
    // Search term filtering
    const matchesSearch = 
      lease.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.unit.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Property filtering
    const matchesProperty = filterProperty === "all" || lease.propertyId === filterProperty;
    
    // Timeframe filtering for lease end dates
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

  // Get upcoming critical dates
  const getUpcomingDates = () => {
    const today = new Date();
    const next180Days = addDays(today, 180);
    
    return MOCK_LEASES
      .filter(lease => {
        // Check if lease end date or renewal notice date is within the next 180 days
        const endDateInRange = isAfter(lease.endDate, today) && isBefore(lease.endDate, next180Days);
        const renewalNoticeInRange = isAfter(lease.renewalNoticeDate, today) && isBefore(lease.renewalNoticeDate, next180Days);
        return endDateInRange || renewalNoticeInRange;
      })
      .map(lease => {
        const endDaysRemaining = getDaysUntil(lease.endDate);
        const renewalDaysRemaining = getDaysUntil(lease.renewalNoticeDate);
        
        // Return both dates if they're both upcoming
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

  return (
    <div className="space-y-6">
      {/* Critical Dates Dashboard */}
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

      {/* Lease Records */}
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
                        <Button variant="ghost" size="icon">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
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

      {/* Add Lease Dialog */}
      <Dialog open={isAddLeaseOpen} onOpenChange={setIsAddLeaseOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Lease</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property">Property</Label>
                <Select>
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
                <Label htmlFor="tenant">Tenant Name</Label>
                <Input id="tenant" placeholder="Enter tenant name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit/Suite</Label>
              <Input id="unit" placeholder="Enter unit or suite identifier" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Lease Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Lease End Date</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentRent">Current Rent (Monthly)</Label>
                <Input id="currentRent" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="renewalNotice">Renewal Notice Date</Label>
                <Input id="renewalNotice" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Key Clauses / Notes</Label>
              <Input id="notes" placeholder="Enter any important clauses or notes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLeaseOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddLeaseOpen(false)}>Add Lease</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaseIntelligence;
