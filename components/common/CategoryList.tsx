import useCategoryApi from "@/hooks/api/useCategoryApi";
import { Category } from "@/types/category";
import { Select, SelectItem, Spinner } from "@heroui/react";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";

function CategoryList({
  setSelectedCategory,
  selectedCategory,
}: {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const { fetchCategoriesApi } = useCategoryApi();
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetchCategoriesApi();
        if (response.status == "error") {
          return;
        }
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <Select
        placeholder="Category"
        className="max-w-xs"
        startContent={<Filter className="text-purple-400" size={18} />}
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        classNames={{
          trigger: "bg-gray-800 border-purple-500/20 border",
        }}
        color="secondary"
        variant="bordered"
      >
        {categories.map((category) => (
          <SelectItem key={category.id}>{category.name}</SelectItem>
        ))}
      </Select>
    </>
  );
}

export default CategoryList;
