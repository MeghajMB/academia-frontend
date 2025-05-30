import { Card, CardBody } from "@heroui/react";
import React from "react";

function GigDetailCardSection({ heading, content,Icon }) {
  return (
    <Card className="bg-content2">
      <CardBody className="p-4 flex items-center gap-3">
        {Icon}
        <div>
          <p className="text-sm text-default-500">{heading}</p>
          <p className="font-semibold">{content}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export default GigDetailCardSection;
