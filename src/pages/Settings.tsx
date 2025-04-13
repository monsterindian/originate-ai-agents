
import { useState } from "react";
import { Settings as SettingsIcon, Users, Bot, Bell, Shield, Database } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings
  const [notifyNewApplications, setNotifyNewApplications] = useState(true);
  const [notifyStatusChanges, setNotifyStatusChanges] = useState(true);
  const [notifyDocumentUploads, setNotifyDocumentUploads] = useState(false);
  
  // AI Agent settings
  const [enableIntakeAgent, setEnableIntakeAgent] = useState(true);
  const [enableProcessingAgent, setEnableProcessingAgent] = useState(true);
  const [enableUnderwritingAgent, setEnableUnderwritingAgent] = useState(true);
  const [enableDecisionAgent, setEnableDecisionAgent] = useState(true);
  const [agentVerbosity, setAgentVerbosity] = useState("detailed");
  
  // Security settings
  const [requireMfa, setRequireMfa] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  const handleSaveSettings = () => {
    // In a real app, this would save settings to a backend
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
      duration: 3000,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your system preferences and configuration
            </p>
          </div>
          <Button onClick={handleSaveSettings}>Save Changes</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden md:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="hidden md:inline">AI Agents</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic system behavior and appearances
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">System Name</Label>
                    <div className="relative">
                      <input
                        id="systemName"
                        className="w-full p-2 border rounded-md"
                        defaultValue="AI LoanAgent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultAssetClass">Default Asset Class</Label>
                    <select id="defaultAssetClass" className="w-full p-2 border rounded-md">
                      <option value="residential_mortgage">Residential Mortgage</option>
                      <option value="commercial_real_estate">Commercial Real Estate</option>
                      <option value="auto_loan">Auto Loan</option>
                      <option value="personal_loan">Personal Loan</option>
                      <option value="sme_loan">SME Loan</option>
                      <option value="equipment_finance">Equipment Finance</option>
                    </select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Display Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableDarkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme for the interface
                      </p>
                    </div>
                    <Switch id="enableDarkMode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compactView">Compact View</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing and show more content
                      </p>
                    </div>
                    <Switch id="compactView" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Configure data retention and export options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention Period</Label>
                  <select id="dataRetention" className="w-full p-2 border rounded-md">
                    <option value="1">1 year</option>
                    <option value="3">3 years</option>
                    <option value="5" selected>5 years</option>
                    <option value="7">7 years</option>
                    <option value="10">10 years</option>
                  </select>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure which events trigger notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Applications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when new applications are submitted
                      </p>
                    </div>
                    <Switch 
                      checked={notifyNewApplications} 
                      onCheckedChange={setNotifyNewApplications} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Status Changes</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when application status changes
                      </p>
                    </div>
                    <Switch 
                      checked={notifyStatusChanges} 
                      onCheckedChange={setNotifyStatusChanges} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Document Uploads</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when documents are uploaded
                      </p>
                    </div>
                    <Switch 
                      checked={notifyDocumentUploads} 
                      onCheckedChange={setNotifyDocumentUploads} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>
                  Configure how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications within the application
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to your email
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Agent Settings</CardTitle>
                <CardDescription>
                  Configure how AI agents operate within the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Intake Agent</Label>
                      <p className="text-sm text-muted-foreground">
                        Processes new applications and initial document verification
                      </p>
                    </div>
                    <Switch 
                      checked={enableIntakeAgent} 
                      onCheckedChange={setEnableIntakeAgent} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Processing Agent</Label>
                      <p className="text-sm text-muted-foreground">
                        Handles application processing and document verification
                      </p>
                    </div>
                    <Switch 
                      checked={enableProcessingAgent} 
                      onCheckedChange={setEnableProcessingAgent} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Underwriting Agent</Label>
                      <p className="text-sm text-muted-foreground">
                        Performs risk assessment and credit analysis
                      </p>
                    </div>
                    <Switch 
                      checked={enableUnderwritingAgent} 
                      onCheckedChange={setEnableUnderwritingAgent} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Decision Agent</Label>
                      <p className="text-sm text-muted-foreground">
                        Makes loan approval recommendations based on all data
                      </p>
                    </div>
                    <Switch 
                      checked={enableDecisionAgent} 
                      onCheckedChange={setEnableDecisionAgent} 
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="agentVerbosity">Agent Verbosity</Label>
                  <select 
                    id="agentVerbosity" 
                    className="w-full p-2 border rounded-md"
                    value={agentVerbosity}
                    onChange={(e) => setAgentVerbosity(e.target.value)}
                  >
                    <option value="minimal">Minimal - Critical information only</option>
                    <option value="standard">Standard - Important details and decisions</option>
                    <option value="detailed">Detailed - Complete reasoning and analysis</option>
                  </select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Controls how much detail AI agents provide in their analysis and recommendations
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Model Configuration</CardTitle>
                <CardDescription>
                  Configure which OpenAI models to use for different tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documentAnalysisModel">Document Analysis Model</Label>
                  <select id="documentAnalysisModel" className="w-full p-2 border rounded-md">
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="underwritingModel">Underwriting Model</Label>
                  <select id="underwritingModel" className="w-full p-2 border rounded-md">
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="decisionModel">Decision Model</Label>
                  <select id="decisionModel" className="w-full p-2 border rounded-md">
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto rounded-md border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-card border-b">
                        <td className="px-6 py-4 font-medium">Admin User</td>
                        <td className="px-6 py-4">admin@example.com</td>
                        <td className="px-6 py-4">Administrator</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr className="bg-card border-b">
                        <td className="px-6 py-4 font-medium">John Smith</td>
                        <td className="px-6 py-4">john@example.com</td>
                        <td className="px-6 py-4">Loan Officer</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr className="bg-card">
                        <td className="px-6 py-4 font-medium">Sarah Johnson</td>
                        <td className="px-6 py-4">sarah@example.com</td>
                        <td className="px-6 py-4">Underwriter</td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Inactive</span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4">
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>
                  Configure user roles and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md space-y-2">
                    <h3 className="font-medium">Administrator</h3>
                    <p className="text-sm text-muted-foreground">
                      Full access to all system features and settings
                    </p>
                    <Button variant="outline" size="sm" className="mt-1">Edit Permissions</Button>
                  </div>
                  
                  <div className="p-4 border rounded-md space-y-2">
                    <h3 className="font-medium">Loan Officer</h3>
                    <p className="text-sm text-muted-foreground">
                      Can create and manage loan applications, interact with borrowers
                    </p>
                    <Button variant="outline" size="sm" className="mt-1">Edit Permissions</Button>
                  </div>
                  
                  <div className="p-4 border rounded-md space-y-2">
                    <h3 className="font-medium">Underwriter</h3>
                    <p className="text-sm text-muted-foreground">
                      Can review applications, make credit decisions, override AI recommendations
                    </p>
                    <Button variant="outline" size="sm" className="mt-1">Edit Permissions</Button>
                  </div>
                  
                  <div className="p-4 border rounded-md space-y-2">
                    <h3 className="font-medium">Read Only</h3>
                    <p className="text-sm text-muted-foreground">
                      Can view applications and reports but cannot make changes
                    </p>
                    <Button variant="outline" size="sm" className="mt-1">Edit Permissions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security and authentication options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Multi-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require all users to use MFA when logging in
                    </p>
                  </div>
                  <Switch 
                    checked={requireMfa} 
                    onCheckedChange={setRequireMfa} 
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <div className="max-w-xs">
                    <select 
                      id="sessionTimeout" 
                      className="w-full p-2 border rounded-md"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                    </select>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically log users out after this period of inactivity
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log Security Events</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep detailed logs of security-related events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>
                  Configure password requirements for all users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordLength">Minimum Password Length</Label>
                  <select id="passwordLength" className="w-full max-w-xs p-2 border rounded-md">
                    <option value="8">8 characters</option>
                    <option value="10">10 characters</option>
                    <option value="12" selected>12 characters</option>
                    <option value="16">16 characters</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Uppercase Letters</Label>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Numbers</Label>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Special Characters</Label>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry</Label>
                  <select id="passwordExpiry" className="w-full max-w-xs p-2 border rounded-md">
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90" selected>90 days</option>
                    <option value="180">180 days</option>
                    <option value="0">Never</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
