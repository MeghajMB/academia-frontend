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
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  PressEvent,
} from "@heroui/react";
import moment from "moment";
import { useState } from "react";
import { ICreateGigDTO } from "@/types/gig";

interface CreateGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGigCreated: (data: ICreateGigDTO) => Promise<void>;
}

interface GigFormData {
  title: string;
  description: string;
  sessionDuration: number;
  minBid: number;
  sessionDate: string;
  maxParticipants: number;
  biddingAllowed:boolean;
}

function CreateGigModal({
  isOpen,
  onClose,
  onGigCreated,
}: CreateGigModalProps) {
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
      biddingAllowed:true
    },
  });
  const [commonError, setCommonError] = useState<null | string>(null);
  const onSubmit = async (data: GigFormData) => {
    try {
      setCommonError(null);
      await onGigCreated(data as unknown as ICreateGigDTO);
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
          Create New Gig
        </ModalHeader>
        <ModalBody>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            {commonError && <p className="text-red-500">{commonError}</p>}
            <div>
              <Input
                label="Title"
                placeholder="Enter gig title"
                variant="bordered"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Textarea
                label="Description"
                placeholder="Describe your gig in detail"
                variant="bordered"
                minRows={3}
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>
            <Checkbox defaultSelected isDisabled>
              Allow Bidding
            </Checkbox>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Session Duration (minutes)"
                  variant="bordered"
                  {...register("sessionDuration", {
                    required: "duration is required",
                  })}
                  defaultSelectedKeys={["30"]}
                  isRequired
                >
                  <SelectItem key="30">30 minutes</SelectItem>
                  <SelectItem key="60">1 hour</SelectItem>
                  <SelectItem key="90">1.5 hours</SelectItem>
                </Select>
                {errors.sessionDuration && (
                  <p className="text-red-500">{errors.sessionDuration.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="number"
                  label="Minimum Bid ($)"
                  variant="bordered"
                  {...register("minBid", {
                    required: "Minimum bid is required",
                    min: {
                      value: 1,
                      message: "Minimum bid must be at least $1",
                    },
                  })}
                />
                {errors.minBid && (
                  <p className="text-red-500">{errors.minBid.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="datetime-local"
                  label="Service Date"
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

              <div>
                <Input
                  type="number"
                  label="Max Participants"
                  variant="bordered"
                  value="1"
                  disabled
                />
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
            color="primary"
            onPress={
              handleSubmit(onSubmit) as unknown as (e: PressEvent) => void
            }
            isLoading={isSubmitting}
          >
            Create Gig
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CreateGigModal;
