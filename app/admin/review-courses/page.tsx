"use client";
import { Input, Pagination, Tooltip, useDisclosure } from "@heroui/react";
import { EyeIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import AdminTable from "@/components/common/Table";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import useAdminApi from "@/hooks/api/useAdminApi";
import { toast } from "react-toastify";
import Link from "next/link";
import ReviewRejectModal from "@/features/course/components/admin/ReviewRejectModal";

export interface IReviewRequests {
  id: string;
  category: { name: string; description: string };
  price: number;
  title: string;
  isBlocked: boolean;
}
export default function Page() {
  const [reviewRequests, setReviewRequests] = useState<IReviewRequests[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeCourseId, setActiveCourseId] = useState<null | string>(null);

  const [filterValue, setFilterValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { fetchCoursesForReviewApi, approveCourseRequestApi } = useAdminApi();

  const fetchAllCoursesForReview = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetchCoursesForReviewApi(page);
      if (response.status == "error") {
        console.log(response.message);
        toast.error("Something happened", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
      setReviewRequests(response.data.requests);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCoursesForReview(currentPage);
  }, [currentPage]);

  async function handleApproveRequest(courseId: string) {
    try {
      const response = await approveCourseRequestApi(courseId);
      setReviewRequests((prevRequests) => {
        return prevRequests.filter((request) => {
          return request.id != courseId;
        });
      });
      if (response.status == "error") {
        console.log(response.message);
        return;
      }
      toast("Request Approved!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
      key: "curriculum",
      label: "CURRICULUM",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  const renderCell = (request: IReviewRequests, columnKey: React.Key) => {
    const cellValue = request[columnKey as keyof IReviewRequests];
    switch (columnKey) {
      case "title":
        return <p>{request.title}</p>;
      case "curriculum":
        return (
          <Tooltip content="View">
            <Link
              className="inline-flex items-center justify-center cursor-pointer active:opacity-50"
              href={`/admin/review-courses/curriculum/${request.id}`}
            >
              <EyeIcon className="w-5 h-5" />
            </Link>
          </Tooltip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip color="success" content="Approve request">
              <span
                className={`text-lg text-success cursor-pointer active:opacity-50`}
              >
                <button
                  onClick={() => handleApproveRequest(request.id)}
                  //disabled={loadingId == request.id}
                >
                  Approve
                </button>
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Reject Request">
              <span
                className={`text-lg text-danger cursor-pointer active:opacity-50`}
              >
                <button
                  onClick={() => {
                    setActiveCourseId(request.id);
                    onOpen();
                  }}
                  //disabled={loadingId == user.id}
                >
                  Reject
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
      <ProtectedRoute role={["admin"]}>
        <main className="overflow-x-auto p-20 flex-1">
          <ReviewRejectModal
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange}
            courseId={activeCourseId}
            setReviewRequests={setReviewRequests}
          />
          <AdminTable
            bottomContent={bottomContent}
            columns={columns}
            items={reviewRequests}
            loadingState={loadingState}
            renderCell={renderCell}
            topContent={topContent}
            label={"Category collection table"}
            emptyContent={"No reviewRequests found"}
          />
        </main>
      </ProtectedRoute>
    </>
  );
}
