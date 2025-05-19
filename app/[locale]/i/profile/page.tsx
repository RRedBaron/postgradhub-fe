"use client";

import { useProfile, useUpdateProfile } from "@/lib/hooks/useProfile";
import { Button, Input, Select, SelectItem, Avatar, Chip } from "@heroui/react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Gender, Role } from "@/types/default";
import { PatternFormat } from "react-number-format";
import { addToast } from "@heroui/toast";

const genderOptions = [
  { key: Gender.MALE, label: "Male" },
  { key: Gender.FEMALE, label: "Female" },
  { key: Gender.OTHER, label: "Other" },
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

const ProfileSkeleton = () => {
  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const t = useTranslations("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    secondName: "",
    email: "",
    phone: "",
    gender: Gender.OTHER,
    group: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        secondName: profile.secondName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        gender: profile.gender || Gender.OTHER,
        group: profile.group || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!profile) return;

    updateProfile(
      {
        ...profile,
        ...formData,
      },
      {
        onSuccess: () => {
          setEditMode(false);
          addToast({
            title: "Success",
            description: "Profile updated successfully",
            color: "success",
          });
        },
        onError: (error) => {
          addToast({
            title: "Error",
            description: "Failed to update profile",
            color: "danger",
          });
        },
      }
    );
  };

  if (isLoading || !profile) {
    return <ProfileSkeleton />;
  }

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
        <Avatar
          size="lg"
          src={"https://i.pravatar.cc/150?u=a042581f4e29026704d"}
        />
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">
              {formData.firstName} {formData.lastName}
            </span>
            {profile.role && (
              <Chip color={getRoleColor(profile.role)} variant="flat">
                {profile.role}
              </Chip>
            )}
          </div>
          <span className="text-md text-gray-500 dark:text-gray-400">
            {formData.email}
          </span>
        </div>
        <Button
          color="primary"
          onPress={() => (editMode ? handleSave() : setEditMode(true))}
          isLoading={isPending}
        >
          {editMode ? t("save") : t("edit")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t("fullName")}
          placeholder="Your First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          isReadOnly={!editMode}
        />
        <Input
          label={t("lastName")}
          placeholder="Your Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          isReadOnly={!editMode}
        />
        <Input
          label={t("secondName")}
          placeholder="Your Second Name"
          value={formData.secondName}
          onChange={(e) => handleInputChange("secondName", e.target.value)}
          isReadOnly={!editMode}
        />
        <Input
          label={t("email")}
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          isReadOnly={!editMode}
        />
        <div>
          <label className="block text-sm font-medium mb-1">{t("phone")}</label>
          <PatternFormat
            format="+38 (###) ###-##-##"
            mask="_"
            customInput={Input}
            value={formData.phone}
            onValueChange={(values) => {
              handleInputChange("phone", values.value);
            }}
            placeholder="+38 (000) 000-00-00"
            isReadOnly={!editMode}
            allowEmptyFormatting={editMode}
          />
        </div>

        <Select
          label={t("gender")}
          selectedKeys={formData.gender ? [formData.gender] : []}
          onChange={(e) => handleInputChange("gender", e.target.value)}
          isDisabled={!editMode}
        >
          {genderOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>

        <Select
          label={t("group")}
          selectedKeys={formData.group ? [formData.group] : []}
          onChange={(e) => handleInputChange("group", e.target.value)}
          isDisabled={!editMode}
        >
          {groupOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </div>
    </section>
  );
}
