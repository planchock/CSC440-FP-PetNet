import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";

function Header({ children }) {
  return (
    <>
      <div className="z-10 max-w-5xl mx-auto">
        <Link to="/" className="block">
          <h1 className="max-w-5xl pt-8 mx-auto text-5xl font-extrabold">
            <span className="text-pink-400">Pet</span>
            <span className="text-white">Net</span>
          </h1>
        </Link>
      </div>
      {children}
    </>
  );
}

export default Header;
