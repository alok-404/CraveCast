export const mockRestaurants = [
  {
    id: 1,
    name: "The Grand Dhaba",
    cuisine: "North Indian, Punjabi",
    rating: 4.5,
    deliveryTime: "30-40 mins",
    image: "https://images.unsplash.com/photo-1564759077036-3def242e69c5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    foodItems: [
      { id: 101, name: "Paneer Tikka Masala", price: 350 },
      { id: 102, name: "Butter Naan", price: 60 },
      { id: 103, name: "Dal Makhani", price: 280 },
    ],
  },
  {
    id: 2,
    name: "South Spice Express",
    cuisine: "South Indian, Kerala",
    rating: 4.2,
    deliveryTime: "20-30 mins",
    image: "https://via.placeholder.com/150/7fafff/333333?text=South",
    foodItems: [
      { id: 201, name: "Masala Dosa", price: 120 },
      { id: 202, name: "Filter Coffee", price: 70 },
      { id: 203, name: "Idli Sambar", price: 90 },
    ],
  },
  {
    id: 3,
    name: "Wok N Roll",
    cuisine: "Chinese, Asian",
    rating: 4.8,
    deliveryTime: "45-55 mins",
    image: "https://via.placeholder.com/150/7fffaf/333333?text=Wok",
    foodItems: [
      { id: 301, name: "Veg Hakka Noodles", price: 220 },
      { id: 302, name: "Chilli Paneer", price: 310 },
      { id: 303, name: "Manchurian Dry", price: 290 },
    ],
  },
];