import React from "react";

interface HeaderProps{
    children: React.ReactNode;
}
export default function Header({children}: HeaderProps) {
  return (
    // <div>hai kamu udah di dashboard</div>
    <>
      <header className="bg-gradient-to-r from-[#A5C5FF] to-[#0038A5] px-4 py-4">
        Learning Path
      </header>
      <main>
        {children}
      </main>
    </>
  );
}
