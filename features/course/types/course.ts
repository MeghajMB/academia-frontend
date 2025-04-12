export interface ListCourses {
  id: string;
  instructorDetails: {
    name: string;
    id: string;
  };
  title: string;
  price: number;
  subtitle: string;
  rating: number;
  category: {
    name: string;
    id: string;
  };
  totalDuration: number;
  totalLectures: number;
  totalSections: number;
  isBlocked: boolean;
  status: string;
  imageThumbnail: string;
  createdAt: string;
  updatedAt: string;
}
