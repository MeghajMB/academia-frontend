"use client";
import {
  Input,
  Pagination,
  Chip,
  Tooltip,
  Button,
  useDisclosure,
} from "@heroui/react";
import { EditIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

interface ICategory {
  id: string;
  name: string;
  description: string;
  isBlocked: boolean;
}
import CategoryModal from "@/features/course/components/admin/CategoryModal";
import AdminTable from "@/components/common/Table";
import useAdminApi from "@/hooks/api/useAdminApi";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [filterValue, setFilterValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { fetchCategoriesApi } = useAdminApi();

  const axiosPrivate = useAxiosPrivate();

  const fetchPaginatedCategories = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetchCategoriesApi(page);
      if (response.status == "error") {
        console.error("Error fetching categories:");
        return;
      }
      setCategories(response.data.categories);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaginatedCategories(currentPage);
  }, [currentPage]);

  async function handleBlockCategory(id: string) {
    try {
      await axiosPrivate.put(`/api/admin/block-category/${id}`);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id == id
            ? { ...category, isBlocked: !category.isBlocked }
            : category
        )
      );
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    }
  }

  const handleEditCategory = (category: ICategory) => {
    setSelectedCategory(category);
    setIsEditMode(true);
    onOpen();
  };

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
          <Button color="default" onPress={onOpen}>
            +Add Category
          </Button>
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
      key: "status",
      label: "STATUS",
    },
    {
      key: "description",
      label: "DESCRIPTION",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  const renderCell = (category: ICategory, columnKey: React.Key) => {
    const cellValue = category[columnKey as keyof ICategory];
    switch (columnKey) {
      case "name":
        return <span>{category.name}</span>;
      case "description":
        return <p>{category.description}</p>;
      case "status":
        return (
          <Chip
            className="capitalize"
            color={category.isBlocked ? "danger" : "success"}
            size="sm"
            variant="flat"
          >
            {category.isBlocked ? "Not Active" : "Active"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit Category">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEditCategory(category)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip
              color="danger"
              content={
                category.isBlocked ? "Unblock Category" : "Block Category"
              }
            >
              <span
                className={`text-lg ${
                  category.isBlocked ? "text-success" : "text-danger"
                } cursor-pointer active:opacity-50`}
              >
                <button onClick={() => handleBlockCategory(category.id)}>
                  {category.isBlocked ? "Unblock" : "Block"}
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
      <main className="overflow-x-auto p-20 flex-1">
        <CategoryModal
          setCategories={setCategories}
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          selectedCategory={selectedCategory}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
        <AdminTable
          bottomContent={bottomContent}
          columns={columns}
          items={categories}
          loadingState={loadingState}
          renderCell={renderCell}
          topContent={topContent}
          label={"Category collection table"}
          emptyContent={"No categories found"}
        />
      </main>
    </>
  );
}
