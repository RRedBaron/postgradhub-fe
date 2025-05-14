"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Upload } from "lucide-react";

interface Submission {
  fileName: string;
  status: "pending" | "approved";
  comments: string[];
}

export function DissertationTopic() {
  const t = useTranslations("dissertationTopic");
  const [file, setFile] = useState<File | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const deadline = new Date(2025, 4, 20); // 20 мая 2025
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const mockComments: string[] = [];
    setSubmission({
      fileName: file.name,
      status: "pending",
      comments: mockComments,
    });
    setFile(null);
  };

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">{t("uploadProposal")}</h2>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">{t("deadline")}:</span>{" "}
        <span className="text-orange-500">{deadline.toLocaleDateString()}</span>
      </p>
      <Card>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary transition">
              <Upload className="w-8 h-8 text-gray-500" />
              <span className="mt-2 text-sm text-gray-600">
                {file ? file.name : t("file")}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
                required
              />
            </label>
            {file && (
              <p className="text-sm text-gray-700">
                {t("mySubmission")} : {file.name}
              </p>
            )}
            <Button
              type="submit"
              variant="flat"
              className="w-full flex items-center justify-center gap-2"
              disabled={!file || Boolean(submission)}
            >
              <Upload className="w-5 h-5" />
              {t("submitDocument")}
            </Button>
          </form>
        </CardBody>
      </Card>

      {submission && (
        <Card className="space-y-2">
          <CardHeader className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{submission.fileName}</h3>
              <p
                className={`text-sm font-semibold ${submission.status === "pending" ? "text-yellow-600" : "text-green-600"}`}
              >
                {submission.status === "pending" ? t("pending") : t("approved")}
              </p>
            </div>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              onPress={() => setSubmission(null)}
            >
              {t("cancelUpload")}
            </Button>
          </CardHeader>
          <Divider />
          <CardBody>
            <h4 className="font-medium mb-2">{t("supervisorComments")}</h4>
            {submission.comments.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {submission.comments.map((comment, idx) => (
                  <li key={idx} className="text-sm">
                    {comment}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">{t("noComments")}</p>
            )}
          </CardBody>
        </Card>
      )}
    </section>
  );
}
