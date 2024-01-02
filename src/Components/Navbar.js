import React, { useState, useRef, useEffect } from "react";
import { FaGithub } from "react-icons/fa"; 

// Navbar component
const Navbar = ({ grouping: propGrouping, setGrouping, ordering: propOrdering, setOrdering, call }) => {
  // State for managing dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Ref for handling click outside dropdown
  const dropdownRef = useRef(null);

  // Get initial grouping and ordering values from localStorage or props
  const initialGrouping = localStorage.getItem("grouping") || propGrouping;
  const initialOrdering = localStorage.getItem("ordering") || propOrdering;

  // State for tracking grouping and ordering with localStorage sync
  // eslint-disable-next-line
  const [grouping, setLocalGrouping] = useState(initialGrouping);
  // eslint-disable-next-line
  const [ordering, setLocalOrdering] = useState(initialOrdering);

  // Effect to sync grouping changes with localStorage and parent component
  useEffect(() => {
    localStorage.setItem("grouping", grouping);
    setGrouping(grouping);
    // eslint-disable-next-line
  }, [grouping]);

  // Effect to sync ordering changes with localStorage and parent component
  useEffect(() => {
    localStorage.setItem("ordering", ordering);
    setOrdering(ordering);
    // eslint-disable-next-line
  }, [ordering]);

  // Handlers
  // Handle grouping change
  const handleGrouping = (event) => {
    const newValue = event.target.value;
    localStorage.setItem("grouping", newValue);
    setGrouping(newValue);
    // Call the provided callback function when grouping is changed to "users"
    if (newValue === "users") {
      call();
    }
  };

  // Handle ordering change
  const handleOrdering = (event) => {
    const newValue = event.target.value;
    localStorage.setItem("ordering", newValue);
    setOrdering(newValue);
  };

  // Effect to close the dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // JSX for the Navbar component
  return (
    <div className="Navbar">
      <div className="dropdown-container" ref={dropdownRef}>
        <button onClick={() => setIsOpen(!isOpen)} className="dropdown-btn">
          <i className="bx bx-slider"></i>
          <div className="btn-txt">Display</div>
          <i className="bx bx-chevron-down"></i>
        </button>
        {isOpen && (
          <div className="dropdown-content">
            {/* Grouping dropdown section */}
            <div className="Grouping">
              <label>Grouping</label>
              <select value={propGrouping} onChange={handleGrouping}>
                <option value="status">Status</option>
                <option value="users">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            {/* Ordering dropdown section */}
            <div className="Ordering">
              <label>Ordering</label>
              <select value={propOrdering} onChange={handleOrdering}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
            {/* GitHub icon and link with inline styling */}
            <a
              href="https://github.com/PKSharma96/kanban-board"
              target="_blank"
              rel="noopener noreferrer"
              className="github-icon"
              style={{ marginLeft: "15px", fontSize: "50px", color: "#000" }}
            >
              <FaGithub />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
