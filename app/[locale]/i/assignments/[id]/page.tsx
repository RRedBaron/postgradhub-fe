"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Textarea,
  Divider,
  Avatar,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/common/enums/routes";
import {
  FiPaperclip,
  FiFile,
  FiDownload,
  FiUpload,
  FiSend,
} from "react-icons/fi";

// Add type for attachments
interface Attachment {
  id: number;
  name: string;
  size: string;
  type: string;
}

// Update the comment type
interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
    role: "teacher" | "student";
  };
  content: string;
  timestamp: string;
  attachments: Attachment[];
}

// Mock data for a single assignment
const assignment = {
  id: 1,
  title: "Research Paper on Machine Learning",
  subject: "Artificial Intelligence",
  dueDate: "2024-04-15T23:59:59Z", // Updated to include time
  status: "pending",
  description:
    "Write a comprehensive research paper on recent advances in machine learning algorithms.",
  requirements: [
    "Minimum 10 pages",
    "Include recent research papers (last 2 years)",
    "Focus on practical applications",
    "Include code examples",
  ],
  attachedFiles: [
    {
      id: 1,
      name: "Assignment Guidelines.pdf",
      size: "2.5 MB",
      type: "application/pdf",
    },
    {
      id: 2,
      name: "Sample Research Paper.docx",
      size: "1.8 MB",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  ],
  submittedFile: null,
  grade: null,
  comments: [
    {
      id: 1,
      author: {
        name: "Dr. Smith",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "teacher",
      },
      content:
        "Please make sure to include recent research papers from 2023-2024.",
      timestamp: "2024-03-15T10:30:00Z",
      attachments: [],
    },
    {
      id: 2,
      author: {
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=2",
        role: "student",
      },
      content:
        "I have a question about the minimum page requirement. Does it include references?",
      timestamp: "2024-03-15T11:45:00Z",
      attachments: [],
    },
    {
      id: 3,
      author: {
        name: "Dr. Smith",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "teacher",
      },
      content:
        "Yes, the 10 pages should include references. However, the reference list itself should not exceed 2 pages.",
      timestamp: "2024-03-15T12:15:00Z",
      attachments: [],
    },
  ],
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
  const [newComment, setNewComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    // Here you would typically upload the files and submit the assignment
    console.log("Submitting assignment with files:", files);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // Here you would typically send the comment to the server
      console.log("Submitting comment:", newComment);
      setNewComment("");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <section className="py-8 md:py-10 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
        <Chip color={getStatusColor(assignment.status)} variant="flat">
          {getStatusText(assignment.status)}
        </Chip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-r from-[#191919] to-[#23272f]">
            <CardHeader>
              <div className="flex flex-col gap-2">
                <p className="text-small text-default-500">
                  Subject: {assignment.subject}
                </p>
                <div className="flex items-center gap-2 text-warning">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">
                    Due: {formatDeadline(assignment.dueDate)}
                  </span>
                </div>
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

                {assignment.attachedFiles &&
                  assignment.attachedFiles.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">
                        Attached Files
                      </h2>
                      <div className="flex flex-col gap-2">
                        {assignment.attachedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 p-2 bg-default-100 rounded-lg"
                          >
                            <FiFile className="text-primary" />
                            <span className="text-default-400">
                              {file.name}
                            </span>
                            <span className="text-small text-default-500">
                              ({file.size})
                            </span>
                            <Button
                              size="sm"
                              variant="light"
                              className="ml-auto"
                              startContent={<FiDownload />}
                            >
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Submission and Comments */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="bg-gradient-to-r from-[#191919] to-[#23272f]">
            <CardHeader>
              <h2 className="text-lg font-semibold">Assignment Status</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-default-500">Status</span>
                  <Chip
                    color={getStatusColor(assignment.status)}
                    variant="flat"
                  >
                    {getStatusText(assignment.status)}
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-500">Due Date</span>
                  <span className="font-semibold text-warning">
                    {formatDeadline(assignment.dueDate)}
                  </span>
                </div>
                {assignment.grade && (
                  <div className="flex items-center justify-between">
                    <span className="text-default-500">Grade</span>
                    <span className="font-semibold text-success">
                      {assignment.grade}
                    </span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Submission Card */}
          <Card className="bg-gradient-to-r from-[#191919] to-[#23272f]">
            <CardHeader>
              <h2 className="text-lg font-semibold">Your Work</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-small text-default-500">
                    Attach Files
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-colors"
                    >
                      <FiUpload />
                      <span>Choose Files</span>
                    </label>
                    <span className="text-small text-default-500">
                      {files.length > 0
                        ? `${files.length} file(s) selected`
                        : "No files selected"}
                    </span>
                  </div>
                  {files.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-default-100 rounded-lg"
                        >
                          <FiFile className="text-primary" />
                          <span className="text-default-400">{file.name}</span>
                          <span className="text-small text-default-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  color="primary"
                  onPress={handleSubmit}
                  className="w-full"
                >
                  Submit Assignment
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Comments Section */}
          <Card className="bg-gradient-to-r from-[#191919] to-[#23272f]">
            <CardHeader>
              <h2 className="text-lg font-semibold">Comments</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                {/* Comments List */}
                <div className="space-y-4">
                  {assignment.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-8 h-8"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {comment.author.name}
                          </span>
                          <span className="text-small text-default-500">
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-default-400 mt-1">
                          {comment.content}
                        </p>
                        {comment.attachments &&
                          comment.attachments.length > 0 && (
                            <div className="mt-2 flex flex-col gap-2">
                              {comment.attachments.map((file) => (
                                <div
                                  key={file.id}
                                  className="flex items-center gap-2 p-2 bg-default-100 rounded-lg"
                                >
                                  <FiFile className="text-primary" />
                                  <span className="text-default-400">
                                    {file.name}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="light"
                                    className="ml-auto"
                                    startContent={<FiDownload />}
                                  >
                                    Download
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* New Comment Input */}
                <div className="flex gap-3">
                  <Avatar
                    src="https://i.pravatar.cc/150?img=2"
                    alt="Your Name"
                    className="w-8 h-8"
                  />
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={handleCommentSubmit}
                        startContent={<FiSend />}
                        isDisabled={!newComment.trim()}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
