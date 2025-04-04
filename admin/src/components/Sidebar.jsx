import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  ClipboardListIcon,
  CubeIcon,
  ArchiveIcon,
  StarIcon,
  ChatAltIcon,
  ChartBarIcon,
  UserIcon,
} from "@heroicons/react/outline";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex justify-center items-center p-3 space-x-3 border-b">
          <img src="/assets/img/logo.png" alt="Logo" className="w-3/4" />
        </div>

        {/* Sidebar Menu */}
        <ul className="menu p-2 space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 text-base rounded-none py-3 px-4 transition ${
                  isActive
                    ? "bg-blue-100 text-gray-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <HomeIcon className="w-6 h-6" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 text-base rounded-none py-3 px-4 transition ${
                  isActive
                    ? "bg-blue-100 text-gray-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <ClipboardListIcon className="w-6 h-6" /> Order
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `flex items-center gap-3 text-base rounded-none py-3 px-4 transition ${
                  isActive
                    ? "bg-blue-100 text-gray-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <CubeIcon className="w-6 h-6" /> Category
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-3 text-base rounded-none py-3 px-4 transition ${
                  isActive
                    ? "bg-blue-100 text-gray-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <ArchiveIcon className="w-6 h-6" /> Product
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                `flex items-center gap-3 text-base rounded-none py-3 px-4 transition ${
                  isActive
                    ? "bg-blue-100 text-gray-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <StarIcon className="w-6 h-6" /> Reviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/feedbacks"
              className={({ isActive }) =>
                `flex items-center gap-3 text-base rounded-none py-3 px-4 transition ${
                  isActive
                    ? "bg-blue-100 text-gray-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <ChatAltIcon className="w-6 h-6" /> Feedbacks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/statistics"
              className={({ isActive }) =>
                `flex items-center gap-3 text-base rounded-none py-3 px-4 transition ${
                  isActive
                    ? "bg-blue-100 text-gray-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <ChartBarIcon className="w-6 h-6" /> Statistics
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-3 text-base rounded-none py-3 px-4 transition ${
                  isActive
                    ? "bg-blue-100 text-gray-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <UserIcon className="w-6 h-6" /> Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/discount-coupons"
              className={({ isActive }) =>
                `flex items-center gap-3 text-base rounded-none py-3 px-4 transition ${
                  isActive
                    ? "bg-blue-100 text-gray-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <UserIcon className="w-6 h-6" /> Discount Coupons
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/website-settings"
              className={({ isActive }) =>
                `flex items-center gap-3 text-base rounded-none py-3 px-4 transition ${
                  isActive
                    ? "bg-blue-100 text-gray-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <UserIcon className="w-6 h-6" /> Website Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
