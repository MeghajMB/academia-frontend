"use client";

import { useAppSelector } from "@/store/hooks";
import { ISection } from "@/types/course";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CourseLectureCard from "./CourseLectureCard";
import AddLecture from "./AddLecture";
import { useState } from "react";
import { Button, Input, Textarea, Form } from "@heroui/react";
import { Edit2, Save, X, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import useCourseApi from "@/hooks/api/useCourseApi";
import DeleteConfirmationModal from "@/components/common/modals/DeleteconfirmationModal";
import { toast } from "react-toastify";

function CourseSection({
  section,
  sectionIndex,
  setSections,
  courseId,
  sectionId,
}: {
  section: ISection;
  sectionIndex: number;
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  courseId: string;
  sectionId: string;
}) {
  const { id } = useAppSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [description, setDescription] = useState(section.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { editSectionApi, deleteSectionApi } = useCourseApi();

  const handleUpdateSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Section title is required");
      setIsLoading(false);
      return;
    }

    try {
      const sectionData = {
        title,
        description,
      };

      await editSectionApi(section.id, sectionData);

      // Update the sections state with the updated section
      setSections((prevSections) =>
        prevSections.map((s) =>
          s.id === section.id
            ? { ...s, title: title, description: description }
            : s
        )
      );

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating section:", error);
      setErrorMessage("Failed to update section. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSection = async () => {
    setIsLoading(true);
    try {
      await deleteSectionApi(section.id);

      // Remove the section from the sections state
      setSections((prevSections) =>
        prevSections.filter((s) => s.id !== section.id)
      );
      toast.success("Successfully deleted Section!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("Failed to delete section. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-[#1c1f26] text-white rounded-lg mt-5 shadow-md border border-gray-700">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-300"
          >
            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </Button>

          {!isEditing ? (
            <h3 className="font-bold text-lg">
              Section {sectionIndex + 1}: {section.title}
            </h3>
          ) : (
            <span className="font-medium text-blue-400">Editing Section</span>
          )}
        </div>

        {!isEditing ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Edit2 size={16} />}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              startContent={<Trash2 size={16} />}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </Button>
          </div>
        ) : null}
      </div>

      {/* Editing Form */}
      {isEditing && (
        <Form
          onSubmit={handleUpdateSection}
          className="mb-4 p-4 bg-neutral-900 rounded-lg"
          validationBehavior="native"
        >
          <div className="space-y-4 flex flex-col w-full">
            <Input
              label="Section Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="bordered"
              color="default"
              isRequired
              classNames={{
                input: "text-white",
                label: "text-gray-300",
              }}
            />

            <Textarea
              label="Section Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="bordered"
              color="default"
              classNames={{
                input: "text-white",
                label: "text-gray-300",
              }}
              placeholder="Add a description for this section"
            />

            {errorMessage && (
              <p className="text-red-400 text-sm">{errorMessage}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="flat"
                color="default"
                startContent={<X size={16} />}
                onClick={() => {
                  setIsEditing(false);
                  setTitle(section.title);
                  setDescription(section.description || "");
                  setErrorMessage("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                startContent={<Save size={16} />}
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Form>
      )}

      {/* Section Content */}
      {!isCollapsed && (
        <>
          <SortableContext
            items={section.lectures.map((lecture) => `lecture-${lecture.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {section.lectures.map((lecture) => (
                <CourseLectureCard
                  key={lecture.id}
                  lecture={lecture}
                  sectionIndex={sectionIndex}
                  courseId={courseId}
                  sectionId={sectionId}
                  userId={id!}
                />
              ))}
            </div>
            <div className="mt-4">
              <AddLecture
                setSections={setSections}
                courseId={courseId}
                sectionId={sectionId}
              />
            </div>
          </SortableContext>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onDelete={handleDeleteSection}
        isLoading={isLoading}
        title="Delete Section"
        itemName={section.title}
        itemType="section"
        customMessage="This action cannot be undone. All lectures in this section will be permanently deleted."
      />
    </div>
  );
}

export default CourseSection;
