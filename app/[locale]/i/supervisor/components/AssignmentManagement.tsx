"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { FiEdit2, FiUsers, FiCalendar, FiFileText, FiX } from "react-icons/fi";
import { FileUploaderMinimal } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

const assignments = [
  {
    id: 1,
    title: "Research Paper on Machine Learning",
    subject: "Artificial Intelligence",
    dueDate: "2024-04-15",
    status: "active",
    assignedStudents: 3,
    description:
      "Write a comprehensive research paper on recent advances in machine learning algorithms.",
  },
  {
    id: 2,
    title: "Database Design Project",
    subject: "Database Systems",
    dueDate: "2024-04-20",
    status: "draft",
    assignedStudents: 0,
    description:
      "Design and implement a database system for a university library.",
  },
];

const students = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Mike Johnson" },
];

interface UploadcareFile {
  cdnUrl: string;
}

export const AssignmentManagement = () => {
  const t = useTranslations("supervisor");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = (file: UploadcareFile) => {
    setAttachments((prev) => [...prev, file.cdnUrl]);
    setIsUploading(false);
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload failed:", error);
    setIsUploading(false);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateAssignment = () => {
    onClose();
  };

  const handleSelectionChange = (keys: any) => {
    if (Array.isArray(keys)) {
      setSelectedStudents(keys);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{t("assignments")}</h2>
          <p className="text-small text-default-500 mt-1">
            {t("assignmentsDescription")}
          </p>
        </div>
        <Button color="primary" onPress={onOpen} startContent={<FiFileText />}>
          {t("createAssignment")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold line-clamp-1">
                  {assignment.title}
                </h3>
                <div className="flex items-center gap-2 text-small text-default-500">
                  <FiFileText className="w-4 h-4" />
                  <span>{assignment.subject}</span>
                </div>
              </div>
              <Chip
                color={assignment.status === "active" ? "success" : "warning"}
                variant="flat"
                size="sm"
              >
                {t(`status.${assignment.status}`)}
              </Chip>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-4">
                <p className="text-default-500 line-clamp-2">
                  {assignment.description}
                </p>
                <div className="flex flex-col gap-2 text-small">
                  <div className="flex items-center gap-2 text-default-500">
                    <FiCalendar className="w-4 h-4" />
                    <span>
                      {t("dueDate")}:{" "}
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-default-500">
                    <FiUsers className="w-4 h-4" />
                    <span>
                      {t("assignedStudents")}: {assignment.assignedStudents}
                    </span>
                  </div>
                </div>
                <Divider />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    startContent={<FiEdit2 />}
                    className="flex-1"
                  >
                    {t("edit")}
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<FiUsers />}
                    className="flex-1"
                  >
                    {t("assignStudents")}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">{t("createAssignment")}</h3>
              <p className="text-small text-default-500">
                {t("createAssignmentDescription")}
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label={t("title")}
                placeholder={t("enterTitle")}
                classNames={{
                  label: "text-small font-medium",
                }}
              />
              <Input
                label={t("subject")}
                placeholder={t("enterSubject")}
                classNames={{
                  label: "text-small font-medium",
                }}
              />
              <Input
                type="date"
                label={t("dueDate")}
                classNames={{
                  label: "text-small font-medium",
                }}
              />
              <Textarea
                label={t("description")}
                placeholder={t("enterDescription")}
                classNames={{
                  label: "text-small font-medium",
                }}
              />
              <Select
                label={t("assignStudents")}
                selectionMode="multiple"
                selectedKeys={selectedStudents}
                onSelectionChange={handleSelectionChange}
                classNames={{
                  label: "text-small font-medium",
                }}
              >
                {students.map((student) => (
                  <SelectItem key={student.id.toString()}>
                    {student.name}
                  </SelectItem>
                ))}
              </Select>

              <div className="flex flex-col gap-2">
                <label className="text-small font-medium">
                  {t("attachments")}
                </label>
                <div className="flex items-center gap-2">
                  <FileUploaderMinimal
                    sourceList="local, camera, facebook, gdrive"
                    pubkey="a33fe610c62b2d39b4e9"
                    onFileUploadSuccess={handleUploadSuccess}
                    className="w-full"
                  />
                </div>
                {isUploading && (
                  <div className="text-small text-default-500">
                    Uploading file...
                  </div>
                )}
                {attachments.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {attachments.map((fileUrl, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-default-100 rounded-lg"
                      >
                        <FiFileText className="text-primary" />
                        <span className="text-default-400 truncate">
                          {fileUrl.split("/").pop()}
                        </span>
                        <Button
                          size="sm"
                          variant="light"
                          className="ml-auto"
                          onPress={() => handleRemoveAttachment(index)}
                        >
                          <FiX />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              {t("cancel")}
            </Button>
            <Button color="primary" onPress={handleCreateAssignment}>
              {t("create")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
