import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusMap = {
  active: { label: "Active", variant: "success" as const },
  pending: { label: "Pending", variant: "warning" as const },
  draft: { label: "Draft", variant: "secondary" as const },
  archived: { label: "Archived", variant: "outline" as const },
  rejected: { label: "Rejected", variant: "danger" as const },
  approved: { label: "Approved", variant: "success" as const },
} as const;

export type StatusKey = keyof typeof statusMap;

type StatusBadgeProps = {
  status: StatusKey;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status];
  return (
    <Badge
      data-slot="status-badge"
      variant={config.variant}
      className={cn(className)}
    >
      {config.label}
    </Badge>
  );
}

const roleMap = {
  platform_admin: "Platform admin",
  committee_reviewer: "Committee reviewer",
  school_admin: "School admin",
  school_advisor: "School advisor",
  club_admin: "Club admin",
  president: "President",
  vice_president: "Vice president",
  secretary: "Secretary",
  treasurer: "Treasurer",
  officer: "Officer",
  advisor: "Advisor",
  member: "Member",
  user: "User",
} as const;

export type RoleKey = keyof typeof roleMap;

type RoleBadgeProps = {
  role: RoleKey;
  className?: string;
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      data-slot="role-badge"
      variant="accent"
      className={cn("font-medium", className)}
    >
      {roleMap[role]}
    </Badge>
  );
}
