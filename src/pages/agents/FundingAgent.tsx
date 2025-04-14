
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PiggyBank, Search, Filter, ArrowUpDown, MoreHorizontal, Info, CreditCard, DollarSign, CalendarClock, AlertCircle, CheckCircle2 } from "lucide-react";
import { FundingSource, LoanApplication, AssetClass, FundingRecommendation } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/services/mockDataService";

// Mock data for funding sources
const mockFundingSources: FundingSource[] = [
  {
    id: "FS-BANK001",
    name: "First National Bank",
    type: "bank",
    description: "Traditional bank offering competitive rates for prime borrowers across multiple asset classes.",
    minAmount: 50000,
    maxAmount: 5000000,
    interestRateRange: {
      min: 4.25,
      max: 7.5
    },
    eligibilityCriteria: {
      minCreditScore: 680,
      maxLTV: 80,
      preferredAssetClasses: ["residential_mortgage", "commercial_real_estate", "auto_loan"],
      maxDTI: 43,
    },
    processingTime: {
      min: 5,
      max: 15
    },
    availableFunds: 25000000,
    allocatedFunds: 12500000,
    status: "active",
    riskTolerance: "conservative",
    specialPrograms: ["First-time homebuyer", "Small business startup"],
    contactInfo: {
      name: "Sarah Johnson",
      email: "sjohnson@firstnational.example.com",
      phone: "(555) 123-4567"
    },
    dateAdded: "2023-01-15",
    lastUpdated: "2025-02-28"
  },
  {
    id: "FS-PE002",
    name: "Horizon Capital",
    type: "private_equity",
    description: "Private equity firm specializing in commercial real estate and high-growth business financing.",
    minAmount: 500000,
    maxAmount: 20000000,
    interestRateRange: {
      min: 6.75,
      max: 12.0
    },
    eligibilityCriteria: {
      maxLTV: 85,
      preferredAssetClasses: ["commercial_real_estate", "sme_loan"],
      businessRequirements: "Minimum 2 years in operation with demonstrated growth",
    },
    processingTime: {
      min: 10,
      max: 30
    },
    availableFunds: 100000000,
    allocatedFunds: 42000000,
    status: "active",
    riskTolerance: "aggressive",
    specialPrograms: ["Growth accelerator", "Acquisition financing"],
    contactInfo: {
      name: "Michael Chen",
      email: "mchen@horizoncapital.example.com",
      phone: "(555) 987-6543"
    },
    dateAdded: "2023-03-10",
    lastUpdated: "2025-03-15"
  },
  {
    id: "FS-CU003",
    name: "Community Credit Union",
    type: "credit_union",
    description: "Member-owned financial cooperative offering favorable rates for personal and small business loans.",
    minAmount: 5000,
    maxAmount: 500000,
    interestRateRange: {
      min: 3.75,
      max: 6.5
    },
    eligibilityCriteria: {
      minCreditScore: 640,
      maxLTV: 90,
      preferredAssetClasses: ["residential_mortgage", "auto_loan", "personal_loan"],
      maxDTI: 45,
      locationRestrictions: ["CA", "OR", "WA"]
    },
    processingTime: {
      min: 3,
      max: 10
    },
    availableFunds: 15000000,
    allocatedFunds: 9000000,
    status: "active",
    riskTolerance: "moderate",
    specialPrograms: ["Community business grants", "First-time homebuyer assistance"],
    contactInfo: {
      name: "David Rodriguez",
      email: "drodriguez@communitycredit.example.com",
      phone: "(555) 234-5678"
    },
    dateAdded: "2023-02-05",
    lastUpdated: "2025-03-01"
  },
  {
    id: "FS-GOV004",
    name: "Federal Housing Authority",
    type: "government_program",
    description: "Government-backed loan program designed to help first-time and low-to-moderate income homebuyers.",
    minAmount: 10000,
    maxAmount: 750000,
    interestRateRange: {
      min: 3.25,
      max: 5.5
    },
    eligibilityCriteria: {
      minCreditScore: 580,
      maxLTV: 96.5,
      preferredAssetClasses: ["residential_mortgage"],
      maxDTI: 50,
    },
    processingTime: {
      min: 15,
      max: 45
    },
    availableFunds: 200000000,
    allocatedFunds: 75000000,
    status: "active",
    riskTolerance: "moderate",
    specialPrograms: ["Down payment assistance", "Housing counseling programs"],
    contactInfo: {
      name: "Federal Housing Support",
      email: "support@fha.gov.example",
      phone: "(555) 876-5432"
    },
    dateAdded: "2023-01-01",
    lastUpdated: "2025-01-15"
  },
  {
    id: "FS-SEC005",
    name: "Pacific Securitization Trust",
    type: "securitization_pool",
    description: "Mortgage-backed security pool designed for conforming residential loans.",
    minAmount: 100000,
    maxAmount: 750000,
    interestRateRange: {
      min: 4.0,
      max: 6.0
    },
    eligibilityCriteria: {
      minCreditScore: 700,
      maxLTV: 80,
      preferredAssetClasses: ["residential_mortgage"],
      maxDTI: 40,
    },
    processingTime: {
      min: 7,
      max: 14
    },
    availableFunds: 500000000,
    allocatedFunds: 325000000,
    status: "active",
    riskTolerance: "conservative",
    dateAdded: "2023-04-15",
    lastUpdated: "2025-02-10"
  },
  {
    id: "FS-P2P006",
    name: "LendConnect Platform",
    type: "peer_to_peer",
    description: "P2P lending marketplace connecting individual investors with borrowers seeking personal and small business loans.",
    minAmount: 1000,
    maxAmount: 100000,
    interestRateRange: {
      min: 5.0,
      max: 15.0
    },
    eligibilityCriteria: {
      minCreditScore: 620,
      preferredAssetClasses: ["personal_loan", "sme_loan"],
      maxDTI: 50,
    },
    processingTime: {
      min: 1,
      max: 5
    },
    availableFunds: 5000000,
    allocatedFunds: 3200000,
    status: "active",
    riskTolerance: "aggressive",
    specialPrograms: ["Fast funding", "Flexible credit requirements"],
    contactInfo: {
      name: "LendConnect Support",
      email: "support@lendconnect.example.com",
      phone: "(555) 345-6789"
    },
    dateAdded: "2023-06-20",
    lastUpdated: "2025-03-25"
  },
  {
    id: "FS-INT007",
    name: "Credion Internal Fund",
    type: "internal_funds",
    description: "Internal capital allocation for strategic partnerships and high-priority loan programs.",
    minAmount: 10000,
    maxAmount: 1000000,
    interestRateRange: {
      min: 3.5,
      max: 9.0
    },
    eligibilityCriteria: {
      preferredAssetClasses: ["residential_mortgage", "commercial_real_estate", "sme_loan", "equipment_finance"],
    },
    processingTime: {
      min: 2,
      max: 7
    },
    availableFunds: 10000000,
    allocatedFunds: 4500000,
    status: "limited",
    riskTolerance: "moderate",
    specialPrograms: ["Employee program", "Strategic partnerships"],
    contactInfo: {
      name: "Internal Funding Team",
      email: "funding@credion.example.com",
      phone: "(555) 456-7890"
    },
    dateAdded: "2023-01-10",
    lastUpdated: "2025-03-10"
  }
];

// Mock pending applications that need funding recommendations
const getPendingApplications = (): LoanApplication[] => {
  return [
    {
      id: "APP-123456",
      borrowerId: "B-ABCDEF",
      borrower: {
        id: "B-ABCDEF",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
        dateOfBirth: "1980-05-15",
        creditScore: 720,
        creditRating: "Good",
        income: 85000,
        address: {
          street: "123 Main St",
          city: "Portland",
          state: "OR",
          zipCode: "97201",
          country: "USA"
        },
        dateCreated: "2024-01-15",
        dateUpdated: "2024-02-10"
      },
      assetClass: "residential_mortgage",
      amount: 350000,
      term: 360,
      interestRate: 5.25,
      purpose: "Primary Residence Purchase",
      completeness: 95,
      displayStatus: "Approved",
      risk: "Low",
      collateral: {
        type: "Property",
        value: 425000,
        description: "3BR/2BA Single Family Home"
      },
      status: "approved",
      documents: [],
      notes: [],
      dateCreated: "2024-01-20",
      dateUpdated: "2024-03-15",
      dateSubmitted: "2024-01-22",
      dateApproved: "2024-03-10",
      agentAssignments: {
        intakeAgentId: "intake-123",
        processingAgentId: "processing-456",
        underwritingAgentId: "underwriting-789",
        decisionAgentId: "decision-012"
      }
    },
    {
      id: "APP-234567",
      borrowerId: "B-BCDEFG",
      borrower: {
        id: "B-BCDEFG",
        companyName: "Tech Solutions Inc",
        firstName: "",
        lastName: "",
        email: "info@techsolutions.example.com",
        phone: "(555) 987-6543",
        taxId: "12-3456789",
        creditScore: 680,
        creditRating: "Fair",
        annualRevenue: 2500000,
        address: {
          street: "456 Business Pkwy",
          city: "Seattle",
          state: "WA",
          zipCode: "98101",
          country: "USA"
        },
        industry: "Technology",
        yearsInBusiness: 5,
        dateCreated: "2023-11-05",
        dateUpdated: "2024-01-25"
      },
      assetClass: "sme_loan",
      amount: 750000,
      term: 60,
      interestRate: 7.5,
      purpose: "Business Expansion",
      completeness: 98,
      displayStatus: "Approved",
      risk: "Medium",
      status: "approved",
      documents: [],
      notes: [],
      dateCreated: "2023-12-10",
      dateUpdated: "2024-03-05",
      dateSubmitted: "2023-12-15",
      dateApproved: "2024-03-01",
      agentAssignments: {
        intakeAgentId: "intake-123",
        processingAgentId: "processing-456",
        underwritingAgentId: "underwriting-789",
        decisionAgentId: "decision-012"
      }
    },
    {
      id: "APP-345678",
      borrowerId: "B-CDEFGH",
      borrower: {
        id: "B-CDEFGH",
        firstName: "Sarah",
        lastName: "Jones",
        email: "sarah.jones@example.com",
        phone: "(555) 456-7890",
        dateOfBirth: "1975-08-22",
        creditScore: 790,
        creditRating: "Excellent",
        income: 120000,
        address: {
          street: "789 Park Ave",
          city: "San Francisco",
          state: "CA",
          zipCode: "94107",
          country: "USA"
        },
        dateCreated: "2024-02-05",
        dateUpdated: "2024-03-01"
      },
      assetClass: "commercial_real_estate",
      amount: 1250000,
      term: 240,
      interestRate: 6.0,
      purpose: "Investment Property Acquisition",
      completeness: 100,
      displayStatus: "Approved",
      risk: "Low",
      collateral: {
        type: "Commercial Property",
        value: 1600000,
        description: "Mixed-use commercial property with retail and office space"
      },
      status: "approved",
      documents: [],
      notes: [],
      dateCreated: "2024-02-10",
      dateUpdated: "2024-03-20",
      dateSubmitted: "2024-02-12",
      dateApproved: "2024-03-15",
      agentAssignments: {
        intakeAgentId: "intake-123",
        processingAgentId: "processing-456",
        underwritingAgentId: "underwriting-789",
        decisionAgentId: "decision-012"
      }
    }
  ];
};

// Mock funding recommendations
const getMockFundingRecommendations = (): FundingRecommendation[] => {
  return [
    {
      applicationId: "APP-123456",
      fundingSourceId: "FS-BANK001",
      matchScore: 92,
      reasons: [
        "Credit score (720) meets bank's minimum requirement (680)",
        "Loan amount ($350,000) falls within bank's range ($50,000 - $5,000,000)",
        "LTV ratio (82.4%) is slightly above preferred maximum (80%)",
        "Residential mortgage is a preferred asset class for this funding source",
        "Low risk profile matches bank's conservative risk tolerance"
      ],
      alternatives: [
        {
          fundingSourceId: "FS-GOV004",
          matchScore: 88,
          reasons: ["Higher LTV allowed", "Lower credit score requirements"]
        },
        {
          fundingSourceId: "FS-CU003",
          matchScore: 85,
          reasons: ["Higher interest rates", "Faster processing time"]
        }
      ],
      dateGenerated: "2024-03-16",
      generatedBy: "funding-agent-001"
    },
    {
      applicationId: "APP-234567",
      fundingSourceId: "FS-PE002",
      matchScore: 90,
      reasons: [
        "Business loan type (SME) matches PE firm's preferred asset classes",
        "Loan amount ($750,000) falls within firm's range ($500,000 - $20,000,000)",
        "Business meets minimum operating history requirement (5 years)",
        "Medium risk profile aligns with firm's aggressive risk tolerance",
        "Business expansion purpose matches firm's growth accelerator program"
      ],
      alternatives: [
        {
          fundingSourceId: "FS-INT007",
          matchScore: 82,
          reasons: ["Lower interest rates", "Faster processing"]
        },
        {
          fundingSourceId: "FS-P2P006",
          matchScore: 70,
          reasons: ["Lower minimum amount", "More flexible terms"]
        }
      ],
      dateGenerated: "2024-03-06",
      generatedBy: "funding-agent-001"
    },
    {
      applicationId: "APP-345678",
      fundingSourceId: "FS-PE002",
      matchScore: 95,
      reasons: [
        "Commercial real estate asset class is preferred by this funding source",
        "Loan amount ($1,250,000) falls within firm's range ($500,000 - $20,000,000)",
        "Excellent credit profile and low risk rating",
        "LTV ratio (78.1%) is below the maximum threshold (85%)",
        "Investment purpose aligns with firm's portfolio strategy"
      ],
      alternatives: [
        {
          fundingSourceId: "FS-BANK001",
          matchScore: 87,
          reasons: ["Lower interest rates", "More conservative approach"]
        },
        {
          fundingSourceId: "FS-INT007",
          matchScore: 80,
          reasons: ["Faster processing", "Internal strategic priority"]
        }
      ],
      dateGenerated: "2024-03-21",
      generatedBy: "funding-agent-001"
    }
  ];
};

// Component to display funding source details in a dialog
const FundingSourceDetails = ({ source }: { source: FundingSource }) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
          <p className="text-sm capitalize">{source.type.replace(/_/g, ' ')}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
          <Badge variant={source.status === "active" ? "success" : source.status === "limited" ? "warning" : "destructive"}>
            {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
        <p className="text-sm">{source.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Loan Amount Range</h4>
          <p className="text-sm">{formatCurrency(source.minAmount)} - {formatCurrency(source.maxAmount)}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Interest Rate Range</h4>
          <p className="text-sm">{source.interestRateRange.min}% - {source.interestRateRange.max}%</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Processing Time</h4>
        <p className="text-sm">{source.processingTime.min} - {source.processingTime.max} days</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Available Funds</h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{formatCurrency(source.allocatedFunds)} / {formatCurrency(source.availableFunds)}</span>
            <span>{Math.round((source.allocatedFunds / source.availableFunds) * 100)}%</span>
          </div>
          <Progress value={(source.allocatedFunds / source.availableFunds) * 100} />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Risk Tolerance</h4>
        <p className="text-sm capitalize">{source.riskTolerance}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Eligibility Criteria</h4>
        <div className="text-sm space-y-1">
          {source.eligibilityCriteria.minCreditScore && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Min Credit Score:</span> {source.eligibilityCriteria.minCreditScore}
            </div>
          )}
          {source.eligibilityCriteria.maxLTV && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Max LTV:</span> {source.eligibilityCriteria.maxLTV}%
            </div>
          )}
          {source.eligibilityCriteria.maxDTI && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Max DTI:</span> {source.eligibilityCriteria.maxDTI}%
            </div>
          )}
          {source.eligibilityCriteria.preferredAssetClasses && source.eligibilityCriteria.preferredAssetClasses.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="font-medium">Preferred Asset Classes:</span>
              <div className="flex flex-wrap gap-1">
                {source.eligibilityCriteria.preferredAssetClasses.map((assetClass) => (
                  <Badge key={assetClass} variant="outline" className="capitalize">
                    {assetClass.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {source.eligibilityCriteria.businessRequirements && (
            <div className="flex flex-col gap-1">
              <span className="font-medium">Business Requirements:</span>
              <span>{source.eligibilityCriteria.businessRequirements}</span>
            </div>
          )}
          {source.eligibilityCriteria.locationRestrictions && source.eligibilityCriteria.locationRestrictions.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="font-medium">Location Restrictions:</span>
              <div className="flex flex-wrap gap-1">
                {source.eligibilityCriteria.locationRestrictions.map((location) => (
                  <Badge key={location} variant="outline">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {source.specialPrograms && source.specialPrograms.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Special Programs</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {source.specialPrograms.map((program) => (
              <Badge key={program} variant="secondary">
                {program}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {source.contactInfo && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
          <div className="text-sm">
            <p>{source.contactInfo.name}</p>
            <p>{source.contactInfo.email}</p>
            <p>{source.contactInfo.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for recommendations
const RecommendationDetails = ({ recommendation }: { recommendation: FundingRecommendation }) => {
  const fundingSource = mockFundingSources.find(source => source.id === recommendation.fundingSourceId);
  
  if (!fundingSource) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{fundingSource.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{fundingSource.type.replace(/_/g, ' ')}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Match Score:</span>
          <div className="flex items-center gap-1">
            <Progress value={recommendation.matchScore} className="w-24 h-2" />
            <span className="text-sm font-semibold">{recommendation.matchScore}%</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Recommendation Reasons:</h4>
        <ul className="space-y-1 text-sm ml-5 list-disc">
          {recommendation.reasons.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Alternative Funding Sources:</h4>
        <div className="space-y-3">
          {recommendation.alternatives.map((alt, index) => {
            const altSource = mockFundingSources.find(source => source.id === alt.fundingSourceId);
            if (!altSource) return null;
            
            return (
              <div key={index} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">{altSource.name}</h5>
                    <p className="text-sm text-muted-foreground capitalize">{altSource.type.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Score:</span>
                    <div className="flex items-center gap-1">
                      <Progress value={alt.matchScore} className="w-16 h-2" />
                      <span className="text-sm font-semibold">{alt.matchScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <h6 className="text-xs font-medium">Key advantages:</h6>
                  <ul className="space-y-0.5 text-xs ml-4 list-disc">
                    {alt.reasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div>Generated on: {new Date(recommendation.dateGenerated).toLocaleDateString()}</div>
        <div>By: {recommendation.generatedBy}</div>
      </div>
    </div>
  );
};

// Main component
const FundingAgent = () => {
  const [activeTab, setActiveTab] = useState("applications");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>("all");
  
  const fundingSources = mockFundingSources;
  const pendingApplications = getPendingApplications();
  const recommendations = getMockFundingRecommendations();
  
  // Filtered funding sources based on search and type filter
  const filteredSources = fundingSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         source.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = sourceTypeFilter === "all" || source.type === sourceTypeFilter;
    return matchesSearch && matchesType;
  });

  // Get unique funding source types for the filter
  const sourceTypes = Array.from(new Set(fundingSources.map(source => source.type)));

  // Find recommendations for applications
  const getRecommendationForApplication = (appId: string) => {
    return recommendations.find(rec => rec.applicationId === appId);
  };

  // Get funding source by ID
  const getFundingSourceById = (id: string) => {
    return fundingSources.find(source => source.id === id);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <PiggyBank className="h-6 w-6" />
            Funding Recommendation Agent
          </h1>
          <p className="text-muted-foreground">
            AI-powered funding source matching for optimal loan financing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applications">Pending Applications</SelectItem>
              <SelectItem value="sources">Funding Sources</SelectItem>
              <SelectItem value="recommendations">Recommendations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="sources">Funding Sources</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Pending Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Applications Requiring Funding</CardTitle>
              <CardDescription>
                Approved applications awaiting funding source recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Asset Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recommendation</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApplications.map((application) => {
                      const recommendation = getRecommendationForApplication(application.id);
                      const recommendedSource = recommendation 
                        ? getFundingSourceById(recommendation.fundingSourceId) 
                        : undefined;
                      
                      return (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.id}</TableCell>
                          <TableCell>
                            {application.borrower.companyName || 
                             `${application.borrower.firstName} ${application.borrower.lastName}`}
                          </TableCell>
                          <TableCell>{formatCurrency(application.amount)}</TableCell>
                          <TableCell className="capitalize">
                            {application.assetClass.replace(/_/g, ' ')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {application.displayStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {recommendation ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{recommendedSource?.name}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                <span className="text-sm">Needed</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {recommendation ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">View Details</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Funding Recommendation for {application.id}</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <RecommendationDetails recommendation={recommendation} />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Button size="sm" variant="secondary">Generate</Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funding Sources Tab */}
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Funding Sources</CardTitle>
              <CardDescription>
                Manage and view all funding sources for loan applications
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search sources..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={sourceTypeFilter}
                  onValueChange={setSourceTypeFilter}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {sourceTypes.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSources.map((source) => (
                  <Card key={source.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                        <Badge
                          variant={
                            source.status === "active"
                              ? "success"
                              : source.status === "limited"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription className="capitalize flex items-center gap-1">
                        <span>{source.type.replace(/_/g, ' ')}</span>
                        <span>•</span>
                        <span>{source.riskTolerance}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm line-clamp-2 mb-2">{source.description}</div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{formatCurrency(source.minAmount)} - {formatCurrency(source.maxAmount)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>{source.interestRateRange.min}% - {source.interestRateRange.max}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarClock className="h-4 w-4 text-muted-foreground" />
                          <span>{source.processingTime.min}-{source.processingTime.max} days</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Available Funds</span>
                          <span className="font-medium">{Math.round((source.allocatedFunds / source.availableFunds) * 100)}%</span>
                        </div>
                        <Progress value={(source.allocatedFunds / source.availableFunds) * 100} />
                      </div>
                    </CardContent>
                    <div className="px-6 py-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full">View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{source.name}</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="max-h-[70vh]">
                            <div className="p-2">
                              <FundingSourceDetails source={source} />
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Funding Recommendations</CardTitle>
              <CardDescription>
                AI-powered recommendations for optimal funding matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recommendations.map((recommendation) => {
                  const application = pendingApplications.find(app => app.id === recommendation.applicationId);
                  const source = fundingSources.find(src => src.id === recommendation.fundingSourceId);
                  
                  if (!application || !source) return null;
                  
                  return (
                    <Card key={recommendation.applicationId} className="border-green-200">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <span>{application.id}</span>
                              <Badge className="capitalize">
                                {application.assetClass.replace(/_/g, ' ')}
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              <span>
                                {application.borrower.companyName || 
                                 `${application.borrower.firstName} ${application.borrower.lastName}`}
                              </span>
                              <span> • </span>
                              <span>{formatCurrency(application.amount)}</span>
                            </CardDescription>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Full Recommendation
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Funding Recommendation for {application.id}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <RecommendationDetails recommendation={recommendation} />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {source.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{source.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">{source.type.replace(/_/g, ' ')}</p>
                            </div>
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="text-sm font-medium">Match Score:</div>
                            <div className="flex-1 flex items-center gap-2">
                              <Progress value={recommendation.matchScore} className="h-2" />
                              <span className="font-semibold">{recommendation.matchScore}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex gap-1 items-center">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <h5 className="text-sm font-medium">Top Reasons for Match</h5>
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 ml-5 list-disc text-sm">
                            {recommendation.reasons.slice(0, 4).map((reason, idx) => (
                              <li key={idx}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundingAgent;
