"use client";
import {
  Input,
  Pagination,
  Chip,
  Tooltip,
  Spinner,
} from "@heroui/react";
import { EyeIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import AdminTable from "@/components/Table";
import useAdminApi from "@/hooks/api/useAdminApi";
import Link from "next/link";
import { debounce } from "lodash";

export interface ICourse {
  id: string;
  category: { name: string; description: string };
  price: number;
  title: string;
  isBlocked: boolean;
  status: string;
}

export default function AdminCoursePage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [filterValue, setFilterValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { fetchCoursesApi, blockCourseApi } = useAdminApi();

  const fetchAllCourses = useMemo(() => debounce(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetchCoursesApi(page);
      setCourses(response.courses);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  }, 500), []);

  useEffect(() => {
    fetchAllCourses(currentPage);
  }, [currentPage,filterValue]);

  async function handleBlockCourse(courseId: string) {
    try {
      await blockCourseApi(courseId);
      setCourses((prevCourse) =>
        prevCourse.map((course) =>
          course.id == courseId
            ? { ...course, isBlocked: !course.isBlocked }
            : course
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setCurrentPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  function handleChangePage(page: number) {
    setCurrentPage(page);
  }

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="secondary"
          isDisabled={false}
          page={currentPage}
          total={totalPages}
          variant="light"
          onChange={(page) => handleChangePage(page)}
        />
      </div>
    );
  }, [currentPage, totalPages]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [filterValue, onSearchChange]);

  const loadingState = isLoading ? "loading" : "idle";

  const columns = [
    {
      key: "title",
      label: "TITLE",
    },

    {
      key: "isBlocked",
      label: "STATUS",
    },
    {
      key: "course",
      label: "COURSE",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  const renderCell = (course: ICourse, columnKey: React.Key) => {
    const cellValue = course[columnKey as keyof ICourse];
    switch (columnKey) {
      case "title":
        return <p>{course.title}</p>;
      case "course":
        return (
          <Tooltip content="View">
            <Link
              className="inline-flex items-center justify-center cursor-pointer active:opacity-50"
              href={`courses/${course.id}`}
            >
              <EyeIcon className="w-5 h-5" />
            </Link>
          </Tooltip>
        );
      case "isBlocked":
        return (
          <Chip
            className="capitalize"
            color={course.isBlocked ? "danger" : "success"}
            size="sm"
            variant="flat"
          >
            {course.isBlocked ? "Not Active" : "Active"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip
              color="danger"
              content={course.isBlocked ? "Unblock Course" : "Block Course"}
            >
              <span
                className={`text-lg ${
                  course.isBlocked ? "text-success" : "text-danger"
                } cursor-pointer active:opacity-50`}
              >
                <button
                  onClick={() => handleBlockCourse(course.id)}
                  disabled={loadingId == course.id}
                >
                  {loadingId == course.id ? (
                    <Spinner size="sm" />
                  ) : course.isBlocked ? (
                    "Unblock"
                  ) : (
                    "Block"
                  )}
                </button>
              </span>
            </Tooltip>
          </div>
        );
      default:
        if (typeof cellValue == "object") {
          return cellValue.name;
        }
        return cellValue;
    }
  };

  return (
    <>
      <main className="overflow-x-auto p-20 flex-1">
        <AdminTable
          bottomContent={bottomContent}
          columns={columns}
          items={courses}
          loadingState={loadingState}
          renderCell={renderCell}
          topContent={topContent}
          label={"Category collection table"}
          emptyContent={"No courses found"}
        />
      </main>
    </>
  );
}
