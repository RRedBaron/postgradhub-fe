"use client";

import { useProfile } from "@/lib/hooks/useProfile";
import { Button, Input, Select, SelectItem, Avatar, Chip } from "@heroui/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Role } from "@/types/default";

const genderOptions = [
  { key: "male", label: "Male" },
  { key: "female", label: "Female" },
  { key: "other", label: "Other" },
];
const countryOptions = [
  { key: "ru", label: "Russia" },
  { key: "us", label: "USA" },
  { key: "de", label: "Germany" },
  // ...
];
const languageOptions = [
  { key: "ru", label: "Russian" },
  { key: "en", label: "English" },
  { key: "de", label: "German" },
  // ...
];
const timezoneOptions = [
  { key: "utc+3", label: "UTC+3" },
  { key: "utc+0", label: "UTC+0" },
  { key: "utc-5", label: "UTC-5" },
  // ...
];

const groupOptions = [
  { key: "group1", label: "Group 1" },
  { key: "group2", label: "Group 2" },
  { key: "group3", label: "Group 3" },
];

const getRoleColor = (role: Role) => {
  switch (role) {
    case Role.PhD:
      return "primary";
    case Role.SUPERVISOR:
      return "success";
    case Role.HEAD:
      return "warning";
    default:
      return "default";
  }
};

export default function Profile() {
  const { data } = useProfile();
  const t = useTranslations("profile");
  const [editMode, setEditMode] = useState(false);

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row bg-gradient-to-r from-[#191919] to-[#23272f] rounded-xl p-8 items-center gap-8 shadow-lg">
        <Avatar size="lg" src={data?.avatarUrl} />
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              {data?.firstname} {data?.lastname}
            </span>
            {data?.role && (
              <Chip color={getRoleColor(data.role)} variant="flat">
                {data.role}
              </Chip>
            )}
          </div>
          <span className="text-md text-zinc-400">{data?.email}</span>
        </div>
        <Button color="primary" onPress={() => setEditMode((v) => !v)}>
          {editMode ? t("save") : t("edit")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t("fullName")}
          placeholder="Your First Name"
          value={data?.firstname || ""}
          isReadOnly={!editMode}
        />
        <Input
          label={t("email")}
          placeholder="Your Email"
          value={data?.email || ""}
          isReadOnly={!editMode}
        />
        <Input
          label={t("phone")}
          placeholder="Your Phone Number"
          value={data?.phone || ""}
          isReadOnly={!editMode}
        />

        <Select
          label={t("group")}
          selectedKeys={data?.group ? [data.group] : []}
          isDisabled={true}
        >
          {groupOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-lg text-white mb-2">
          {t("myEmail")}
        </h3>
        <div className="flex items-center gap-4 bg-zinc-800 rounded-lg p-4">
          <Avatar size="sm" />
          <div>
            <div className="text-white">{data?.email}</div>
            <div className="text-xs text-zinc-400">1 month ago</div>
          </div>
        </div>
        <Button className="mt-4" color="primary" variant="flat">
          {t("addEmail")}
        </Button>
      </div>
    </section>
  );
}
