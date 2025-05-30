"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Image,
  Tooltip,
  Input,
} from "@heroui/react";
import { Camera, Edit } from "lucide-react";
import ProfileImage from "@/public/images/blankUserProfile.jpeg";
import { CldUploadWidget } from "next-cloudinary";
import { useCallback, useEffect, useState } from "react";
import useUserApi from "@/hooks/api/useUserApi";

interface EditProfileProps {
  profilePicture: string | null;
  name: string;
  headline: string;
}
export default function EditProfile({
  profilePicture,
  name,
  headline,
}: EditProfileProps) {
  const [formData, setFormData] = useState<{
    imageurl: string | null;
    headLine: string;
    name: string;
  }>({ imageurl: null, headLine: "", name: "" });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { updateUserProfile } = useUserApi();
  useEffect(() => {
    setFormData({ imageurl: profilePicture, headLine: headline, name: name });
  }, []);
  const handleSaveProfile = useCallback(async (onClose: () => void) => {
    try {
      const response = await updateUserProfile(formData);
      if (response.status == "error") throw new Error(response.message);
      onClose();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Button
        color="primary"
        endContent={<Edit size={16} />}
        variant="flat"
        onPress={onOpen}
      >
        Edit Profile
      </Button>
      <Drawer
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2  rounded-medium",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                <Tooltip content="Close">
                  <Button
                    isIconOnly
                    className="text-default-400"
                    size="sm"
                    variant="light"
                    onPress={onClose}
                  >
                    <svg
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                    </svg>
                  </Button>
                </Tooltip>

                <div className="w-full flex justify-center gap-2">
                  <p>Edit Profile</p>
                </div>
              </DrawerHeader>
              <DrawerBody className="pt-16">
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  onSuccess={(result, { widget }) => {
                    if (
                      result.info &&
                      typeof result.info === "object" &&
                      "secure_url" in result.info
                    ) {
                      console.log(result.info.secure_url);
                      setFormData((prev) => {
                        return { ...prev, imageUrl: result.info.secure_url };
                      });
                      //sent a request to the backend to upload it to the database
                      widget.close();
                    }
                  }}
                >
                  {({ open }) => {
                    return (
                      <div
                        className="relative flex w-full justify-center items-center pt-4 cursor-pointer"
                        onClick={() => open()}
                      >
                        <Image
                          isBlurred
                          isZoomed
                          alt="Profile Picture"
                          className="aspect-square w-full hover:scale-110"
                          height={300}
                          src={
                            profilePicture ? profilePicture : ProfileImage.src
                          }
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full transition-colors">
                          <Camera />
                        </div>
                      </div>
                    );
                  }}
                </CldUploadWidget>

                <div className="flex flex-col gap-2 py-4">
                  <Input value={name} />
                  <Input value={headline} />
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  color="success"
                  onPress={() => handleSaveProfile(onClose)}
                >
                  Save
                </Button>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
