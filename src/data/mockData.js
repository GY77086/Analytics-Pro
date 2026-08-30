// KPI Data
export const kpiData = [
  { id: 1, title: "Total Revenue",    value: "$128,430", change: "+12.5%", trend: "up",   icon: "DollarSign", color: "blue"   },
  { id: 2, title: "Active Users",     value: "24,812",   change: "+8.2%",  trend: "up",   icon: "Users",      color: "green"  },
  { id: 3, title: "Conversion Rate",  value: "3.64%",    change: "-0.4%",  trend: "down", icon: "TrendingUp", color: "purple" },
  { id: 4, title: "Avg. Session",     value: "4m 32s",   change: "+1.1%",  trend: "up",   icon: "Clock",      color: "orange" },
];

// Revenue Trend
export const revenueData = {
  "7d": [
    { name: "Mon", revenue: 4200 }, { name: "Tue", revenue: 3800 },
    { name: "Wed", revenue: 5100 }, { name: "Thu", revenue: 4700 },
    { name: "Fri", revenue: 6200 }, { name: "Sat", revenue: 5800 },
    { name: "Sun", revenue: 4900 },
  ],
  "30d": [
    { name: "Week 1", revenue: 18400 }, { name: "Week 2", revenue: 22100 },
    { name: "Week 3", revenue: 19800 }, { name: "Week 4", revenue: 25600 },
  ],
  "90d": [
    { name: "Jan", revenue: 42000 }, { name: "Feb", revenue: 38500 },
    { name: "Mar", revenue: 51200 }, { name: "Apr", revenue: 47800 },
    { name: "May", revenue: 62100 }, { name: "Jun", revenue: 58400 },
  ],
  "1y": [
    { name: "Jan", revenue: 42000 }, { name: "Feb", revenue: 38500 },
    { name: "Mar", revenue: 51200 }, { name: "Apr", revenue: 47800 },
    { name: "May", revenue: 62100 }, { name: "Jun", revenue: 58400 },
    { name: "Jul", revenue: 71200 }, { name: "Aug", revenue: 65900 },
    { name: "Sep", revenue: 74300 }, { name: "Oct", revenue: 68100 },
    { name: "Nov", revenue: 82400 }, { name: "Dec", revenue: 91200 },
  ],
};

// Sales by Category
export const salesByCategoryData = [
  { category: "Electronics",   sales: 42000, target: 45000 },
  { category: "Clothing",      sales: 28000, target: 30000 },
  { category: "Books",         sales: 15000, target: 18000 },
  { category: "Home & Garden", sales: 22000, target: 20000 },
  { category: "Sports",        sales: 18500, target: 22000 },
  { category: "Toys",          sales: 11200, target: 12000 },
];

// Traffic Sources
export const trafficData = [
  { name: "Organic Search", value: 38, color: "#3b82f6" },
  { name: "Direct",         value: 22, color: "#10b981" },
  { name: "Social Media",   value: 18, color: "#8b5cf6" },
  { name: "Email",          value: 12, color: "#f59e0b" },
  { name: "Referral",       value: 10, color: "#ef4444" },
];

// Table Data
export const tableData = [
  { id:  1, name: "Alice Johnson",   email: "alice@example.com",    category: "Electronics",   revenue: 4320, status: "Active",   date: "2024-01-15" },
  { id:  2, name: "Bob Smith",       email: "bob@example.com",      category: "Clothing",      revenue: 1890, status: "Inactive", date: "2024-01-18" },
  { id:  3, name: "Carol Williams",  email: "carol@example.com",    category: "Books",         revenue:  760, status: "Active",   date: "2024-01-20" },
  { id:  4, name: "David Brown",     email: "david@example.com",    category: "Sports",        revenue: 2340, status: "Active",   date: "2024-01-22" },
  { id:  5, name: "Emma Davis",      email: "emma@example.com",     category: "Electronics",   revenue: 5600, status: "Pending",  date: "2024-01-25" },
  { id:  6, name: "Frank Miller",    email: "frank@example.com",    category: "Home & Garden", revenue: 1230, status: "Active",   date: "2024-01-27" },
  { id:  7, name: "Grace Wilson",    email: "grace@example.com",    category: "Clothing",      revenue:  980, status: "Active",   date: "2024-01-29" },
  { id:  8, name: "Henry Moore",     email: "henry@example.com",    category: "Toys",          revenue:  540, status: "Inactive", date: "2024-02-01" },
  { id:  9, name: "Isabella Taylor", email: "isabella@example.com", category: "Electronics",   revenue: 3200, status: "Active",   date: "2024-02-03" },
  { id: 10, name: "Jack Anderson",   email: "jack@example.com",     category: "Books",         revenue:  410, status: "Pending",  date: "2024-02-05" },
  { id: 11, name: "Karen Thomas",    email: "karen@example.com",    category: "Sports",        revenue: 1870, status: "Active",   date: "2024-02-07" },
  { id: 12, name: "Liam Jackson",    email: "liam@example.com",     category: "Home & Garden", revenue: 2100, status: "Active",   date: "2024-02-09" },
];