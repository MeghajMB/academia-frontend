export interface ILecture {
  id: string;
  title: string;
  videoUrl: string;
  order: number;
  duration: number;
  status: string;
}

export interface ISection {
  id: string;
  title: string;
  order: number;
  lectures: ILecture[];
}

export interface ICourse {
  id: string;
  userId: string;
  title: string;
  price: number;
  subtitle: string;
  description: string;
  category: { description: string,name:string };
  totalDuration: number;
  totalLectures: number;
  totalSections: number;
  isBlocked: boolean;
  status: "pending" | "accepted" | "rejected" | "draft" | "listed";
  rejectedReason: string;
  imageThumbnail: string;
  promotionalVideo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseDetails{
  courseId: string;
  instructorId: string;
  instructorName: string;
  totalDuration: number;
  totalLectures: number;
  imageThumbnail: string;
  promotionalVideo: string;
  category: string;
  title: string;
  price: number;
  subtitle: string;
  description: string;
  enrollmentStatus:"enrolled" | "not enrolled";
  canReview:boolean
  hasReviewed:boolean;
}