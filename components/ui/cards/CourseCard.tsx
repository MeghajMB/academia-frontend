import {
  Card,
  CardFooter,
  Image,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { Star } from "lucide-react";

interface ICourse {
    id: string;
    title: string;
    image: string;
    rating: number;
    reviews: number;
    price: number;
    instructor:string
  }

export default function CourseCard({ course }: { course: ICourse }) {
  return (
    <Card className="py-4">
      <Image
        alt="Card background"
        className="object-cover rounded-xl"
        src="https://nextui.org/images/hero-card-complete.jpeg"
        width={270}
      />
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-large uppercase font-bold">{course.title}</p>
        <small className="text-default-500 text-[#8680ff]">
          {course.instructor}
        </small>
      </CardHeader>
      <CardBody className="overflow-visible py-2 pl-4">
        <div className="flex">
          <span className="text-sm">{course.rating}</span>
          <Star className="w-4 text-blue-500" />
          <Star className="w-4 text-blue-500" />
          <Star className="w-4 text-blue-500" />
        </div>
        <p className="text-yellow-300">${course.price}</p>
      </CardBody>
    </Card>
  );
}
