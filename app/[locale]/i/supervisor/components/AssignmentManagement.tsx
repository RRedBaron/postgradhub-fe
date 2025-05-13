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
import { FiEdit2, FiUsers, FiCalendar, FiFileText } from "react-icons/fi";

// Mock data for assignments
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

// Mock data for students
const students = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Mike Johnson" },
];

export const AssignmentManagement = () => {
  const t = useTranslations("supervisor");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleCreateAssignment = () => {
    // Here you would typically create a new assignment
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
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
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
