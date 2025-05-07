"use client";

import { emailRegex } from "@/constants";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { RegisterRequest } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { useRegister } from "@/lib/hooks/useAuth";
import { ROUTES } from "@/common/enums/routes";

interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAndConditions: boolean;
}

export default function SignUp() {
  const router = useRouter();
  const { mutate: registerUser, isPending, error } = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAndConditions: false,
    },
  });

  const onSubmit = (data: SignUpForm) => {
    if (!data.termsAndConditions) {
      alert("You must agree to the Terms and Conditions");
      return;
    }

    const registerData: RegisterRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    };

    registerUser(registerData, {
      onSuccess: () => {
        router.push(ROUTES.HOME);
      },
      onError: (err) => {
        console.error("Registration error:", err);
      },
    });
  };

  return (
    <section className="flex flex-col w-full items-center justify-center gap-4 py-8">
      <h1 className="text-3xl font-bold">PostgradHub</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[480px]">
        <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4 pt-6">
          <div className="flex flex-row justify-between w-full">
            <p>Sign Up</p>
            <Link className="text-blue-500" href="/auth/login">
              Log in
            </Link>
          </div>
          <div className="flex flex-row justify-between w-full gap-4">
            <div className="flex-1">
              <Input
                isRequired
                label="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                placeholder="John"
                isInvalid={!!errors.firstName}
                errorMessage={errors.firstName?.message}
              />
            </div>
            <div className="flex-1">
              <Input
                isRequired
                label="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                placeholder="Doe"
                isInvalid={!!errors.lastName}
                errorMessage={errors.lastName?.message}
              />
            </div>
          </div>
          <Input
            isRequired
            label="Email"
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
            label="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
          <Input
            isRequired
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          />
          <div className="flex flex-row gap-1 items-center">
            <Checkbox
              {...register("termsAndConditions", {
                required: "You must agree to the Terms and Conditions",
              })}
            />
            <p>
              I agree to the{" "}
              <Link className="text-blue-500" href="/terms">
                Terms and Conditions
              </Link>
            </p>
            {errors.termsAndConditions && (
              <p className="text-red-500 text-sm">
                {errors.termsAndConditions.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            color="primary"
            variant="flat"
            className="mt-6"
            disabled={isPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
          {error && (
            <p className="text-red-500 text-sm mt-2">
              Registration failed: {error.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
