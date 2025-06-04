"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardBody, Badge, Spinner, toast, addToast } from "@heroui/react";
import { Button } from "@heroui/button";
import Calendar from "react-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import {
  format,
  addDays,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
} from "date-fns";
import { uk } from "date-fns/locale";
import {
  useGetBookings,
  useCreateBooking,
  useDeleteBooking,
} from "@/lib/hooks/useBookings";
import { useProfile } from "@/lib/hooks/useProfile";
import { Booking, CreateBookingDto, BookingStatus } from "@/lib/types/booking";
import { CalendarIcon, ChevronDown, Clock, Globe } from "lucide-react";
import "react-calendar/dist/Calendar.css";

const START_HOUR = 9;
const END_HOUR = 17;

export const DissertationDefense = () => {
  const t = useTranslations("dissertation");
  const { data: profile } = useProfile();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    isRefetching,
  } = useGetBookings();
  const { mutate: createBooking, isPending: isCreating } = useCreateBooking();
  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking();

  const today = new Date();
  const maxDate = addDays(today, 30);

  const grouped = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((b) => {
      if (b.isDeleted || b.status === BookingStatus.REJECTED) return;
      const key = format(new Date(b.startDate), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    });
    return map;
  }, [bookings]);

  const dayFull = (d: Date) =>
    (grouped.get(format(d, "yyyy-MM-dd")) ?? []).length >=
    END_HOUR - START_HOUR;

  const dateEnabled = (d: Date) =>
    isAfter(d, today) && isBefore(d, maxDate) && !dayFull(d);

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
      const time = `${START_HOUR + i}:00`;
      const taken = (
        grouped.get(format(selectedDate, "yyyy-MM-dd")) ?? []
      ).some((b) => format(new Date(b.startDate), "HH:mm") === time);
      return { time, available: !taken };
    });
  }, [selectedDate, grouped]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !profile) return;

    const hasExistingBooking = bookings.some(
      (b) =>
        !b.isDeleted &&
        b.status !== BookingStatus.REJECTED &&
        b.userId === profile.id
    );

    if (hasExistingBooking) {
      addToast({
        title: t("error"),
        description: t("oneBookingLimit"),
        color: "danger",
      });
      return;
    }

    const [h, m] = selectedTime.split(":").map(Number);

    const startDate = setMinutes(setHours(selectedDate, h), m);
    const endDate = setMinutes(setHours(selectedDate, h + 1), m);

    const dto: CreateBookingDto = {
      startDate,
      endDate,
      description: t("dissertationDefense"),
      userId: profile.id,
    };

    createBooking(dto, {
      onSuccess: () => {
        addToast({
          title: t("success"),
          description: t("bookingCreated"),
          color: "success",
        });
        setSelectedDate(null);
        setSelectedTime(null);
      },
      onError: (error: Error) =>
        addToast({
          title: t("error"),
          description: error.message || t("bookingError"),
          color: "danger",
        }),
    });
  };

  const handleDeleteBooking = (id: string) => {
    if (!window.confirm(t("confirmCancel"))) return;
    deleteBooking(id, {
      onSuccess: () =>
        addToast({
          title: t("success"),
          description: t("bookingCancelled"),
          color: "success",
        }),
      onError: (error: Error) =>
        addToast({
          title: t("error"),
          description: error.message || t("cancelError"),
          color: "danger",
        }),
    });
  };

  const busy = isLoadingBookings || isCreating || isDeleting || isRefetching;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("defenseBooking")}</h3>
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-muted-foreground" />
          <span className="text-sm">
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardBody>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="flat"
                    className={`w-full justify-start text-left font-normal ${
                      !selectedDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {selectedDate
                      ? format(selectedDate, "d MMMM yyyy", { locale: uk })
                      : t("selectDate")}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    onChange={(value) => {
                      if (value instanceof Date) {
                        setSelectedDate(value);
                        setSelectedTime(null);
                      }
                    }}
                    value={selectedDate}
                    minDate={today}
                    maxDate={maxDate}
                    tileDisabled={({ date }) => !dateEnabled(date)}
                    tileClassName={({ date }) =>
                      dayFull(date) ? "opacity-40 pointer-events-none" : ""
                    }
                  />
                </PopoverContent>
              </Popover>
            </CardBody>
          </Card>

          {selectedDate && (
            <Card>
              <CardBody>
                <h4 className="font-medium mb-4">
                  {format(selectedDate, "d MMMM yyyy", { locale: uk })}
                </h4>
                {busy ? (
                  <div className="flex justify-center py-10">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        color={
                          selectedTime === slot.time
                            ? "primary"
                            : slot.available
                              ? "default"
                              : "danger"
                        }
                        className="w-full"
                        disabled={!slot.available}
                        onPress={() => setSelectedTime(slot.time)}
                      >
                        <Clock size={14} className="mr-1" />
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          )}

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
              disabled={!selectedDate || !selectedTime || busy}
            >
              {t("bookDefense")}
            </Button>
          </div>
        </div>

        <Card>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">{t("bookedDefenses")}</h4>
              {isRefetching && <Spinner size="sm" />}
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {bookings
                .filter(
                  (b) => !b.isDeleted && b.status !== BookingStatus.REJECTED
                )
                .sort((a, b) => {
                  if (profile && a.userId === profile.id) return -1;
                  if (profile && b.userId === profile.id) return 1;
                  return (
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
                  );
                })
                .map((b) => (
                  <div
                    key={b.id}
                    className={`border rounded-lg p-4 flex justify-between items-start ${
                      profile && b.userId === profile.id
                        ? "bg-primary-50 dark:bg-primary-900/20"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(b.startDate), "d MMMM yyyy", {
                          locale: uk,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(b.startDate), "HH:mm")}
                      </p>
                      <p className="text-sm font-medium">
                        {b.user ? `${b.user.firstName} ${b.user.lastName}` : ""}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {b.description}
                      </p>
                      <Badge className="mt-1">
                        {t(`status.${b.status.toLowerCase()}`)}
                      </Badge>
                    </div>

                    {b.status === BookingStatus.PENDING &&
                      profile &&
                      b.userId === profile.id && (
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          onPress={() => handleDeleteBooking(b.id)}
                          disabled={busy}
                        >
                          {t("cancel")}
                        </Button>
                      )}
                  </div>
                ))}

              {!bookings.length && (
                <p className="text-sm text-center text-muted-foreground">
                  {t("noBookings")}
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};
