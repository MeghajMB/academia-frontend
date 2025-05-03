"use client";

import { useState, useEffect } from "react";
import { Button, useDisclosure, Tooltip, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { Edit, Trash2, Plus, Coins, Package } from "lucide-react";
import DeleteConfirmationModal from "@/components/common/modals/DeleteconfirmationModal";
import AdminTable from "@/components/common/Table";
import PackageModal from "@/features/payment/components/coin/PackageModal";
import RatiosCard from "@/features/payment/components/coin/RatiosCard";
import useCoinApi from "@/hooks/api/useCoinApi";
import { ErrorState } from "@/components/common/ErrorState";
import { toast } from "react-toastify";

// Mock data based on the interface
interface CoinData {
  id: string;
  goldToINRRatio: number;
  redeemCoinToGoldRatio: number;
  packages: {
    id: string;
    coinAmount: number;
    priceInINR: number;
  }[];
  isActive: boolean;
}

export default function CoinAdminPage() {
  // State for coin data
  const [coinData, setCoinData] = useState<CoinData | null>(null);

  // State for editing ratios
  const [editingRatios, setEditingRatios] = useState(false);
  const [goldToINRRatio, setGoldToINRRatio] = useState(0);
  const [redeemCoinToGoldRatio, setRedeemCoinToGoldRatio] = useState(0);

  // State for package modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPackage, setCurrentPackage] = useState<{
    id?: string;
    coinAmount: number;
    priceInINR: number;
  }>({
    coinAmount: 0,
    priceInINR: 0,
  });
  const [isNewPackage, setIsNewPackage] = useState(true);

  // State for delete confirmation
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange,
  } = useDisclosure();
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  const {
    fetchCoinConfig,
    createCoinPackage,
    updateCoinRatio,
    deleteCoinPackage,
    updateCoinPackage,
  } = useCoinApi();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Update local state when coinData changes
  useEffect(() => {
    async function fetchFunction() {
      try {
        const response = await fetchCoinConfig();
        if (response.status == "error") return;
        console.log(response.data);
        setCoinData(response.data);
        setRedeemCoinToGoldRatio(response.data.redeemCoinToGoldRatio);
        setGoldToINRRatio(response.data.goldToINRRatio);
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFunction();
  }, []);

  if (error) {
    return (
      <div className="w-screen h-screen content-center">
        <ErrorState fullPage />
      </div>
    );
  }

  // Handle saving ratio changes
  const handleSaveRatios = async () => {
    try {
      const response = await updateCoinRatio({
        goldToINRRatio,
        redeemCoinToGoldRatio,
      });
      if (response.status == "error") {
        throw new Error("Something happened");
      }
    } catch (error) {
      toast.error("Something happened.Refresh the page.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setEditingRatios(false);
    }
  };

  // Handle opening package modal for editing
  const handleEditPackage = (pkg: {
    id: string;
    coinAmount: number;
    priceInINR: number;
  }) => {
    setCurrentPackage(pkg);
    setIsNewPackage(false);
    onOpen();
  };

  // Handle opening package modal for creating
  const handleAddPackage = () => {
    setCurrentPackage({ coinAmount: 0, priceInINR: 0 });
    setIsNewPackage(true);
    onOpen();
  };

  // Handle saving package
  const handleSavePackage = async () => {
    try {
      if (!coinData) return;
      if (isNewPackage) {
        // Add new package
        const response = await createCoinPackage(currentPackage);
        if (response.status == "error") {
          return;
        }
        setCoinData({
          ...coinData,
          packages: [
            ...coinData.packages,
            {
              ...currentPackage,
              id: response.data.id,
            },
          ],
        });
      } else {
        if (!currentPackage?.id) return;
        const response = await updateCoinPackage({
          id: currentPackage.id,
          coinAmount: currentPackage.coinAmount,
          priceInINR: currentPackage.priceInINR,
        });
        if (response.status == "error") {
          throw new Error("Something Happened");
        }

        setCoinData({
          ...coinData,
          packages: coinData.packages.map((pkg) =>
            pkg.id === currentPackage.id ? currentPackage : pkg
          ),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  // Handle opening delete confirmation
  const handleDeleteClick = (id: string) => {
    setPackageToDelete(id);
    onDeleteOpen();
  };

  // Handle confirming deletion
  const handleConfirmDelete = async () => {
    if (packageToDelete && coinData) {
      try {
        const response = await deleteCoinPackage(packageToDelete);
        if (response.status == "error") {
          throw new Error("something happened");
        }
        setCoinData({
          ...coinData,
          packages: coinData.packages.filter((pkg) => {
            if (pkg.id) return pkg.id !== packageToDelete;
            return true;
          }),
        });
      } catch (error) {
        toast.error("Failed to delete the package", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };

  const renderCell = (pkg: any, columnKey: React.Key) => {
    const cellValue = pkg[columnKey as keyof any];
    switch (columnKey) {
      case "coin-amount":
        return (
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">
              {pkg.coinAmount.toLocaleString()}
            </span>
          </div>
        );
      case "price":
        return <p>₹ {pkg.priceInINR.toLocaleString()}</p>;
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="Edit package">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={() => handleEditPackage(pkg)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete package" color="danger">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onClick={() => handleDeleteClick(pkg.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const columns = [
    { key: "coin-amount", label: "COIN AMOUNT" },
    { key: "price", label: "PRICE (INR)" },
    { key: "actions", label: "ACTIONS" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Coin System Management</h1>
            <p className="text-gray-500">
              Manage coin exchange rates and purchase packages
            </p>
          </div>

          {/* Ratios Card */}
          <Skeleton isLoaded={!isLoading}>
            <RatiosCard
              editingRatios={editingRatios}
              handleSaveRatios={handleSaveRatios}
              setEditingRatios={setEditingRatios}
              goldToINRRatio={goldToINRRatio}
              setGoldToINRRatio={setGoldToINRRatio}
              redeemCoinToGoldRatio={redeemCoinToGoldRatio}
              setRedeemCoinToGoldRatio={setRedeemCoinToGoldRatio}
            />
          </Skeleton>
          <Skeleton isLoaded={!isLoading}>
            <AdminTable
              columns={columns}
              emptyContent="No Active Packages"
              items={coinData?.packages || []}
              label=""
              loadingState="idle"
              renderCell={renderCell}
              bottomContent
              topContent={
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-500" />
                    <h2 className="text-xl font-semibold">Purchase Packages</h2>
                  </div>
                  <Button
                    color="primary"
                    variant="shadow"
                    startContent={<Plus className="w-4 h-4" />}
                    onClick={handleAddPackage}
                  >
                    Add Package
                  </Button>
                </div>
              }
            />
          </Skeleton>
        </div>
      </motion.div>

      {/* Package Modal */}
      <PackageModal
        isOpen={isOpen}
        onClose={onClose}
        isNewPackage={isNewPackage}
        setCurrentPackage={setCurrentPackage}
        currentPackage={currentPackage}
        handleSavePackage={handleSavePackage}
      />
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        itemName={``}
        onOpenChange={onOpenChange}
        title="Delete Package"
        onDelete={handleConfirmDelete}
        itemType="Coin Package"
        isLoading={isLoading}
      />
    </div>
  );
}
