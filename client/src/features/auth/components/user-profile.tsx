import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import {
  User,
  Settings,
  LogOut,
  CreditCard,
  Bell,
  Shield,
  ChevronDown,
} from "lucide-react";
import type { ReactNode } from "react";
import { ModeToggle } from "@/components/theme/mode-toggle";

interface UserProfileProps {
  extraMenuItems?: ReactNode;
  className?: string;
}

export function UserProfile({
  extraMenuItems,
  className = "",
}: UserProfileProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const { data, isPending } = useSession();

  const user = data?.user;

  const navigate = useNavigate();

  // Handle loading state
  if (isPending) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="grid flex-1 gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/auth/login" });
    return null;
  }

  async function onSignOut() {
    await signOut();
    navigate({ to: "/auth/login" });
  }

  // TODO: Implement these functions to handle navigation or actions
  async function onProfileClick() {}
  async function onSettingsClick() {}
  async function onBillingClick() {}
  async function onNotificationsClick() {}
  async function onSecurityClick() {}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`relative h-10 w-auto justify-start px-2 ${className}`}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.image || "/placeholder.svg"}
                alt={user.name || "User"}
              />
              <AvatarFallback className="text-xs">
                {getInitials(user.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              {user.email && (
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {user.email}
                </span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onBillingClick}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onNotificationsClick}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSecurityClick}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Security</span>
          </DropdownMenuItem>
          {extraMenuItems}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ModeToggle />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
