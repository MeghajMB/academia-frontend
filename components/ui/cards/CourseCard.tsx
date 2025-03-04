"use client";

import { ICourse } from "@/types/course";
import { Card, CardBody, CardFooter, CardHeader, Chip, Image } from "@nextui-org/react";
import { BookOpen, Clock, Star } from "lucide-react";
import Link from "next/link";

export default function CourseCard({ course }: { course: ICourse }) {
  const hours = Math.floor(course.totalDuration / 60)
  const minutes = course.totalDuration % 60

  // Format duration string
  const durationText = hours > 0 ? `${hours}h ${minutes > 0 ? `${minutes}m` : ""}` : `${minutes}m`

  // Calculate rating display (placeholder - replace with actual rating logic)
  const rating = 4.5 // Replace with actual rating calculation
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  return (
    <Link href={`/course/${course.id}`} className="block">
    <Card 
      className="w-full max-w-[340px] h-[420px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      shadow="sm"
    >
      <div className="relative">
        <Image
          alt={course.title}
          className="w-full object-cover aspect-video z-0"
          src={course.imageThumbnail || "/placeholder.svg"}
          width={340}
          height={190}
          radius="none"
        />
        
        {course.status === "listed" && (
          <Chip 
            color="secondary" 
            variant="flat" 
            className="absolute top-2 right-2 z-10"
            size="sm"
          >
            {course.category.name}
          </Chip>
        )}
      </div>

      <CardHeader className="pb-0 pt-3 px-4 flex-col items-start">
        <h3 className="font-bold text-lg line-clamp-2 h-[56px]">{course.title}</h3>
      </CardHeader>

      <CardBody className="py-2 px-4 flex flex-col gap-2">
        <p className="text-default-500 text-sm line-clamp-2 h-[40px]">{course.subtitle}</p>
        
        <div className="flex items-center gap-1 mt-1">
          <span className="font-medium">{rating.toFixed(1)}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={`${
                  i < fullStars 
                    ? "fill-yellow-500 text-yellow-500" 
                    : i === fullStars && hasHalfStar
                      ? "fill-yellow-500/50 text-yellow-500" 
                      : "fill-gray-600 text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-default-500 mt-1">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{durationText}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{course.totalLectures} lectures</span>
          </div>
        </div>
      </CardBody>

      <CardFooter className="pt-0 px-4 flex justify-between items-center">
        <p className="text-xl font-bold text-yellow-400">₹{course.price}</p>
        <Chip 
          color="primary" 
          variant="flat" 
          size="sm"
          className="font-medium"
        >
          View Course
        </Chip>
      </CardFooter>
    </Card>
  </Link>
  );
}
