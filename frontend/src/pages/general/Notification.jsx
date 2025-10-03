// Notification.jsx
import React, { useState } from "react";

const initialNotifications = [
  {
    id: "n1",
    title: "Order Delivered",
    message: "Your order #2345 has been delivered. Enjoy! 🍽️",
    time: "2h ago",
    read: false,
    variant: "success",
  },
  {
    id: "n2",
    title: "New Reel from Tasty Treats",
    message: "Tasty Treats posted a new reel — check it out!",
    time: "5h ago",
    read: false,
    variant: "info",
  },
  {
    id: "n3",
    title: "10% Discount",
    message: "Use code CRAVE10 for 10% off at Swiggy123.",
    time: "1 day ago",
    read: true,
    variant: "promo",
  },
];

const VariantIcon = ({ variant }) => {
  if (variant === "success") return <span>✅</span>;
  if (variant === "promo") return <span>🏷️</span>;
  return <span>🔔</span>;
};

export default function Notification() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const toggleRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );

  const removeNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAll}
            className="text-xs text-red-500 hover:underline"
            title="Clear all"
          >
            Clear all
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No notifications</div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-3 p-3 rounded ${
                n.read ? "bg-gray-50" : "bg-indigo-50"
              }`}
            >
              <div className="mt-1 text-xl">
                <VariantIcon variant={n.variant} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-gray-500">{n.message}</p>
                  </div>
                  <div className="text-xs text-gray-400">{n.time}</div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  {!n.read ? (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-xs bg-indigo-600 text-white px-2 py-1 rounded"
                    >
                      Mark read
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleRead(n.id)}
                      className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                      Mark unread
                    </button>
                  )}

                  <button
                    onClick={() => removeNotification(n.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
