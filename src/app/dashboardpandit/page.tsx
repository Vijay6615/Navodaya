// "use client";

// import { useEffect, useState } from "react";

// export default function Dashboard() {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     const saved = localStorage.getItem("pujaBookings");
//     if (saved) setBookings(JSON.parse(saved));
//   }, []);

//   const updateStatus = (id, status) => {
//     const updated = bookings.map((b) =>
//       b.id === id ? { ...b, status } : b
//     );
//     setBookings(updated);
//     localStorage.setItem("pujaBookings", JSON.stringify(updated));
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-6">
//       <header className="bg-orange-600 text-white p-5 rounded-2xl shadow-md text-center">
//         <h1 className="text-3xl font-bold">🔱 Pandit Ji Dashboard</h1>
//         <p className="text-sm mt-1">Manage all Puja bookings</p>
//       </header>

//       <section className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
//         <h2 className="text-2xl font-bold text-orange-700 mb-4">📅 All Bookings</h2>
//         {bookings.length === 0 ? (
//           <p className="text-gray-600">No bookings yet.</p>
//         ) : (
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-orange-100 text-orange-800">
//                 <th className="py-2 px-3 text-left">Client Name</th>
//                 <th className="py-2 px-3 text-left">Phone</th>
//                 <th className="py-2 px-3 text-left">Puja</th>
//                 <th className="py-2 px-3 text-left">Date</th>
//                 <th className="py-2 px-3 text-left">Status</th>
//                 <th className="py-2 px-3 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bookings.map((b) => (
//                 <tr key={b.id} className="border-b hover:bg-orange-50">
//                   <td className="py-2 px-3">{b.name}</td>
//                   <td className="py-2 px-3">{b.phone}</td>
//                   <td className="py-2 px-3">{b.puja}</td>
//                   <td className="py-2 px-3">{b.date}</td>
//                   <td
//                     className={`py-2 px-3 font-semibold ${
//                       b.status === "Cancelled"
//                         ? "text-red-500"
//                         : b.status === "Completed"
//                         ? "text-green-600"
//                         : b.status === "Pending"
//                         ? "text-yellow-600"
//                         : "text-orange-600"
//                     }`}
//                   >
//                     {b.status}
//                   </td>
//                   <td className="py-2 px-3 text-center">
//                     {b.status !== "Cancelled" && (
//                       <select
//                         value={b.status}
//                         onChange={(e) => updateStatus(b.id, e.target.value)}
//                         className="border p-1 rounded text-sm"
//                       >
//                         <option>Pending</option>
//                         <option>Confirmed</option>
//                         <option>Completed</option>
//                         <option>Cancelled</option>
//                       </select>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>
//     </main>
//   );
// }
