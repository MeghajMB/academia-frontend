"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import type { RootState } from "@/lib/store";
import { customAxios } from "@/api/axios";
import { logout } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  User,
} from "@heroui/react";
import {
  Bell,
  LogOut,
  UserIcon,
  BookOpen,
  ShoppingCart,
  Home,
  Briefcase,
  ChevronDown,
  Glasses,
} from "lucide-react";
import ProfilePicture from "@/public/images/blankUserProfile.jpeg";
import useNotification from "@/hooks/socket/useSocketNotification";
import Image from "next/image";
import AcademiaLogo from '@/public/images/academia-logo.png'
const UserNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { notifications, notificationCount } = useNotification(user.id);

  async function handleLogout() {
    setLoading(true);
    try {
      await customAxios.post("/api/auth/signout");
      dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  let instructorRoute;
  if (user?.role === "student") {
    instructorRoute = { path: "/home/teaching", label: "Become an Instructor",icon:<Glasses />  };
  } else {
    instructorRoute = { path: "/instructor", label: "Instructor",icon:<Glasses /> };
  }

  const navigationItems = [
    { path: "/home", label: "Home", icon: <Home size={18} /> },
    instructorRoute,
    { path: "/home/courses", label: "Courses", icon: <BookOpen size={18} /> },
    {
      path: "/home/gigs",
      label: "Gigs",
      icon: <Briefcase size={18} />,
    },
    {
      path: "/home/my-learning",
      label: "My Learning",
      icon: <BookOpen size={18} />,
    },
    {
      path: "/home/my-gigs",
      label: "My Gigs",
      icon: <Briefcase size={18} />,
    },
    { path: "/home/shop", label: "Shop", icon: <ShoppingCart size={18} /> },
  ];

  if (!isClient) {
    return (
      <Navbar className="bg-black">
        <NavbarContent>
          <NavbarBrand>
            <div className="w-8 h-8 bg-primary rounded"></div>
            <p className="font-bold text-inherit ml-2">Academia</p>
          </NavbarBrand>
        </NavbarContent>
      </Navbar>
    );
  }

  return (
    <Navbar
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-black border-b border-divider"
      isBordered
      isBlurred={false}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
        <NavbarBrand>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => {
              return user?.role ? router.push("/home") : router.push("/");
            }}
            className="flex items-center cursor-pointer"
          >
            <div className="w-8 h-8 bg-primary rounded relative"><Image src={AcademiaLogo.src} alt="logo" fill/></div>
            <span className="text-xl font-bold ml-2">Academia</span>
          </motion.div>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden lg:flex gap-4" justify="center">
        {user?.role &&
          navigationItems.map((item, index) => (
            <NavbarItem key={index} isActive={path === item.path}>
              <Link
                href={item.path}
                className={`flex items-center gap-1 ${
                  path === item.path ? "text-secondary" : "text-foreground"
                } hover:text-secondary transition-colors`}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </Link>
            </NavbarItem>
          ))}
      </NavbarContent>
      <NavbarContent justify="end">
        {!user?.role ? (
          <>
            <NavbarItem>
              <Button
                as={Link}
                href="/login"
                variant="light"
                className="hover:text-indigo-400 hover:bg-indigo-700/20 transition-colors"
              >
                Log In
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                href="/signUp"
                variant="flat"
                color="secondary"
                className="hover:text-indigo-400 hover:bg-indigo-700/20 transition-colors"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            {/* Notifications Dropdown */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly variant="light" className="text-foreground">
                  {notificationCount && notificationCount > 0 ? (
                    <Badge
                      content={notificationCount}
                      color="danger"
                      shape="circle"
                      size="sm"
                    >
                      <Bell size={20} />
                    </Badge>
                  ) : (
                    <Bell size={20} />
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Notifications">
                <>
                  <DropdownItem key="notifications" className="h-14 gap-2">
                    <p className="font-bold">Notifications</p>
                    <p className="text-sm text-default-500">
                      See all your notifications
                    </p>
                  </DropdownItem>
                  {notifications.map((notification) => {
                    return (
                      <DropdownItem key={notification.message}>
                        {notification.title}
                      </DropdownItem>
                    );
                  })}
                  <DropdownItem
                    key="view-all"
                    color="secondary"
                  >
                    <Link href="/home/notification">
                      View All Notifications
                    </Link>
                  </DropdownItem>
                </>
              </DropdownMenu>
            </Dropdown>

            {/* Profile Dropdown */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="p-0 bg-transparent"
                  endContent={<ChevronDown size={16} />}
                >
                  <User
                    name={user.userName || "User"}
                    description={user.role || "Student"}
                    avatarProps={{
                      src: user.profilePicture || ProfilePicture.src,
                      size: "sm",
                      isBordered: true,
                      color: "primary",
                    }}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User Actions"
                disabledKeys={loading ? ["logout"] : []}
              >
                <DropdownItem
                  key="profile"
                  startContent={<UserIcon size={16} />}
                  textValue="Profile"
                >
                  <Link href="/home/profile">My Profile</Link>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  startContent={<LogOut size={16} />}
                  color="danger"
                  onPress={handleLogout}
                  isDisabled={loading}
                  textValue="Logout"
                >
                  {loading ? "Logging out..." : "Logout"}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="pt-6 bg-black">
        {!user?.role ? (
          <>
            <NavbarMenuItem>
              <Button
                as={Link}
                href="/login"
                variant="light"
                color="primary"
                className="w-full justify-start"
              >
                Log In
              </Button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                as={Link}
                href="/signUp"
                color="primary"
                variant="flat"
                className="w-full justify-start"
              >
                Sign Up
              </Button>
            </NavbarMenuItem>
          </>
        ) : (
          <>
            {/* User Profile in Mobile Menu */}
            <NavbarMenuItem className="mb-4">
              <User
                name={user.userName || "User"}
                description={user.role || "Student"}
                avatarProps={{
                  src: user.profilePicture || ProfilePicture.src,
                  size: "lg",
                  isBordered: true,
                  color: "primary",
                }}
              />
            </NavbarMenuItem>

            {/* Navigation Items */}
            {navigationItems.map((item, index) => (
              <NavbarMenuItem key={index}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 w-full py-2 ${
                    path === item.path ? "text-secondary" : "text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}

            {/* Additional Mobile Menu Items */}
            <NavbarMenuItem>
              <Link
                href="/home/notification"
                className="flex items-center gap-2 w-full py-2"
              >
                <Bell size={18} />
                Notifications
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                href="/home/profile"
                className="flex items-center gap-2 w-full py-2"
              >
                <UserIcon size={18} />
                Profile
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                color="danger"
                variant="flat"
                startContent={<LogOut size={18} />}
                onPress={handleLogout}
                disabled={loading}
                className="w-full justify-start mt-4"
              >
                {loading ? "Logging out..." : "Logout"}
              </Button>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

export default UserNavbar;
