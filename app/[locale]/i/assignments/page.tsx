"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  Chip,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/common/enums/routes";

// Mock data for assignments
const assignments = [
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "submitted":
      return "primary";
    case "graded":
      return "success";
    default:
      return "default";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "submitted":
      return "Submitted";
    case "graded":
      return "Graded";
    default:
      return status;
  }
};

export default function Assignments() {
  const t = useTranslations("assignments");
  const router = useRouter();

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Assignments</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="hover:scale-105 transition-transform cursor-pointer bg-content2"
            isPressable
            onPress={() =>
              router.push(`${ROUTES.ASSIGNMENTS}/${assignment.id}`)
            }
          >
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md font-bold text-foreground">
                  {assignment.title}
                </p>
                <p className="text-small text-default-500">
                  {assignment.subject}
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-small text-foreground-500">
                {assignment.description}
              </p>
            </CardBody>
            <CardFooter className="flex justify-between">
              <Chip color={getStatusColor(assignment.status)} variant="flat">
                {getStatusText(assignment.status)}
              </Chip>
              <p className="text-small text-default-500">
                Due: {assignment.dueDate}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
