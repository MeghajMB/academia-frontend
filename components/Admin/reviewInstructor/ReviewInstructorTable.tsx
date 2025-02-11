"use client";
import {
  Input,
  Pagination,
  User,
  Chip,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { EyeIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAdminApi from "@/hooks/useAdminApi";
import AdminTable from "../../Table";
import GenericModal from "@/components/ui/GenericModal";
import RejectRequestModal from "./RejectRequestModal";
import { toast } from "react-toastify";
import Link from "next/link";

interface IUser {
  id: string;
  name: string;
  email: string;
  verified: "pending" | "rejected" | "notRequested" | "verified";
  profilePicture: string;
  isBlocked: boolean;
}

export default function ReviewInstructorTable() {
  const [users, setUsers] = useState<IUser[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [activeUserId, setActiveUserId] = useState<null | string>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { fetchInstructorRequestsApi, approveInstructorRequestApi } =
    useAdminApi();

  const fetchPaginatedRequests = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetchInstructorRequestsApi(page);
      setUsers(response.requests);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedRequests(currentPage);
  }, [currentPage]);

  async function handleApproveRequest(userId: string) {
    try {
      const response = await approveInstructorRequestApi(userId);
      setUsers((prevUsers) => {
       return prevUsers.filter((user) => {
          return user.id != userId;
        });
      });
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
      key: "name",
      label: "NAME",
    },

    {
      key: "verified",
      label: "STATUS",
    },
    {
      key: "profile",
      label: "PROFILE",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  const renderCell = (user: IUser, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof IUser];
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.profilePicture }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "profile":
        return (
          <Tooltip content="Profile">
            <Link
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              href={`/admin/review-instructor/${user.id}`}
            >
              <EyeIcon />
            </Link>
          </Tooltip>
        );
      case "verified":
        return (
          <Chip
            className="capitalize"
            color={user.verified == "pending" ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {user.verified === "pending" ? "pending" : "rejected"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip color="success" content="Approve request">
              <span
                className={`text-lg text-success cursor-pointer active:opacity-50`}
              >
                <button
                  onClick={() => handleApproveRequest(user.id)}
                  disabled={loadingId == user.id}
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
                    setActiveUserId(user.id);
                    onOpen();
                  }}
                  disabled={loadingId == user.id}
                >
                  Reject
                </button>
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      <RejectRequestModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        activeUserId={activeUserId}
        setUsers={setUsers}
      />
      <AdminTable
        bottomContent={bottomContent}
        columns={columns}
        items={users}
        loadingState={loadingState}
        renderCell={renderCell}
        topContent={topContent}
        label={"Instructor Request table"}
        emptyContent={"No request found"}
      />
    </>
  );
}
