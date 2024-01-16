import { LayoutDashboard, UserCog } from "lucide-react";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type AppLayout = {
  rawToken: string;
  activeTab: "dashboard" | "account";
  children: ReactNode;
};
export default function AppLayout({
  rawToken,
  activeTab,
  children,
}: AppLayout) {
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
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex w-fit flex-col bg-primary px-4 py-8 text-primary-foreground">
        <a className="hidden pb-2 text-3xl font-bold sm:block" href="/">
          LetMeInUBC
        </a>
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={`${tab.href}#id_token=${rawToken}`}
            className={`flex flex-row gap-2 py-2 hover:underline ${tab.id === activeTab ? "font-semibold" : "text-muted-foreground"}`}
          >
            <div>{tab.icon}</div>
            <div className="hidden sm:block">{tab.name}</div>
          </NavLink>
        ))}
      </div>
      <div className="flex w-full flex-col justify-between overflow-auto p-8 pb-0">
        <div>{children}</div>
        <div className="py-2 text-center text-sm text-muted-foreground">
          LetMeInUBC © {new Date().getFullYear()}. LetMeInUBC is no way
          affiliated with the University of British Columbia.
        </div>
      </div>
    </div>
  );
}
