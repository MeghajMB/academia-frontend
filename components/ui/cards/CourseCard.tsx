"use client";

import { ICourse } from "@/types/course";
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { Star } from "lucide-react";
import Link from "next/link";

export default function CourseCard({ course }: { course: ICourse }) {
  return (
    <Link href={`/course/${course.id}`} className="block">
      <Card className="cursor-pointer max-w-[340px] w-full transition-transform duration-300 hover:scale-[1.02] h-96">
        <div className="w-full overflow-hidden rounded-xl">
          <Image
            alt="Course thumbnail"
            className="w-full object-cover aspect-video rounded-xl"
            src={course.imageThumbnail}
            width={340}
            height={190}
          />
        </div>

        <CardHeader className="pb-0 pt-3 px-4 flex flex-col items-start">
          <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
          <small className="text-primary">{course.category.name}</small>
        </CardHeader>

        <CardBody className="py-2 px-4 flex flex-col gap-2">
          <div className="flex items-center gap-1 text-sm">
            <span>4.5</span>
            <Star className="w-4 text-yellow-500" />
            <Star className="w-4 text-yellow-500" />
            <Star className="w-4 text-yellow-500" />
          </div>
          <p className="text-lg font-medium text-yellow-400">${course.price}</p>
        </CardBody>
      </Card>
    </Link>
  );
}
