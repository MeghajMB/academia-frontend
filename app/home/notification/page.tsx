"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { Bell, Mail, CreditCard, Info, Filter, Check } from "lucide-react";
import { INotification } from "@/types/notification";
import moment from "moment";
import useNotificationApi from "@/hooks/api/useNotificationApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ProtectedRoute from "@/hoc/ProtectedRoute";
import { clearNotifications, removeNotification } from "@/store/features/notification/notificationSlice";

// Mock data for notifications

function NotificationPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const {
    fetchUnreadNotificationApi,
    markNotificationAsReadApi,
    markAllNotificationAsReadApi,
  } = useNotificationApi();
  const { id } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;
        const notificationResponse = await fetchUnreadNotificationApi(id);
        if (notificationResponse.status == "error") {
          return;
        }
        console.log(notificationResponse);
        setNotifications(notificationResponse.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [ id]);

  // Function to mark a notification as read
  const markAsRead = async (index: number, notificationId: string) => {
    try {
      const response=await markNotificationAsReadApi(notificationId);
      if(response.status=="error"){
        return
      }
      dispatch(removeNotification(notificationId))
      const updatedNotifications = [...notifications];
      updatedNotifications[index].isRead = true;
      setNotifications(updatedNotifications);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await markAllNotificationAsReadApi();
      if (response.status == "error") {
        return;
      }
      dispatch(clearNotifications())
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter notifications based on selected filter
  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notification) => notification.type === filter);

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "course":
        return <Bell className="h-5 w-5 text-primary" />;
      case "payment":
        return <CreditCard className="h-5 w-5 text-success" />;
      case "message":
        return <Mail className="h-5 w-5 text-warning" />;
      case "system":
        return <Info className="h-5 w-5 text-danger" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  // Get color based on notification type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "course":
        return "primary";
      case "payment":
        return "success";
      case "message":
        return "warning";
      case "system":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <ProtectedRoute role={["instructor", "student"]}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="flex gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  startContent={<Filter className="h-4 w-4" />}
                >
                  {filter === "all"
                    ? "All Notifications"
                    : `${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Filter notifications"
                onAction={(key) => setFilter(key as string)}
                selectedKeys={new Set([filter])}
                selectionMode="single"
              >
                <DropdownItem key="all">All Notifications</DropdownItem>
                <DropdownItem key="course">Course</DropdownItem>
                <DropdownItem key="payment">Payment</DropdownItem>
                <DropdownItem key="message">Message</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button
              color="primary"
              variant="flat"
              startContent={<Check className="h-4 w-4" />}
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white">No notifications to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => (
              <Card
                key={index}
                className={`p-4 transition-all ${
                  !notification.isRead ? "border-l-4 border-primary" : ""
                }`}
                isPressable
                onPress={() => markAsRead(index, notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-gray-100 p-2">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {notification.title}
                        </h3>
                        <Chip
                          color={
                            getTypeColor(notification.type) as
                              | "primary"
                              | "success"
                              | "warning"
                              | "danger"
                              | "default"
                              | "secondary"
                          }
                          size="sm"
                          variant="flat"
                          className="mt-1"
                        >
                          {notification.type}
                        </Chip>
                      </div>
                      <div className="text-sm text-gray-500">
                        {moment(notification.createdAt).format(
                          "MMM DD, YYYY HH:mm:ss"
                        )}
                        {!notification.isRead && (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary"></span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{notification.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default NotificationPage;
