import { Link } from "react-router-dom";
const NavItemsInfo = [
  { name: "Home" },
  { name: "Articles" },
  { name: "Pages" },
  { name: "Pricing" },
  { name: "Faq" },
];
const NavItem = ({ name }) => {
  return (
    <li className=" relative group">
      <Link to="/" className="px-4 py-2">
        {name}
      </Link>
      <span className="text-blue-500 absolute transition-all duration-500 font-bold right-0 top-0  group-hover:right-[90%] opacity-0 group-hover:opacity-100">
        |
      </span>
    </li>
  );
};

const Header = () => {
  return (
    <section>
      <header className="container mx-auto px-2 flex justify-between py-4 items-center">
        <div>
          <h2>
            <Link to="/">BLOG APP</Link>
          </h2>
        </div>
        <div className="flex gap-x-9 ">
          <ul className="flex gap-x-2 items-center">
            {NavItemsInfo.map((item) => (
              <NavItem key={item.name} name={item.name} />
            ))}
          </ul>
          <button className=" border-2 border-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
            Sign In
          </button>
        </div>
      </header>
    </section>
  );
};

export default Header;
