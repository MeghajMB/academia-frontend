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
  instructorId: string;
  title: string;
  description: string;
  sessionDuration: number;
  minBid: number;
  currentBid: number;
  currentBidder: string | null;
  status: "active" | "expired";
  biddingExpiresAt: string;
  sessionDate: string;
  createdAt: string;
  updatedAt: string;
}
