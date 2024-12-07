import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [viewType, setViewType] = useState('list'); // View type state
  const [showMenu, setShowMenu] = useState(false); // Dropdown visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Dummy Data for Testing
    const dummyData = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '2345678901' },
      { id: 3, name: 'Alice Brown', email: 'alice.brown@example.com', phone: '3456789012' },
      { id: 4, name: 'Bob White', email: 'bob.white@example.com', phone: '4567890123' },
      { id: 5, name: 'Charlie Black', email: 'charlie.black@example.com', phone: '5678901234' },
      { id: 6, name: 'Daisy Green', email: 'daisy.green@example.com', phone: '6789012345' },
      { id: 7, name: 'Ethan Blue', email: 'ethan.blue@example.com', phone: '7890123456' },
      { id: 8, name: 'Fiona Red', email: 'fiona.red@example.com', phone: '8901234567' },
    ];
    setCustomers(dummyData);
    setFilteredCustomers(dummyData);
  }, []);

  useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'asc') return a[sortField]?.localeCompare(b[sortField]);
      return b[sortField]?.localeCompare(a[sortField]);
    });

    setFilteredCustomers(sorted);
  }, [searchQuery, customers, sortField, sortOrder]);

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const handleUpdateCustomer = (id) => {
    navigate(`/update-customer/${id}`);
  };

  const handleViewCustomer = (id) => {
    navigate(`/view-customer/${id}`);
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(firstIndex, lastIndex);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredCustomers.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleView = (type) => {
    setViewType(type);
    setShowMenu(false); // Close the menu after selection
  };

  return (
    <div className="customer-list-container">
      <h2>Customer List</h2>

      {/* Filter and Sorting Section */}
      <div className="filter-sort-container">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        {/* Sort and view toggle section */}
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="sort-dropdown"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="phone">Sort by Phone</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-dropdown"
        >
          <option value="asc">Sort ASC</option>
          <option value="desc">Sort DESC</option>
        </select>

        {/* View Mode Toggle */}
        <div className="view-mode-dropdown">
          <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
            &#9776;
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => toggleView('list')}>List View</button>
              <button onClick={() => toggleView('card')}>Card View</button>
            </div>
          )}
        </div>
      </div>

      {/* Render Customers in List or Card View */}
      {viewType === 'list' ? (
        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <button className="action-button view" onClick={() => handleViewCustomer(customer.id)}>View</button>
                    <button className="action-button update" onClick={() => handleUpdateCustomer(customer.id)}>Update</button>
                    <button className="action-button delete" onClick={() => handleDeleteCustomer(customer.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="card-container">
          {currentCustomers.map((customer) => (
            <div className="customer-card" key={customer.id}>
              <h3>{customer.name}</h3>
              <p>Email: {customer.email}</p>
              <p>Phone: {customer.phone}</p>
              <div className="card-actions">
                <button className="action-button view" onClick={() => handleViewCustomer(customer.id)}>View</button>
                <button className="action-button update" onClick={() => handleUpdateCustomer(customer.id)}>Update</button>
                <button className="action-button delete" onClick={() => handleDeleteCustomer(customer.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Section */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {Math.ceil(filteredCustomers.length / itemsPerPage)}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredCustomers.length / itemsPerPage)}>Next</button>
      </div>
    </div>
  );
};

export default CustomerList;


























































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './css/CustomerList.css';

// const CustomerList = () => {
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortField, setSortField] = useState('name'); // Default sort field
//   const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
//   const navigate = useNavigate();

//   // Fetch customer data when the component mounts
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/getAllCustomers');
//         setCustomers(response.data);
//         setFilteredCustomers(response.data); // Initialize filtered customers
//       } catch (error) {
//         console.error('Error fetching customers:', error);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   // Filter and sort customers based on search query and sorting options
//   useEffect(() => {
//     const filtered = customers.filter((customer) =>
//       customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       customer.phone.includes(searchQuery)
//     );

//     const sorted = [...filtered].sort((a, b) => {
//       if (sortOrder === 'asc') return a[sortField]?.localeCompare(b[sortField]);
//       return b[sortField]?.localeCompare(a[sortField]);
//     });

//     setFilteredCustomers(sorted);
//   }, [searchQuery, customers, sortField, sortOrder]);

//   // Delete customer by ID
//   const handleDeleteCustomer = async (id) => {
//     try {
//       await axios.delete(`/api/customers/${id}`);
//       setCustomers(customers.filter((customer) => customer.id !== id));
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//     }
//   };

//   // Navigate to update customer page
//   const handleUpdateCustomer = (id) => {
//     navigate(`/update-customer/${id}`);
//   };

//   // Navigate to view customer details page
//   const handleViewCustomer = (id) => {
//     navigate(`/view-customer/${id}`);
//   };

//   // Navigate to add shop page with customer ID
//   const handleAddShop = (id) => {
//     navigate(`/add-shop?customerId=${id}`);
//   };

//   return (
//     <div className="customer-list-container">
//       <h2>Customer List</h2>

//       {/* Search and Sorting */}
//       <div className="filter-sort-container">
//         <input
//           type="text"
//           placeholder="Search by name, email, or phone"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="search-input"
//         />
//         <div className="sort-dropdowns"> 
//           <select
//             className="sort-dropdown"
//             value={sortField}
//             onChange={(e) => setSortField(e.target.value)}
//           > 
//             <option value="name">Sort by Name</option>
//             <option value="email">Sort by Email</option>
//             <option value="phone">Sort by Phone</option>
//             <option value="id">Sort by ID</option>
//           </select>
//           <select
//             className="sort-dropdown"
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//           >
//             <option value="asc"> Sort ASC</option>
//             <option value="desc"> Sort DESC</option>
//           </select>
//         </div>
//       </div>

//       {/* Customer Table */}
//       <table className="customer-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredCustomers.length > 0 ? (
//             filteredCustomers.map((customer) => (
//               <tr key={customer.id}>
//                 <td>{customer.id}</td>
//                 <td>{customer.name}</td>
//                 <td>{customer.email}</td>
//                 <td>{customer.phone}</td>
//                 <td>
//                   <button
//                     onClick={() => handleViewCustomer(customer.id)}
//                     className="action-button view"
//                   >
//                     View
//                   </button>
//                   <button
//                     onClick={() => handleUpdateCustomer(customer.id)}
//                     className="action-button update"
//                   >
//                     Update
//                   </button>
//                   <button
//                     onClick={() => handleDeleteCustomer(customer.id)}
//                     className="action-button delete"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => handleAddShop(customer.id)}
//                     className="action-button add-shop"
//                   >
//                     Add Shop
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5">No customers found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CustomerList;









































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './css/CustomerList.css';

// const CustomerList = () => {
//     const [customers, setCustomers] = useState([]);
//     const [filteredCustomers, setFilteredCustomers] = useState([]);
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Fetch customer data when the component mounts
//     useEffect(() => {
//         const fetchCustomers = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/getAllCustomers');
//                 setCustomers(response.data);
//                 setFilteredCustomers(response.data);
//             } catch (error) {
//                 console.error('Error fetching customers:', error);
//             }
//         };

//         fetchCustomers();
//     }, []);

//     // Get search term from URL parameters
//     useEffect(() => {
//         const searchParams = new URLSearchParams(location.search);
//         const searchTerm = searchParams.get('search') || '';

//         if (searchTerm === '') {
//             setFilteredCustomers(customers);
//         } else {
//             const filtered = customers.filter(customer =>
//                 customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 customer.id.toString().includes(searchTerm)
//             );
//             setFilteredCustomers(filtered);
//         }
//     }, [location.search, customers]);

//     // Delete customer by ID
//     const handleDeleteCustomer = async (id) => {
//         try {
//             await axios.delete(`/api/customers/${id}`);
//             setCustomers(customers.filter(customer => customer.id !== id));
//         } catch (error) {
//             console.error('Error deleting customer:', error);
//         }
//     };

//     // Navigate to update customer page
//     const handleUpdateCustomer = (id) => {
//         navigate(`/update-customer/${id}`);
//     };

//     // Navigate to view customer details page
//     const handleViewCustomer = (id) => {
//         navigate(`/view-customer/${id}`);
//     };

//     // Navigate to add shop page with customer ID
//     const handleAddShop = (id) => {
//         navigate(`/add-shop?customerId=${id}`);
//     };

//     return (
//         <div className="customer-list-container">
//             <h2>Customer List</h2>

//             {/* Customer Table */}
//             <table className="customer-table">
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Phone</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredCustomers.length > 0 ? (
//                         filteredCustomers.map(customer => (
//                             <tr key={customer.id}>
//                                 <td>{customer.id}</td>
//                                 <td>{customer.name}</td>
//                                 <td>{customer.email}</td>
//                                 <td>{customer.phone}</td>
//                                 <td>
//                                     <button onClick={() => handleViewCustomer(customer.id)} className="action-button view">View</button>
//                                     <button onClick={() => handleUpdateCustomer(customer.id)} className="action-button update">Update</button>
//                                     <button onClick={() => handleDeleteCustomer(customer.id)} className="action-button delete">Delete</button>
//                                     <button onClick={() => handleAddShop(customer.id)} className="action-button add-shop">Add Shop</button>
//                                 </td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="5">No customers found</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default CustomerList;


















