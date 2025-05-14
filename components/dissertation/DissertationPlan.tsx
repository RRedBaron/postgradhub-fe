"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import { useTranslations } from "next-intl";

interface Task {
  id: number;
  name: string;
  deadline: string;
}

export function DissertationPlan() {
  const t = useTranslations("dissertation");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");

  const addTask = () => {
    if (!name || !deadline) return;
    setTasks([...tasks, { id: Date.now(), name, deadline }]);
    setName("");
    setDeadline("");
  };

  return (
    <section className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t("plan")}</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={t("enterTaskName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <Button onPress={addTask}>{t("addTask")}</Button>
          </div>
          {tasks.map((task) => (
            <Card key={task.id} variant="flat">
              <CardBody className="flex justify-between">
                <span>{task.name}</span>
                <span className="text-sm text-gray-600">{task.deadline}</span>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card>
    </section>
  );
}
