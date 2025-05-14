"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import clsx from "clsx";
import { isSameDay, parseISO } from "date-fns";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";
import "./DissertationCalendar.css";

interface Event {
  id: number;
  name: string;
  date: string;
}

export function DissertationCalendar() {
  const t = useTranslations("dissertation");
  const events: Event[] = [
    { id: 1, name: t("interimEvaluation"), date: "2025-06-01" },
    { id: 2, name: t("stateExam"), date: "2025-10-15" },
    { id: 3, name: t("defense"), date: "2025-12-20" },
  ];
  const [value, setValue] = useState<Date>(new Date());

  return (
    <section className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t("calendar")}</h3>
        </CardHeader>
        <CardBody>
          <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 shadow border max-w-md mx-auto">
            <Calendar
              onChange={(val) => {
                if (val instanceof Date) setValue(val);
              }}
              value={value}
              calendarType="iso8601"
              className="custom-calendar w-full border-0 bg-transparent text-base"
              tileClassName={({ date, view }) =>
                clsx(
                  "custom-calendar-tile",
                  view === "month" &&
                    events.some((evt) => isSameDay(parseISO(evt.date), date)) &&
                    "event-day",
                  view === "month" && isSameDay(date, value) && "selected-day"
                )
              }
              tileContent={({ date, view }) => {
                if (view === "month") {
                  const event = events.find((evt) =>
                    isSameDay(parseISO(evt.date), date)
                  );
                  return event ? (
                    <span className="block w-1 h-1 mt-1 mx-auto rounded-full bg-primary dark:bg-primary-300" />
                  ) : null;
                }
                return null;
              }}
              prevLabel={<span className="text-lg">‹</span>}
              nextLabel={<span className="text-lg">›</span>}
              prev2Label={null}
              next2Label={null}
            />
          </div>
          <div className="mt-4 space-y-2">
            {events.map((evt) => (
              <div key={evt.id} className="flex justify-between">
                <span className="font-medium">{evt.name}</span>
                <span className="text-sm text-gray-600">
                  {parseISO(evt.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
