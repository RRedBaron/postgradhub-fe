"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Textarea,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/common/enums/routes";

// Mock data for a single assignment
const assignment = {
  id: 1,
  title: "Research Paper on Machine Learning",
  subject: "Artificial Intelligence",
  dueDate: "2024-04-15",
  status: "pending",
  description:
    "Write a comprehensive research paper on recent advances in machine learning algorithms.",
  requirements: [
    "Minimum 10 pages",
    "Include recent research papers (last 2 years)",
    "Focus on practical applications",
    "Include code examples",
  ],
  submittedFile: null,
  studentComment: "",
  teacherComment: "",
  grade: null,
};

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

export default function AssignmentDetail() {
  const t = useTranslations("assignments");
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Here you would typically upload the file and submit the assignment
    console.log("Submitting assignment with file:", file);
    console.log("Comment:", comment);
  };

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
        <Chip color={getStatusColor(assignment.status)} variant="flat">
          {getStatusText(assignment.status)}
        </Chip>
      </div>

      <Card className="bg-gradient-to-r from-[#191919] to-[#23272f]">
        <CardHeader>
          <div className="flex flex-col gap-2">
            <p className="text-small text-default-500">
              Subject: {assignment.subject}
            </p>
            <p className="text-small text-default-500">
              Due Date: {assignment.dueDate}
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-default-400">{assignment.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Requirements</h2>
              <ul className="list-disc list-inside text-default-400">
                {assignment.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Submit Assignment</h2>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-default-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary-600"
                />
                <Textarea
                  label="Add a comment (optional)"
                  placeholder="Add any additional information for your submission..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button color="primary" onPress={handleSubmit}>
                  Submit Assignment
                </Button>
              </div>
            </div>

            {assignment.teacherComment && (
              <div className="mt-6 p-4 bg-default-100 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">
                  Teacher's Feedback
                </h2>
                <p className="text-default-400">{assignment.teacherComment}</p>
                {assignment.grade && (
                  <p className="mt-2 font-semibold">
                    Grade: {assignment.grade}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
