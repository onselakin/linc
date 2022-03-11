import 'renderer/App.css';

const TopBar = () => {
  return (
    <div className="draggable absolute left-0 top-0 right-0 h-12 w-full flex items-center justify-center bg-container text-white">
      <h1>
        <i className="fa-solid fa-flask fa-sm text-[#FFB543] w-5" />
        LinC
      </h1>
    </div>
  );
};
export default TopBar;
