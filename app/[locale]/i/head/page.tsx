"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Button,
  Select,
  SelectItem,
  Chip,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Progress,
  Input,
} from "@heroui/react";
import { useTranslations } from "next-intl";

const mockStudents = [
  {
    id: 1,
    name: "Іван Іваненко",
    email: "ivanenko@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
    year: 2022,
    supervisor: "Петренко П.П.",
    progress: 80,
    status: "active",
    lastActivity: "2025-05-10",
    role: "PhD",
  },
  {
    id: 2,
    name: "Марія Смирненко",
    email: "smirnenko@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    year: 2023,
    supervisor: "Сидоренко С.С.",
    progress: 60,
    status: "active",
    lastActivity: "2025-05-12",
    role: "PhD",
  },
];

const mockSupervisors = [
  { id: 1, name: "Петренко П.П." },
  { id: 2, name: "Сидоренко С.С." },
  { id: 3, name: "Новиченко Н.Н." },
];

const mockUsers = [
  { id: 1, name: "Іван Іваненко", email: "ivanenko@example.com", role: "PhD" },
  {
    id: 2,
    name: "Петренко П.П.",
    email: "petrenko@example.com",
    role: "SUPERVISOR",
  },
  {
    id: 3,
    name: "Марія Смирненко",
    email: "smirnenko@example.com",
    role: "PhD",
  },
  {
    id: 4,
    name: "Сидоренко С.С.",
    email: "sidorенко@example.com",
    role: "SUPERVISOR",
  },
];

const roleOptions = [
  { key: "PhD", label: "Студент" },
  { key: "SUPERVISOR", label: "Керівник" },
];

export default function HeadDashboard() {
  const t = useTranslations("head");
  const [students, setStudents] = useState(mockStudents);
  const [users, setUsers] = useState(mockUsers);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(
    null
  );
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleAssignSupervisor = () => {
    if (selectedStudentId && selectedSupervisor) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudentId
            ? {
                ...s,
                supervisor: mockSupervisors.find(
                  (sup) => sup.id.toString() === selectedSupervisor
                )?.name,
              }
            : s
        )
      );
      setSelectedStudentId(null);
      setSelectedSupervisor(null);
    }
  };

  const handleAssignRole = () => {
    if (selectedUserId && selectedRole) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserId ? { ...u, role: selectedRole } : u
        )
      );
      setSelectedUserId(null);
      setSelectedRole(null);
    }
  };

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Панель завідуючого</h1>
        <a href="/i/head/reports" className="text-primary underline text-base">
          Звітність
        </a>
      </div>
      <Card>
        <CardBody>
          <Tabs aria-label="Head Dashboard">
            <Tab key="students" title="Студенти">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Всі студенти</h2>
                <Table aria-label="Students list">
                  <TableHeader>
                    <TableColumn>Студент</TableColumn>
                    <TableColumn>Рік вступу</TableColumn>
                    <TableColumn>Керівник</TableColumn>
                    <TableColumn>Прогрес</TableColumn>
                    <TableColumn>Статус</TableColumn>
                    <TableColumn>Остання активність</TableColumn>
                    <TableColumn>Дії</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar src={student.avatar} size="sm" />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {student.name}
                              </span>
                              <span className="text-small text-default-500">
                                {student.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>{student.supervisor}</TableCell>
                        <TableCell>
                          <Progress
                            value={student.progress}
                            color={
                              student.progress >= 70 ? "success" : "warning"
                            }
                            className="max-w-md"
                          />
                          <span className="text-small text-default-500">
                            {student.progress}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={
                              student.status === "active"
                                ? "success"
                                : "warning"
                            }
                            variant="flat"
                            size="sm"
                          >
                            {student.status === "active"
                              ? "Активний"
                              : "Неактивний"}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <span className="text-small text-default-500">
                            {new Date(
                              student.lastActivity
                            ).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Select
                            label="Назначити керівника"
                            selectedKeys={
                              selectedStudentId === student.id &&
                              selectedSupervisor
                                ? [selectedSupervisor]
                                : []
                            }
                            onSelectionChange={(keys) => {
                              setSelectedStudentId(student.id);
                              setSelectedSupervisor(
                                Array.from(keys)[0] as string
                              );
                            }}
                            className="mb-2"
                          >
                            {mockSupervisors.map((sup) => (
                              <SelectItem key={sup.id.toString()}>
                                {sup.name}
                              </SelectItem>
                            ))}
                          </Select>
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={handleAssignSupervisor}
                            isDisabled={
                              selectedStudentId !== student.id ||
                              !selectedSupervisor
                            }
                          >
                            Прикріпити
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            <Tab key="roles" title="Користувачі та ролі">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Користувачі</h2>
                <Table aria-label="Users list">
                  <TableHeader>
                    <TableColumn>Ім'я</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Роль</TableColumn>
                    <TableColumn>Дії</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            color={
                              user.role === "PhD"
                                ? "primary"
                                : user.role === "SUPERVISOR"
                                  ? "success"
                                  : "default"
                            }
                            variant="flat"
                            size="sm"
                          >
                            {user.role}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Select
                            label="Назначити роль"
                            selectedKeys={
                              selectedUserId === user.id && selectedRole
                                ? [selectedRole]
                                : []
                            }
                            onSelectionChange={(keys) => {
                              setSelectedUserId(user.id);
                              setSelectedRole(Array.from(keys)[0] as string);
                            }}
                            className="mb-2"
                          >
                            {roleOptions.map((role) => (
                              <SelectItem key={role.key}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </Select>
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={handleAssignRole}
                            isDisabled={
                              selectedUserId !== user.id ||
                              !selectedRole ||
                              user.role === "HEAD"
                            }
                          >
                            Назначити
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </section>
  );
}
