import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import Navbar from "../Components/Navbar";
import CustomSpinner from "../Components/CustomSpinner";
import profile from "../Assets/profile.png";
import profile1 from "../Assets/profile1.png";
import profile4 from "../Assets/profile4.jpeg";
import profile5 from "../Assets/profile5.jpeg";
import profile6 from "../Assets/profile6.png";
import profile7 from "../Assets/profile7.png";
import { FETCH_URL } from "../Config";

const Dashboard = () => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({});
  const [user, setUser] = useState({});
  const [priority, setPriority] = useState({});
  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("priority");
  const [availableUser, setAvailableUser] = useState({});
  const [statusMapping, setStatusMapping] = useState({});
  const statusKeys = ["Backlog", "Todo", "In progress", "Done", "Canceled"];

// Effect to fetch data when grouping or ordering changes
useEffect(() => {
  getData();
  // eslint-disable-next-line 
}, [grouping, ordering]);


// Function to sort tickets by title
const sortByTitle = (tickets) => {
  return tickets.sort((a, b) => a.title.localeCompare(b.title));
};

// Function to group tickets by status
const groupByStatus = (tickets) => {
  let sortedTickets = tickets;

  // If ordering is based on title, sort the tickets by title
  if (ordering === "title") {
    sortedTickets = sortByTitle(tickets);
  }

  // Group tickets by status
  const grouped = sortedTickets.reduce((acc, ticket) => {
    if (!acc[ticket.status]) {
      acc[ticket.status] = [];
    }
    acc[ticket.status].push(ticket);
    return acc;
  }, {});

    statusKeys.forEach((key) => {
      if (!grouped[key]) {
        grouped[key] = [];
      }
    });

    if (ordering === "priority") {
      for (let key in grouped) {
        grouped[key].sort((a, b) => b.priority - a.priority);
      }
    }

    return {
      Keys: statusKeys,
      ...grouped,
    };
  };

  // Function to group tickets by priority
const groupByPriority = (tickets) => {
  // Initialize variable to store sorted tickets
  let sortedTickets = tickets;

  // Check if ordering is based on title and sort accordingly
  if (ordering === "title") {
    sortedTickets = sortByTitle(tickets);
  }

  // Use reduce to create an object with keys as priorities and values as arrays of tickets
  const priorityObject = sortedTickets.reduce((acc, ticket) => {
    // If priority key doesn't exist in the accumulator, create an empty array
    if (!acc[ticket.priority]) {
      acc[ticket.priority] = [];
    }
    
    // Push the current ticket to the corresponding priority array
    acc[ticket.priority].push(ticket);
    return acc;
  }, {});

  // Return an object with keys as priorities and the ticket arrays
  return {
    Keys: Object.keys(priorityObject),
    ...priorityObject,
  };
};


// Function to group tickets by user
const groupByUser = (tickets) => {
  // Initialize variable to store sorted tickets
  let sortedTickets = tickets;

  // Check if ordering is based on title and sort accordingly
  if (ordering === "title") {
    sortedTickets = sortByTitle(tickets);
  }

  // Use reduce to create an object with keys as user IDs and values as arrays of tickets
  const grouped = sortedTickets.reduce((acc, ticket) => {
    // If user ID key doesn't exist in the accumulator, create an empty array
    if (!acc[ticket.userId]) {
      acc[ticket.userId] = [];
    }
    
    // Push the current ticket to the corresponding user ID array
    acc[ticket.userId].push(ticket);
    return acc;
  }, {});

  // If ordering is based on priority, sort the ticket arrays by priority
  if (ordering === "priority") {
    for (let key in grouped) {
      grouped[key].sort((a, b) => b.priority - a.priority);
    }
  }

  // Return an object with keys as user IDs and the ticket arrays
  return {
    Keys: userData.map((user) => user.id.toString()),
    ...grouped,
  };
};


// Function to create a mapping of user availability
const availabilityMap = (users) => {
  // Use reduce to create an object with user IDs as keys and availability as values
  return users.reduce((acc, user) => {
    acc[user.id] = user.available;
    return acc;
  }, {});
};

// Function to extract status mapping from ticket data
const extractStatusMapping = (data) => {
  // Initialize an empty object to store the status mapping
  const statusMapping = {};

  // Iterate through tickets and populate the status mapping with ticket ID and status
  data.tickets.forEach((ticket) => {
    statusMapping[ticket.id] = ticket.status;
  });

  // Return the status mapping object
  return statusMapping;
};


  // Asynchronous function to fetch data from the server
  const getData = async () => {
    try {
      // Set loading state to true while fetching data
      setIsLoading(true);

      // Fetch data from the provided URL
      const response = await fetch(FETCH_URL);

      // Parse the response into JSON format
      const data = await response.json();

      // Set various states based on the fetched data
      setIsLoading(false);
      setUserData(data.users);
      setUser(groupByUser(data.tickets));
      setStatus(groupByStatus(data.tickets));
      setPriority(groupByPriority(data.tickets));
      setAvailableUser(availabilityMap(data.users));
      setStatusMapping(extractStatusMapping(data));
    } catch (e) {

      // Log any errors that occur during the data fetching process
      console.log(e);

      // Set loading state to false in case of an error
      setIsLoading(false);
    }
  };

  // Render the component content based on grouping by status
if (grouping === "status") {
  return (
    <>
      <div>
        {/* Navbar component for controlling grouping and ordering */}
        <Navbar
          grouping={grouping}
          setGrouping={setGrouping}
          ordering={ordering}
          setOrdering={setOrdering}
          call={getData}
        />
        <div className="Dashboard-Container">
          {isLoading ? (
            // Display a loading spinner if data is still loading
            <CustomSpinner />
          ) : (
            <>
              {/* Render columns for each status */}
              {status.Keys.map((item, index) => (
                <div className="column" key={index}>
                  <div className="Header">
                    <div className="icon-text">
                      {/* Display status-specific icon */}
                      {item === "Todo" ? (
                        <i className="bx bx-circle" id="todo"></i>
                      ) : item === "In progress" ? (
                        <i className="bx bx-adjust" id="progress"></i>
                      ) : item === "Backlog" ? (
                        <i className="bx bx-task-x" id="backlog"></i>
                      ) : item === "Done" ? (
                        <i className="bx bxs-check-circle" id="done"></i>
                      ) : (
                        <i className="bx bxs-x-circle" id="cancel"></i>
                      )}
                      <span className="text">
                        {/* Adjust label for "In progress" status */}
                        {item === "In progress" ? "In Progress" : item}
                      </span>
                      {/* Display the count of tickets in the current status */}
                      <span>{status[item]?.length}</span>
                    </div>
                    <div className="actions">
                      {/* Icons for additional actions */}
                      <i className="bx bx-plus" id="plus"></i>
                      <i
                        className="bx bx-dots-horizontal-rounded"
                        id="dots"
                      ></i>
                    </div>
                  </div>
                  {/* Render cards for each ticket in the current status */}
                  {status[item] &&
                    status[item].map((value) => (
                      <Card
                        id={value.id}
                        title={value.title}
                        tag={value.tag}
                        userId={value.userId}
                        status={status}
                        userData={userData}
                        priority={value.priority}
                        key={value.id}
                        grouping={grouping}
                        ordering={ordering}
                        statusMapping={statusMapping}
                      />
                    ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
// Render the component content based on grouping by users
else if (grouping === "users") {
  return (
    <>
      <div>
        {/* Navbar component for controlling grouping and ordering */}
        <Navbar
          grouping={grouping}
          setGrouping={setGrouping}
          ordering={ordering}
          setOrdering={setOrdering}
          call={getData}
        />
        <div className="Dashboard-Container">
          {isLoading ? (
            // Display a loading spinner if data is still loading
            <CustomSpinner />
          ) : (
            <>
              {/* Render columns for each user */}
              {availableUser &&
                user.Keys.map((userId, index) => {
                  // Get the current user's name or use "Unknown" if not found
                  const currentUserName =
                    userData.find((u) => u.id.toString() === userId)?.name ||
                    "Unknown";
                  return (
                    <div className="column" key={index}>
                      <div className="Header">
                        <div className="icon-text">
                          {/* Display user avatar with availability indicator */}
                          <div
                            className={
                              String(availableUser[userId]) === "false"
                                ? "user-avatar-unavailable"
                                : "user-avatar"
                            }
                          >
                            <img
                              src={
                                userId === "usr-1"
                                  ? profile1
                                  : userId === "usr-2"
                                  ? profile6
                                  : userId === "usr-3"
                                  ? profile7
                                  : userId === "usr-4"
                                  ? profile5
                                  : userId === "usr-5"
                                  ? profile4
                                  : profile
                              }
                              className={
                                String(availableUser[userId]) === "false"
                                  ? "user-avatar-unavailable"
                                  : "user-avatar"
                              }
                              alt="user"
                            />
                          </div>
                          {/* Display user's name and the count of tickets assigned */}
                          <span className="text">{currentUserName}</span>
                          <span>{user[userId]?.length}</span>
                        </div>
                        <div className="actions">
                          {/* Icons for additional actions */}
                          <i className="bx bx-plus" id="plus"></i>
                          <i
                            className="bx bx-dots-horizontal-rounded"
                            id="dots"
                          ></i>
                        </div>
                      </div>
                      {/* Render cards for each ticket assigned to the current user */}
                      {user[userId] &&
                        user[userId].map((ticket) => (
                          <Card
                            id={ticket.id}
                            title={ticket.title}
                            tag={ticket.tag}
                            userId={ticket.userId}
                            userData={userData}
                            priority={ticket.priority}
                            key={ticket.id}
                            grouping={grouping}
                            ordering={ordering}
                            status={status}
                            statusMapping={statusMapping}
                          />
                        ))}
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
// Render the component content based on grouping by priority
else {
  return (
    <>
      <div>
        {/* Navbar component for controlling grouping and ordering */}
        <Navbar
          grouping={grouping}
          setGrouping={setGrouping}
          ordering={ordering}
          setOrdering={setOrdering}
          call={getData}
        />
        <div className="Dashboard-Container">
          {isLoading ? (
            // Display a loading spinner if data is still loading
            <CustomSpinner />
          ) : (
            <>
              {/* Render columns for each priority level */}
              {priority.Keys
                .sort((a, b) => a - b)
                .map((item, index) => (
                  <div className="column" key={index}>
                    <div className="Header">
                      <div className="icon-text-priority">
                        {/* Display icon based on priority level */}
                        {item === "0" ? (
                          <i
                            className="bx bx-dots-horizontal-rounded"
                            id="noPriority"
                          ></i>
                        ) : item === "1" ? (
                          <i className="bx bx-signal-2" id="low"></i>
                        ) : item === "2" ? (
                          <i className="bx bx-signal-3" id="medium"></i>
                        ) : item === "3" ? (
                          <i className="bx bx-signal-4" id="high"></i>
                        ) : (
                          <i
                            className="bx bxs-message-square-error"
                            id="urgent"
                          ></i>
                        )}
                        {/* Display text representing the priority level */}
                        <span className="text">
                          {`Priority ${item}` === "Priority 4"
                            ? "Urgent"
                            : `Priority ${item}` === "Priority 3"
                            ? "High"
                            : `Priority ${item}` === "Priority 2"
                            ? "Medium"
                            : `Priority ${item}` === "Priority 1"
                            ? "Low"
                            : "No Priority"}
                        </span>
                        {/* Display the count of tickets with the current priority */}
                        <span className="count">
                          {priority[item]?.length}
                        </span>
                      </div>
                      <div className="actions">
                        {/* Icons for additional actions */}
                        <i className="bx bx-plus" id="plus"></i>
                        <i
                          className="bx bx-dots-horizontal-rounded"
                          id="dots"
                        ></i>
                      </div>
                    </div>
                    {/* Render cards for each ticket with the current priority level */}
                    {priority[item] &&
                      priority[item].map((value) => (
                        <Card
                          id={value.id}
                          title={value.title}
                          tag={value.tag}
                          userId={value.userId}
                          status={status}
                          userData={userData}
                          priority={value.priority}
                          key={value.id}
                          grouping={grouping}
                          ordering={ordering}
                          statusMapping={statusMapping}
                        />
                      ))}
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
};

export default Dashboard;
