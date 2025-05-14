"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";

interface Publication {
  id: number;
  title: string;
  link: string;
}

export function DissertationPublications() {
  const t = useTranslations("dissertation");
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const addPub = () => {
    if (!title || !link) return;
    setPubs([...pubs, { id: Date.now(), title, link }]);
    setTitle("");
    setLink("");
  };

  return (
    <section className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t("publications")}</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={t("publicationTitle")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder={t("publicationLink")}
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <Button onPress={addPub}>{t("addPublication")}</Button>
          </div>
          {pubs.map((pub) => (
            <Card key={pub.id} variant="flat">
              <CardBody className="flex justify-between">
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener"
                  className="underline text-primary"
                >
                  {pub.title}
                </a>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card>
    </section>
  );
}
