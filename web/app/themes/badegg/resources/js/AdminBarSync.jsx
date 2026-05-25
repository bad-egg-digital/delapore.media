import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AdminBarSync() {
  const location = useLocation();

  useEffect(() => {
    const adminBar = document.getElementById("wpadminbar");

    if (!adminBar) return;

    // Example: update body class
    document.body.setAttribute(
      "data-current-route",
      location.pathname
    );

    // Example: change edit link dynamically
    const editLink = document.querySelector(
      "#wp-admin-bar-edit a"
    );

    if (editLink) {
      if (location.pathname === "/about") {
        editLink.href =
          "/wp-admin/post.php?post=12&action=edit";
      }

      if (location.pathname === "/blog") {
        editLink.href =
          "/wp-admin/edit.php";
      }
    }

    // Example: custom active class
    adminBar
      .querySelectorAll(".custom-active")
      .forEach(el => el.classList.remove("custom-active"));

    const activeNode = adminBar.querySelector(
      `[data-route="${location.pathname}"]`
    );

    if (activeNode) {
      activeNode.classList.add("custom-active");
    }
  }, [location]);

  return null;
}

export default AdminBarSync;
