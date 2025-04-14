import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  FileText, 
  Settings, 
  Menu, 
  ChevronLeft,
  Bot,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AgentStatusIndicator from "../agents/AgentStatusIndicator";
import Logo from "@/components/branding/Logo";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 h-14">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground ml-auto"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      <Separator className="bg-sidebar-border" />

      <div className="mt-4 px-3">
        <div className="space-y-1">
          <NavItem to="/" icon={<Home size={20} />} label="Dashboard" collapsed={collapsed} />
          <NavItem to="/applications" icon={<FileText size={20} />} label="Applications" collapsed={collapsed} />
          <NavItem to="/borrowers" icon={<Users size={20} />} label="Borrowers" collapsed={collapsed} />
        </div>
      </div>

      <Separator className="bg-sidebar-border my-4" />

      <div className="px-3">
        <p className={cn("text-xs uppercase font-semibold text-sidebar-foreground/70 mb-2", 
          collapsed && "text-center"
        )}>
          {collapsed ? "AI" : "AI Agents"}
        </p>
        <div className="space-y-1">
          <NavItem 
            to="/agents/intake" 
            icon={<Bot size={20} />} 
            label="Intake Agent" 
            collapsed={collapsed}
            extra={<AgentStatusIndicator active />}
          />
          <NavItem 
            to="/agents/processing" 
            icon={<Bot size={20} />} 
            label="Processing Agent" 
            collapsed={collapsed}
            extra={<AgentStatusIndicator active />}
          />
          <NavItem 
            to="/agents/underwriting" 
            icon={<Bot size={20} />} 
            label="Underwriting Agent" 
            collapsed={collapsed}
            extra={<AgentStatusIndicator active />}
          />
          <NavItem 
            to="/agents/decision" 
            icon={<Bot size={20} />} 
            label="Decision Agent" 
            collapsed={collapsed}
            extra={<AgentStatusIndicator active />}
          />
        </div>
      </div>

      <div className="mt-auto px-3 mb-4">
        <NavItem to="/integration" icon={<Database size={20} />} label="Integrations" collapsed={collapsed} />
        <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" collapsed={collapsed} />
      </div>
    </aside>
  );
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  extra?: React.ReactNode;
};

const NavItem = ({ to, icon, label, collapsed, extra }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        collapsed && "justify-center"
      )}
    >
      {icon}
      {!collapsed && (
        <span className="flex-1 truncate">{label}</span>
      )}
      {!collapsed && extra && (
        <span>{extra}</span>
      )}
    </NavLink>
  );
};

export default Sidebar;
