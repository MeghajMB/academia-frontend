"use client";
import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Spinner,
} from "@heroui/react";
import { Search, ChevronDown } from "lucide-react";
import NoContentAvailable from "@/components/common/NoContentAvailable";
import CourseCard from "@/features/course/components/CourseCard";
import useCourseApi from "@/hooks/api/useCourseApi";
import { debounce } from "lodash";
import { ListCourses } from "@/features/course/types/course";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import CategoryList from "@/components/common/CategoryList";

const SORT_OPTIONS = [
  "Most Popular",
  "Highest Rated",
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
];

export default function CourseListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [courses, setCourses] = useState<ListCourses[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { fetchCoursesApi } = useCourseApi();

  const fetchPaginatedCourses = debounce(async () => {
    try {
      setIsLoading(true);
      const response = await fetchCoursesApi({
        sort: sortBy,
        category: selectedCategory,
        page: currentPage,
        search: searchQuery,
      });

      if (response.status == "error") {
        return;
      }
      setCourses(response.data.courses);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, 500);
  // Filter and sort courses based on search query and filters
  useEffect(() => {
    fetchPaginatedCourses();
    return () => {
      fetchPaginatedCourses.cancel();
    };
  }, [searchQuery, selectedCategory, sortBy, currentPage]);

  return (
    <ProtectedRoute role={["instructor", "student"]}>
      <div>
        {/* Header */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Explore Courses
          </h1>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              classNames={{
                base: "max-w-full md:max-w-md",
                inputWrapper: "bg-gray-800 border-purple-500/20 border",
              }}
              placeholder="Search by course or instructor name..."
              startContent={<Search className="text-white" size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              color="secondary"
              variant="bordered"
            />

            <div className="flex gap-2 ml-auto">
              <CategoryList
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
              />

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    color="secondary"
                    className="bg-gray-800 border-purple-500/20 border"
                    endContent={<ChevronDown size={16} />}
                  >
                    {sortBy}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort options"
                  className="bg-gray-800 border-purple-500/20 border"
                  onAction={(key) => setSortBy(key as string)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <DropdownItem key={option} className="text-white">
                      {option}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Course Listing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {courses.length === 0 && !isLoading ? (
            <NoContentAvailable
              content="Try adjusting your search or filter criteria"
              title="No courses found"
            />
          ) : (
            <>
              {!isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <Spinner />
              )}

              {/* Pagination */}
            </>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <Pagination
                total={totalPages}
                initialPage={1}
                page={currentPage}
                onChange={setCurrentPage}
                color="secondary"
                classNames={{
                  cursor: "bg-purple-500",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
