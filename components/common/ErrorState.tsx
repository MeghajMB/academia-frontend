"use client";

import type React from "react";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export interface ErrorStateProps {
  /** The main error message to display */
  message?: string;
  /** Additional details about the error */
  details?: string;
  /** Function to call when retry button is clicked */
  onRetry?: () => void;
  /** Function to call when back button is clicked */
  onBack?: () => void;
  /** Whether to show a loading state during retry */
  isRetrying?: boolean;
  /** Whether to render as a full page error */
  fullPage?: boolean;
  /** Custom action button */
  actionButton?: React.ReactNode;
  /** Error code if available */
  errorCode?: string | number;
  /** Custom icon to override the default */
  icon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * A reusable component to display error states when data fetching fails
 */
export function ErrorState({
  message = "Failed to load data",
  details = "There was a problem loading the requested information. Please try again.",
  onRetry,
  onBack,
  isRetrying = false,
  fullPage = false,
  actionButton,
  errorCode,
  icon,
  className = "",
}: ErrorStateProps) {
  const errorIcon = icon || (
    <AlertTriangle size={fullPage ? 40 : 24} className="text-amber-500" />
  );

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center text-center ${
        fullPage ? "p-6" : "p-4"
      }`}
    >
      <div className={`${fullPage ? "mb-6" : "mb-4"}`}>
        <div
          className={`${
            fullPage ? "w-20 h-20" : "w-12 h-12"
          } bg-amber-500/10 rounded-full flex items-center justify-center`}
        >
          {errorIcon}
        </div>
        {errorCode && (
          <div className="mt-2">
            <span className="text-sm font-mono bg-gray-800 px-2 py-1 rounded text-gray-400">
              Error {errorCode}
            </span>
          </div>
        )}
      </div>

      <h3
        className={`${
          fullPage ? "text-2xl" : "text-lg"
        } font-semibold text-white mb-2`}
      >
        {message}
      </h3>
      <p className="text-gray-400 mb-6 max-w-md">{details}</p>

      <div className="flex flex-wrap gap-3 justify-center">
        {onRetry && (
          <Button
            color="secondary"
            variant="shadow"
            isLoading={isRetrying}
            startContent={!isRetrying && <RefreshCw size={16} />}
            onClick={onRetry}
            spinner={<Spinner color="white" size="sm" />}
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </Button>
        )}

        {onBack && (
          <Button
            variant="bordered"
            color="secondary"
            startContent={<ArrowLeft size={16} />}
            onClick={onBack}
            isDisabled={isRetrying}
          >
            Go Back
          </Button>
        )}

        {actionButton}
      </div>
    </motion.div>
  );

  if (fullPage) {
    return (
      <div
        className={`min-h-[400px] flex items-center justify-center bg-gray-950 ${className}`}
      >
        {content}
      </div>
    );
  }

  return (
    <Card className={`bg-gray-900/50 border-amber-500/20 border ${className}`}>
      <CardBody>{content}</CardBody>
      {/* {(errorCode || details) && (
        <CardFooter className="flex justify-center border-t border-gray-800 pt-3 pb-4">
          <Button
            variant="light"
            color="secondary"
            size="sm"
            as="a"
            href="/help"
            startContent={<HelpCircle size={14} />}
          >
            Get Help
          </Button>
        </CardFooter>
      )} */}
    </Card>
  );
}
