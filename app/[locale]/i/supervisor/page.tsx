"use client";

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";
import { StudentsList } from "./components/StudentsList";
import { AssignmentManagement } from "./components/AssignmentManagement";

export default function SupervisorDashboard() {
  const t = useTranslations("supervisor");

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
      </div>

      <Card>
        <CardBody>
          <Tabs aria-label="Supervisor Dashboard">
            <Tab key="students" title={t("studentsTab")}>
              <StudentsList />
            </Tab>
            <Tab key="assignments" title={t("assignmentsTab")}>
              <AssignmentManagement />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </section>
  );
}
