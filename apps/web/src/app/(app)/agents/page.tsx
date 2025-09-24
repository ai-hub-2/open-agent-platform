"use client";

import AgentsInterface from "@/features/agents";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * The /agents page.
 * Contains the list of all agents the user has access to.
 */
export default function AgentsPage(): React.ReactNode {
  return (
    <React.Suspense fallback={<div>Loading (layout)...</div>}>
      <Toaster />
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Agents</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {/* Render interface only when deployments are configured to avoid build-time errors */}
      {process.env.NEXT_PUBLIC_DEPLOYMENTS ? (
        <AgentsInterface />
      ) : (
        <div className="px-4 py-8 text-sm text-muted-foreground">
          No deployments configured. Set NEXT_PUBLIC_DEPLOYMENTS to enable agents.
        </div>
      )}
    </React.Suspense>
  );
}
