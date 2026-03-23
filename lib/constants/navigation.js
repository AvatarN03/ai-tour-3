/**
 * Navigation Constants
 * Sidebar menus & landing page nav links
 */

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
    translationKey: "sidebar.dashboard",
  },
  {
    name: "Discover",
    href: "/discover",
    icon: Map,
    translationKey: "sidebar.discover",
  },
  {
    name: "Trips Inbox",
    href: "/trips",
    icon: Bookmark,
    translationKey: "sidebar.savedTrips",
  },
  {
    name: "AI Assistant",
    href: "/ai",
    icon: MessageSquare,
    translationKey: "sidebar.aiAssistant",
  },
  {
    name: "Zone",
    href: "/zone",
    icon: Users,
    translationKey: "sidebar.zone",
  },
  {
    name: "Tools",
    href: "/tools",
    icon: Wrench,
    translationKey: "sidebar.tools",
  },
  {
    name: "Insights",
    href: "/insights",
    icon: BarChart,
    translationKey: "sidebar.insights",
  },
];

export const landingPageMenus = [
  { name: "Home",        href: "#home",     translationKey: "navbar.home" },
  { name: "Services",   href: "#services",  translationKey: "navbar.services" },
  { name: "How It Works", href: "#htw",    translationKey: "navbar.howItWorks" },
  { name: "Pricing",    href: "#pricing",   translationKey: "navbar.pricing" },
  { name: "About Us",   href: "#about",     translationKey: "navbar.aboutUs" },
];
