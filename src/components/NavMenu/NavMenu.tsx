import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CodeSandboxOutlined, HomeOutlined, SettingOutlined, SolutionOutlined } from "@ant-design/icons";

import styles from "./NavMenu.module.scss";

export const NavMenu = () => {
  const { pathname } = useLocation();
  const PAGES_LIST = [
    {
      url: "/",
      name: "Início",
      icon: <HomeOutlined />,
      altPath: "/home",
    },
    {
      url: "/library/",
      name: "Fichas",
      icon: <SolutionOutlined />,
    },
    {
      url: "/dices",
      name: "Dados",
      icon: <CodeSandboxOutlined />,
    },
    {
      url: "/settings",
      name: "Configs",
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