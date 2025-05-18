"use client";

import { emailRegex } from "@/constants";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Checkbox, Select, SelectItem } from "@heroui/react";
import { Link } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { RegisterRequest } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { useRegister } from "@/lib/hooks/useAuth";
import { ROUTES } from "@/common/enums/routes";
import { Gender, Role } from "@/types/default";
import { PatternFormat } from "react-number-format";

interface SignUpForm {
  firstName: string;
  lastName: string;
  secondName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  group: string;
  termsAndConditions: boolean;
}

export default function SignUp() {
  const router = useRouter();
  const { mutate: registerUser, isPending, error } = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpForm>({
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      secondName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      gender: Gender.OTHER,
      group: "",
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
      secondName: data.secondName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: Role.PhD,
      gender: data.gender,
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
    <section className="flex flex-col w-full items-center justify-center py-8">
      <div className="w-full max-w-[480px] rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            PostgradHub
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join our academic community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-row justify-between w-full items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create Account
            </h2>
            <Link
              className="text-blue-600 hover:text-blue-700 transition-colors"
              href="/auth/login"
            >
              Already have an account?
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
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
            <div>
              <Input
                label="Second Name"
                {...register("secondName")}
                placeholder="Ivanovich"
                isInvalid={!!errors.secondName}
                errorMessage={errors.secondName?.message}
              />
            </div>
          </div>

          <Input
            isRequired
            label="Last Name"
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Doe"
            isInvalid={!!errors.lastName}
            errorMessage={errors.lastName?.message}
          />

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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <PatternFormat
              format="+38 (###) ###-##-##"
              mask="_"
              customInput={Input}
              onValueChange={(values) => {
                setValue("phone", values.value);
              }}
              placeholder="+38 (000) 000-00-00"
              isInvalid={!!errors.phone}
              errorMessage={errors.phone?.message}
              {...register("phone", {
                required: "Phone number is required",
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Gender"
              {...register("gender", { required: "Please select your gender" })}
              placeholder="Select gender"
              isInvalid={!!errors.gender}
              errorMessage={errors.gender?.message}
            >
              <SelectItem key="Male">Male</SelectItem>
              <SelectItem key="Female">Female</SelectItem>
              <SelectItem key="Other">Other</SelectItem>
            </Select>

            <Select
              label="Group"
              {...register("group", { required: "Please select your group" })}
              placeholder="Select group"
              isInvalid={!!errors.group}
              errorMessage={errors.group?.message}
            >
              <SelectItem key="group1">Group 1</SelectItem>
              <SelectItem key="group2">Group 2</SelectItem>
              <SelectItem key="group3">Group 3</SelectItem>
            </Select>
          </div>

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

          <div className="flex flex-row gap-2 items-start">
            <Checkbox
              {...register("termsAndConditions", {
                required: "You must agree to the Terms and Conditions",
              })}
              classNames={{
                wrapper: "mt-1",
              }}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              I agree to the{" "}
              <Link
                className="text-blue-600 hover:text-blue-700 transition-colors"
                href="/terms"
              >
                Terms and Conditions
              </Link>
            </p>
          </div>
          {errors.termsAndConditions && (
            <p className="text-red-500 text-sm">
              {errors.termsAndConditions.message}
            </p>
          )}

          <Button
            type="submit"
            color="primary"
            variant="flat"
            className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            disabled={isPending}
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>

          {error && (
            <p className="text-red-500 text-sm text-center">
              Registration failed: {error.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
