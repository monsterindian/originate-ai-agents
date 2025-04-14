
import { useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import OpenAIStatusIndicator from "../agents/OpenAIStatusIndicator";
import Logo from "@/components/branding/Logo";

const Topbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-14 border-b bg-background flex items-center px-4 md:px-6">
      <div className="mr-4 md:hidden">
        <Logo size="sm" />
      </div>
      <div className="flex-1 flex items-center relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder="Search applications, borrowers, loans..."
          className="pl-8 max-w-xs bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <OpenAIStatusIndicator />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-auto">
              <NotificationItem
                title="New Loan Application"
                description="Jane Smith submitted a new mortgage application"
                time="2 minutes ago"
              />
              <NotificationItem
                title="Application Approved"
                description="Processing agent approved John Doe's car loan"
                time="1 hour ago"
              />
              <NotificationItem
                title="Document Request"
                description="Underwriting agent requested additional documents"
                time="3 hours ago"
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-flex">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

type NotificationItemProps = {
  title: string;
  description: string;
  time: string;
};

const NotificationItem = ({ title, description, time }: NotificationItemProps) => {
  return (
    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-default">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
      <div className="text-xs text-muted-foreground mt-1">{time}</div>
    </DropdownMenuItem>
  );
};

export default Topbar;
