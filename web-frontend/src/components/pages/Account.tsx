import { Token } from "src/types/cognito";
import DashboardLayout from "../DashboardLayout";

type AccountProps = {
  token: Token | null;
};
export default function Account({ token }: AccountProps) {
  if (!token) {
    return <div>Not logged in.</div>;
  }
  return (
    <DashboardLayout activeTab="account">
      <div className="text-2xl font-bold">Account Settings</div>
    </DashboardLayout>
  );
}
