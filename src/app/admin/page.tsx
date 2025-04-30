import React from 'react';

// Renamed function to start with uppercase
function AdminDashboardPage() { // Renamed for clarity
  return (
    <> {/* Use Fragment as the layout provides the main structure */}
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="mt-4 bg-white p-4 rounded shadow">
        {/* Content for the selected sidebar item will go here */}
        <p>Welcome to the admin dashboard. Select an option from the sidebar.</p>
      </div>
    </>
  );
}

// Export the renamed component
export default AdminDashboardPage; // Renamed export
