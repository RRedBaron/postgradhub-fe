"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardBody } from "@heroui/react";
import { Button } from "@heroui/button";
import { Calendar } from "@heroui/calendar";
import { format, addDays, isBefore, isAfter } from "date-fns";
import { ru } from "date-fns/locale";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookedDefense {
  id: string;
  date: Date;
  time: string;
  student: string;
  topic: string;
}

export function DissertationDefense() {
  const t = useTranslations("dissertation");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock booked defenses
  const bookedDefenses: BookedDefense[] = [
    {
      id: "1",
      date: addDays(new Date(), 5),
      time: "10:00",
      student: "Иванов И.И.",
      topic: "Разработка системы управления проектами",
    },
    {
      id: "2",
      date: addDays(new Date(), 7),
      time: "14:00",
      student: "Петров П.П.",
      topic: "Анализ эффективности алгоритмов машинного обучения",
    },
    {
      id: "3",
      date: addDays(new Date(), 10),
      time: "11:00",
      student: "Сидоров С.С.",
      topic: "Оптимизация процессов в распределенных системах",
    },
  ];

  // Generate time slots from 9:00 to 17:00
  const timeSlots: TimeSlot[] = Array.from({ length: 9 }, (_, i) => ({
    time: `${9 + i}:00`,
    available: Math.random() > 0.3, // Mock availability
  }));

  const isDateSelectable = (date: Date) => {
    const today = new Date();
    const maxDate = addDays(today, 30); // Allow booking up to 30 days in advance
    return isAfter(date, today) && isBefore(date, maxDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    // Here you would typically make an API call to book the slot
    alert(
      `Защита назначена на ${format(selectedDate, "d MMMM yyyy", { locale: ru })} в ${selectedTime}`
    );
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("defenseBooking")}</h3>
        <div className="flex gap-2">
          <Button
            variant="flat"
            color="primary"
            onPress={() => {
              setSelectedDate(null);
              setSelectedTime(null);
            }}
          >
            {t("clearSelection")}
          </Button>
          <Button
            variant="solid"
            color="primary"
            onPress={handleBooking}
            disabled={!selectedDate || !selectedTime}
          >
            {t("bookDefense")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardBody>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date: Date) => !isDateSelectable(date)}
                className="rounded-md border"
              />
            </CardBody>
          </Card>

          {selectedDate && (
            <Card>
              <CardBody>
                <h4 className="font-medium mb-4">
                  {format(selectedDate, "d MMMM yyyy", { locale: ru })}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "solid" : "flat"}
                      color={selectedTime === slot.time ? "primary" : "default"}
                      className="w-full"
                      disabled={!slot.available}
                      onPress={() => handleTimeSelect(slot.time)}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <Card>
          <CardBody>
            <h4 className="font-medium mb-4">{t("bookedDefenses")}</h4>
            <div className="space-y-4">
              {bookedDefenses.map((defense) => (
                <Card key={defense.id} variant="flat">
                  <CardBody>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {format(defense.date, "d MMMM yyyy", { locale: ru })}
                        </p>
                        <p className="text-sm text-gray-600">{defense.time}</p>
                        <p className="text-sm mt-1">{defense.student}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {defense.topic}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => {
                          // Here you would typically make an API call to cancel the booking
                          alert(`Отмена защиты ${defense.student}`);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
