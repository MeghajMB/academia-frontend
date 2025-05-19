"use client";
import { ICourse } from "@/types/course";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider,
} from "@heroui/react";
import { ChartNoAxesCombined } from "lucide-react";
import { useState } from "react";
import ScheduleCourseListModal from "../SheduleCourseListModal";
import { CourseAnalyticsDrawer } from "../analytics/CourseAnalyticsDrawer";
import Link from "next/link";

export default function InstructorCourseCard({
  course,
  handleListCourse,
}: {
  course: ICourse;
  handleListCourse: (courseId: string, date: string) => void;
}) {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const statusColorMap: Record<
    string,
    {
      color:
        | "success"
        | "primary"
        | "warning"
        | "default"
        | "danger"
        | "secondary";
      label: string;
    }
  > = {
    listed: { color: "success", label: "Listed" },
    accepted: { color: "primary", label: "Approved" },
    pending: { color: "warning", label: "Pending" },
    draft: { color: "default", label: "Draft" },
    rejected: { color: "danger", label: "Rejected" },
  };

  const statusInfo = statusColorMap[course.status] || {
    color: "default",
    label: course.status,
  };

  return (
    <>
      <Card className="bg-content1 border-none shadow-md hover:shadow-lg transition-shadow">
        <CardBody className="p-5">
          <h3 className="text-xl font-semibold text-foreground line-clamp-1">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
            {course.description || "No description available"}
          </p>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between items-center p-5">
          <Chip
            color={statusInfo.color}
            variant="flat"
            size="sm"
            className={`${course.status === "rejected" && "font-semibold"}`}
          >
            {statusInfo.label}
          </Chip>
          <div className="flex gap-2">
            {course.status == "accepted" && (
              <Button
                color="success"
                size="sm"
                variant="flat"
                onPress={() => setIsModalOpen(true)}
                className="font-medium"
              >
                List Course
              </Button>
            )}
            {course.status == "listed" && (
              <Button
                color="warning"
                size="sm"
                variant="flat"
                className="font-medium"
                onPress={() => setIsAnalyticsOpen(true)}
              >
                <ChartNoAxesCombined />
              </Button>
            )}
            <Button
              as={Link}
              href={`/instructor/courses/${course.id}`}
              color="secondary"
              variant="light"
              size="sm"
              className="font-medium"
            >
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>
      {/* Schedule List Modal */}
      <ScheduleCourseListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onListCourse={(date: string) => {
          handleListCourse(course.id, date);
        }}
      />
      {/* Analytics Drawer */}
      {isAnalyticsOpen && (
        <CourseAnalyticsDrawer
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
          courseId={course.id}
          courseTitle={course.title}
        />
      )}
    </>
  );
}
