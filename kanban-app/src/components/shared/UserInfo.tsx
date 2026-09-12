import type { User } from "@/types";
import Avatar from "./Avatar";

type UserInfoProps = {
  user: User;
  avatarClassName: string;
  nameClassName: string;
};

const UserInfo = ({ user, avatarClassName, nameClassName }: UserInfoProps) => (
  <>
    <Avatar user={user} className={avatarClassName} />
    <span className={nameClassName}>{user.name}</span>
  </>
);
export default UserInfo;