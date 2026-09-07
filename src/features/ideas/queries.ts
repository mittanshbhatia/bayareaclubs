import "server-only";

import { postgrestIlikeOr } from "@/lib/supabase/postgrest-filter";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.generated";
import {
  presentSchoolOptions,
  type PersistedSchoolOption,
} from "@/features/ideas/school-options";

export type { PersistedSchoolOption };
export { presentSchoolOptions };

export type ClubIdeaStatus = Database["public"]["Enums"]["club_idea_status"];

export type IdeaListItem = {
  id: string;
  application_kind: "new_idea" | "existing_club";
  title: string;
  category: string;
  status: ClubIdeaStatus;
  school_id: string;
  submitter_id: string;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  draft_step: number;
  schools: { name: string } | null;
};

export async function listMyIdeas(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_ideas")
    .select(
      "id, application_kind, title, category, status, school_id, submitter_id, submitted_at, created_at, updated_at, draft_step, schools(name)",
    )
    .eq("submitter_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as IdeaListItem[];
}

export async function listReviewQueue(filters: {
  schoolId?: string;
  status?: ClubIdeaStatus | "all";
  category?: string;
  search?: string;
  reviewerId?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("club_ideas")
    .select(
      `
      id, title, category, status, school_id, submitter_id, submitted_at, created_at, updated_at, draft_step,
      schools(name),
      profiles!club_ideas_submitter_id_fkey(display_name),
      club_idea_reviews(id, reviewer_id, assigned_at, reviewed_at, decision)
    `,
    )
    .in("status", [
      "submitted",
      "under_review",
      "changes_requested",
      "resubmitted",
      "approved",
      "rejected",
      "converted_to_club",
    ])
    .order("submitted_at", { ascending: true, nullsFirst: false });

  if (filters.schoolId) query = query.eq("school_id", filters.schoolId);
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.search) {
    const orFilter = postgrestIlikeOr(["title", "category"], filters.search);
    if (orFilter) query = query.or(orFilter);
  }

  const { data, error } = await query;
  if (error) throw error;

  let rows = data ?? [];
  if (filters.reviewerId) {
    rows = rows.filter((row) =>
      (row.club_idea_reviews ?? []).some(
        (review) =>
          review.reviewer_id === filters.reviewerId && !review.reviewed_at,
      ),
    );
  }
  return rows;
}

export async function getIdeaDetail(ideaId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_ideas")
    .select(
      `
      *,
      schools(id, name),
      profiles!club_ideas_submitter_id_fkey(id, display_name),
      club_idea_proposed_officers(*),
      club_idea_links(*),
      club_idea_status_history(*),
      club_idea_reviews(*),
      club_idea_versions(*)
    `,
    )
    .eq("id", ideaId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getApplicantFeedback(ideaId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_idea_applicant_feedback")
    .select("*")
    .eq("idea_id", ideaId)
    .order("reviewed_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listUserSchools(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_school_memberships")
    .select("school_id, role, schools(id, name)")
    .eq("user_id", userId)
    .eq("status", "active");
  if (error) throw error;
  return data ?? [];
}

/** Active schools persisted in the directory — never a client-side hardcoded list. */
export async function listActiveSchools(): Promise<PersistedSchoolOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schools")
    .select("id, name, city")
    .eq("is_active", true)
    .order("name");
  if (error) throw error;
  return presentSchoolOptions(data ?? []);
}

export async function listCommitteeReviewers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("platform_role_assignments")
    .select(
      "user_id, role, profiles!platform_role_assignments_user_id_fkey(id, display_name)",
    )
    .in("role", ["committee_reviewer", "platform_admin"])
    .is("revoked_at", null);
  if (error) throw error;
  const seen = new Set<string>();
  return (data ?? []).filter((row) => {
    if (seen.has(row.user_id)) return false;
    seen.add(row.user_id);
    return true;
  });
}

export function ideaCompletionPercent(idea: {
  title: string;
  category: string;
  description: string;
  mission: string;
  problem_opportunity: string;
  expected_activities: string[];
  expected_membership: number | null;
  proposed_meeting_cadence: string;
  grade_min: number | null;
  grade_max: number | null;
  school_id: string | null;
  officersCount: number;
}): number {
  const checks = [
    idea.title.trim().length > 1,
    idea.category.trim().length > 0,
    idea.description.trim().length >= 20,
    Boolean(idea.school_id),
    idea.mission.trim().length >= 20,
    idea.problem_opportunity.trim().length >= 20,
    idea.expected_activities.length > 0,
    idea.expected_membership != null,
    idea.grade_min != null && idea.grade_max != null,
    idea.officersCount > 0,
    idea.proposed_meeting_cadence.trim().length >= 3,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

export function reviewAgeHours(submittedAt: string | null) {
  if (!submittedAt) return null;
  const ms = Date.now() - new Date(submittedAt).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60)));
}
