"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import useAuthApi from "@/hooks/api/useAuthApi";
import useUserApi from "@/hooks/api/useUserApi";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";

interface InstructorForm {
  headline: string;
  biography: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  website: string;
  agreement: boolean;
}

interface FormErrors {
  headline?: string;
  biography?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  general?: string;
}

const InstructorRegister = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<InstructorForm>({
    headline: "",
    biography: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    website: "",
    agreement: false,
  });
  const [rejectReason, setRejectReason] = useState();

  const [isClient, setIsClient] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  const { registerInstructor } = useAuthApi();
  const { fetchUserProfileApi } = useUserApi();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    async function getProfile() {
      const userData = await fetchUserProfileApi(user.id!);
      setRejectReason(userData.rejectedReason || "");
      setFormData({
        headline: userData.headline,
        biography: userData.biography,
        facebook: userData.links.facebook,
        linkedin: userData.links.linkedin,
        twitter: userData.links.twitter,
        website: userData.links.website,
        agreement: true,
      });

      setIsClient(true);
    }
    if (user.verified == "pending") {
      router.push("/home");
      return;
    } else if (user.verified == "rejected") {
      getProfile();
    } else {
      setIsClient(true);
    }
  }, []);

  if (!isClient) {
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Headline validation
    if (!formData.headline.trim()) {
      newErrors.headline = "Professional headline is required";
    } else if (formData.headline.length < 5) {
      newErrors.headline = "Headline must be at least 5 characters long";
    }

    // Biography validation
    if (!formData.biography.trim()) {
      newErrors.biography = "Professional biography is required";
    } else if (formData.biography.length < 100) {
      newErrors.biography = "Biography must be at least 100 characters long";
    }

    // URL validations
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    if (!urlRegex.test(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }
    if (!urlRegex.test(formData.facebook)) {
      newErrors.facebook = "Please enter a valid Facebook URL";
    }
    if (!urlRegex.test(formData.linkedin)) {
      newErrors.linkedin = "Please enter a valid LinkedIn URL";
    }
    if (!urlRegex.test(formData.twitter)) {
      newErrors.twitter = "Please enter a valid Twitter URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await registerInstructor(formData);
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      setErrors({
        general:
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <main className="pt-24 px-4">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reason for rejecting instructor request
              </ModalHeader>
              <ModalBody>
                <Textarea
                  name="rejectReason"
                  label="Reason"
                  variant="bordered"
                  value={rejectReason}
                  disabled
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8 bg-gray-900 p-8 rounded-xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Become an Instructor</h1>
          <p className="mt-2 text-gray-400">
            Complete your profile to start teaching on Academia
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>{errors.general}</p>
          </div>
        )}

        {rejectReason && (
          <button className="bg-red-600 p-1 rounded-lg" onClick={onOpen}>
            Click to view Rejected Reason
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Headline */}
          <div>
            <label
              htmlFor="headline"
              className="block text-sm font-medium mb-2"
            >
              Professional Headline*
            </label>
            <input
              id="headline"
              name="headline"
              type="text"
              required
              placeholder="e.g., Senior Web Developer | JavaScript Expert"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.headline ? "border-red-500" : "border-gray-700"
              }`}
              value={formData.headline}
              onChange={handleInputChange}
            />
            {errors.headline && (
              <p className="mt-1 text-sm text-red-500">{errors.headline}</p>
            )}
          </div>

          {/* Biography */}
          <div>
            <label
              htmlFor="biography"
              className="block text-sm font-medium mb-2"
            >
              Professional Biography*
            </label>
            <textarea
              id="biography"
              name="biography"
              required
              rows={6}
              placeholder="Tell us about your experience and expertise..."
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.biography ? "border-red-500" : "border-gray-700"
              }`}
              value={formData.biography}
              onChange={handleInputChange}
            />
            {errors.biography && (
              <p className="mt-1 text-sm text-red-500">{errors.biography}</p>
            )}
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Media Links</h3>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium mb-2"
              >
                Website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourwebsite.com"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  errors.website ? "border-red-500" : "border-gray-700"
                }`}
                value={formData.website}
                onChange={handleInputChange}
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-500">{errors.website}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="facebook"
                className="block text-sm font-medium mb-2"
              >
                Facebook Profile
              </label>
              <input
                id="facebook"
                name="facebook"
                type="url"
                placeholder="https://facebook.com/yourprofile"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  errors.facebook ? "border-red-500" : "border-gray-700"
                }`}
                value={formData.facebook}
                onChange={handleInputChange}
              />
              {errors.facebook && (
                <p className="mt-1 text-sm text-red-500">{errors.facebook}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="linkedin"
                className="block text-sm font-medium mb-2"
              >
                LinkedIn Profile
              </label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  errors.linkedin ? "border-red-500" : "border-gray-700"
                }`}
                value={formData.linkedin}
                onChange={handleInputChange}
              />
              {errors.linkedin && (
                <p className="mt-1 text-sm text-red-500">{errors.linkedin}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="twitter"
                className="block text-sm font-medium mb-2"
              >
                X (Twitter) Profile
              </label>
              <input
                id="twitter"
                name="twitter"
                type="url"
                placeholder="https://twitter.com/yourhandle"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  errors.twitter ? "border-red-500" : "border-gray-700"
                }`}
                value={formData.twitter}
                onChange={handleInputChange}
              />
              {errors.twitter && (
                <p className="mt-1 text-sm text-red-500">{errors.twitter}</p>
              )}
            </div>
          </div>

          {/* Agreement */}
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h4 className="font-medium mb-4">Instructor Agreement</h4>
              <div className="text-sm text-gray-400 space-y-2">
                <p>By becoming an instructor, you agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Create and maintain high-quality course content</li>
                  <li>Respond to student questions within 48 hours</li>
                  <li>Maintain accurate and up-to-date course materials</li>
                  <li>
                    Comply with Academia&apos;s content quality guidelines
                  </li>
                  <li>Accept Academia&apos;s revenue sharing model</li>
                  <li>Protect student data and maintain confidentiality</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agreement"
                name="agreement"
                required
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-600"
                checked={formData.agreement}
                onChange={(e) =>
                  setFormData({ ...formData, agreement: e.target.checked })
                }
              />
              <label htmlFor="agreement" className="text-sm">
                I agree to Academia&apos;s instructor terms and policies
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.agreement}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Verification"
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
};

export default InstructorRegister;
