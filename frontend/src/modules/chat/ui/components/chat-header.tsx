interface ChatHeaderProps {
  name: string;
}

export const ChatHeader = ({ name }: ChatHeaderProps) => {
  return (
    <div className="text-md flex h-12 items-center border-b border-neutral-200 px-3 font-semibold  ">
      <p className="text-base font-semibold text-zinc-600 ">#{name}</p>
    </div>
  );
};
