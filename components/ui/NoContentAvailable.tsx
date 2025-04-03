import React from "react";

function NoContentAvailable({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl border-default-700">
      <p className="text-xl text-default-900">{title}</p>
      <p className="text-sm text-default-700">{content}</p>
    </div>
  );
}

export default NoContentAvailable;
