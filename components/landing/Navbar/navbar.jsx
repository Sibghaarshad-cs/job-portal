import Logo from "./logo";

import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-50">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        <Logo />

        

        <AuthButtons />

      </div>

    </header>
  );
}