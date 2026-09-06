"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { RoleBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  appointOfficerAction,
  bulkUpdateMembershipStatusAction,
  changeMemberRoleAction,
  endOfficerTermAction,
  inviteMemberAction,
  updateMembershipStatusAction,
} from "@/features/clubs/actions";
import { clubRoles, officerRoles } from "@/lib/validation/clubs";

type Member = {
  id: string;
  user_id: string;
  role: string;
  status: string;
  school_year: string;
  profiles: { id: string; display_name: string } | null;
};

type Term = {
  id: string;
  membership_id: string;
  role: string;
  school_year: string;
  starts_on: string;
  ends_on: string | null;
  ended_reason: string | null;
};

type Candidate = { user_id: string; display_name: string };

export function MembersPanel({
  clubId,
  schoolYear,
  members,
  terms,
  candidates,
}: {
  clubId: string;
  schoolYear: string;
  members: Member[];
  terms: Term[];
  candidates: Candidate[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inviteUserId, setInviteUserId] = useState(candidates[0]?.user_id ?? "");
  const [inviteRole, setInviteRole] = useState<(typeof clubRoles)[number]>("member");
  const [selected, setSelected] = useState<string[]>([]);

  const termsByMembership = useMemo(() => {
    const map = new Map<string, Term[]>();
    for (const term of terms) {
      const list = map.get(term.membership_id) ?? [];
      list.push(term);
      map.set(term.membership_id, list);
    }
    return map;
  }, [terms]);

  function run(action: () => Promise<{ ok: boolean; error?: { message: string } }>) {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await action();
      if (!result.ok) {
        setError(result.error?.message ?? "Action failed");
        return;
      }
      setMessage("Updated");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-surface p-5 shadow-xs">
        <h2 className="font-semibold">Invite member</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite school peers by display name. Emails and other PII are not shown
          or exportable.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <label className="min-w-[14rem] flex-1 space-y-1 text-sm">
            <Label>School peer</Label>
            <select
              className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
              value={inviteUserId}
              onChange={(e) => setInviteUserId(e.target.value)}
            >
              <option value="">Select a person</option>
              {candidates.map((candidate) => (
                <option key={candidate.user_id} value={candidate.user_id}>
                  {candidate.display_name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <Label>Role</Label>
            <select
              className="min-h-11 rounded-md border border-border bg-surface px-3"
              value={inviteRole}
              onChange={(e) =>
                setInviteRole(e.target.value as (typeof clubRoles)[number])
              }
            >
              {clubRoles.map((role) => (
                <option key={role} value={role}>
                  {role.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <Button
              type="button"
              disabled={pending || !inviteUserId}
              onClick={() =>
                run(() =>
                  inviteMemberAction({
                    clubId,
                    userId: inviteUserId,
                    role: inviteRole,
                    schoolYear,
                  }),
                )
              }
            >
              Send invite
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Roster ({schoolYear})</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={pending || selected.length === 0}
              onClick={() =>
                run(() =>
                  bulkUpdateMembershipStatusAction({
                    clubId,
                    membershipIds: selected,
                    status: "active",
                  }),
                )
              }
            >
              Approve selected
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={pending || selected.length === 0}
              onClick={() =>
                run(() =>
                  bulkUpdateMembershipStatusAction({
                    clubId,
                    membershipIds: selected,
                    status: "exited",
                  }),
                )
              }
            >
              Remove selected
            </Button>
          </div>
        </div>

        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {members.map((member) => {
            const history = termsByMembership.get(member.id) ?? [];
            const checked = selected.includes(member.id);
            return (
              <li key={member.id} className="space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={checked}
                      onChange={(e) => {
                        setSelected((prev) =>
                          e.target.checked
                            ? [...prev, member.id]
                            : prev.filter((id) => id !== member.id),
                        );
                      }}
                      aria-label={`Select ${member.profiles?.display_name ?? "member"}`}
                    />
                    <div>
                      <p className="font-medium">
                        {member.profiles?.display_name ?? "Member"}
                      </p>
                      <p className="text-sm capitalize text-muted-foreground">
                        {member.status.replaceAll("_", " ")} · {member.role.replaceAll("_", " ")}
                      </p>
                    </div>
                  </div>
                  <RoleBadge
                    role={
                      (member.role as Parameters<typeof RoleBadge>[0]["role"]) ??
                      "member"
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {member.status === "invited" ? (
                    <Button
                      type="button"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        run(() =>
                          updateMembershipStatusAction({
                            clubId,
                            membershipId: member.id,
                            status: "active",
                          }),
                        )
                      }
                    >
                      Approve
                    </Button>
                  ) : null}
                  {member.status === "active" ? (
                    <>
                      <label className="flex items-center gap-2 text-sm">
                        <span className="sr-only">Change role</span>
                        <select
                          className="min-h-9 rounded-md border border-border bg-surface px-2"
                          defaultValue={member.role}
                          onChange={(e) =>
                            run(() =>
                              changeMemberRoleAction({
                                clubId,
                                membershipId: member.id,
                                role: e.target.value as (typeof clubRoles)[number],
                                schoolYear,
                              }),
                            )
                          }
                        >
                          {clubRoles.map((role) => (
                            <option key={role} value={role}>
                              {role.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                      </label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() =>
                          run(() =>
                            appointOfficerAction({
                              clubId,
                              membershipId: member.id,
                              role:
                                member.role === "member"
                                  ? "officer"
                                  : (member.role as (typeof officerRoles)[number]),
                              schoolYear,
                              startsOn: new Date().toISOString().slice(0, 10),
                            }),
                          )
                        }
                      >
                        Record officer term
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={pending}
                        onClick={() =>
                          run(() =>
                            updateMembershipStatusAction({
                              clubId,
                              membershipId: member.id,
                              status: "exited",
                            }),
                          )
                        }
                      >
                        Remove
                      </Button>
                    </>
                  ) : null}
                </div>

                {history.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Officer term history
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {history.map((term) => (
                        <li key={term.id} className="flex flex-wrap gap-2">
                          <span className="capitalize">
                            {term.role.replaceAll("_", " ")}
                          </span>
                          <span>
                            {term.starts_on}
                            {term.ends_on ? ` → ${term.ends_on}` : " → current"}
                          </span>
                          {!term.ends_on ? (
                            <button
                              type="button"
                              className="text-primary underline-offset-4 hover:underline"
                              onClick={() =>
                                run(() =>
                                  endOfficerTermAction({
                                    clubId,
                                    termId: term.id,
                                    endsOn: new Date().toISOString().slice(0, 10),
                                    endedReason: "Term ended by officer",
                                    demoteToMember: false,
                                  }),
                                )
                              }
                            >
                              End term
                            </button>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-success">{message}</p> : null}
    </div>
  );
}
