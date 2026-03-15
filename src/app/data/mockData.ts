// Mock data for the Hotel Management SaaS System

export const mockRooms = [
  { id: 1, number: "101", type: "Standard", price: 89, floor: 1, status: "Available", description: "Cozy standard room with city view" },
  { id: 2, number: "102", type: "Standard", price: 89, floor: 1, status: "Occupied", description: "Cozy standard room" },
  { id: 3, number: "201", type: "Deluxe", price: 149, floor: 2, status: "Cleaning", description: "Spacious deluxe room with balcony" },
  { id: 4, number: "202", type: "Deluxe", price: 149, floor: 2, status: "Available", description: "Deluxe room with garden view" },
  { id: 5, number: "301", type: "Suite", price: 299, floor: 3, status: "Occupied", description: "Luxury suite with living area" },
  { id: 6, number: "302", type: "Suite", price: 299, floor: 3, status: "Maintenance", description: "Executive suite" },
  { id: 7, number: "103", type: "Standard", price: 89, floor: 1, status: "Available", description: "Standard room near pool" },
  { id: 8, number: "203", type: "Deluxe", price: 149, floor: 2, status: "Occupied", description: "Deluxe corner room" },
  { id: 9, number: "401", type: "Penthouse", price: 599, floor: 4, status: "Available", description: "Top-floor penthouse with panoramic view" },
  { id: 10, number: "104", type: "Standard", price: 89, floor: 1, status: "Cleaning", description: "Standard twin room" },
];

export const mockGuests = [
  { id: 1, firstName: "James", lastName: "Wilson", phone: "+1-555-0101", email: "james.wilson@email.com", address: "123 Main St, NY", idPassport: "P1234567", visits: 3, notes: "VIP guest, prefers quiet rooms" },
  { id: 2, firstName: "Sarah", lastName: "Johnson", phone: "+1-555-0102", email: "sarah.j@email.com", address: "456 Oak Ave, CA", idPassport: "P2345678", visits: 1, notes: "" },
  { id: 3, firstName: "Michael", lastName: "Chen", phone: "+1-555-0103", email: "m.chen@email.com", address: "789 Pine Rd, TX", idPassport: "P3456789", visits: 5, notes: "Allergic to feather pillows" },
  { id: 4, firstName: "Emma", lastName: "Davis", phone: "+1-555-0104", email: "emma.davis@email.com", address: "321 Elm St, FL", idPassport: "P4567890", visits: 2, notes: "Anniversary trip" },
  { id: 5, firstName: "Robert", lastName: "Martinez", phone: "+1-555-0105", email: "r.martinez@email.com", address: "654 Cedar Ln, WA", idPassport: "P5678901", visits: 7, notes: "Business traveler" },
  { id: 6, firstName: "Olivia", lastName: "Brown", phone: "+1-555-0106", email: "o.brown@email.com", address: "987 Maple Dr, IL", idPassport: "P6789012", visits: 1, notes: "" },
  { id: 7, firstName: "William", lastName: "Taylor", phone: "+1-555-0107", email: "w.taylor@email.com", address: "147 Birch Blvd, OH", idPassport: "P7890123", visits: 4, notes: "Requires accessibility room" },
  { id: 8, firstName: "Sophia", lastName: "Anderson", phone: "+1-555-0108", email: "s.anderson@email.com", address: "258 Walnut St, GA", idPassport: "P8901234", visits: 2, notes: "Honeymoon couple" },
];

export const mockBookings = [
  { id: 1, guestId: 1, guestName: "James Wilson", room: "301", checkIn: "2026-03-12", checkOut: "2026-03-16", adults: 2, children: 0, status: "Checked-in", notes: "VIP treatment", amount: 1196 },
  { id: 2, guestId: 2, guestName: "Sarah Johnson", room: "102", checkIn: "2026-03-14", checkOut: "2026-03-17", adults: 1, children: 0, status: "Confirmed", notes: "", amount: 267 },
  { id: 3, guestId: 3, guestName: "Michael Chen", room: "203", checkIn: "2026-03-10", checkOut: "2026-03-14", adults: 2, children: 1, status: "Checked-out", notes: "Late checkout requested", amount: 596 },
  { id: 4, guestId: 4, guestName: "Emma Davis", room: "202", checkIn: "2026-03-15", checkOut: "2026-03-18", adults: 2, children: 0, status: "Confirmed", notes: "Anniversary", amount: 447 },
  { id: 5, guestId: 5, guestName: "Robert Martinez", room: "101", checkIn: "2026-03-13", checkOut: "2026-03-15", adults: 1, children: 0, status: "Checked-in", notes: "Business", amount: 178 },
  { id: 6, guestId: 6, guestName: "Olivia Brown", room: "103", checkIn: "2026-03-16", checkOut: "2026-03-20", adults: 2, children: 2, status: "Confirmed", notes: "Family vacation", amount: 356 },
  { id: 7, guestId: 7, guestName: "William Taylor", room: "104", checkIn: "2026-03-08", checkOut: "2026-03-14", adults: 1, children: 0, status: "Cancelled", notes: "Wheelchair accessible", amount: 534 },
  { id: 8, guestId: 8, guestName: "Sophia Anderson", room: "401", checkIn: "2026-03-18", checkOut: "2026-03-22", adults: 2, children: 0, status: "Confirmed", notes: "Honeymoon package", amount: 2396 },
];

export const mockStaff = [
  { id: 1, name: "Alice Thompson", role: "Front Desk Manager", phone: "+1-555-1001", email: "a.thompson@hotel.com", status: "Active", department: "Front Office" },
  { id: 2, name: "Bob Jackson", role: "Housekeeper", phone: "+1-555-1002", email: "b.jackson@hotel.com", status: "Active", department: "Housekeeping" },
  { id: 3, name: "Carol White", role: "Chef", phone: "+1-555-1003", email: "c.white@hotel.com", status: "Active", department: "Kitchen" },
  { id: 4, name: "David Harris", role: "Maintenance", phone: "+1-555-1004", email: "d.harris@hotel.com", status: "On Leave", department: "Maintenance" },
  { id: 5, name: "Eve Clark", role: "Receptionist", phone: "+1-555-1005", email: "e.clark@hotel.com", status: "Active", department: "Front Office" },
  { id: 6, name: "Frank Lewis", role: "Security", phone: "+1-555-1006", email: "f.lewis@hotel.com", status: "Active", department: "Security" },
  { id: 7, name: "Grace Hall", role: "Housekeeper", phone: "+1-555-1007", email: "g.hall@hotel.com", status: "Active", department: "Housekeeping" },
  { id: 8, name: "Henry Young", role: "Concierge", phone: "+1-555-1008", email: "h.young@hotel.com", status: "Inactive", department: "Front Office" },
];

export const mockShifts = [
  { id: 1, staffId: 1, staffName: "Alice Thompson", date: "2026-03-14", startTime: "08:00", endTime: "16:00", department: "Front Office", notes: "Morning shift" },
  { id: 2, staffId: 2, staffName: "Bob Jackson", date: "2026-03-14", startTime: "09:00", endTime: "17:00", department: "Housekeeping", notes: "" },
  { id: 3, staffId: 5, staffName: "Eve Clark", date: "2026-03-14", startTime: "16:00", endTime: "00:00", department: "Front Office", notes: "Evening shift" },
  { id: 4, staffId: 6, staffName: "Frank Lewis", date: "2026-03-14", startTime: "00:00", endTime: "08:00", department: "Security", notes: "Night shift" },
  { id: 5, staffId: 7, staffName: "Grace Hall", date: "2026-03-15", startTime: "08:00", endTime: "16:00", department: "Housekeeping", notes: "" },
  { id: 6, staffId: 3, staffName: "Carol White", date: "2026-03-15", startTime: "06:00", endTime: "14:00", department: "Kitchen", notes: "Breakfast prep" },
  { id: 7, staffId: 1, staffName: "Alice Thompson", date: "2026-03-15", startTime: "08:00", endTime: "16:00", department: "Front Office", notes: "" },
  { id: 8, staffId: 8, staffName: "Henry Young", date: "2026-03-16", startTime: "10:00", endTime: "18:00", department: "Front Office", notes: "Weekend cover" },
];

export const mockHousekeepingTasks = [
  { id: 1, room: "102", assignedStaff: "Bob Jackson", priority: "High", status: "In Progress", notes: "Deep clean required", type: "Cleaning" },
  { id: 2, room: "201", assignedStaff: "Grace Hall", priority: "Normal", status: "Pending", notes: "Standard checkout clean", type: "Cleaning" },
  { id: 3, room: "104", assignedStaff: "Grace Hall", priority: "Normal", status: "Completed", notes: "", type: "Cleaning" },
  { id: 4, room: "302", assignedStaff: "David Harris", priority: "High", status: "In Progress", notes: "AC unit repair", type: "Maintenance" },
  { id: 5, room: "203", assignedStaff: "Bob Jackson", priority: "Low", status: "Pending", notes: "Minibar restock", type: "Restock" },
  { id: 6, room: "401", assignedStaff: "Grace Hall", priority: "High", status: "Pending", notes: "Pre-arrival VIP setup", type: "Cleaning" },
  { id: 7, room: "101", assignedStaff: "Bob Jackson", priority: "Normal", status: "Completed", notes: "", type: "Cleaning" },
  { id: 8, room: "103", assignedStaff: "Grace Hall", priority: "Normal", status: "In Progress", notes: "Linen change", type: "Cleaning" },
];

export const mockInvoices = [
  { id: "INV-001", guestName: "James Wilson", bookingId: 1, room: "301", amount: 1196, tax: 119.6, discount: 0, total: 1315.6, status: "Paid", date: "2026-03-16" },
  { id: "INV-002", guestName: "Michael Chen", bookingId: 3, room: "203", amount: 596, tax: 59.6, discount: 30, total: 625.6, status: "Paid", date: "2026-03-14" },
  { id: "INV-003", guestName: "Robert Martinez", bookingId: 5, room: "101", amount: 178, tax: 17.8, discount: 0, total: 195.8, status: "Pending", date: "2026-03-15" },
  { id: "INV-004", guestName: "Sarah Johnson", bookingId: 2, room: "102", amount: 267, tax: 26.7, discount: 0, total: 293.7, status: "Pending", date: "2026-03-17" },
  { id: "INV-005", guestName: "William Taylor", bookingId: 7, room: "104", amount: 534, tax: 53.4, discount: 0, total: 587.4, status: "Cancelled", date: "2026-03-08" },
  { id: "INV-006", guestName: "Emma Davis", bookingId: 4, room: "202", amount: 447, tax: 44.7, discount: 20, total: 471.7, status: "Pending", date: "2026-03-18" },
];

export const mockUsers = [
  { id: 1, name: "Admin User", email: "admin@hotel.com", role: "Super Admin", status: "Active", lastLogin: "2026-03-14" },
  { id: 2, name: "Alice Thompson", email: "a.thompson@hotel.com", role: "Manager", status: "Active", lastLogin: "2026-03-14" },
  { id: 3, name: "Bob Jackson", email: "b.jackson@hotel.com", role: "Housekeeper", status: "Active", lastLogin: "2026-03-13" },
  { id: 4, name: "Carol White", email: "c.white@hotel.com", role: "Staff", status: "Active", lastLogin: "2026-03-12" },
  { id: 5, name: "Eve Clark", email: "e.clark@hotel.com", role: "Receptionist", status: "Active", lastLogin: "2026-03-14" },
  { id: 6, name: "David Harris", email: "d.harris@hotel.com", role: "Staff", status: "Inactive", lastLogin: "2026-03-01" },
];

export const mockRoles = [
  {
    id: 1, name: "Super Admin",
    permissions: {
      Dashboard: { create: true, read: true, update: true, delete: true },
      Bookings: { create: true, read: true, update: true, delete: true },
      Guests: { create: true, read: true, update: true, delete: true },
      Rooms: { create: true, read: true, update: true, delete: true },
      Staff: { create: true, read: true, update: true, delete: true },
      Invoices: { create: true, read: true, update: true, delete: true },
      IAM: { create: true, read: true, update: true, delete: true },
      Settings: { create: true, read: true, update: true, delete: true },
    }
  },
  {
    id: 2, name: "Manager",
    permissions: {
      Dashboard: { create: false, read: true, update: false, delete: false },
      Bookings: { create: true, read: true, update: true, delete: false },
      Guests: { create: true, read: true, update: true, delete: false },
      Rooms: { create: false, read: true, update: true, delete: false },
      Staff: { create: false, read: true, update: true, delete: false },
      Invoices: { create: true, read: true, update: true, delete: false },
      IAM: { create: false, read: true, update: false, delete: false },
      Settings: { create: false, read: true, update: true, delete: false },
    }
  },
  {
    id: 3, name: "Receptionist",
    permissions: {
      Dashboard: { create: false, read: true, update: false, delete: false },
      Bookings: { create: true, read: true, update: true, delete: false },
      Guests: { create: true, read: true, update: true, delete: false },
      Rooms: { create: false, read: true, update: false, delete: false },
      Staff: { create: false, read: false, update: false, delete: false },
      Invoices: { create: false, read: true, update: false, delete: false },
      IAM: { create: false, read: false, update: false, delete: false },
      Settings: { create: false, read: false, update: false, delete: false },
    }
  },
  {
    id: 4, name: "Housekeeper",
    permissions: {
      Dashboard: { create: false, read: true, update: false, delete: false },
      Bookings: { create: false, read: false, update: false, delete: false },
      Guests: { create: false, read: false, update: false, delete: false },
      Rooms: { create: false, read: true, update: false, delete: false },
      Staff: { create: false, read: false, update: false, delete: false },
      Invoices: { create: false, read: false, update: false, delete: false },
      IAM: { create: false, read: false, update: false, delete: false },
      Settings: { create: false, read: false, update: false, delete: false },
    }
  },
];
