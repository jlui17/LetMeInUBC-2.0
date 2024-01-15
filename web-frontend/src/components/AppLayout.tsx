import { LayoutDashboard, UserCog } from "lucide-react";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type DashboardLayoutProps = {
  rawToken: string;
  activeTab: "dashboard" | "account";
  children: ReactNode;
};
export default function DashboardLayout({
  rawToken,
  activeTab,
  children,
}: DashboardLayoutProps) {
  const tabs = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard />,
      href: "/dashboard",
    },
    {
      id: "account",
      name: "Account",
      icon: <UserCog />,
      href: "/account",
    },
  ];

  return (
    <div className="flex flex-row">
      <div className="flex h-screen w-64 flex-col bg-primary px-4 py-8 text-primary-foreground">
        <div className="pb-2 text-3xl font-bold">LetMeInUBC</div>
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={`${tab.href}#id_token=${rawToken}`}
            className={`flex flex-row gap-2 py-2 hover:underline ${tab.id === activeTab ? "font-semibold" : "text-muted-foreground"}`}
          >
            {tab.icon} {tab.name}
          </NavLink>
        ))}
      </div>
      <div className="flex flex-grow flex-col p-8">{children}</div>
    </div>
  );
}
