"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Progress,
} from "@heroui/react";
import { Calendar, Clock, Coins, Info, Award } from "lucide-react";
import PageNotFound from "@/components/PageNotFound";
import TopBidders from "@/components/gigs/TopBidders";
import useGigApi from "@/hooks/api/useGigApi";
import CountDownTimer from "@/components/CountDownTimer";

interface IGigDetails {
  id: string;
  instructorId: string;
  title: string;
  description: string;
  sessionDuration: number;
  minBid: number;
  currentBid: number;
  currentBidder: string | null;
  status: "active" | "expired";
  biddingExpiresAt: Date;
  sessionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

function Page() {
  const { gigSlug } = useParams();
  const { getGigByIdApi, CreateBidApi } = useGigApi();
  const [gigDetails, setGigDetails] = useState<IGigDetails | null>(null);
  const [bid, setBid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getGigByIdApi(gigSlug as string);
        setGigDetails(data);
      } catch (error) {
        console.error("Failed to fetch gig details:", error);
      }
    }
    fetchData();
  }, []);

  if (!gigDetails) {
    return <PageNotFound />;
  }

  const isExpired = new Date(gigDetails.biddingExpiresAt) < new Date();
  const bidPercentage = gigDetails.currentBid
    ? Math.min(
        Math.round((gigDetails.currentBid / gigDetails.minBid) * 100),
        200
      )
    : 100;

  async function handleSubmitBid() {
    setError("");
    if (!gigDetails) return;
    if (!bid || Number(bid) <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }

    if (Number(bid) < gigDetails.minBid) {
      setError(`Bid must be at least ${gigDetails.minBid} coins`);
      return;
    }

    if (gigDetails.currentBid && Number(bid) <= gigDetails.currentBid) {
      setError(
        `Bid must be higher than current bid of ${gigDetails.currentBid} coins`
      );
      return;
    }

    try {
      setIsLoading(true);
      await CreateBidApi(gigSlug as string, Number(bid));
      onClose();
      // Refresh gig details after successful bid
      const updatedData = await getGigByIdApi(gigSlug as string);
      setGigDetails(updatedData);
      setBid("");
    } catch (error) {
      console.error(error);
      setError("Failed to place bid. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pt-24">
      <Card className="bg-content1 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {gigDetails.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Chip color={isExpired ? "danger" : "success"} variant="flat">
                {isExpired ? "Bidding Closed" : "Bidding Open"}
              </Chip>

              {!isExpired && (
                <Chip color="warning" variant="dot">
                  <span className="font-semibold">Ends in:</span>{" "}
                  <CountDownTimer
                    targetDate={gigDetails.biddingExpiresAt.toString()}
                  />
                </Chip>
              )}
            </div>
          </div>

          {!isExpired && (
            <Button
              color="primary"
              size="lg"
              onPress={onOpen}
              startContent={<Coins />}
              className="font-semibold"
            >
              Place Bid
            </Button>
          )}
        </CardHeader>

        <Divider />

        <CardBody className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-default-600 whitespace-pre-line">
                {gigDetails.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Session Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-content2">
                  <CardBody className="p-4 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm text-default-500">Duration</p>
                      <p className="font-semibold">
                        {gigDetails.sessionDuration} minutes
                      </p>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content2">
                  <CardBody className="p-4 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm text-default-500">Service Date</p>
                      <p className="font-semibold">
                        {new Date(gigDetails.sessionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content2">
                  <CardBody className="p-4 flex items-center gap-3">
                    <Coins className="w-6 h-6 text-warning" />
                    <div>
                      <p className="text-sm text-default-500">Minimum Bid</p>
                      <p className="font-semibold">{gigDetails.minBid} Coins</p>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content2">
                  <CardBody className="p-4 flex items-center gap-3">
                    <Award className="w-6 h-6 text-success" />
                    <div>
                      <p className="text-sm text-default-500">
                        Current Highest Bid
                      </p>
                      <p className="font-semibold">
                        {gigDetails.currentBid
                          ? `${gigDetails.currentBid} Coins`
                          : "No bids yet"}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Bidding Progress</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    Min Bid: {gigDetails.minBid} Coins
                  </span>
                  <span className="text-sm">
                    Current: {gigDetails.currentBid || "No bids"}
                    {gigDetails.currentBid ? " Coins" : ""}
                  </span>
                </div>
                <Progress
                  aria-label="Loading..."
                  value={bidPercentage}
                  color={
                    bidPercentage > 150
                      ? "success"
                      : bidPercentage > 120
                      ? "warning"
                      : "primary"
                  }
                  showValueLabel={true}
                  className="h-3"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <Card className="bg-content2">
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold">Top Bidders</h2>
              </CardHeader>
              <CardBody>
                <TopBidders gigId={gigDetails.id} />
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>

      {/* Bidding Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Place Your Bid
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Time Remaining:</span>
                    <Chip
                      color="warning"
                      variant="flat"
                      className="animate-pulse"
                    >
                      <CountDownTimer
                        targetDate={gigDetails.biddingExpiresAt.toString()}
                      />
                    </Chip>
                  </div>

                  <Divider />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Minimum Bid:</span>
                    <span>{gigDetails.minBid} Coins</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Current Highest Bid:</span>
                    <span>{gigDetails.currentBid || "No bids yet"}</span>
                  </div>

                  <Divider />

                  <div>
                    <Input
                      type="number"
                      label="Your Bid (Coins)"
                      placeholder="Enter bid amount"
                      value={bid}
                      onChange={(e) => setBid(e.target.value)}
                      min={gigDetails.minBid}
                      step="1"
                      startContent={
                        <Coins className="w-4 h-4 text-default-400" />
                      }
                      description={`Must be higher than ${
                        gigDetails.currentBid || gigDetails.minBid
                      } coins`}
                      isInvalid={!!error}
                      errorMessage={error}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-default-100 rounded-lg">
                    <Info className="w-5 h-5 text-default-500 mt-0.5" />
                    <p className="text-sm text-default-600">
                      Once placed, bids cannot be withdrawn. The highest bidder
                      at the end of the bidding period will win the session.
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmitBid}
                  isLoading={isLoading}
                  startContent={!isLoading && <Coins />}
                >
                  Confirm Bid
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Page;
