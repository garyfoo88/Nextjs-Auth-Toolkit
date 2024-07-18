"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import React from "react";
import FormError from "../form-error";

type RoleGateProps = {
  children: React.ReactNode;
  allowedRoles: UserRole;
};

export default function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const role = useCurrentRole();

  if (role !== allowedRoles) {
    return (
      <FormError message="You do not have permission to view this content" />
    );
  }

  return <>{children}</>;
}
