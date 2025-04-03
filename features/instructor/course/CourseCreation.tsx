"use client";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Select,
  SelectItem,
  Image,
  Card,
  CardBody,
  Spinner,
} from "@heroui/react";
import useCategoryApi from "@/hooks/api/useCategoryApi";
import useFilesApi from "@/hooks/api/useFilesApi";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import useCourseApi from "@/hooks/api/useCourseApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import LoadingPage from "@/app/loading";

interface ICategory {
  createdAt: string;
  description: string;
  id: string;
  isBlocked: boolean;
  name: string;
  updatedAt: string;
}

interface CourseFormData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  price: string;
  imageThumbnail: string;
  promotionalVideo: string;
}

interface ICourseDetails {
  courseId: string;
  imageThumbnail: string;
  promotionalVideo: string;
  category: string;
  title: string;
  price: number;
  subtitle: string;
  description: string;
  rejectedReason: string;
  canSubmitReview: boolean;
}

export default function CourseCreation({
  isEditMode,
  courseDetails,
}: {
  isEditMode: boolean;
  courseDetails?: ICourseDetails;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>();

  const { fetchCategoriesApi } = useCategoryApi();
  const { generatePutSignedUrlApi } = useFilesApi();
  const {
    createCourse,
    editCourseCreationDetailsApi,
  } = useCourseApi();

  useEffect(() => {
    async function getCategories() {
      try {
        const categories = await fetchCategoriesApi();
        setCategories(categories);
      } catch (error) {
        console.log(error);
      } finally {
        setIsClient(true);
      }
    }
    if (isEditMode && courseDetails) {
      reset({
        title: courseDetails.title,
        subtitle: courseDetails.subtitle,
        description: courseDetails.description,
        category: courseDetails.category,
        price: String(courseDetails.price),
      });
      setImagePreview(courseDetails.imageThumbnail);
      setVideoPreview(courseDetails.promotionalVideo);
    }
    getCategories();
  }, [courseDetails]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [imagePreview, videoPreview]);

  if (!isClient) return <LoadingPage />;

  const handleCreateCourse = async (formData: CourseFormData) => {
    try {
      setIsLoading(true);
      if (!imageFile || !videoFile) {
        return null;
      }
      if (
        imageFile.type !== "image/jpeg" &&
        imageFile.type !== "image/jpg" &&
        imageFile.type !== "image/png"
      ) {
        toast.error("Only JPG, JPEG, and PNG image formats are allowed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
      if (videoFile.type !== "video/mp4" && videoFile.type !== "video/webm") {
        toast.error("Only MP4 and WebM video formats are allowed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }

      if (videoFile.size > 50000000 || videoFile.size < 10000000) {
        toast.error("Video Must be between 10 and 50 mb", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
      const thumbnailKey = `thumbnails/${Date.now()}_${uuidv4()}_${
        imageFile.name
      }`;
      const videoKey = `previewVideos/${Date.now()}_${uuidv4()}_${
        videoFile.name
      }`;
      const thumbnailContentType = imageFile.type;
      const videoContentType = videoFile.type;
      const thumbnailSignedUrl = await generatePutSignedUrlApi(
        thumbnailKey,
        thumbnailContentType,
        true,
        false
      );
      const videoSignedUrl = await generatePutSignedUrlApi(
        videoKey,
        videoContentType,
        true,
        false
      );
      // Uploading files to s3
      await axios.put(thumbnailSignedUrl, imageFile, {
        headers: { "Content-Type": thumbnailContentType },
      });
      await axios.put(videoSignedUrl, videoFile, {
        headers: { "Content-Type": videoContentType },
      });

      // Submitting course details to the backend
      const sanitizedDescription = DOMPurify.sanitize(formData.description);
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        price: parseFloat(formData.price),
        description: sanitizedDescription,
        imageThumbnail: thumbnailKey,
        promotionalVideo: videoKey,
      };

      const response = await createCourse(payload);
      router.push(`/instructor/courses/create/${response.id}`); // Navigate to courses page after success
    } catch (error) {
      let commonError;
      if (error instanceof AxiosError) {
        commonError = error.response?.data?.errors[0].message;
      }
      console.log(commonError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourse = async (formData: CourseFormData) => {
    try {
      setIsLoading(true);
      let videoKey = null,
        thumbnailKey = null;
      if (videoFile) {
        if (videoFile.type !== "video/mp4" && videoFile.type !== "video/webm") {
          toast.error("Only MP4 and WebM video formats are allowed", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          return;
        }

        if (videoFile.size > 50000000 || videoFile.size < 10000000) {
          toast.error("Video Must be between 10 and 50 mb", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          return;
        }

        videoKey = `previewVideos/${Date.now()}_${uuidv4()}_${videoFile.name}`;
        const videoContentType = videoFile.type;
        const videoSignedUrl = await generatePutSignedUrlApi(
          videoKey,
          videoContentType,
          true,
          false
        );
        // Uploading files to s3
        await axios.put(videoSignedUrl, videoFile, {
          headers: { "Content-Type": videoContentType },
        });
      }
      if (imageFile) {
        if (
          imageFile &&
          imageFile.type !== "image/jpeg" &&
          imageFile.type !== "image/jpg" &&
          imageFile.type !== "image/png"
        ) {
          toast.error("Only JPG, JPEG, and PNG image formats are allowed", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          return;
        }
        thumbnailKey = `thumbnails/${Date.now()}_${uuidv4()}_${imageFile.name}`;
        const thumbnailContentType = imageFile.type;
        const thumbnailSignedUrl = await generatePutSignedUrlApi(
          thumbnailKey,
          thumbnailContentType,
          true,
          false
        );
        // Uploading files to s3
        await axios.put(thumbnailSignedUrl, imageFile, {
          headers: { "Content-Type": thumbnailContentType },
        });
      }
      const sanitizedDescription = DOMPurify.sanitize(formData.description);
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        price: parseFloat(formData.price),
        description: sanitizedDescription,
        imageThumbnail: thumbnailKey,
        promotionalVideo: videoKey,
      };

      await editCourseCreationDetailsApi(courseDetails!.courseId,payload);
      toast.success("Successfully Edited Course", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-black to-gray-900">
      <CardBody>
        <form
          onSubmit={
            isEditMode
              ? handleSubmit(handleEditCourse)
              : handleSubmit(handleCreateCourse)
          }
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("title", {
                required: "Title is required",
                minLength: { value: 5, message: "Minimum 5 characters" },
              })}
              errorMessage={errors.title?.message}
              isInvalid={Boolean(errors.title?.message)}
              label="Course Title"
              labelPlacement="outside"
              placeholder="Enter the Title"
              type="text"
              variant="bordered"
              classNames={{
                label: "font-medium",
              }}
            />

            <Input
              {...register("subtitle", {
                required: "Subtitle is required",
                minLength: { value: 5, message: "Minimum 5 characters" },
              })}
              errorMessage={errors.subtitle?.message}
              isInvalid={Boolean(errors.subtitle?.message)}
              label="Course Subtitle"
              labelPlacement="outside"
              placeholder="Enter the Subtitle"
              type="text"
              variant="bordered"
              classNames={{
                label: "font-medium",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              {...register("category", { required: "Category is required" })}
              isInvalid={Boolean(errors.category?.message)}
              errorMessage={errors.category?.message}
              label="Select a Category"
              labelPlacement="outside"
              name="category"
              variant="bordered"
              classNames={{
                label: "font-medium",
              }}
            >
              {categories.map((category) => (
                <SelectItem key={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Price"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Enter a valid price" },
                max: { value: 5000, message: "Price cannot exceed 5,000" },
                validate: (value) => {
                  const numValue = Number(value);
                  if (isNaN(numValue)) return "Price must be a number";
                  if (!Number.isInteger(numValue))
                    return "Price must be a whole number";
                  return true;
                },
              })}
              errorMessage={errors.price?.message}
              isInvalid={Boolean(errors.price?.message)}
              labelPlacement="outside"
              placeholder="Enter the Price"
              type="number"
              variant="bordered"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
              classNames={{
                label: "font-medium",
              }}
            />
          </div>

          <Textarea
            {...register("description", {
              required: "Description is required",
              minLength: { value: 50, message: "Minimum 50 characters" },
            })}
            errorMessage={errors.description?.message}
            isInvalid={Boolean(errors.description?.message)}
            label="Description"
            placeholder="Enter your description"
            labelPlacement="outside"
            name="description"
            variant="bordered"
            minRows={4}
            classNames={{
              label: "font-medium",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="font-medium">Course Thumbnail</p>
              {imagePreview ? (
                <div className="flex flex-col justify-center items-center">
                  <Image
                    src={imagePreview}
                    alt="Image Preview"
                    classNames={{
                      img: "object-cover w-full h-48 rounded-lg",
                    }}
                  />
                  <div>
                    <Button
                      as="label"
                      htmlFor="image-upload"
                      variant="flat"
                      color="primary"
                      className="bg-white/20"
                    >
                      Change Image
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  as="label"
                  htmlFor="image-upload"
                  variant="flat"
                  color="primary"
                  className="w-full h-48"
                >
                  Select Thumbnail Image
                </Button>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                {...register("imageThumbnail")}
                onChange={handleImageChange}
              />
            </div>

            <div className="space-y-4">
              <p className="font-medium">Course Preview Video</p>
              {videoPreview ? (
                <div className="flex flex-col justify-center items-center">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-48 rounded-lg object-cover"
                  />
                  <div className="">
                    <Button
                      as="label"
                      htmlFor="video-upload"
                      variant="flat"
                      color="primary"
                      className="bg-white/20"
                    >
                      Change Video
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  as="label"
                  htmlFor="video-upload"
                  variant="flat"
                  color="primary"
                  className="w-full h-48"
                >
                  Select Preview Video
                </Button>
              )}
              <Input
                id="video-upload"
                type="file"
                accept="video/mp4"
                {...register("promotionalVideo", {
                  validate: (fileList) => {
                    const file = (fileList as unknown as FileList)?.[0];
                    if (!file) return true;
                    if (
                      !["video/mp4", "video/mov", "video/avi"].includes(
                        file.type
                      )
                    )
                      return "Invalid video format (Only MP4/MOV/AVI)";
                    if (file.size > 50 * 1024 * 1024)
                      return "Video size exceeds 50MB";
                    return true;
                  },
                })}
                className="hidden"
                onChange={handleVideoChange}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-4 bg-purple-900"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner />
            ) : isEditMode ? (
              "Edit Course"
            ) : (
              "Create Course"
            )}
          </Button>

        </form>
      </CardBody>
    </Card>
  );
}
