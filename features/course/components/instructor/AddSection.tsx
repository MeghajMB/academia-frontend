import { ErrorState } from "@/components/common/ErrorState";
import useCourseApi from "@/hooks/api/useCourseApi";
import { ISection } from "@/types/course";
import { Button, Form, Input, Spinner, Textarea } from "@heroui/react";
import { FormEvent, useState } from "react";

export default function AddSection({
  setSections,
  courseId,
}: {
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  courseId: string;
}) {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createCourseSection } = useCourseApi();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as {
      id: string;
      title: string;
      description: string;
    };
    try {
      const sectionResponse = await createCourseSection(courseId, formData);
      if (sectionResponse.status == "error") {
        console.log(sectionResponse.message);
        setError(true);
        return;
      }
      const updatedSection = { ...sectionResponse.data, lectures: [] };
      setIsActive(false);
      setSections((prevSections) => [...prevSections, updatedSection]);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }
  if (error) {
    return <ErrorState />;
  }
  return (
    <>
      <div className="p-4">
        <Button
          color="secondary"
          onPress={() => setIsActive((prevState) => !prevState)}
          className="mb-4"
        >
          {isActive ? "Close" : "+ Section"}
        </Button>

        {isActive && (
          <Form
            validationBehavior="native"
            onSubmit={handleSubmit}
            className="p-4 rounded-lg shadow-md bg-neutral-900 border border-gray-700"
          >
            <Input
              isRequired
              label="Section Title"
              labelPlacement="outside"
              name="title"
              placeholder="Enter the Title"
              type="text"
              variant="bordered"
              className="mb-4"
              validate={(value) => {
                if (value.trim().length <= 0) {
                  return "Enter Title";
                }
                return null;
              }}
            />

            <h2 className="font-semibold mb-2 text-lg text-gray-200">
              What will the students be able to do at the end of the section?
            </h2>
            <Textarea
              name="description"
              placeholder="Enter the learning outcome for this section"
              className="mb-4"
              isRequired
              validate={(value) => {
                if (value.trim().length <= 0) {
                  return "Please fill out this field.";
                }
                if (value.length <= 10) {
                  return "Must be greater than 10 characters";
                }
                return null;
              }}
              classNames={{
                input: "bg-gray-700 text-gray-200 placeholder-gray-400",
              }}
            />

            <div className="flex justify-between gap-3">
              <Button
                onPress={() => setIsActive(false)}
                variant="ghost"
                className="mr-2 text-gray-200"
              >
                Cancel
              </Button>
              <Button type="submit" color="secondary" disabled={isLoading}>
                {isLoading ? <Spinner /> : "Add Section"}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </>
  );
}
