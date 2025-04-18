
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LeaseIntelligence from "@/components/collateral/LeaseIntelligence";
import DocumentTracking from "@/components/collateral/DocumentTracking";
import MarketComps from "@/components/collateral/MarketComps";

const CollateralAgent = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Collateral Agent</h1>
          <p className="text-muted-foreground mt-2">
            Manage lease intelligence, track collateral documents, and collect market comparables
          </p>
        </div>

        <Tabs defaultValue="lease" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="lease">Lease Intelligence</TabsTrigger>
            <TabsTrigger value="documents">Collateral Documents</TabsTrigger>
            <TabsTrigger value="comps">Market Comps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lease">
            <LeaseIntelligence />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentTracking />
          </TabsContent>
          
          <TabsContent value="comps">
            <MarketComps />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CollateralAgent;
