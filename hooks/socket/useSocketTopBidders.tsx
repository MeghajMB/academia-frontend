"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/store/socket";

interface Bid {
  userId: string;
  username: string;
  amount: number;
  profilePicture: string;
}

const useTopBidders = (gigId: string) => {
  const [topBidders, setTopBidders] = useState<Bid[]>([]);

  useEffect(() => {
    if (!gigId) return;
    const socket = getSocket();
    // Join the bidding room
    socket.emit("joinBiddingRoom", gigId);

    // Listen for updates
    socket.on(`topBids${gigId}`, (bidders: Bid[]) => {
      setTopBidders(bidders);
    });

    return () => {
      socket.emit("leaveBiddingRoom", gigId);
      socket.off(`topBids${gigId}`);
    };
  }, [gigId]);

  return topBidders;
};

export default useTopBidders;
