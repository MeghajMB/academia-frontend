export interface ICreateGigDTO {
  sessionDate: string;
  description: string;
  biddingAllowed: boolean;
  sessionDuration: number;
  maxParticipants: number;
  minBid: number;
  title: string;
}

export interface IGig {
  id: string;
  sessionDate: string;
  description: string;
  biddingAllowed:boolean;
  sessionDuration: number;
  maxParticipants:number;
  minBid: number;
  status: "completed" | "active" | "expired" | "no-bids" | "missed";
  currentBid: number;
  currentBidder: string | null;
  title: string;

  instructorId: string;
  biddingExpiresAt: string;
  createdAt: string;
}
