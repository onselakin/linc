import 'renderer/App.css';
import { Link, LinkProps, useLocation } from 'react-router-dom';

interface SidebarLinkProps extends LinkProps {
  iconName: string;
}

const Button = ({ iconName, to }: SidebarLinkProps) => {
  const location = useLocation();

  if (location.pathname.startsWith(to as string)) {
    return (
      <Link to={to} className="w-14 h-14 block flex justify-center items-center border-l-4 border-l-green text-green">
        <i className={`fa-solid fa-${iconName} fa-xl`} />
      </Link>
    );
  }

  return (
    <Link to={to} className="w-14 h-14 block flex justify-center items-center">
      <i className={`fa-solid fa-${iconName} fa-xl text-icon hover:text-green`} />
    </Link>
  );
};

const SideBar = () => {
  return (
    <div className="absolute top-12 left-0 w-14 bottom-0 flex flex-col align-middle items-center bg-component pt-8 gap-8">
      <div>
        <Button iconName="chalkboard" to="/lab" />
        <Button iconName="gears" to="/settings" />
      </div>
      <div className="mt-auto mb-14">
        <Button iconName="question" to="/help" />
      </div>
    </div>
  );
};
export default SideBar;
