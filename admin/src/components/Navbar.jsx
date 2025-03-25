import { BellIcon, MenuAlt1Icon } from "@heroicons/react/outline";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ pageTitle, toggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-200"
          onClick={toggleSidebar}
        >
          <MenuAlt1Icon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-700">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <BellIcon className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}

        <div className="relative">
          <Link
            to="/profile"
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src="/assets/img/logo.jpg"
              alt="User"
              className="w-10 h-10 rounded-full border"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
