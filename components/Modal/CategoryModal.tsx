"use client";

import { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

interface FormData {
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
  description?: string;
}

export default function CategoryModal({ setCategories }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (!isOpen) {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (formData.description.length < 10) {
      newErrors.description =
        "Description should be at least 10 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (onClose: () => void) => {
    if (!validateForm()) return;

    setIsLoading(true);
    controllerRef.current = new AbortController();
    try {
      // Replace with your actual API endpoint
      const response = await axiosPrivate.post(
        "/api/admin/create-category",
        formData,
        {
          signal: controllerRef.current.signal,
        }
      );

      console.log(response);
      setFormData({ name: "", description: "" }); // Reset form
      setCategories((prevCategories)=> [...prevCategories, response.data])
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding category:", error);
      setErrors({ name: "Failed to add category. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button color="default" onPress={onOpen}>
        +Add Category
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          onOpenChange();
          if (!open) {
            setFormData({ name: "", description: "" });
            setErrors({});
          }
        }}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Enter The Category
              </ModalHeader>
              <ModalBody>
                <Input
                  name="name"
                  label="Name"
                  placeholder="Enter category name"
                  variant="bordered"
                  value={formData.name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                />
                <Textarea
                  name="description"
                  label="Description"
                  placeholder="Enter your description"
                  variant="bordered"
                  value={formData.description}
                  onChange={handleInputChange}
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleSubmit(onClose)}
                  isLoading={isLoading}
                >
                  Add Category
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
