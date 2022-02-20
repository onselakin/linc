import 'renderer/App.css';
import { Link } from 'react-router-dom';

const SideBar = () => {
  return (
    <div className="absolute top-14 left-0 w-14 bottom-0 border-2 flex content-center justify-center border-blue-500 bg-green-500">
      <Link to="/">
        <button type="button" className="w-6 h-6 bg-amber-100">
          L
        </button>
      </Link>
    </div>
  );
};
export default SideBar;