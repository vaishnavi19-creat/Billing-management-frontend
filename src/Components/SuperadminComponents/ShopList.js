import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ShopList.css';

const ShopList = () => {
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [packageFilter, setPackageFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1); // For pagination
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'

    const itemsPerPage = 5; // Number of shops per page

    // Simulating backend data with dummy data
    const dummyData = [
        {
            id: 1,
            name: 'General Store',
            ownerName: 'John Doe',
            location: 'New York',
            shopType: 'General',
            packageType: 'Basic',
        },
        {
            id: 2,
            name: 'Medical Supplies',
            ownerName: 'Jane Smith',
            location: 'California',
            shopType: 'Medical',
            packageType: 'Standard',
        },
        {
            id: 3,
            name: 'Footwear Hub',
            ownerName: 'Alice Brown',
            location: 'Texas',
            shopType: 'Footwear',
            packageType: 'Premium',
        },
        {
            id: 4,
            name: 'Electrical Bazaar',
            ownerName: 'Bob Johnson',
            location: 'Florida',
            shopType: 'Electrical',
            packageType: 'Basic',
        },
        {
            id: 5,
            name: 'Fashion Paradise',
            ownerName: 'Sara Lee',
            location: 'Nevada',
            shopType: 'Clothes',
            packageType: 'Standard',
        },
        {
            id: 6,
            name: 'Tech World',
            ownerName: 'Mike Davis',
            location: 'Washington',
            shopType: 'Electronics',
            packageType: 'Premium',
        },
    ];

    // Simulate API call
    useEffect(() => {
        const fetchShops = async () => {
            try {
                // Simulating an API call
                const response = { data: dummyData };
                setShops(response.data);
                setFilteredShops(response.data);
            } catch (error) {
                console.error('Error fetching shops:', error);
            }
        };

        fetchShops();
    }, []);

    // Filter and sort logic
    useEffect(() => {
        let filtered = shops;

        if (searchQuery) {
            filtered = filtered.filter(shop =>
                shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.id.toString().includes(searchQuery) ||
                shop.shopType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(shop => shop.shopType === categoryFilter);
        }

        if (packageFilter) {
            filtered = filtered.filter(shop => shop.packageType === packageFilter);
        }

        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredShops(filtered);
    }, [searchQuery, categoryFilter, packageFilter, sortOrder, shops]);

    // Pagination logic
    const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
    const paginatedShops = filteredShops.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle delete operation
    const handleDelete = (id) => {
        setShops(shops.filter(shop => shop.id !== id));
    };

    // Toggle view modes
    const toggleViewMode = (mode) => {
        setViewMode(mode);
    };

    return (
        <div className="shop-list-container">
            <h2>Shop List</h2>

            {/* Filter and Sorting Section */}
            <div className="filter-sort-container">
                <input
                    type="text"
                    placeholder="Search by name, owner, location, ID, or type"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="sort-dropdown"
                >
                    <option value="">Category</option>
                    <option value="General">General Shop</option>
                    <option value="Medical">Medical</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Clothes">Clothes</option>
                </select>

                <select
                    value={packageFilter}
                    onChange={(e) => setPackageFilter(e.target.value)}
                    className="sort-dropdown"
                >
                    <option value="">Filter by Package</option>
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="sort-dropdown"
                >
                    <option value="asc">Sort ASC</option>
                    <option value="desc">Sort DESC</option>
                </select>

                <div className="view-mode-dropdown">
                    <button className="menu-icon">&#9776;</button>
                    <div className="dropdown-menu">
                        <button onClick={() => toggleViewMode('list')}>List View</button>
                        <button onClick={() => toggleViewMode('card')}>Card View</button>
                    </div>
                </div>
            </div>

            {/* Shop List or Card View */}
            {viewMode === 'list' ? (
                <table className="shop-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Shop Name</th>
                            <th>Owner Name</th>
                            <th>Location</th>
                            <th>Shop Type</th>
                            <th>Package Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedShops.length > 0 ? (
                            paginatedShops.map(shop => (
                                <tr key={shop.id}>
                                    <td>{shop.id}</td>
                                    <td>{shop.name}</td>
                                    <td>{shop.ownerName}</td>
                                    <td>{shop.location}</td>
                                    <td>{shop.shopType}</td>
                                    <td>{shop.packageType}</td>
                                    <td>
                                        <button className="action-button view">View</button>
                                        <button className="action-button update">Update</button>
                                        <button
                                            className="action-button delete"
                                            onClick={() => handleDelete(shop.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No shops found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <div className="card-container">
                    {paginatedShops.map(shop => (
                        <div className="shop-card" key={shop.id}>
                            <h3>{shop.name}</h3>
                            <p>Owner: {shop.ownerName}</p>
                            <p>Location: {shop.location}</p>
                            <p>Type: {shop.shopType}</p>
                            <p>Package: {shop.packageType}</p>
                            <button className="action-button view">View</button>
                            <button className="action-button update">Update</button>
                            <button
                                className="action-button delete"
                                onClick={() => handleDelete(shop.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ShopList;



















































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './css/ShopList.css';

// const ShopList = () => {
//     const [shops, setShops] = useState([]);
//     const [filteredShops, setFilteredShops] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [categoryFilter, setCategoryFilter] = useState('');
//     const [packageFilter, setPackageFilter] = useState('');
//     const [sortOrder, setSortOrder] = useState('asc');
//     const [currentPage, setCurrentPage] = useState(1); // For pagination
//     const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'

//     const itemsPerPage = 5; // Number of shops per page

//     // Fetch shop data from the backend when the component mounts
//     useEffect(() => {
//         const fetchShops = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/getAllShops');
//                 setShops(response.data);
//                 setFilteredShops(response.data);
//             } catch (error) {
//                 console.error('Error fetching shops:', error);
//             }
//         };

//         fetchShops();
//     }, []);

//     // Filter and sort logic
//     useEffect(() => {
//         let filtered = shops;

//         if (searchQuery) {
//             filtered = filtered.filter(shop =>
//                 shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 shop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 shop.id.toString().includes(searchQuery) ||
//                 shop.shopType.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         if (categoryFilter) {
//             filtered = filtered.filter(shop => shop.shopType === categoryFilter);
//         }

//         if (packageFilter) {
//             filtered = filtered.filter(shop => shop.packageType === packageFilter);
//         }

//         if (sortOrder === 'asc') {
//             filtered.sort((a, b) => a.name.localeCompare(b.name));
//         } else {
//             filtered.sort((a, b) => b.name.localeCompare(a.name));
//         }

//         setFilteredShops(filtered);
//     }, [searchQuery, categoryFilter, packageFilter, sortOrder, shops]);

//     // Pagination logic
//     const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
//     const paginatedShops = filteredShops.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     const handlePreviousPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const handleNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     // Handle delete operation
//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`/api/shops/${id}`);
//             setShops(shops.filter(shop => shop.id !== id));
//         } catch (error) {
//             console.error('Error deleting shop:', error);
//         }
//     };

//     // Toggle view modes
//     const toggleViewMode = (mode) => {
//         setViewMode(mode);
//     };

//     return (
//         <div className="shop-list-container">
//             <h2>Shop List</h2>

//             {/* Filter and Sorting Section */}
//             <div className="filter-sort-container">
//                 <input
//                     type="text"
//                     placeholder="Search by name, owner, location, ID, or type"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="search-input"
//                 />

//                 <select
//                     value={categoryFilter}
//                     onChange={(e) => setCategoryFilter(e.target.value)}
//                     className="sort-dropdown"
//                 >
//                     <option value="">Category</option>
//                     <option value="General">General Shop</option>
//                     <option value="Medical">Medical</option>
//                     <option value="Footwear">Footwear</option>
//                     <option value="Electrical">Electrical</option>
//                     <option value="Clothes">Clothes</option>
//                 </select>

//                 <select
//                     value={packageFilter}
//                     onChange={(e) => setPackageFilter(e.target.value)}
//                     className="sort-dropdown"
//                 >
//                     <option value="">Filter by Package</option>
//                     <option value="Basic">Basic</option>
//                     <option value="Standard">Standard</option>
//                     <option value="Premium">Premium</option>
//                 </select>

//                 <select
//                     value={sortOrder}
//                     onChange={(e) => setSortOrder(e.target.value)}
//                     className="sort-dropdown"
//                 >
//                     <option value="asc">Sort ASC</option>
//                     <option value="desc">Sort DESC</option>
//                 </select>

//                 {/* Dropdown Menu Icon */}
//                 <div className="view-mode-dropdown">
//                     <button className="menu-icon">&#9776;</button>
//                     <div className="dropdown-menu">
//                         <button onClick={() => toggleViewMode('list')}>List View</button>
//                         <button onClick={() => toggleViewMode('card')}>Card View</button>
//                     </div>
//                 </div>
//             </div>

//             {/* Shop List or Card View */}
//             {viewMode === 'list' ? (
//                 <table className="shop-table">
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Shop Name</th>
//                             <th>Owner Name</th>
//                             <th>Location</th>
//                             <th>Shop Type</th>
//                             <th>Package Type</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {paginatedShops.length > 0 ? (
//                             paginatedShops.map(shop => (
//                                 <tr key={shop.id}>
//                                     <td>{shop.id}</td>
//                                     <td>{shop.name}</td>
//                                     <td>{shop.ownerName}</td>
//                                     <td>{shop.location}</td>
//                                     <td>{shop.shopType}</td>
//                                     <td>{shop.packageType}</td>
//                                     <td>
//                                         <button className="action-button view">View</button>
//                                         <button className="action-button update">Update</button>
//                                         <button
//                                             className="action-button delete"
//                                             onClick={() => handleDelete(shop.id)}
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="7">No shops found</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             ) : (
//                 <div className="card-container">
//                     {paginatedShops.map(shop => (
//                         <div className="shop-card" key={shop.id}>
//                             <h3>{shop.name}</h3>
//                             <p>Owner: {shop.ownerName}</p>
//                             <p>Location: {shop.location}</p>
//                             <p>Type: {shop.shopType}</p>
//                             <p>Package: {shop.packageType}</p>
//                             <button className="action-button view">View</button>
//                             <button className="action-button update">Update</button>
//                             <button
//                                 className="action-button delete"
//                                 onClick={() => handleDelete(shop.id)}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Pagination */}
//             <div className="pagination">
//                 <button onClick={handlePreviousPage} disabled={currentPage === 1}>
//                     Previous
//                 </button>
//                 <span>
//                     Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                     onClick={handleNextPage}
//                     disabled={currentPage === totalPages}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ShopList;
























































