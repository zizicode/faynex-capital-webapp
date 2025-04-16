
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function calculateReferralEarnings(amount, level) {
  const commissions = {
    1: 0.50, // 50% for direct referrals
    2: 0.10, // 10% for second level
    3: 0.05, // 5% for third level
  };
  return amount * commissions[level];
}

export function getActiveReferrals(users, userId, level = 1) {
  if (level > 3) return [];
  
  const directReferrals = users.filter(user => 
    user.referredBy === userId && user.isActive
  );

  if (level === 1) return directReferrals;

  const nextLevelReferrals = directReferrals.flatMap(referral =>
    getActiveReferrals(users, referral.id, level + 1)
  );

  return [...directReferrals, ...nextLevelReferrals];
}

export function checkUserSubscription() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return null;

  const subscriptions = JSON.parse(localStorage.getItem("subscriptions") || "[]");
  return subscriptions.find(sub => sub.userId === currentUser.id && new Date(sub.expiryDate) > new Date());
}
