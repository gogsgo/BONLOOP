"use client";

import React, { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { DiscoverView } from "@/components/DiscoverView";
import { LaunchTokenView } from "@/components/LaunchTokenView";
import { PortfolioView } from "@/components/PortfolioView";
import { ActivityView } from "@/components/ActivityView";
import { RewardsView } from "@/components/RewardsView";
import { GuideView } from "@/components/GuideView";
import { TokenSwapModal } from "@/components/TokenSwapModal";
import { useRebateStore } from "@/store/useRebateStore";

export default function HomePage() {
  const { activeTab, fetchInitialState } = useRebateStore();

  useEffect(() => {
    fetchInitialState();
  }, [fetchInitialState]);

  return (
    <AppShell>
      {activeTab === "discover" && <DiscoverView />}
      {activeTab === "launch" && <LaunchTokenView />}
      {activeTab === "portfolio" && <PortfolioView />}
      {activeTab === "activity" && <ActivityView />}
      {activeTab === "rewards" && <RewardsView />}
      {activeTab === "guide" && <GuideView />}
      <TokenSwapModal />
    </AppShell>
  );
}
