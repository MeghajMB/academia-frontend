import useInstructorApi from "@/hooks/useInstructorApi";
import { Button, Form, Input, Spinner, Textarea } from "@nextui-org/react";
import { useState } from "react";

export default function AddSection({ setSections, courseId }) {
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createCourseSection } = useInstructorApi();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as {
      id: string;
      title: string;
      description: string;
    };
    try {
      const response = await createCourseSection(courseId, formData);
      console.log(response);
      setIsActive(false);
      setSections((prevSections) => [...prevSections, response]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
              errorMessage={errors || ""}
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
