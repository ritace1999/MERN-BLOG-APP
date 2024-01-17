import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavItemCollapse = ({
  content,
  title,
  icon,
  name,
  activeNavName,
  setActiveNavName,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if (activeNavName !== name) {
      setIsChecked(false);
    }
  }, [activeNavName, name]);

  return (
    <div
      className="collapse-arrow collapse grid  min-h-0 grid-cols-[auto,0.8fr] bg-base-200 py-0 text-[#a5a5a5]  "
      checked={name === activeNavName}
    >
      <input
        type="checkbox"
        className="min-h-0 p-8"
        onChange={() => {
          setActiveNavName(name);
          setIsChecked(!isChecked);
        }}
      />
      <div
        className={`collapse-title flex min-h-0 items-center gap-x-2 py-0 pl-0 text-lg font-medium ${name == activeNavName ? "font-bold text-primary" : "font-semibold text-[#a5a5a5]"} `}
      >
        {icon}
        {title}
      </div>
      <div className="collapse-content">
        <div className=" flex flex-col gap-y-3 px-2">
          {content.map((items) => (
            <Link key={items.title} to={items.link}>
              {items.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavItemCollapse;
