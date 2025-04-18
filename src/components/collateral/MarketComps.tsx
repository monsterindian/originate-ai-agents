
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FilePlus, FileEdit, Trash2, Building, DollarSign, Globe, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { LineChart, BarChart } from "@/components/ui/charts";

// Mock data for initial UI
const MOCK_SALE_COMPS = [
  {
    id: "S001",
    address: "123 Main Street",
    city: "Downtown",
    state: "CA",
    zip: "90001",
    propertyType: "Office",
    size: 25000,
    salePrice: 7500000,
    pricePerSqFt: 300,
    transactionDate: new Date("2023-02-15"),
    notes: "Class A office building with recent renovations"
  },
  {
    id: "S002",
    address: "456 Market Avenue",
    city: "Westside",
    state: "CA",
    zip: "90002",
    propertyType: "Retail",
    size: 12000,
    salePrice: 4800000,
    pricePerSqFt: 400,
    transactionDate: new Date("2023-04-22"),
    notes: "Corner lot retail center, fully leased"
  },
  {
    id: "S003",
    address: "789 Industrial Parkway",
    city: "Eastside",
    state: "CA",
    zip: "90003",
    propertyType: "Industrial",
    size: 50000,
    salePrice: 8500000,
    pricePerSqFt: 170,
    transactionDate: new Date("2023-01-10"),
    notes: "Modern warehouse with high ceilings"
  },
  {
    id: "S004",
    address: "321 Tower Road",
    city: "Downtown",
    state: "CA",
    zip: "90001",
    propertyType: "Office",
    size: 30000,
    salePrice: 9600000,
    pricePerSqFt: 320,
    transactionDate: new Date("2023-05-05"),
    notes: "High-rise office building with parking"
  },
  {
    id: "S005",
    address: "555 Commerce Street",
    city: "Northside",
    state: "CA",
    zip: "90004",
    propertyType: "Mixed Use",
    size: 18000,
    salePrice: 6300000,
    pricePerSqFt: 350,
    transactionDate: new Date("2023-03-18"),
    notes: "Ground floor retail with apartments above"
  }
];

const MOCK_LEASE_COMPS = [
  {
    id: "L001",
    address: "123 Main Street, Suite 400",
    city: "Downtown",
    state: "CA",
    zip: "90001",
    propertyType: "Office",
    size: 5000,
    leaseRate: 45,
    rateType: "Annual",
    leaseType: "Full Service",
    transactionDate: new Date("2023-02-01"),
    termYears: 5,
    notes: "Class A office space"
  },
  {
    id: "L002",
    address: "456 Market Avenue, Space B",
    city: "Westside",
    state: "CA",
    zip: "90002",
    propertyType: "Retail",
    size: 3200,
    leaseRate: 38,
    rateType: "Annual",
    leaseType: "NNN",
    transactionDate: new Date("2023-03-15"),
    termYears: 10,
    notes: "High-traffic retail location"
  },
  {
    id: "L003",
    address: "789 Industrial Parkway, Unit 5",
    city: "Eastside",
    state: "CA",
    zip: "90003",
    propertyType: "Industrial",
    size: 12000,
    leaseRate: 1.25,
    rateType: "Monthly",
    leaseType: "Modified Gross",
    transactionDate: new Date("2023-01-20"),
    termYears: 7,
    notes: "Warehouse space with loading docks"
  },
  {
    id: "L004",
    address: "321 Tower Road, Floor 12",
    city: "Downtown",
    state: "CA",
    zip: "90001",
    propertyType: "Office",
    size: 8500,
    leaseRate: 48,
    rateType: "Annual",
    leaseType: "Full Service",
    transactionDate: new Date("2023-04-10"),
    termYears: 3,
    notes: "Premium office space with city views"
  },
  {
    id: "L005",
    address: "555 Commerce Street, Suite 200",
    city: "Northside",
    state: "CA",
    zip: "90004",
    propertyType: "Office",
    size: 4200,
    leaseRate: 42,
    rateType: "Annual",
    leaseType: "Modified Gross",
    transactionDate: new Date("2023-05-01"),
    termYears: 5,
    notes: "Medical office space"
  }
];

// Prepare chart data
const getSalePriceByTypeData = () => {
  const propertyTypes = Array.from(new Set(MOCK_SALE_COMPS.map(comp => comp.propertyType)));
  
  return propertyTypes.map(type => {
    const comps = MOCK_SALE_COMPS.filter(comp => comp.propertyType === type);
    const avgPrice = comps.reduce((sum, comp) => sum + comp.pricePerSqFt, 0) / comps.length;
    
    return {
      type,
      value: Math.round(avgPrice)
    };
  });
};

const getLeaseRateByTypeData = () => {
  const propertyTypes = Array.from(new Set(MOCK_LEASE_COMPS.map(comp => comp.propertyType)));
  
  return propertyTypes.map(type => {
    const comps = MOCK_LEASE_COMPS.filter(comp => comp.propertyType === type);
    // Normalize all rates to annual
    const rates = comps.map(comp => {
      if (comp.rateType === "Monthly") {
        return comp.leaseRate * 12;
      }
      return comp.leaseRate;
    });
    const avgRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    
    return {
      type,
      value: Math.round(avgRate)
    };
  });
};

const MarketComps = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPropertyType, setFilterPropertyType] = useState("all");
  const [isAddSaleCompOpen, setIsAddSaleCompOpen] = useState(false);
  const [isAddLeaseCompOpen, setIsAddLeaseCompOpen] = useState(false);
  
  // Filter sale comps
  const filteredSaleComps = MOCK_SALE_COMPS.filter(comp => {
    const matchesSearch = 
      comp.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPropertyType = filterPropertyType === "all" || comp.propertyType === filterPropertyType;
    
    return matchesSearch && matchesPropertyType;
  });
  
  // Filter lease comps
  const filteredLeaseComps = MOCK_LEASE_COMPS.filter(comp => {
    const matchesSearch = 
      comp.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPropertyType = filterPropertyType === "all" || comp.propertyType === filterPropertyType;
    
    return matchesSearch && matchesPropertyType;
  });

  // Prepare chart data
  const salePriceByTypeData = getSalePriceByTypeData();
  const leaseRateByTypeData = getLeaseRateByTypeData();
  
  // Chart data for comparisons
  const comparisonChartData = [
    { category: "Office", "Sale Price ($/sf)": 310, "Lease Rate ($/sf/yr)": 45 },
    { category: "Retail", "Sale Price ($/sf)": 400, "Lease Rate ($/sf/yr)": 38 },
    { category: "Industrial", "Sale Price ($/sf)": 170, "Lease Rate ($/sf/yr)": 15 },
    { category: "Mixed Use", "Sale Price ($/sf)": 350, "Lease Rate ($/sf/yr)": 42 },
  ];

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sale Price by Property Type ($/sf)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <BarChart
                    data={salePriceByTypeData}
                    dataKey="type"
                    categories={["value"]}
                    valueFormatter={(value) => `$${value}/sf`}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Lease Rate by Property Type ($/sf/yr)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <BarChart
                    data={leaseRateByTypeData}
                    dataKey="type"
                    categories={["value"]}
                    valueFormatter={(value) => `$${value}/sf/yr`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Comparable Data Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Market Comps Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sale">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="sale">Sale Comps</TabsTrigger>
                <TabsTrigger value="lease">Lease Comps</TabsTrigger>
              </TabsList>
              
              <div className="space-x-2">
                <Button onClick={() => setIsAddSaleCompOpen(true)}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Sale Comp
                </Button>
                <Button onClick={() => setIsAddLeaseCompOpen(true)}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Lease Comp
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search comps..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Property Types</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="sale">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Property Type</TableHead>
                      <TableHead>Size (sf)</TableHead>
                      <TableHead>Sale Price</TableHead>
                      <TableHead>Price/SF</TableHead>
                      <TableHead>Transaction Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSaleComps.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{comp.address}</div>
                            <div className="text-xs text-muted-foreground">{comp.city}, {comp.state} {comp.zip}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {comp.propertyType}
                          </Badge>
                        </TableCell>
                        <TableCell>{comp.size.toLocaleString()}</TableCell>
                        <TableCell>${comp.salePrice.toLocaleString()}</TableCell>
                        <TableCell>${comp.pricePerSqFt}/sf</TableCell>
                        <TableCell>{format(comp.transactionDate, 'MMM dd, yyyy')}</TableCell>
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
                    {filteredSaleComps.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No sale comps found matching your search criteria
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
                      <TableHead>Address</TableHead>
                      <TableHead>Property Type</TableHead>
                      <TableHead>Size (sf)</TableHead>
                      <TableHead>Lease Rate</TableHead>
                      <TableHead>Lease Type</TableHead>
                      <TableHead>Term (Years)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaseComps.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{comp.address}</div>
                            <div className="text-xs text-muted-foreground">{comp.city}, {comp.state} {comp.zip}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {comp.propertyType}
                          </Badge>
                        </TableCell>
                        <TableCell>{comp.size.toLocaleString()}</TableCell>
                        <TableCell>
                          ${comp.leaseRate}/{comp.rateType === "Annual" ? "sf/yr" : "sf/mo"}
                        </TableCell>
                        <TableCell>{comp.leaseType}</TableCell>
                        <TableCell>{comp.termYears} {comp.termYears === 1 ? 'year' : 'years'}</TableCell>
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
                    {filteredLeaseComps.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No lease comps found matching your search criteria
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
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sale-address">Property Address</Label>
              <Input id="sale-address" placeholder="Enter full address" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sale-city">City</Label>
                <Input id="sale-city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale-state">State</Label>
                <Input id="sale-state" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale-zip">Zip Code</Label>
                <Input id="sale-zip" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sale-property-type">Property Type</Label>
                <Select>
                  <SelectTrigger id="sale-property-type">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale-size">Size (SF)</Label>
                <Input id="sale-size" type="number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sale-price">Sale Price ($)</Label>
                <Input id="sale-price" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale-date">Transaction Date</Label>
                <Input id="sale-date" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale-notes">Notes</Label>
              <Input id="sale-notes" placeholder="Additional information" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSaleCompOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddSaleCompOpen(false)}>Add Sale Comp</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Lease Comp Dialog */}
      <Dialog open={isAddLeaseCompOpen} onOpenChange={setIsAddLeaseCompOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Lease Comparable</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lease-address">Property Address</Label>
              <Input id="lease-address" placeholder="Enter full address including suite/unit" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lease-city">City</Label>
                <Input id="lease-city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lease-state">State</Label>
                <Input id="lease-state" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lease-zip">Zip Code</Label>
                <Input id="lease-zip" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lease-property-type">Property Type</Label>
                <Select>
                  <SelectTrigger id="lease-property-type">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lease-size">Size (SF)</Label>
                <Input id="lease-size" type="number" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lease-rate">Lease Rate</Label>
                <Input id="lease-rate" type="number" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lease-rate-type">Rate Type</Label>
                <Select>
                  <SelectTrigger id="lease-rate-type">
                    <SelectValue placeholder="Select rate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual">Annual ($/SF/YR)</SelectItem>
                    <SelectItem value="Monthly">Monthly ($/SF/MO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lease-term">Term (Years)</Label>
                <Input id="lease-term" type="number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lease-type">Lease Type</Label>
                <Select>
                  <SelectTrigger id="lease-type">
                    <SelectValue placeholder="Select lease type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Service">Full Service</SelectItem>
                    <SelectItem value="Modified Gross">Modified Gross</SelectItem>
                    <SelectItem value="NNN">NNN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lease-date">Transaction Date</Label>
                <Input id="lease-date" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lease-notes">Notes</Label>
              <Input id="lease-notes" placeholder="Additional information" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLeaseCompOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddLeaseCompOpen(false)}>Add Lease Comp</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketComps;
