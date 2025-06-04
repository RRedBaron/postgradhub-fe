"use client";

import React, { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";
import { FileUploaderMinimal } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

interface Doc {
  id: string;
  name: string;
  status: "pending" | "uploaded";
  fileUrl?: string;
}

interface UploadcareFile {
  cdnUrl: string;
}

export function DissertationFlow() {
  const t = useTranslations("dissertation");
  const initialDocs: Doc[] = [
    { id: "autoref", name: t("autoref"), status: "pending" },
    { id: "review", name: t("review"), status: "pending" },
    { id: "feedback", name: t("feedback"), status: "pending" },
  ];
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  const handleUploadSuccess = (docId: string, file: UploadcareFile) => {
    setDocs(
      docs.map((d) =>
        d.id === docId ? { ...d, status: "uploaded", fileUrl: file.cdnUrl } : d
      )
    );
    setUploadingDocId(null);
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload failed:", error);
    setUploadingDocId(null);
  };

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">{t("documentFlow")}</h3>
      {docs.map((doc) => (
        <Card key={doc.id}>
          <CardBody className="flex justify-between items-center">
            <span>{doc.name}</span>
            {doc.status === "pending" ? (
              <div className="flex items-center gap-2">
                <FileUploaderMinimal
                  sourceList="local, camera, facebook, gdrive"
                  pubkey="a33fe610c62b2d39b4e9"
                  onFileUploadSuccess={(file) =>
                    handleUploadSuccess(doc.id, file)
                  }
                  className="w-full"
                />
                {uploadingDocId === doc.id && (
                  <span className="text-small text-default-500">
                    Uploading...
                  </span>
                )}
              </div>
            ) : (
              <span className="flex items-center gap-2 text-green-600">
                {t("uploaded")}
              </span>
            )}
          </CardBody>
        </Card>
      ))}
    </section>
  );
}
