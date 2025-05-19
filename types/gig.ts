export interface ICreateGigDTO {
  title: string;
  description: string;
  price: number;
  biddingAllowed: boolean;
  duration: string;
  maxParticipants: number;
  date: string; // Received as a string
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
