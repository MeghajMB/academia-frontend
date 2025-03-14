"use client";

import { useEffect, useState } from "react";
import ProfilePicture from "@/public/images/blankUserProfile.jpeg";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Avatar,
  Chip,
  Divider,
} from "@heroui/react";
import useGigApi from "@/hooks/api/useGigApi";
import CountDownTimer from "@/components/CountDownTimer";
import Link from "next/link";
import { Calendar, Clock, Coins } from "lucide-react";
import NoContentAvailable from "@/components/ui/NoContentAvailable";

interface IGigDetails {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorProfilePicture: string;
  title: string;
  sessionDuration: string;
  minBid: number;
  biddingExpiresAt: string;
  sessionDate: string;
}

const GigListing = () => {
  const [gigs, setGigs] = useState<IGigDetails[]>([]);
  const { getAllActiveGigApi } = useGigApi();

  useEffect(() => {
    async function fetchData() {
      const data = await getAllActiveGigApi();
      setGigs(data);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Available Gigs
        </h2>
        <Chip color="primary" variant="shadow" className="hidden md:flex">
          {gigs.length} gigs found
        </Chip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <Card
            key={gig.id}
            className="bg-content1 border border-content2 hover:shadow-lg transition-shadow duration-300"
            isPressable
            as={Link}
            href={`gigs/${gig.id}`}
          >
            <CardHeader className="flex gap-3 p-4">
              <Avatar
                src={gig.instructorProfilePicture || ProfilePicture.src}
                size="md"
                isBordered
                color="primary"
                alt={"gig.instructorName"}
              />
              <div className="flex flex-col">
                <p className="text-md font-semibold">{"gig.instructorName"}</p>
                <p className="text-small text-default-500">Instructor</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-4">
              <h3 className="text-xl font-bold mb-3">{gig.title}</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-warning" />
                  <span className="text-sm">
                    <span className="font-semibold">Min Bid:</span>{" "}
                    <Chip size="sm" color="warning" variant="flat">
                      {gig.minBid} Coins
                    </Chip>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span className="text-sm">
                    <span className="font-semibold">Duration:</span>{" "}
                    {gig.sessionDuration} minutes
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-success" />
                  <span className="text-sm">
                    <span className="font-semibold">Service Date:</span>{" "}
                    {new Date(gig.sessionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Time Left:</span>
                <Chip color="danger" variant="flat" className="animate-pulse">
                  <CountDownTimer targetDate={gig.biddingExpiresAt} />
                </Chip>
              </div>
              <Button color="primary" variant="flat" size="sm" radius="full">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {gigs.length === 0 && (
        <NoContentAvailable
          title="No gigs available at the moment"
          content="Check back later for new opportunities"
        />
      )}
    </div>
  );
};

export default GigListing;
