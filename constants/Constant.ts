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
  { id: 1, title: "Await Payment" },
  { id: 2, title: "Check Payment" },
  { id: 3, title: "Find Repairman" },
  { id: 4, title: "In Progress" },
  { id: 5, title: "Done" },
  { id: 6, title: "Cancel By User" },
  { id: 7, title: "Cancel By Repairman" },
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
