"use client";
import {
  Input,
  Spinner,
  Pagination,
  User,
  Chip,
  Tooltip,
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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

interface IUser {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  isBlocked: boolean;
}

export default function UsersTable({role}:{role:'instructor'|'student'}) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [filterValue, setFilterValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const fetchPaginatedUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get("/api/admin/get-users", {
        params: {
          role,
          page,
        },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedUsers(currentPage);
  }, [currentPage]);

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
  }, [currentPage]);

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
      key: "isBlocked",
      label: "STATUS",
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
      case "isBlocked":
        return (
          <Chip
            className="capitalize"
            color={user.isBlocked ? "danger" : "success"}
            size="sm"
            variant="flat"
          >
            {user.isBlocked ? "Not Active" : "Active"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            {role === "instructor" && (
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
            )}
            <Tooltip
              color="danger"
              content={user.isBlocked ? "Unblock User" : "Block User"}
            >
              <span
                className={`text-lg ${
                  user.isBlocked ? "text-success" : "text-danger"
                } cursor-pointer active:opacity-50`}
              >
                <button>{user.isBlocked ? "Unblock" : "Block"}</button>
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
      <Table
        removeWrapper
        aria-label="Student collection table"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody
          emptyContent={"No users found"}
          items={users}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(user) => (
            <TableRow key={user.id}>
              {(columnKey) => (
                <TableCell>{renderCell(user, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
