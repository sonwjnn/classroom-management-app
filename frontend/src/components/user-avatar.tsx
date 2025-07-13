import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const avatarSizes = cva("", {
  variants: {
    size: {
      xs: "size-6",
      default: "size-8",
      md: "size-12",
      lg: "size-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  name: string;
  imageUrl?: string;
  className?: string;
}

export const UserAvatar = ({
  name,
  imageUrl,
  size,
  className,
}: UserAvatarProps) => {
  return (
    <div
      className={cn("relative rounded-full", className, avatarSizes({ size }))}
    >
      <Avatar className={cn(avatarSizes({ size }))}>
        <AvatarImage src={imageUrl} className="object-cover" />
        <AvatarFallback className=" bg-sky-500 font-medium text-white">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
