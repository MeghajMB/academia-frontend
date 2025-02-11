"use client";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Textarea,
  Select,
  SelectItem,
  Image,
  Card,
  CardBody,
  Spinner,
} from "@nextui-org/react";
import useCategoryApi from "@/hooks/useCategoryApi";
import useFilesApi from "@/hooks/useFilesApi";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import useInstructorApi from "@/hooks/useInstructorApi";

interface FormErrors {
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
  price?: string;
  image?: string;
  video?: string;
  common?: string;
}

interface ICategory {
  createdAt: string;
  description: string;
  id: string;
  isBlocked: boolean;
  name: string;
  updatedAt: string;
}

export default function CourseCreation() {
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { fetchCategoriesApi } = useCategoryApi();
  const { generatePutSignedUrlApi } = useFilesApi();
  const { createCourseLandingPage } = useInstructorApi();

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
    getCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [imagePreview, videoPreview]);

  if (!isClient) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!imageFile || !videoFile) {
      setErrors({ common: "Both image and video files are required" });
      return;
    }
    if (
      imageFile.type !== "image/jpeg" &&
      imageFile.type !== "image/jpg" &&
      imageFile.type !== "image/png"
    ) {
      setErrors({
        common: "Only JPG, JPEG, and PNG image formats are allowed",
      });
      return;
    }
    if (videoFile.type !== "video/mp4" && videoFile.type !== "video/webm") {
      setErrors({ common: "Only MP4 and WebM video formats are allowed" });
      return;
    }

    if (videoFile.size > 50000000 || videoFile.size < 10000000) {
      setErrors({ common: "Video Must be between 10 and 50 mb" });
      return;
    }

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const thumbnailKey = `thumbnails/${Date.now()}_${uuidv4()}_${
      imageFile.name
    }`;
    const videoKey = `previewVideos/${Date.now()}_${uuidv4()}_${videoFile.name}`;
    const thumbnailContentType = imageFile.type;
    const videoContentType = videoFile.type;
    try {
      setIsLoading(true);
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
        ...formData,
        description: sanitizedDescription,
        image: {
          key: thumbnailKey,
          size: imageFile.size,
          type: imageFile.type,
          name: imageFile.name,
        },
        video: {
          key: videoKey,
          size: videoFile.size,
          type: videoFile.type,
          name: videoFile.name,
        },
      };

      const response = await createCourseLandingPage(payload);
      router.push(`/instructor/courses/create/${response.id}`); // Navigate to courses page after success
    } catch (error) {
      let commonError;
      if (error instanceof AxiosError) {
        commonError = error.response?.data?.errors[0].message;
      }
      setErrors({
        common: commonError
          ? commonError
          : "An error occurred while creating the course.",
      });
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
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="p-6 bg-gray-950">
        {errors.common && <p className="text-red-400">{errors.common}</p>}
        <CardBody>
          <Form
            validationBehavior="native"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                isRequired
                errorMessage={errors.title || null}
                label="Course Title"
                labelPlacement="outside"
                name="title"
                placeholder="Enter the Title"
                type="text"
                variant="bordered"
                classNames={{
                  label: "font-medium",
                }}
                validate={(value) => {
                  if (value.length < 5)
                    return "Title must be at least 5 characters long";
                }}
              />

              <Input
                isRequired
                errorMessage={errors.subtitle || null}
                label="Course Subtitle"
                labelPlacement="outside"
                name="subtitle"
                placeholder="Enter the Subtitle"
                type="text"
                variant="bordered"
                classNames={{
                  label: "font-medium",
                }}
                validate={(value) => {
                  if (value.length < 5)
                    return "Subtitle must be at least 5 characters long";
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select a Category"
                labelPlacement="outside"
                isRequired
                name="category"
                variant="bordered"
                classNames={{
                  label: "font-medium",
                }}
              >
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Price"
                isRequired
                labelPlacement="outside"
                name="price"
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
                validate={(value) => {
                  if (parseFloat(value) < 0) return "Enter a valid Price";
                }}
              />
            </div>

            <Textarea
              isRequired
              label="Description"
              placeholder="Enter your description"
              labelPlacement="outside"
              name="description"
              variant="bordered"
              minRows={4}
              classNames={{
                label: "font-medium",
              }}
              validate={(value) => {
                if (value.length < 50)
                  return "Description must be at least 50 characters long";
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
                <Input
                  id="image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
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
                  name="video"
                  accept="video/*"
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
              {isLoading ? <Spinner /> : "Create Course"}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
