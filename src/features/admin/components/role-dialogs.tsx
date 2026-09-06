"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignPlatformRoleAction,
  revokePlatformRoleAction,
} from "@/features/admin/actions";

export function AssignRoleDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"platform_admin" | "committee_reviewer">(
    "committee_reviewer",
  );
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setError(null);
        setConfirmed(false);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button">Assign role</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign platform role</DialogTitle>
          <DialogDescription>
            Role changes are audited. Confirm carefully before assigning
            platform administrator access.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="assign-user-id">User ID</Label>
            <Input
              id="assign-user-id"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="UUID of the profile"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assign-role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as "platform_admin" | "committee_reviewer")
              }
            >
              <SelectTrigger id="assign-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="committee_reviewer">
                  Committee reviewer
                </SelectItem>
                <SelectItem value="platform_admin">
                  Platform administrator
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            <span>
              I confirm this role assignment and understand it will be recorded
              in the audit log.
            </span>
          </label>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={pending || !confirmed || !userId}
            onClick={() => {
              startTransition(async () => {
                const result = await assignPlatformRoleAction({
                  userId,
                  role,
                  confirm: true,
                });
                if (!result.ok) {
                  setError(result.error.message);
                  return;
                }
                setOpen(false);
                router.refresh();
              });
            }}
          >
            {pending ? "Assigning…" : "Confirm assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RevokeRoleDialog({
  assignmentId,
  displayName,
  role,
  disabled,
}: {
  assignmentId: string;
  displayName: string;
  role: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setError(null);
        setConfirmed(false);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" disabled={disabled}>
          Revoke
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke role</DialogTitle>
          <DialogDescription>
            Remove {role.replaceAll("_", " ")} from {displayName}. The final
            platform administrator cannot be removed.
          </DialogDescription>
        </DialogHeader>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          <span>
            I confirm this revocation and understand it will be audited.
          </span>
        </label>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={pending || !confirmed}
            onClick={() => {
              startTransition(async () => {
                const result = await revokePlatformRoleAction({
                  assignmentId,
                  confirm: true,
                });
                if (!result.ok) {
                  setError(result.error.message);
                  return;
                }
                setOpen(false);
                router.refresh();
              });
            }}
          >
            {pending ? "Revoking…" : "Confirm revoke"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
