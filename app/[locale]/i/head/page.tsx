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

// TODO: заменить на реальные данные с бэка
const mockStudents = [
  {
    id: 1,
    name: "Иван Иванов",
    email: "ivanov@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
    year: 2022,
    supervisor: "Петров П.П.",
    progress: 80,
    status: "active",
    lastActivity: "2025-05-10",
    role: "PhD",
  },
  {
    id: 2,
    name: "Мария Смирнова",
    email: "smirnova@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    year: 2023,
    supervisor: "Сидоров С.С.",
    progress: 60,
    status: "active",
    lastActivity: "2025-05-12",
    role: "PhD",
  },
];

const mockSupervisors = [
  { id: 1, name: "Петров П.П." },
  { id: 2, name: "Сидоров С.С." },
  { id: 3, name: "Новиков Н.Н." },
];

const mockUsers = [
  { id: 1, name: "Иван Иванов", email: "ivanov@example.com", role: "PhD" },
  {
    id: 2,
    name: "Петров П.П.",
    email: "petrov@example.com",
    role: "SUPERVISOR",
  },
  { id: 3, name: "Мария Смирнова", email: "smirnova@example.com", role: "PhD" },
  {
    id: 4,
    name: "Сидоров С.С.",
    email: "sidorov@example.com",
    role: "SUPERVISOR",
  },
];

const roleOptions = [
  { key: "PhD", label: "Студент" },
  { key: "SUPERVISOR", label: "Руководитель" },
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

  // Назначить руководителя студенту
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

  // Назначить роль пользователю
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
        <h1 className="text-2xl font-bold">Панель заведующего</h1>
        <a href="/i/head/reports" className="text-primary underline text-base">
          Отчетность
        </a>
      </div>
      <Card>
        <CardBody>
          <Tabs aria-label="Head Dashboard">
            <Tab key="students" title="Студенты">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Все студенты</h2>
                <Table aria-label="Students list">
                  <TableHeader>
                    <TableColumn>Студент</TableColumn>
                    <TableColumn>Год поступления</TableColumn>
                    <TableColumn>Руководитель</TableColumn>
                    <TableColumn>Прогресс</TableColumn>
                    <TableColumn>Статус</TableColumn>
                    <TableColumn>Последняя активность</TableColumn>
                    <TableColumn>Действия</TableColumn>
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
                              ? "Активен"
                              : "Неактивен"}
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
                            label="Назначить руководителя"
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
                            Прикрепить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            <Tab key="roles" title="Пользователи и роли">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Пользователи</h2>
                <Table aria-label="Users list">
                  <TableHeader>
                    <TableColumn>Имя</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Роль</TableColumn>
                    <TableColumn>Действия</TableColumn>
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
                            label="Назначить роль"
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
                            Назначить
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
