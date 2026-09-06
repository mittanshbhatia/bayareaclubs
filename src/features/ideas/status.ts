import type { ClubIdeaStatus } from "@/features/ideas/queries";
import type { StatusKey } from "@/components/ds/badges";

export function ideaStatusToBadge(status: ClubIdeaStatus | string): StatusKey {
  switch (status) {
    case "draft":
      return "draft";
    case "approved":
    case "converted_to_club":
      return "approved";
    case "rejected":
      return "rejected";
    case "changes_requested":
      return "pending";
    case "submitted":
    case "resubmitted":
    case "under_review":
      return "active";
    default:
      return "draft";
  }
}

export function formatIdeaStatus(status: string) {
  return status.replaceAll("_", " ");
}
