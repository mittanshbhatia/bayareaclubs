import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type AvatarStackItem = {
  id: string;
  name: string;
  src?: string;
};

type AvatarStackProps = {
  people: AvatarStackItem[];
  max?: number;
  className?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AvatarStack({ people, max = 4, className }: AvatarStackProps) {
  const visible = people.slice(0, max);
  const overflow = Math.max(0, people.length - max);

  return (
    <div
      data-slot="avatar-stack"
      className={cn("flex items-center -space-x-2", className)}
      role="list"
      aria-label={`${people.length} people`}
    >
      {visible.map((person) => (
        <Avatar
          key={person.id}
          role="listitem"
          className="size-9 border-2 border-surface ring-0"
          title={person.name}
        >
          {person.src ? <AvatarImage src={person.src} alt="" /> : null}
          <AvatarFallback className="bg-primary-muted text-xs font-semibold text-primary">
            {initials(person.name)}
          </AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 ? (
        <span
          role="listitem"
          className="flex size-9 items-center justify-center rounded-full border-2 border-surface bg-surface-muted text-xs font-semibold text-muted-foreground"
          aria-label={`${overflow} more`}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}
