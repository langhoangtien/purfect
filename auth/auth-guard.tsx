"use client";
import { ReactNode, useState, useEffect, useCallback } from "react";

import { UKOSplashScreen } from "@/components/splash-screen";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth/use-auth";

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { loading } = useAuthContext();

  return (
    <>{loading ? <UKOSplashScreen /> : <Container>{children}</Container>}</>
  );
}

// ----------------------------------------------------------------------

type ContainerProps = {
  children: ReactNode;
};

function Container({ children }: ContainerProps) {
  const router = useRouter();
  const { authenticated } = useAuthContext();
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = "/login";

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, router]);

  useEffect(() => {
    check();
  }, [check]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
