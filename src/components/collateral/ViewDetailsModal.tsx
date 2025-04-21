
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const ViewDetailsModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footerContent,
}: ViewDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">{children}</div>
        {footerContent && (
          <div className="mt-2 pt-4 border-t flex justify-end">
            {footerContent}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsModal;
