import { User } from '@/lib/types/auth';

export function getUserInitials(user?: User): string {
  if (!user?.name) return "U";

  const name = user.name.trim();
  const parts = name.split(/\s+/);

  if (parts.length >= 2) {
    // First letter of first name + first letter of last name
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else {
    // First 2 letters of single name
    return name.substring(0, 2).toUpperCase();
  }
}