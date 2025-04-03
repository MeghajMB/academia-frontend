"use client";

import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
} from "@heroui/react";
import { Trophy, Coins } from "lucide-react";
import ProfilePicture from "@/public/images/blankUserProfile.jpeg";
import useTopBidders from "@/hooks/socket/useSocketTopBidders";

interface Props {
  gigId: string;
}

const TopBidders = ({ gigId }: Props) => {
  const topBidders = useTopBidders(gigId);

  return (
    <Card className="bg-content2 shadow-md">
      <CardHeader className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-bold">Top Bidders</h3>
        </div>
        <Chip color="primary" variant="flat" size="sm">
          Live
        </Chip>
      </CardHeader>
      <Divider />
      <CardBody className="px-2 py-3 max-h-[300px] overflow-y-auto">
        {topBidders.length > 0 ? (
          <ul className="space-y-3">
            {topBidders.map((bid, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-content3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Chip
                    color={
                      index === 0
                        ? "warning"
                        : index === 1
                        ? "primary"
                        : index === 2
                        ? "secondary"
                        : "default"
                    }
                    variant="flat"
                    size="sm"
                  >
                    #{index != 9 && "0"}
                    {index + 1}
                  </Chip>
                  <Avatar
                    src={bid.profilePicture || ProfilePicture.src}
                    size="sm"
                    className="hidden sm:flex"
                  />
                  <span className="font-medium truncate max-w-[120px] sm:max-w-[150px]">
                    {bid.username}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-warning" />
                  <span className="font-semibold">{bid.amount}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-default-500">
            <Coins className="w-8 h-8 mb-2 opacity-50" />
            <p>No bids yet</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default TopBidders;
