"use client";

import { useTranslations } from "next-intl";
import { AssignmentCard } from "./components/AssignmentCard";
import { useGetAssignments } from "@/lib/hooks/useAssignments";
import { Assignment } from "@/lib/types/assignment";

export default function Assignments() {
  const t = useTranslations("assignments");
  const { data: assignments, isLoading } = useGetAssignments();

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6 py-8 md:py-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("myAssignments")}</h1>
        </div>
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Loading assignments...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("myAssignments")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments?.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </section>
  );
}
