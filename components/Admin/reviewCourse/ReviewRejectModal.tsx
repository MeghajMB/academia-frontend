"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@nextui-org/react";
import useAdminApi from "@/hooks/api/useAdminApi";
import { toast } from "react-toastify";
import { IReviewRequests } from "@/app/admin/review-courses/page";

interface RejectRequestModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string | null;
  onOpen: () => void;
  setReviewRequests: React.Dispatch<React.SetStateAction<IReviewRequests[]>>;
}

export default function ReviewRejectModal({
  isOpen,
  onOpenChange,
  courseId,
  onOpen,
  setReviewRequests,
}: RejectRequestModalProps) {
  const { rejectCourseRequestApi } = useAdminApi();

  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (onClose: () => void) => {
    if (rejectReason.length < 10) {
      setError("Reason must be at least 10 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      if (!courseId) throw new Error("No active course selected.");
      await rejectCourseRequestApi(rejectReason, courseId);

      setReviewRequests((prevRequest) => {
       return prevRequest.filter((request) => {
          return request.id != courseId;
        });
     
      });

      toast("Request rejected successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      onClose(); // Close the modal
      setRejectReason(""); // Reset the input
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Error rejecting request!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setRejectReason("");
          setError(null);
        }
      }}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Enter the Reason for Rejection
            </ModalHeader>
            <ModalBody>
              <Textarea
                name="rejectReason"
                label="Reason"
                placeholder="Enter your reason for rejection"
                variant="bordered"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                errorMessage={error}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={() => {
                  onClose();
                  setRejectReason("");
                  setError(null);
                }}
              >
                Close
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={() => handleSubmit(onClose)}
                disabled={isLoading || rejectReason.length < 10}
              >
                Reject Request
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
