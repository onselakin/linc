const TabButton = ({
  idx,
  title,
  active,
  onActivateClick,
  onCloseClick,
}: {
  idx: number;
  title: string;
  active: boolean;
  onActivateClick: () => void;
  onCloseClick: (idx: number) => void;
}) => {
  return (
    <div
      className={`bg-container h-7 items-center px-4 flex flex-row gap-2 ${
        active && 'border-b-2 border-green'
      } text-sm`}
    >
      <button type="button" className="flex flex-row items-center gap-2" onClick={onActivateClick}>
        <i className="fa-solid fa-terminal fa-sm" />
        <p>{title}</p>
      </button>
      <button type="button" className="ml-3 flex flex-row items-center" onClick={() => onCloseClick(idx)}>
        <i className="fa-solid fa-xmark hover:fa-lock fa-sm" />
      </button>
    </div>
  );
};

export default TabButton;
