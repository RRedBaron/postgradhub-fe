"use client";

import React, { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";

interface Doc {
  id: string;
  name: string;
  status: "pending" | "uploaded";
}

export function DissertationFlow() {
  const t = useTranslations("dissertation");
  const initialDocs: Doc[] = [
    { id: "autoref", name: t("autoref"), status: "pending" },
    { id: "review", name: t("review"), status: "pending" },
    { id: "feedback", name: t("feedback"), status: "pending" },
  ];
  const [docs, setDocs] = useState<Doc[]>(initialDocs);

  const handleUpload = (id: string, file: File) => {
    setDocs(docs.map((d) => (d.id === id ? { ...d, status: "uploaded" } : d)));
  };

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">{t("documentFlow")}</h3>
      {docs.map((doc) => (
        <Card key={doc.id} variant="flat">
          <CardBody className="flex justify-between items-center">
            <span>{doc.name}</span>
            {doc.status === "pending" ? (
              <label className="flex items-center gap-2 text-primary cursor-pointer">
                <Upload className="w-5 h-5" />
                {t("upload")}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) handleUpload(doc.id, file);
                  }}
                />
              </label>
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
