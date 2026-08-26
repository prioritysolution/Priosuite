import {
  FiHome,
  FiInbox,
  FiLock,
  FiRadio,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";
import { MdOutlineSettings } from "react-icons/md";

export const links = [
  {
    title: "Dashboard",
    logo: <FiHome />,
    path: "/dashboard",
  },
  {
    title: "Org Setup",
    logo: <FiUser />,
    path: "/orgSetup",
    childLinks: [
      {
        title: "Create Org",
        path: "/orgSetup/createOrg",
      },
      {
        title: "Assign Module",
        path: "/orgSetup/assignModule",
      },
      {
        title: "Item3",
        path: "/orgSetup/item3",
      },
    ],
  },
  {
    title: "Link3",
    logo: <FiLock />,
    path: "/link3",
    childLinks: [
      {
        title: "Item1",
        path: "/link3/item1",
      },
      {
        title: "Item2",
        path: "/link3/item2",
      },
    ],
  },
  {
    title: "Link4",
    logo: <FiInbox />,
    path: "/link4",
  },
  {
    title: "Link5",
    logo: <FiRadio />,
    path: "/link5",
    childLinks: [
      {
        title: "Item1",
        path: "/link5/item1",
      },
      {
        title: "Item2",
        path: "/link5/item2",
      },
    ],
  },
  {
    title: "Link6",
    logo: <FiUserPlus />,
    path: "/link4",
  },
  {
    title: "Settings",
    logo: <MdOutlineSettings />,
    path: "/settings",
    childLinks: [
      {
        title: "Item1",
        path: "/settings/item1",
      },
      {
        title: "Item2",
        path: "/settings/item2",
      },
    ],
  },
  {
    name: "Approval",
    icon: "CheckCircle",
    subLinks: [
      {
        name: "KYC Approval",
        path: "/approval/kyc",
      },
    ],
  }
];
