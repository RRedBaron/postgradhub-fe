"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import { useTranslations } from "next-intl";
import {
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { format, isAfter, isBefore, setHours, setMinutes } from "date-fns";
import { uk } from "date-fns/locale";
import { Calendar } from "@heroui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Chip } from "@heroui/react";
import {
  useGetTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/lib/hooks";
import { Task, TaskPriority, TaskStatus } from "@/lib/types/task";

export function DissertationPlan() {
  const t = useTranslations("dissertation");
  const { data: tasks = [], isLoading } = useGetTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [deadlineTime, setDeadlineTime] = useState("12:00");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [description, setDescription] = useState("");

  const handleAddTask = () => {
    const [hours, minutes] = deadlineTime.split(":").map(Number);
    const deadlineWithTime = setMinutes(setHours(deadline, hours), minutes);

    createTask.mutate({
      name,
      deadline: deadlineWithTime.toISOString(),
      priority,
      description: description || undefined,
    });

    setName("");
    setDeadline(null);
    setDeadlineTime("12:00");
    setDescription("");
    setPriority(TaskPriority.MEDIUM);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    updateTask.mutate({
      id: taskId,
      task: { status: newStatus },
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask.mutate(taskId);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "text-red-500";
      case TaskPriority.MEDIUM:
        return "text-yellow-500";
      case TaskPriority.LOW:
        return "text-green-500";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case TaskStatus.IN_PROGRESS:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case TaskStatus.PENDING:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const isTaskOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    return (
      isBefore(deadlineDate, new Date()) && !isAfter(deadlineDate, new Date())
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t("plan")}</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                placeholder={t("enterTaskName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="flat"
                      className={`w-full justify-start text-left font-normal ${
                        !deadline && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? (
                        format(deadline, "d MMMM yyyy", { locale: uk })
                      ) : (
                        <span>{t("selectDate")}</span>
                      )}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={(date: Date | null) => setDeadline(date)}
                      initialFocus
                      disabled={(date: Date) => isBefore(date, new Date())}
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={TaskPriority.LOW}>{t("priorityLow")}</option>
                  <option value={TaskPriority.MEDIUM}>
                    {t("priorityMedium")}
                  </option>
                  <option value={TaskPriority.HIGH}>{t("priorityHigh")}</option>
                </select>
              </div>
              <Input
                placeholder={t("taskDescription")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button
                onPress={handleAddTask}
                className="w-full"
                disabled={!name || !deadline || createTask.isPending}
              >
                {createTask.isPending ? t("adding") : t("addTask")}
              </Button>
            </div>
          </div>

          <Divider />

          <div className="space-y-4">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => {
                          const newStatus =
                            task.status === TaskStatus.COMPLETED
                              ? TaskStatus.PENDING
                              : TaskStatus.COMPLETED;
                          handleUpdateTaskStatus(task.id, newStatus);
                        }}
                        className="mt-1"
                      >
                        {getStatusIcon(task.status)}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-medium ${task.status === TaskStatus.COMPLETED ? "line-through text-gray-500" : ""}`}
                          >
                            {task.name}
                          </h4>
                          <Chip
                            size="sm"
                            color={
                              task.status === TaskStatus.COMPLETED
                                ? "success"
                                : task.status === TaskStatus.IN_PROGRESS
                                  ? "warning"
                                  : "default"
                            }
                          >
                            {t(`status.${task.status.toLowerCase()}`)}
                          </Chip>
                          <Chip
                            size="sm"
                            color={
                              task.priority === TaskPriority.HIGH
                                ? "danger"
                                : task.priority === TaskPriority.MEDIUM
                                  ? "warning"
                                  : "default"
                            }
                          >
                            {t(`priority.${task.priority.toLowerCase()}`)}
                          </Chip>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span
                              className={
                                isTaskOverdue(task.deadline)
                                  ? "text-red-500"
                                  : ""
                              }
                            >
                              {format(new Date(task.deadline), "d MMMM yyyy", {
                                locale: uk,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {format(new Date(task.deadline), "HH:mm")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => handleDeleteTask(task.id)}
                        disabled={deleteTask.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
