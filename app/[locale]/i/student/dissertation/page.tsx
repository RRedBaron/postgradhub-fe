"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { DissertationTopic } from "@/components/dissertation/DissertationTopic";

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
              <p>{t("plan")}</p>
            </Tab>
            <Tab key="publications" title={t("publications")}>
              <p>{t("publications")}</p>
            </Tab>
            <Tab key="flow" title={t("documentFlow")}>
              <p>{t("documentFlow")}</p>
            </Tab>
            <Tab key="calendar" title={t("calendar")}>
              <p>{t("calendar")}</p>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </section>
  );
}
