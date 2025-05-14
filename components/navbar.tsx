"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import { GB, UA } from "country-flag-icons/react/3x2";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { Button } from "@heroui/button";
import { Link } from "@/i18n/navigation";
import {
  Avatar,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
} from "@heroui/react";
import { useProfile } from "@/lib/hooks/useProfile";
import { useLogout } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/common/enums/routes";
import { addToast } from "@heroui/toast";
import { useLanguage } from "@/lib/contexts/language-context";
import { useTranslations } from "next-intl";

const languageOptions = [
  { key: "en", label: "English", flag: GB },
  { key: "uk", label: "Українська", flag: UA },
];

export const Navbar = () => {
  const { data, isLoading } = useProfile();
  const { mutate: logoutUser } = useLogout();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const t = useTranslations("common");

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        router.push(ROUTES.LOGIN);
        addToast({
          title: "Logged out successfully",
          description: t("loggedOut"),
          color: "success",
        });
      },
    });
  };

  const LanguageSelector = () => {
    const selectedOption = languageOptions.find((opt) => opt.key === language);
    const Flag = selectedOption?.flag;

    return (
      <Select
        selectedKeys={[language]}
        onChange={(e) => setLanguage(e.target.value as "en" | "uk")}
        className="w-32"
        classNames={{
          trigger: "min-h-unit-10 h-unit-10",
          value: "flex items-center gap-2",
        }}
        renderValue={(items) => {
          return items.map((item) => {
            const Flag = languageOptions.find(
              (opt) => opt.key === item.key
            )?.flag;
            return (
              <div key={item.key} className="flex items-center gap-2">
                {Flag && <Flag className="w-4 h-4" />}
                <span>{item.textValue}</span>
              </div>
            );
          });
        }}
      >
        {languageOptions.map((opt) => {
          const Flag = opt.flag;
          return (
            <SelectItem key={opt.key} textValue={opt.label}>
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                <span>{opt.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </Select>
    );
  };

  return (
    <HeroUINavbar maxWidth="2xl" position="sticky" isBordered className="py-2">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex items-center justify-center gap-4" href="/">
            <Logo size={48} />
            <p className="font-bold text-inherit">PostgradHub</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {isLoading ? (
          <div className="flex items-center gap-2" />
        ) : data ? (
          <>
            <NavbarItem className="hidden sm:flex gap-2">
              <ThemeSwitch />
            </NavbarItem>
            <NavbarItem>
              <LanguageSelector />
            </NavbarItem>
            {data.role === "PhD" && (
              <>
                <NavbarItem>
                  <Button
                    as={Link}
                    color="primary"
                    href={ROUTES.ASSIGNMENTS}
                    variant="flat"
                  >
                    {t("assignments")}
                  </Button>
                </NavbarItem>
                <NavbarItem>
                  <Button
                    as={Link}
                    color="primary"
                    href={ROUTES.DISSERTATION}
                    variant="flat"
                  >
                    {t("dissertation")}
                  </Button>
                </NavbarItem>
              </>
            )}
            {data.role === "SUPERVISOR" && (
              <NavbarItem>
                <Button
                  as={Link}
                  color="secondary"
                  href={ROUTES.SUPERVISOR}
                  variant="flat"
                >
                  Control Panel
                </Button>
              </NavbarItem>
            )}
            {data.role === "HEAD" && (
              <NavbarItem>
                <Button
                  as={Link}
                  color="primary"
                  href={ROUTES.HEAD}
                  variant="flat"
                >
                  {t("head")}
                </Button>
              </NavbarItem>
            )}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  onPress={() => router.push(ROUTES.PROFILE)}
                >
                  {t("profile")}
                  <Divider className="mt-2" />
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                >
                  {t("logout")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <>
            <NavbarItem className="hidden sm:flex gap-2">
              <ThemeSwitch />
            </NavbarItem>
            <NavbarItem>
              <LanguageSelector />
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href={ROUTES.LOGIN}
                variant="flat"
              >
                {t("signIn")}
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </HeroUINavbar>
  );
};
