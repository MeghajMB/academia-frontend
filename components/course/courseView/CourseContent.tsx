import { ILecture, ISection } from "@/types/course";
import { Accordion, AccordionItem, Spinner } from "@nextui-org/react";
import { CheckCircle, Clock1, Lock, Play } from "lucide-react";
import { useEffect, useState } from "react";

const CourseContent = ({
    sections,
    setActiveLecture,
    activeLecture,
  }: {
    sections: ISection[];
    setActiveLecture: (lecture: ILecture) => void;
    activeLecture: ILecture;
  }) => {
  
    return (
      <div className=" backdrop-blur-sm rounded-xl">
        <div className="flex justify-center items-center mb-2">
          <h2 className="text-2xl font-bold text-white">Course Content</h2>
        </div>
  
        <Accordion variant="shadow" selectionMode="multiple" className="gap-4">
          {sections.map((section, index) => (
            <AccordionItem
              key={index}
              title={`Section:${section.order + 1}  ${section.title}`}
              subtitle={
                <div className="flex justify-between items-center py-2">
                  <p className="text-sm text-gray-400 mt-1">
                    {section.lectures.reduce(
                      (total, lecture) => total + lecture.duration,
                      0
                    )}
                    min
                  </p>
                  <span className="text-sm text-gray-400">
                    {
                      section.lectures.filter((l) => l.status === "completed")
                        .length
                    }
                    /{section.lectures.length}
                  </span>
                </div>
              }
              className="rounded-xl"
            >
              <ul className="space-y-2">
                {section.lectures.map((lecture) => (
                  <li
                    key={lecture.id}
                    onClick={() => setActiveLecture(lecture)}
                    className={`
                      flex items-center p-3 rounded-lg transition-all duration-200
                      ${
                        lecture.id === activeLecture.id
                          ? "bg-blue-600/20 border-l-4 border-blue-600"
                          : "hover:bg-gray-600/50 border-l-4 border-transparent"
                      }
                      ${
                        lecture.status === "locked"
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }
                    `}
                  >
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      {lecture.order + 1}.
                    </div>
  
                    <div className="flex-grow">
                      <div className="flex items-center">
                        {lecture.status === "locked" ? (
                          <Lock className="w-4 h-4 text-gray-400 mr-2" />
                        ) : lecture.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <Play className="w-4 h-4 text-gray-400 mr-2" />
                        )}
                        <p className="text-gray-300 font-medium">
                          {lecture.title}
                        </p>
                      </div>
  
                      <div className="flex items-center mt-1">
                        <Clock1 className="w-3 h-3 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          {lecture.duration} min
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  };

  export default CourseContent;