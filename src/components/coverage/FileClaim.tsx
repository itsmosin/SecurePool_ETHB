import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload } from 'lucide-react';

interface FileClaimProps {
  coverage: {
    id: number;
    title: string;
    coverage: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onClaimSubmitted: () => void;
}

const FileClaim: React.FC<FileClaimProps> = ({ coverage, isOpen, onClose, onClaimSubmitted }) => {
  const [claimAmount, setClaimAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClaimSubmitted();
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>File a Claim</DialogTitle>
          <DialogDescription>
            Submit your claim for {coverage.title}. Please provide all required details for faster processing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="claim-amount">Claim Amount (NEON)</Label>
            <Input
              id="claim-amount"
              type="number" 
              placeholder="Enter amount"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              max={coverage.coverage}
            />
            <p className="text-xs text-gray-500">Maximum coverage: {coverage.coverage} NEON</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="claim-description">Claim Description</Label>
            <Textarea
              id="claim-description"
              placeholder="Describe the incident and reason for your claim"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Supporting Documents</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop files or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, or PDF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            className="bg-safetyblue-500 hover:bg-safetyblue-600"
            onClick={handleSubmit}
            disabled={!claimAmount || !description || isSubmitting}
          >
            {isSubmitting ? (
              <>Processing...</>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Submit Claim
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileClaim;
