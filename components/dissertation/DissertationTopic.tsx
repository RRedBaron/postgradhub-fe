"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import { Button } from "@heroui/button";
import { FileUploaderMinimal } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

interface Submission {
  fileName: string;
  fileUrl: string;
  status: "pending" | "approved";
  comments: string[];
}

export function DissertationTopic() {
  const t = useTranslations("dissertationTopic");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  const deadline = new Date(2025, 4, 20);

  const handleFileChange = () => {
    setIsUploading(true);
  };

  const handleUploadSuccess = (file: { cdnUrl: string }) => {
    const url = file.cdnUrl;
    const name = url.split("/").pop() || "unknown";
    setSelectedFileName(name);
    setSelectedFileUrl(url);
    setIsUploading(false);
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload failed:", error);
    setIsUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileName || !selectedFileUrl) return;

    setSubmission({
      fileName: selectedFileName,
      fileUrl: selectedFileUrl,
      status: "pending",
      comments: [],
    });
    setSelectedFileName(null);
    setSelectedFileUrl(null);
  };

  const handleCancelSelection = () => {
    setSelectedFileName(null);
    setSelectedFileUrl(null);
  };

  const renderPreview = () => {
    if (!selectedFileUrl || !selectedFileName) return null;
    const ext = selectedFileName.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return (
        <img
          src={selectedFileUrl}
          alt="Preview"
          className="max-h-40 object-contain border"
        />
      );
    } else if (ext === "pdf") {
      return (
        <iframe
          src={selectedFileUrl}
          className="w-full h-48 border"
          title="PDF Preview"
        />
      );
    } else {
      return <p className="text-sm text-default-500">{selectedFileName}</p>;
    }
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
            <div className="flex flex-col gap-2">
              <label className="text-small text-default-500">{t("file")}</label>
              <FileUploaderMinimal
                sourceList="local, camera, facebook, gdrive"
                pubkey="a33fe610c62b2d39b4e9"
                onChange={handleFileChange}
                onFileUploadSuccess={handleUploadSuccess}
                onFileUploadError={handleUploadError}
                className="w-full"
              />
              {isUploading && (
                <div className="text-small text-default-500">
                  {t("uploading")}...
                </div>
              )}
              {selectedFileUrl && (
                <div className="mt-2">
                  {renderPreview()}
                  <Button
                    size="xs"
                    variant="flat"
                    color="danger"
                    onPress={handleCancelSelection}
                    className="mt-2"
                  >
                    {t("cancelSelection")}
                  </Button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="md"
              variant="flat"
              color="primary"
              disabled={!selectedFileUrl || isUploading}
            >
              {t("submit")}
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
                className={`text-sm font-semibold ${
                  submission.status === "pending"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
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
