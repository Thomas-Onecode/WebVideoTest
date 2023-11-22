import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  NavLink,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import {
  RiRecordCircleLine,
  RiHome6Line,
  RiUserShared2Line,
  RiFileUserLine,
} from "react-icons/ri";

export const links = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "manifest",
    href: "/site.webmanifest",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon-png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
];

export const loader = async ({ params }) => {
  return params;
};

export default function App() {
  const loaderData = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="relative lg:flex lg:flex-col-reverse lg:w-[1024] xl:w-[1280px] lg:m-auto">
        <main className="mb-20 relative">
          <Outlet />
        </main>
        <nav className="fixed bottom-0 w-full flex justify-around items-center rounded-lg h-[80px] border-t-2 z-90 bg-blue-600 lg:relative lg:flex lg:w-auto">
          <NavLink
            className={({ isActive, isPending }) =>
              `nav-link ${isPending ? "pending" : isActive ? "active" : ""}`
            }
            to={`${loaderData.company}/customers`}
          >
            <RiUserShared2Line size={30} />
            Kunder
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) =>
              `nav-link ${isPending ? "pending" : isActive ? "active" : ""}`
            }
            to={`${loaderData.company}/employees`}
          >
            <RiFileUserLine size={30} />
            Ansatte
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) =>
              `nav-link ${isPending ? "pending" : isActive ? "active" : ""}`
            }
            to={`${loaderData.company}/record`}
          >
            <RiRecordCircleLine size={30} />
            Optag
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) =>
              `nav-link ${isPending ? "pending" : isActive ? "active" : ""}`
            }
            to={`${loaderData.company}/home`}
          >
            <RiHome6Line size={30} />
            Home
          </NavLink>
        </nav>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
