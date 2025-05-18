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
import { format, isAfter, isBefore } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@heroui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";

interface Task {
  id: number;
  name: string;
  deadline: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  description?: string;
}

export function DissertationPlan() {
  const t = useTranslations("dissertation");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [description, setDescription] = useState("");

  const addTask = () => {
    if (!name || !deadline) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        name,
        deadline: deadline.toISOString(),
        status: "pending",
        priority,
        description: description || undefined,
      },
    ]);
    setName("");
    setDeadline(null);
    setDescription("");
    setPriority("medium");
  };

  const updateTaskStatus = (taskId: number, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "pending":
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const isTaskOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    return (
      isBefore(deadlineDate, new Date()) && !isAfter(deadlineDate, new Date())
    );
  };

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
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !deadline && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? (
                        format(deadline, "d MMMM yyyy", { locale: ru })
                      ) : (
                        <span>{t("selectDate")}</span>
                      )}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                      disabled={(date) => isBefore(date, new Date())}
                    />
                  </PopoverContent>
                </Popover>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as Task["priority"])
                  }
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">{t("priorityLow")}</option>
                  <option value="medium">{t("priorityMedium")}</option>
                  <option value="high">{t("priorityHigh")}</option>
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
                onPress={addTask}
                className="w-full"
                disabled={!name || !deadline}
              >
                {t("addTask")}
              </Button>
            </div>
          </div>

          <Divider />

          <div className="space-y-4">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => {
                          const newStatus: Task["status"] =
                            task.status === "completed"
                              ? "pending"
                              : "completed";
                          updateTaskStatus(task.id, newStatus);
                        }}
                        className="mt-1"
                      >
                        {getStatusIcon(task.status)}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
                          >
                            {task.name}
                          </h4>
                          <span
                            className={`text-sm ${getPriorityColor(task.priority)}`}
                          >
                            {t(
                              `priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`
                            )}
                          </span>
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
                                locale: ru,
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
                        onPress={() => deleteTask(task.id)}
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
