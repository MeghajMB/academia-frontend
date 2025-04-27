export interface ILecture {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
  status: string;
  sectionId: string;
  progress: "completed" | "not completed" | "locked" | "instructor";
}

export interface ISection {
  id: string;
  title: string;
  order: number;
  description:string;
  courseId:string;
  lectures: ILecture[];
}

export interface ICourse {
  id: string;
  userId: string;
  title: string;
  price: number;
  subtitle: string;
  description: string;
  category: { description: string; name: string };
  totalDuration: number;
  totalLectures: number;
  totalSections: number;
  isBlocked: boolean;
  status: "pending" | "accepted" | "rejected" | "draft" | "listed";
  rejectedReason: string;
  imageThumbnail: string;
  promotionalVideo: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICourseDetails {
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
  enrollmentStatus: "enrolled" | "not enrolled"|"instructor";
  canReview: boolean;
  hasReviewed: boolean;
}
