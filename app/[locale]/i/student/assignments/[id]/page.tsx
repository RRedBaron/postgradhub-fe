"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Textarea,
  Avatar,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { FileUploaderMinimal } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { FiFile, FiDownload, FiSend, FiX } from "react-icons/fi";
import {
  useGetAssignmentById,
  useSubmitAssignment,
} from "@/lib/hooks/useAssignments";
import { useGetComments, useCreateComment } from "@/lib/hooks/useComments";
import { useProfile } from "@/lib/hooks/useProfile";
import { SubmissionStatus } from "@/lib/types/assignment";

const getStatusColor = (status: string) => {
  switch (status) {
    case SubmissionStatus.NOT_SUBMITTED:
      return "warning";
    case SubmissionStatus.SUBMITTED:
      return "primary";
    case SubmissionStatus.GRADED:
      return "success";
    case SubmissionStatus.LATE:
      return "danger";
    case SubmissionStatus.REJECTED:
      return "danger";
    default:
      return "default";
  }
};

export default function AssignmentDetail() {
  const t = useTranslations("assignments");
  const { id = "" } = useParams();
  const router = useRouter();
  const [newComment, setNewComment] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: assignment, isLoading: isAssignmentLoading } =
    useGetAssignmentById(id as string);
  const { data: comments, isLoading: isCommentsLoading } = useGetComments(
    id as string
  );
  const { data: currentUser } = useProfile();
  const createComment = useCreateComment();
  const submitAssignment = useSubmitAssignment();

  const getStatusText = (status: string) => {
    switch (status) {
      case SubmissionStatus.NOT_SUBMITTED:
        return t("status.notSubmitted");
      case SubmissionStatus.SUBMITTED:
        return t("status.submitted");
      case SubmissionStatus.GRADED:
        return t("status.graded");
      case SubmissionStatus.LATE:
        return t("status.late");
      case SubmissionStatus.REJECTED:
        return t("status.rejected");
      default:
        return status;
    }
  };

  const handleUploadSuccess = (file: { cdnUrl: string }) => {
    setUploadedFiles((prev) => [...prev, file.cdnUrl]);
    setIsUploading(false);
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload failed:", error);
    setIsUploading(false);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) return;

    submitAssignment.mutate(
      {
        assignmentId: id as string,
        files: uploadedFiles,
      },
      {
        onSuccess: (data) => {
          setUploadedFiles([]);
        },
        onError: (error) => {
          console.error("Failed to submit assignment:", error);
        },
      }
    );
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() && currentUser) {
      createComment.mutate(
        {
          text: newComment.trim(),
          assignmentId: id as string,
          authorId: currentUser.id,
        },
        {
          onSuccess: () => {
            setNewComment("");
          },
          onError: (error) => {
            console.error("Failed to create comment:", error);
          },
        }
      );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDeadline = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  if (isAssignmentLoading || !assignment) {
    return (
      <section className="py-8 md:py-10 max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Loading assignment...</p>
        </div>
      </section>
    );
  }

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
          <Card className="bg-content1">
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
                    Due:{" "}
                    {assignment.dueDate
                      ? formatDeadline(assignment.dueDate)
                      : "Not set"}
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
                    {assignment.requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                {assignment.attachments &&
                  assignment.attachments.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">
                        Attached Files
                      </h2>
                      <div className="flex flex-col gap-2">
                        {assignment.attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-default-100 rounded-lg"
                          >
                            <FiFile className="text-primary" />
                            <span className="text-default-400">{file}</span>
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
          <Card className="bg-content1">
            <CardHeader>
              <h2 className="text-lg font-semibold">Assignment Status</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-default-500">Status</span>
                  <Chip
                    color={getStatusColor(
                      assignment.users?.find(
                        (u) => u.userId === currentUser?.id
                      )?.submission?.status || SubmissionStatus.NOT_SUBMITTED
                    )}
                    variant="flat"
                  >
                    {getStatusText(
                      assignment.users?.find(
                        (u) => u.userId === currentUser?.id
                      )?.submission?.status || SubmissionStatus.NOT_SUBMITTED
                    )}
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-500">Due Date</span>
                  <span className="font-semibold text-warning">
                    {assignment.dueDate
                      ? formatDeadline(assignment.dueDate)
                      : "Not set"}
                  </span>
                </div>
                {assignment.users?.find((u) => u.userId === currentUser?.id)
                  ?.submission?.grade && (
                  <div className="flex items-center justify-between">
                    <span className="text-default-500">Grade</span>
                    <span className="font-semibold text-success">
                      {
                        assignment.users.find(
                          (u) => u.userId === currentUser?.id
                        )?.submission?.grade
                      }
                    </span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Submission Card */}
          {(!assignment.users?.find((u) => u.userId === currentUser?.id)
            ?.submission?.status ||
            assignment.users.find((u) => u.userId === currentUser?.id)
              ?.submission?.status !== SubmissionStatus.GRADED) && (
            <Card className="bg-content1">
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
                      <FileUploaderMinimal
                        sourceList="local, camera, facebook, gdrive"
                        pubkey="a33fe610c62b2d39b4e9"
                        onFileUploadSuccess={handleUploadSuccess}
                        onFileUploadError={handleUploadError}
                        className="w-full"
                      />
                    </div>
                    {isUploading && (
                      <div className="text-small text-default-500">
                        Uploading file...
                      </div>
                    )}
                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2">
                        {uploadedFiles.map((fileUrl, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-default-100 rounded-lg"
                          >
                            <FiFile className="text-primary" />
                            <span className="text-default-400 truncate">
                              {fileUrl.split("/").pop()}
                            </span>
                            <Button
                              size="sm"
                              variant="light"
                              className="ml-auto"
                              onPress={() => handleRemoveFile(index)}
                            >
                              <FiX />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    color="primary"
                    onPress={handleSubmit}
                    className="w-full"
                    isDisabled={
                      uploadedFiles.length === 0 ||
                      isUploading ||
                      submitAssignment.isPending
                    }
                    isLoading={submitAssignment.isPending}
                  >
                    Submit Assignment
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Comments Section */}
          <Card className="bg-content1">
            <CardHeader>
              <h2 className="text-lg font-semibold">Comments</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                {/* Comments List */}
                <div className="space-y-4">
                  {isCommentsLoading ? (
                    <p>Loading comments...</p>
                  ) : (
                    comments?.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${comment.author.firstName}+${comment.author.lastName}&background=random`}
                          alt={`${comment.author.firstName} ${comment.author.lastName}`}
                          className="w-8 h-8"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {`${comment.author.firstName} ${comment.author.lastName}`}
                            </span>
                            <span className="text-small text-default-500">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-default-400 mt-1">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* New Comment Input */}
                <div className="flex gap-3">
                  <Avatar
                    src={`https://ui-avatars.com/api/?name=${currentUser?.firstName}+${currentUser?.lastName}&background=random`}
                    alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
                    className="w-8 h-8"
                  />
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-2"
                      isDisabled={createComment.isPending}
                    />
                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={handleCommentSubmit}
                        startContent={<FiSend />}
                        isDisabled={
                          !newComment.trim() ||
                          createComment.isPending ||
                          !currentUser
                        }
                        isLoading={createComment.isPending}
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
