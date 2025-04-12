
import React from "react";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pt-10 mx-10">{children}</div>
    </>
  );
}

export default HomeLayout;
