"use client";

import { useEffect } from "react";

export default function DashboardTitle({ userName }: { userName: string }) {
  useEffect(() => {
    if (userName) {
      document.title = `Hola, ${userName} | Dashboard`;
    }
  }, [userName]);

  return null;
}
