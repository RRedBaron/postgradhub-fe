import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Tooltip,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/common/enums/routes";

interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  description: string;
}

interface AssignmentCardProps {
  assignment: Assignment;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "submitted":
      return "primary";
    case "graded":
      return "success";
    default:
      return "default";
  }
};

export const AssignmentCard = ({ assignment }: AssignmentCardProps) => {
  const t = useTranslations("assignments");
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(assignment.dueDate);

  return (
    <Card
      className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white dark:bg-content2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
      isPressable
      onPress={() => router.push(`${ROUTES.ASSIGNMENTS}/${assignment.id}`)}
    >
      <CardHeader className="flex gap-3 border-b border-default-200 bg-default-50 dark:bg-default-100/20 px-4 py-3">
        <div className="flex flex-col">
          <p className="text-md font-bold text-foreground-900 dark:text-foreground">
            {assignment.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-small text-foreground-700 dark:text-default-400">
              {assignment.subject}
            </p>
            <Tooltip content={t("clickToViewDetails")}>
              <Chip
                size="sm"
                color={getStatusColor(assignment.status)}
                variant="flat"
                className="font-medium shadow-sm"
              >
                {t(`status.${assignment.status}`)}
              </Chip>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-4 py-4">
        <p className="text-small text-foreground-700 dark:text-foreground-400 mb-4">
          {assignment.description}
        </p>
        <div className="flex flex-col gap-3 text-small bg-default-50 dark:bg-default-100/20 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-foreground-700 dark:text-default-400 font-medium">
              {t("dueDate")}:
            </span>
            <span
              className={
                daysRemaining <= 3
                  ? "text-danger-700 dark:text-danger font-semibold"
                  : "text-foreground-700 dark:text-default-400"
              }
            >
              {formatDate(assignment.dueDate)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground-700 dark:text-default-400 font-medium">
              {t("daysRemaining")}:
            </span>
            <span
              className={
                daysRemaining <= 3
                  ? "text-danger-700 dark:text-danger font-semibold"
                  : "text-foreground-700 dark:text-default-400"
              }
            >
              {daysRemaining} {t("days")}
            </span>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between items-center border-t border-default-200 bg-default-50 dark:bg-default-100/20 px-4 py-3">
        <Tooltip content={t("viewDetails")}>
          <Chip
            size="sm"
            variant="flat"
            color="primary"
            className="font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            {t("viewDetails")}
          </Chip>
        </Tooltip>
        {daysRemaining <= 3 && (
          <Chip
            size="sm"
            color="danger"
            variant="flat"
            className="font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            {t("urgent")}
          </Chip>
        )}
      </CardFooter>
    </Card>
  );
};
