import { FaSearch, FaHome, FaInfoCircle, FaRegBuilding, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setMobileMenuOpen(false);
  };

  // Get search term from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Add scroll effect to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if a navigation item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:py-5">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className={`h-8 w-8 rounded-full ${isScrolled ? 'bg-blue-600' : 'bg-white'} flex items-center justify-center mr-2`}>
                <FaRegBuilding className={`${isScrolled ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <h1 className="font-bold text-sm sm:text-xl">
                <span className={isScrolled ? 'text-blue-600' : 'text-blue-100'}>SRI</span>
                <span className={isScrolled ? 'text-slate-700' : 'text-white'}>Estate</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center text-sm font-medium transition-colors duration-300
                ${isActive('/') 
                ? (isScrolled ? 'text-blue-600' : 'text-white font-bold') 
                : (isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-blue-100 hover:text-white')}`}
            >
              <FaHome className="mr-1" />
              Home
            </Link>
            <Link 
              to="/search" 
              className={`flex items-center text-sm font-medium transition-colors duration-300
                ${isActive('/search') 
                ? (isScrolled ? 'text-blue-600' : 'text-white font-bold') 
                : (isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-blue-100 hover:text-white')}`}
            >
              <FaSearch className="mr-1" />
              Properties
            </Link>
            <Link 
              to="/about" 
              className={`flex items-center text-sm font-medium transition-colors duration-300
                ${isActive('/about') 
                ? (isScrolled ? 'text-blue-600' : 'text-white font-bold') 
                : (isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-blue-100 hover:text-white')}`}
            >
              <FaInfoCircle className="mr-1" />
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSubmit}
            className={`hidden md:flex items-center rounded-lg overflow-hidden ${
              isScrolled ? 'bg-gray-100' : 'bg-white bg-opacity-20'
            }`}
          >
            <input
              type="text"
              placeholder="Search for properties..."
              className={`px-4 py-2 text-sm focus:outline-none w-56 ${
                isScrolled ? 'bg-gray-100 text-gray-800' : 'bg-transparent placeholder-blue-100 text-white'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className={`px-4 py-2 text-sm flex items-center transition-colors duration-200 ${
                isScrolled 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-white bg-opacity-30 text-white hover:bg-opacity-40'
              }`}
            >
              <FaSearch className="mr-1" />
              Search
            </button>
          </form>

          {/* User Menu */}
          <div className="flex items-center">
            <Link to="/profile" className="flex items-center">
              {currentUser ? (
                <div className="flex items-center">
                  <img
                    className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm"
                    src={currentUser.avatar}
                    alt="profile"
                  />
                  <span className={`ml-2 font-medium text-sm hidden lg:inline ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}>
                    {currentUser.username}
                  </span>
                </div>
              ) : (
                <button className={`flex items-center py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300 ${
                  isScrolled 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}>
                  <FaUserCircle className="mr-1" />
                  Sign in
                </button>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="ml-4 md:hidden"
            >
              {mobileMenuOpen ? (
                <FaTimes className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <FaBars className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        ref={navRef}
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96' : 'max-h-0'
        } bg-white shadow-lg`}
      >
        <div className="px-4 pt-4 pb-6 space-y-3">
          <form
            onSubmit={handleSubmit}
            className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search properties..."
              className="flex-1 px-4 py-2 text-sm bg-transparent focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm"
            >
              <FaSearch />
            </button>
          </form>
          
          <div className="border-t border-gray-200 pt-3">
            <Link 
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center py-3 ${
                isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <FaHome className="mr-3" />
              Home
            </Link>
            <Link 
              to="/search" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center py-3 ${
                isActive('/search') ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <FaSearch className="mr-3" />
              Properties
            </Link>
            <Link 
              to="/about"
              onClick={() => setMobileMenuOpen(false)} 
              className={`flex items-center py-3 ${
                isActive('/about') ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <FaInfoCircle className="mr-3" />
              About
            </Link>
            {currentUser && (
              <Link 
                to="/profile"
                onClick={() => setMobileMenuOpen(false)} 
                className={`flex items-center py-3 ${
                  isActive('/profile') ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                <FaUserCircle className="mr-3" />
                My Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
