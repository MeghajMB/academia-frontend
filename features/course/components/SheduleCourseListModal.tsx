"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@heroui/react";
import moment from "moment";
import { useState } from "react";

interface ScheduleCourseListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListCourse: (date:string) => void;
}

function ScheduleCourseListModal({
  isOpen,
  onClose,
  onListCourse,
}: ScheduleCourseListModalProps) {
  const [commonError, setCommonError] = useState<null | string>(null);
  const [date, setDate] = useState<string>(moment().format("YYYY-MM-DDTHH:mm"));
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const utcDate=moment(date).utc().format("YYYY-MM-DDTHH:mm")
      setCommonError(null);
      await onListCourse(utcDate);
      onClose();
    } catch (error) {
      if (Array.isArray(error)) {
        setCommonError(error[0]?.message || "An error occurred.");
      } else {
        setCommonError("something happened");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          List Your Course
        </ModalHeader>
        <ModalBody>
          {commonError && <p className="text-red-500">{commonError}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="datetime-local"
                label="List Date"
                defaultValue={date}
                onChange={(e) => setDate(e.target.value)}
                variant="bordered"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            Schedule course
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ScheduleCourseListModal;
