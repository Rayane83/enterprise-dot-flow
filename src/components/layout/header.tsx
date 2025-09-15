import { RoleBadge } from "@/components/ui/status-badge";
import { User } from "@/types/dot";

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">
              Panel DOT
            </h1>
            <div className="text-sm text-muted-foreground">
              Multi-entreprise
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="font-medium text-foreground">
                {user.username}
              </div>
              <div className="text-sm text-muted-foreground">
                Enterprise #{user.enterprise_id.slice(-6)}
              </div>
            </div>
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>
    </header>
  );
}