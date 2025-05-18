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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
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
    <section className="flex flex-col w-full items-center justify-center py-8">
      <div className="w-full max-w-[480px] rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            PostgradHub
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-row justify-between w-full items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("login")}
            </h2>
            <Link
              className="text-blue-600 hover:text-blue-700 transition-colors"
              href="/auth/signup"
            >
              {t("signUp")}
            </Link>
          </div>

          <Input
            isRequired
            label={t("email")}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: emailRegex,
                message: "Invalid email address",
              },
            })}
            placeholder="example_email@gmail.com"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />

          <Input
            isRequired
            type="password"
            label={t("password")}
            {...register("password", {
              required: "Password is required",
            })}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <Button
            type="submit"
            color="primary"
            variant="flat"
            className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            disabled={isPending}
          >
            {isPending ? t("signingIn") : t("signIn")}
          </Button>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {t("loginFailed")}: {error.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
