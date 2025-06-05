import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, FileText, Calendar } from 'lucide-react';

// Mock data for active coverages
const ACTIVE_COVERAGES = [
  {
    id: 1,
    title: "Flight Delay Protection",
    premium: 150,
    coverage: 1500,
    status: "Active",
    endDate: "2025-07-18",
    iconColor: "bg-blue-500"
  },
  {
    id: 2,
    title: "Tech Device Coverage",
    premium: 250,
    coverage: 2500,
    status: "Active",
    endDate: "2025-08-25",
    iconColor: "bg-purple-500"
  },
  {
    id: 3,
    title: "Home Insurance",
    premium: 500,
    coverage: 15000,
    status: "Active",
    endDate: "2026-01-10",
    iconColor: "bg-orange-500"
  }
];

interface ActiveCoveragesProps {
  onFileClaimClick: (coverage: any) => void;
}

const ActiveCoverages: React.FC<ActiveCoveragesProps> = ({ onFileClaimClick }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Your Active Coverages</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coverage</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Coverage Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACTIVE_COVERAGES.map((coverage) => (
                <TableRow key={coverage.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${coverage.iconColor} text-white mr-3`}>
                        <Shield className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{coverage.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{coverage.premium} NEON</TableCell>
                  <TableCell>{coverage.coverage} NEON</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {coverage.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {coverage.endDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center text-safetyblue-500 border-safetyblue-200"
                      onClick={() => onFileClaimClick(coverage)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      File Claim
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="h-12 w-12 text-safetyblue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Total Protection Value</h3>
            <p className="text-3xl font-bold text-safetyblue-500">19,000 NEON</p>
            <p className="text-gray-500 mt-2">Across 3 active coverage policies</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveCoverages;
