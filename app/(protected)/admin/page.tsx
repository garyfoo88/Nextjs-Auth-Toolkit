"use client";

import { admin } from "@/actions/admin";
import RoleGate from "@/components/auth/role-gate";
import FormSuccess from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

export default function AdminPage() {
  const onServerActionClick = async () => {
    const res = await admin();
    if (res.error) {
      toast.error(res.error);
    }

    if (res.success) {
      toast.success(res.success);
    }
  };

  const onApiRouteClick = async () => {
    const res = await fetch("/api/admin");
    if (res.ok) {
      toast.success("Admin API Route success");
    } else {
      toast.error("Admin API Route failed");
    }
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRoles={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <button onClick={onApiRouteClick}>Click to test</button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <button onClick={onServerActionClick}>Click to test</button>
        </div>
      </CardContent>
    </Card>
  );
}
