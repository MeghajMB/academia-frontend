
import React from "react";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-10">{children}</div>
    </>
  );
}

export default HomeLayout;
