"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Progress,
  Button,
} from "@heroui/react";
import { useTranslations } from "next-intl";

// Mock data for students
const students = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    progress: 75,
    status: "active",
    lastActivity: "2024-03-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    progress: 45,
    status: "active",
    lastActivity: "2024-03-14",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    progress: 90,
    status: "active",
    lastActivity: "2024-03-15",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "warning";
    default:
      return "default";
  }
};

export const StudentsList = () => {
  const t = useTranslations("supervisor");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("studentsList")}</h2>
        <Button color="primary" variant="flat">
          {t("addStudent")}
        </Button>
      </div>

      <Table aria-label="Students list">
        <TableHeader>
          <TableColumn>{t("student")}</TableColumn>
          <TableColumn>{t("progress")}</TableColumn>
          <TableColumn>{t("status")}</TableColumn>
          <TableColumn>{t("lastActivity")}</TableColumn>
          <TableColumn>{t("actions")}</TableColumn>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar src={student.avatar} size="sm" />
                  <div className="flex flex-col">
                    <span className="font-medium">{student.name}</span>
                    <span className="text-small text-default-500">
                      {student.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Progress
                    value={student.progress}
                    color={student.progress >= 70 ? "success" : "warning"}
                    className="max-w-md"
                  />
                  <span className="text-small text-default-500">
                    {student.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  color={getStatusColor(student.status)}
                  variant="flat"
                  size="sm"
                >
                  {t(`status.${student.status}`)}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-small text-default-500">
                  {new Date(student.lastActivity).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="light">
                    {t("viewDetails")}
                  </Button>
                  <Button size="sm" color="primary" variant="flat">
                    {t("message")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
