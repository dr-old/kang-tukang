export const services = [
  {
    id: 1,
    title: "AC Repairman",
    image: require("@/assets/images/ac-repairman.png"),
  },
  {
    id: 2,
    title: "Daily Handyman",
    image: require("@/assets/images/daily-handyman.png"),
  },
  {
    id: 3,
    title: "Tool Repairman",
    image: require("@/assets/images/tool-repairman.png"),
  },
];

export const trxStatus = [
  { id: 1, title: "Await Payment", type: "warning" },
  { id: 2, title: "Check Payment", type: "warning" },
  { id: 3, title: "Find Repairman", type: "info" },
  { id: 4, title: "In Progress", type: "info" },
  { id: 5, title: "Done", type: "success" },
  { id: 6, title: "Cancel By User", type: "danger" },
  { id: 7, title: "Cancel By Repairman", type: "danger" },
];

export const accountStatus = [
  { id: 1, title: "Await Payment" },
  { id: 2, title: "Check Payment" },
  { id: 3, title: "Done" },
  { id: 4, title: "Cancel By User" },
];

export const env = {
  APP_ID_REALM: "devicesync-dehqp",
  APP_KEY_REALM:
    "fCDt39qO7HJc0NC1XjQchzITpKax1FPRhk4Nt4PycDTZw17URrPJD6XzO3hJejzK",
  APP_URL_REALM: "https://services.cloud.mongodb.com",
};
// "fCDt39qO7HJc0NC1XjQchzITpKax1FPRhk4Nt4PycDTZw17URrPJD6XzO3hJejzK",
// "INNbBjbWmKmTjpIrPrcERPvZQrlkmnHBEDtw7i8v5twImRR3suIN6PsLjePjLv1M",

export const imageTabBar = [
  require("@/assets/images/home.png"),
  require("@/assets/images/order.png"),
  require("@/assets/images/message.png"),
  require("@/assets/images/profile.png"),
];

// createMultipleServices([
// AC Repairman Services
//   {
//     category: 1,
//     description: "Basic troubleshooting and filter replacement.",
//     groupId: "AC Repair",
//     price: 80000,
//     title: "AC Filter Replacement",
//   },
//   {
//     category: 1,
//     description: "Cooling system performance optimization.",
//     groupId: "AC Repair",
//     price: 30000,
//     title: "AC Performance Optimization",
//   },
//   {
//     category: 1,
//     description: "Complete overhaul and repair of old AC units.",
//     groupId: "",
//     price: 40000,
//     title: "AC Overhaul",
//   },
//   {
//     category: 1,
//     description: "Quick response service for urgent AC repairs.",
//     groupId: "",
//     price: 35000,
//     title: "Emergency AC Repair",
//   },
//   {
//     category: 1,
//     description: "Annual maintenance contract for AC units.",
//     groupId: "",
//     price: 60000,
//     title: "AC Annual Maintenance",
//   },
//   {
//     category: 1,
//     description: "Service for energy-efficient AC operation.",
//     groupId: "",
//     price: 22000,
//     title: "AC Energy Efficiency Service",
//   },
//   {
//     category: 1,
//     description: "Inspection and repair of AC thermostats.",
//     groupId: "",
//     price: 13000,
//     title: "AC Thermostat Repair",
//   },
// ])

// createMultipleServices([
//   // Daily Handyman Services
//   {
//     category: 2,
//     description: "Furniture assembly and minor carpentry.",
//     groupId: "",
//     price: 14000,
//     title: "Furniture Assembly",
//   },
//   {
//     category: 2,
//     description: "Fixing door locks and handles.",
//     groupId: "",
//     price: 10000,
//     title: "Lock and Handle Repairs",
//   },
//   {
//     category: 2,
//     description: "Garden maintenance and landscaping.",
//     groupId: "Roof Handyman",
//     price: 20000,
//     title: "Garden Maintenance",
//   },
//   {
//     category: 2,
//     description: "Roof and gutter cleaning.",
//     groupId: "Roof Handyman",
//     price: 18000,
//     title: "Roof and Gutter Cleaning",
//   },
//   {
//     category: 2,
//     description: "Minor home renovations and upgrades.",
//     groupId: "Roof Handyman",
//     price: 25000,
//     title: "Home Renovations",
//   },
//   {
//     category: 2,
//     description: "Seasonal home decoration and setup.",
//     groupId: "",
//     price: 12000,
//     title: "Seasonal Decoration",
//   },
//   {
//     category: 2,
//     description: "Repair of minor electrical fixtures.",
//     groupId: "",
//     price: 11000,
//     title: "Minor Electrical Repairs",
//   },
// ])

// createMultipleServices([
//   // Tool Repairman Services
//   {
//     category: 3,
//     description: "Repair of industrial-grade tools.",
//     groupId: "",
//     price: 40000,
//     title: "Industrial Tool Repair",
//   },
//   {
//     category: 3,
//     description: "On-site tool repair service.",
//     groupId: "",
//     price: 35000,
//     title: "On-Site Tool Repair",
//   },
//   {
//     category: 3,
//     description:
//       "Battery replacement and testing for cordless tools.",
//     groupId: "",
//     price: 15000,
//     title: "Cordless Tool Battery Service",
//   },
//   {
//     category: 3,
//     description: "Repair of specialized workshop tools.",
//     groupId: "",
//     price: 25000,
//     title: "Workshop Tool Repair",
//   },
//   {
//     category: 3,
//     description: "Refurbishment of damaged or old tools.",
//     groupId: "",
//     price: 28000,
//     title: "Tool Refurbishment",
//   },
//   {
//     category: 3,
//     description: "Precision tool calibration and repair.",
//     groupId: "Customize",
//     price: 20000,
//     title: "Precision Tool Repair",
//   },
//   {
//     category: 3,
//     description: "Custom tool modification and enhancements.",
//     groupId: "Customize",
//     price: 30000,
//     title: "Custom Tool Modification",
//   },
// ])
