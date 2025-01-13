"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { customAxios } from "@/lib/axios";

interface InstructorForm {
  headline: string;
  biography: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  website:string
  agreement: boolean;
}

const InstructorRegister = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InstructorForm>({
    headline: "",
    biography: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    website:"",
    agreement: false,
  });
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await customAxios.post(
        "/api/instructor/verify",
        formData
      );

      if (response.status === 200) {
        console.log("Success");
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 px-4">
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
              type="text"
              required
              placeholder="e.g., Senior Web Developer | JavaScript Expert"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={formData.headline}
              onChange={(e) =>
                setFormData({ ...formData, headline: e.target.value })
              }
            />
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
              required
              rows={6}
              placeholder="Tell us about your experience and expertise..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={formData.biography}
              onChange={(e) =>
                setFormData({ ...formData, biography: e.target.value })
              }
            />
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Media Links</h3>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium mb-2"
              >
                Website (optional)
              </label>
              <input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium mb-2"
              >
                Facebook Profile
              </label>
              <input
                id="website"
                type="url"
                placeholder="https://facebook.com/yourprofile"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.facebook}
                onChange={(e) =>
                  setFormData({ ...formData, facebook: e.target.value })
                }
              />
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
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
              />
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
                type="url"
                placeholder="https://twitter.com/yourhandle"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.twitter}
                onChange={(e) =>
                  setFormData({ ...formData, twitter: e.target.value })
                }
              />
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
