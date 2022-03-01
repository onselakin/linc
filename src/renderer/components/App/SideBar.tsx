import 'renderer/App.css';
import { NavLink } from 'react-router-dom';

const Button = ({ iconName, link }: { iconName: string; link: string }) => (
  <NavLink
    to={link}
    className={({ isActive }) =>
      `w-14 h-14 block flex justify-center items-center ${isActive ? 'border-l-4 border-l-green text-green' : ''}`
    }
  >
    <i className={`fa-solid fa-${iconName} fa-xl text-icon hover:text-green`} />
  </NavLink>
);

const SideBar = () => {
  return (
    <div className="absolute top-12 left-0 w-14 bottom-0 flex flex-col align-middle items-center bg-component pt-8 gap-8">
      <Button iconName="chalkboard" link="/labs" />
      <Button iconName="gears" link="/settings" />
      <Button iconName="question" link="/info" />
    </div>
  );
};
export default SideBar;
