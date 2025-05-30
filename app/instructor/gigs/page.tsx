"use client";

import useGigApi from "@/hooks/api/useGigApi";
import type React from "react";
import { useEffect, useState } from "react";
import { Button, Pagination, Select, SelectItem } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { GigCard } from "@/features/gig/components/GigCard";
import { ICreateGigDTO, IGig } from "@/types/gig";
import CreateGigModal from "@/features/gig/components/CreateGigModal";

function GigPage() {
  const { getGigsOfInstructorApi, createGigApi } = useGigApi();
  const [gigs, setGigs] = useState<IGig[]>([]);
  const [gigStatus, setGigStatus] = useState<
    "active" | "expired" | "completed" | "no-bids" | "missed"
  >("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await getGigsOfInstructorApi({
          page: currentPage,
          status: gigStatus,
        });
        if (response.status == "error") {
          console.error("Error fetching gigs:", response.message);
          return;
        }
        setGigs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [gigStatus, currentPage]);

  const handleCreateGig = async (data: ICreateGigDTO) => {
    try {
      const response = await createGigApi(data);
      if (response.status == "error") {
        throw new Error(response.message);
      }
      setGigs((prevGigs) => [
        ...prevGigs,
        { ...response.data, currentBidder: null },
      ]);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Gigs</h1>
        <div className="flex space-x-2 items-center">
          <Button
            color="primary"
            startContent={<PlusIcon size={16} />}
            onPress={() => setIsModalOpen(true)}
          >
            Create Gig
          </Button>
          <Select
            className="max-w-48"
            label="Purchase Type"
            placeholder="Select a type"
            selectedKeys={[gigStatus]}
            variant="bordered"
            onChange={(e) =>
              setGigStatus(
                e.target.value as unknown as
                  | "active"
                  | "expired"
                  | "completed"
                  | "no-bids"
                  | "missed"
              )
            }
          >
            {["active", "expired", "completed", "no-bids", "missed"].map(
              (status) => (
                <SelectItem key={status}>{status}</SelectItem>
              )
            )}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900 rounded-lg">
          <h3 className="text-xl font-medium text-white mb-2">No gigs found</h3>
          <p className="text-gray-300 mb-4">
            Create your first gig to get started
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
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
            total={1}
            variant="light"
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Create Gig Modal */}
      {isModalOpen && (
        <CreateGigModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onGigCreated={handleCreateGig}
        />
      )}
    </div>
  );
}

export default GigPage;
