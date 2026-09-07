import clsx from "clsx";
import type { User } from "@/types";

interface AvatarProps {
  user: User;
  className?: string;
}

const Avatar = ({ user, className }: AvatarProps) => {
  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <div
      className={clsx("avatar", className)}
      style={{ backgroundColor: user.color }}
      title={user.name}
      aria-label={user.name}
    >
      {initial}
    </div>
  );
};

export default Avatar;
