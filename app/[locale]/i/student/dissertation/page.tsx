"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { DissertationTopic } from "@/components/dissertation/DissertationTopic";
import { DissertationPlan } from "@/components/dissertation/DissertationPlan";
import { DissertationFlow } from "@/components/dissertation/DissertationFlow";
import { DissertationDefense } from "@/components/dissertation/DissertationDefense";

export default function DissertationPage() {
  const t = useTranslations("dissertation");

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">{t("dissertation")}</h1>
      <Card>
        <CardBody>
          <Tabs aria-label="Dissertation Workflow">
            <Tab key="topic" title={t("topicApproval")}>
              <DissertationTopic />
            </Tab>
            <Tab key="plan" title={t("plan")}>
              <DissertationPlan />
            </Tab>
            <Tab key="flow" title={t("documentFlow")}>
              <DissertationFlow />
            </Tab>
            <Tab key="defense" title={t("defenseBooking")}>
              <DissertationDefense />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </section>
  );
}
