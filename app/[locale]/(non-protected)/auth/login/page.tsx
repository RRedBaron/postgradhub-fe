"use client";

import { ROUTES } from "@/common/enums/routes";
import { emailRegex } from "@/constants";
import { Link } from "@/i18n/navigation";
import { useLogin } from "@/lib/hooks";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { mutate: loginUser, isPending, error } = useLogin();
  const router = useRouter();
  const t = useTranslations("auth");

  const { register, handleSubmit } = useForm<LoginForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginUser(data, {
      onSuccess: () => {
        addToast({
          title: t("welcome"),
          description: t("loggedIn"),
          color: "success",
        });
        router.push(ROUTES.HOME);
      },
    });
  };

  return (
    <section className="flex flex-col w-full items-center justify-center gap-4 py-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>

      <form
        className="flex flex-col w-1/3 flex-wrap md:flex-nowrap gap-4 pt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-row justify-between w-full">
          <p>{t("login")}</p>
          <Link className="text-blue-500" href="/auth/signup">
            {t("signUp")}
          </Link>
        </div>
        <Input
          isRequired
          label={t("email")}
          {...register("email", {
            validate: (value) =>
              emailRegex.test(value) || "Invalid email address",
          })}
        />
        <Input
          isRequired
          type="password"
          label={t("password")}
          id="password"
          {...register("password")}
        />
        <Button color="primary" variant="flat" className="w-full" type="submit">
          {t("signIn")}
        </Button>
      </form>
    </section>
  );
}
