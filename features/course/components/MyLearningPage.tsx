"use client";

import React, { useEffect, useState } from "react";
import { Award, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import LoadingPage from "@/app/loading";
import MyLearningCard from "./MyLearningCard";
import useCourseApi from "@/hooks/api/useCourseApi";
import NoContentAvailable from "../../../components/common/NoContentAvailable";

export interface IEnrolledCourses {
  id: string;
  imageThumbnail: string;
  title: string;
  completedAt: string | undefined;
  progressPercentage: number;
  certificate: string | undefined;
}

export default function LearningPage() {
  const [isClient, setIsClient] = useState(false);
  const [courses, setCourses] = useState<IEnrolledCourses[]>([]);
  const [completedCourses, setCompletedCourses] = useState<IEnrolledCourses[]>(
    []
  );
  const [error,setError]=useState<string>('')

  const { fetchEnrolledCoursesApi } = useCourseApi();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetchEnrolledCoursesApi();
        if(response.status=='error'){
          setError(response.message);
          return
        }
        const completedCourses = response.data.filter(
          (course) => course.completedAt
        );
        setCourses(response.data);
        setCompletedCourses(completedCourses);
      } catch (error) {
        console.log(error);
      }
      setIsClient(true);
    }
    fetchCourses();
  }, []);

  if (!isClient) {
    return <LoadingPage />;
  }

  return (
    <div className=" bg-black text-white pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-neutral-900 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-indigo-600/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{courses.length}</div>
              <div className="text-neutral-400">Active Courses</div>
            </div>
          </div>

          {/* <div className="bg-neutral-900 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <BarChart2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">48</div>
              <div className="text-neutral-400">Hours Learned</div>
            </div>
          </div> */}

          <div className="bg-neutral-900 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-yellow-600/20 rounded-lg">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {completedCourses.length}
              </div>
              <div className="text-neutral-400">Completed Courses</div>
            </div>
          </div>
        </motion.div>

        {/* In Progress Courses */}
        {courses.length != 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">In Progress</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <MyLearningCard key={course.id} course={course} />
              ))}
            </div>
          </motion.div>
        )}
        {courses.length == 0 && (
          <NoContentAvailable
            title="No Courses Purchased"
            content="Purchase courses to view them."
          />
        )}
        {/* Completed Courses */}
        {/*         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Completed</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <motion.div
                key={course.id}
                className="bg-neutral-900 rounded-xl overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={course.imageThumbnail}
                    alt={course.title}
                    fill
                    className="w-full h-48 object-cover opacity-75"
                  />
                  <div className="absolute top-4 right-4 bg-green-600/20 text-green-400 px-3 py-1 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Completed</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{course.title}</h3>

                  <div className="flex justify-between text-sm text-neutral-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Completed on{" "}
                        {course.completedAt
                          ? new Date(course.completedAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {course.certificate && (
                    <button className="w-full flex items-center justify-center space-x-2 border border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white py-2 rounded-lg transition-colors">
                      <Award className="w-5 h-5" />
                      <span>View Certificate</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </div>
  );
}
