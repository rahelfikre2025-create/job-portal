import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props} />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

// AvatarFallback now accepts 'name' prop and shows first letter if no image, with a consistent random color
const COLORS = [
  '#F59E42', // orange
  '#4F8EF7', // blue
  '#34C759', // green
  '#FF5E5E', // red
  '#A259F7', // purple
  '#F7B32B', // yellow
  '#2EC4B6', // teal
  '#FF7F50', // coral
  '#FFB347', // light orange
  '#6C63FF', // indigo
];
function stringToColor(str) {
  if (!str) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}
const AvatarFallback = React.forwardRef(({ className, name, ...props }, ref) => {
  const firstLetter = name && typeof name === 'string' && name.length > 0 ? name[0].toUpperCase() : '';
  const bgColor = stringToColor(name);
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full text-lg font-bold text-white",
        className
      )}
      style={{ backgroundColor: bgColor }}
      {...props}
    >
      {firstLetter}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback }