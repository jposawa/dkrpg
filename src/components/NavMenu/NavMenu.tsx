import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CodeSandboxOutlined, HomeOutlined, SettingOutlined, SolutionOutlined } from "@ant-design/icons";

import styles from "./NavMenu.module.scss";

export const NavMenu = () => {
  const { pathname } = useLocation();
  const PAGES_LIST = [
    {
      url: "/",
      name: "Home",
      icon: <HomeOutlined />,
      altPath: "/home",
    },
    {
      url: "/library/",
      name: "Sheets",
      icon: <SolutionOutlined />,
    },
    {
      url: "/dices",
      name: "Dices",
      icon: <CodeSandboxOutlined />,
    },
    {
      url: "/settings",
      name: "Settings",
      icon: <SettingOutlined />,
    },
  ]

  return (
    <nav className={styles.navMenu}>
      {PAGES_LIST.map((page, index) => (
        <Link
          key={`item${index}`} to={page.url}
          className={pathname === page.url || pathname === page.altPath ? styles.currentPage : ""}
        >
          {page.icon}
          <p>{page.name}</p>
        </Link>))}
    </nav>
  )
}