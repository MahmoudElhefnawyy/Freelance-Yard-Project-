import { Link } from "wouter";

interface HeaderProps {
  activeLink: "home" | "events" | "venues" | "contact";
}

const Header = ({ activeLink }: HeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-primary-500 font-bold text-2xl">EventFinder</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`${activeLink === "home" ? "text-primary-500 border-b-2 border-primary-500 pb-1" : "text-gray-700 hover:text-primary-500"} font-medium`}>
              Home
            </Link>
            <Link href="/events" className={`${activeLink === "events" ? "text-primary-500 border-b-2 border-primary-500 pb-1" : "text-gray-700 hover:text-primary-500"} font-medium`}>
              Events
            </Link>
            <Link href="/venues" className={`${activeLink === "venues" ? "text-primary-500 border-b-2 border-primary-500 pb-1" : "text-gray-700 hover:text-primary-500"} font-medium`}>
              Venues
            </Link>
            <Link href="/contact" className={`${activeLink === "contact" ? "text-primary-500 border-b-2 border-primary-500 pb-1" : "text-gray-700 hover:text-primary-500"} font-medium`}>
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="hidden md:block bg-white text-primary-500 border border-primary-500 px-4 py-2 rounded-md font-medium hover:bg-primary-50 transition">
              Log in
            </button>
            <button className="hidden md:block bg-primary-500 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-600 transition">
              Sign up
            </button>
            <button className="md:hidden text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
