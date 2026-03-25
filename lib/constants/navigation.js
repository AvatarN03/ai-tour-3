

import {
  BarChart,
  Bookmark,
  Home,
  Map,
  MessageSquare,
  Users,
  Wrench,
} from "lucide-react";

export const sidebarMenus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Discover",
    href: "/discover",
    icon: Map,
  },
  {
    name: "Trips Inbox",
    href: "/trips",
    icon: Bookmark,
  },
  {
    name: "AI Assistant",
    href: "/ai",
    icon: MessageSquare,
  },
  {
    name: "Zone",
    href: "/zone",
    icon: Users,
  },
  {
    name: "Tools",
    href: "/tools",
    icon: Wrench,
  },
  {
    name: "Insights",
    href: "/insights",
    icon: BarChart,
  },
];

export const landingPageMenus = [
  { name: "Home",        href: "/#home" },
  { name: "Services",   href: "/#services" },
  { name: "How It Works", href: "/#htw" },
  { name: "Pricing",    href: "/#pricing" },
  { name: "About Us",   href: "/about" },
  { name: "Contact Us",   href: "/contact" },
];
