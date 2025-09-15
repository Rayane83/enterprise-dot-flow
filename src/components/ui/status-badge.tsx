import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/dot";

interface StatusBadgeProps {
  variant: 'role' | 'version' | 'status';
  value: string;
  className?: string;
}

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function StatusBadge({ variant, value, className }: StatusBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'role':
        return getRoleStyles(value as UserRole);
      case 'version':
        return "bg-accent text-accent-foreground border-accent/50";
      case 'status':
        return "bg-success text-success-foreground border-success/50";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(getVariantStyles(), className)}
    >
      {value}
    </Badge>
  );
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return <StatusBadge variant="role" value={role} className={className} />;
}

function getRoleStyles(role: UserRole): string {
  switch (role) {
    case 'SUPERSTAFF':
      return "bg-accent text-accent-foreground border-accent font-semibold";
    case 'PATRON':
      return "bg-primary text-primary-foreground border-primary";
    case 'CO-PATRON':
      return "bg-primary/80 text-primary-foreground border-primary/80";
    case 'STAFF':
      return "bg-secondary text-secondary-foreground border-secondary";
    case 'DOT':
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}