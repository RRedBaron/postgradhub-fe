"use client";

import { ROUTES } from "@/common/enums/routes";
import { emailRegex } from "@/constants";
import { useLogin } from "@/lib/hooks";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { mutate: loginUser, isPending, error } = useLogin();
  const router = useRouter();

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
          title: "Welcome to PostgradHub!",
          description: "You have successfully logged in.",
          color: "success",
        });
        router.push(ROUTES.HOME);
      },
    });
  };

  return (
    <section className="flex flex-col w-full items-center justify-center gap-4 py-8">
      <h1 className="text-3xl font-bold">PostgradHub</h1>

      <form
        className="flex flex-col w-1/3 flex-wrap md:flex-nowrap gap-4 pt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-row justify-between w-full">
          <p>Log in</p>
          <Link className="text-blue-500" href="/auth/signup">
            Sign Up
          </Link>
        </div>
        <Input
          isRequired
          label="Email"
          {...register("email", {
            validate: (value) =>
              emailRegex.test(value) || "Invalid email address",
          })}
        />
        <Input
          isRequired
          type="password"
          label="Password"
          id="password"
          {...register("password")}
        />
        <Button color="primary" variant="flat" className="w-full" type="submit">
          Sign in
        </Button>
      </form>
    </section>
  );
}
