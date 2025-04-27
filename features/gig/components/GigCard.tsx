import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Button,
} from "@heroui/react";
import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import CountDownTimer from "@/components/common/CountDownTimer";
import moment from "moment";
import { GigData } from "@/types/gig";

interface GigCardProps {
  gig: GigData;
}

export function GigCard({ gig }: GigCardProps) {
  return (
    <Card key={gig.id} className="shadow-md">
      <CardHeader className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{gig.title}</h3>
          <p className="text-sm text-gray-500">
            Created {moment(gig.createdAt).format("MMM D, YYYY")}
          </p>
        </div>
        <Chip
          color={gig.status === "active" ? "success" : "danger"}
          variant="flat"
        >
          {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
        </Chip>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-sm mb-4 line-clamp-3">{gig.description}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <ClockIcon size={16} className="text-gray-500" />
            <span className="text-sm">{gig.sessionDuration} mins</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSignIcon size={16} className="text-gray-500" />
            <span className="text-sm">Min bid: ${gig.minBid}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-gray-500" />
            <span className="text-sm">
              {moment(gig.sessionDate).format("MMM D, YYYY, h:mm A")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSignIcon size={16} className="text-gray-500" />
            <span className="text-sm">
              Current: ${gig.currentBid > 0 ? gig.currentBid : "No bids"}
            </span>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between">
        <div className="text-sm">
          <span className="text-gray-500">Bidding ends: </span>
          <CountDownTimer targetDate={gig.biddingExpiresAt} />
        </div>
        <Button size="sm" color="primary" variant="flat">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
