"use client";

import { useForm } from "react-hook-form";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  PressEvent,
} from "@heroui/react";
import moment from "moment";
import { useState } from "react";

interface ScheduleCourseListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListCourse: (data: GigFormData) => Promise<void>;
}

interface GigFormData {
  title: string;
  description: string;
  sessionDuration: number;
  minBid: number;
  sessionDate: string;
  maxParticipants: number;
  biddingAllowed: boolean;
}

function ScheduleCourseListModal({
  isOpen,
  onClose,
  onListCourse,
}: ScheduleCourseListModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GigFormData>({
    defaultValues: {
      title: "",
      description: "",
      sessionDuration: 60,
      minBid: 10,
      sessionDate: moment().format("YYYY-MM-DDTHH:mm"),
      maxParticipants: 1,
      biddingAllowed: true,
    },
  });
  const [commonError, setCommonError] = useState<null | string>(null);
  const onSubmit = async (data: GigFormData) => {
    try {
      setCommonError(null);
      await onListCourse(data);
      reset(); // Reset form after successful submission
      onClose();
    } catch (error) {
      if (Array.isArray(error)) {
        setCommonError(error[0]?.message || "An error occurred.");
      } else {
        setCommonError("something happened");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          List Your Course
        </ModalHeader>
        <ModalBody>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            {commonError && <p className="text-red-500">{commonError}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="datetime-local"
                  label="List Date"
                  defaultValue={moment().format("YYYY-MM-DDTHH:mm")}
                  variant="bordered"
                  {...register("sessionDate", {
                    required: "Service date is required",
                  })}
                />
                {errors.sessionDate && (
                  <p className="text-red-500">{errors.sessionDate.message}</p>
                )}
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            onPress={
              handleSubmit(onSubmit) as unknown as (e: PressEvent) => void
            }
            isLoading={isSubmitting}
          >
            Schedule course
          </Button>
          <Button
            color="success"
            onPress={
              handleSubmit(onSubmit) as unknown as (e: PressEvent) => void
            }
            isLoading={isSubmitting}
          >
            List now
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ScheduleCourseListModal;
