"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import useCategoryApi from "@/hooks/api/useCategoryApi";

// Define the structure of category data
export interface Category {
  id: string;
  name: string;
  description: string;
  isBlocked: boolean;
}

// Define the shape of form data
interface FormData {
  name: string;
  description: string;
}

// Define the shape of form validation errors
interface FormErrors {
  name?: string;
  description?: string;
  common?: string;
}

// Define the props for the CategoryModal component
interface ICategoryModalProps {
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  isEditMode?: boolean;
  selectedCategory?: Category | null;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CategoryModal({
  setCategories,
  isOpen,
  onOpenChange,
  isEditMode = false,
  selectedCategory,
  setIsEditMode
}: ICategoryModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const { createCategoryApi, editCategoryApi } = useCategoryApi();

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", description: "" });
      setIsEditMode(false)
      return
    }
    if (isEditMode && selectedCategory && isOpen) {
      setFormData({
        name: selectedCategory.name,
        description: selectedCategory.description,
      });
    }
  }, [isEditMode, selectedCategory, isOpen]);

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
    try {
      // Replace with your actual API endpoint
      const response = isEditMode
        ? await editCategoryApi(formData, selectedCategory!.id)
        : await createCategoryApi(formData);
      if (response.status == "error") {
        setErrors({ common: response.message });
        return;
      }
      setFormData({ name: "", description: "" });
      setCategories((prevCategories) =>
        isEditMode
          ? prevCategories.map((category) =>
              category.id === selectedCategory?.id ? response.data : category
            )
          : [...prevCategories, response.data]
      );
      onClose(); // Close the modal
    } catch (error) {
      setErrors({
        common: "Failed to add category. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
                {errors.common && (
                  <p className="text-red-600">{errors.common}</p>
                )}
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
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleSubmit(onClose)}
                  isLoading={isLoading}
                >
                  {isEditMode ? "Update" : "Add"} Category
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
