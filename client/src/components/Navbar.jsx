/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const Navbar = ({ btnText }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-white text-lg font-bold">
            <Link to="/">Imagify</Link>
          </span>
        </div>
        <div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            {btnText === "Create" ? (
              <Link to="/">{btnText}</Link>
            ) : (
              <Link to="/community">{btnText}</Link>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
