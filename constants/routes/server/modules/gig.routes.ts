const VERSION = "v1";

export const GIG_ROUTES = {
  GET_ALL: `/${VERSION}/gigs`,
  GET_BY_ID: (id: string) => `/${VERSION}/gigs/${id}`,
  GET_BY_SLUG: (slug: string) => `/${VERSION}/gigs/slug/${slug}`,
  CREATE: `/${VERSION}/gigs`,
  UPDATE: (id: string) => `/${VERSION}/gigs/${id}`,
  DELETE: (id: string) => `/${VERSION}/gigs/${id}`,
  
  // Gig bookings
  BOOK: `/${VERSION}/gigs/book`,
  MY_BOOKINGS: `/${VERSION}/gigs/my-bookings`,
};
