"use client";

import { useTranslations } from "next-intl";
import { AssignmentCard } from "./components/AssignmentCard";

type Assignment = {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  description: string;
};

// Mock data for assignments
const assignments: Assignment[] = [
  {
    id: 1,
    title: "Research Paper on Machine Learning",
    subject: "Artificial Intelligence",
    dueDate: "2024-04-15",
    status: "pending",
    description:
      "Write a comprehensive research paper on recent advances in machine learning algorithms.",
  },
  {
    id: 2,
    title: "Database Design Project",
    subject: "Database Systems",
    dueDate: "2024-04-20",
    status: "submitted",
    description:
      "Design and implement a database system for a university library.",
  },
  {
    id: 3,
    title: "Web Development Assignment",
    subject: "Web Technologies",
    dueDate: "2024-04-25",
    status: "graded",
    description: "Create a responsive web application using modern frameworks.",
  },
];

export default function Assignments() {
  const t = useTranslations("assignments");

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("myAssignments")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </section>
  );
}
