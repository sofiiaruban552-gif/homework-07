import type { PropsWithChildren, HTMLAttributes } from "react";
import clsx from "clsx";

type SurfaceProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

const Surface = ({ children, className, ...props }: SurfaceProps) => {
  return (
    <div className={clsx("surface", className)} {...props}>
      {children}
    </div>
  );
};

export default Surface;
