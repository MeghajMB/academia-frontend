import { GetAdminAnalyticsResponseDTO } from "@academia-dev/common";

export type AdminAnalyticsSummary = {
  transactionSummary: GetAdminAnalyticsResponseDTO["data"]["transaction"]["summary"];
  enrollmentSummary: GetAdminAnalyticsResponseDTO["data"]["enrollment"]["summary"];
  sessionSummary: GetAdminAnalyticsResponseDTO["data"]["session"]["summary"];
  reviewSummary: GetAdminAnalyticsResponseDTO["data"]["review"]["summary"];
};
