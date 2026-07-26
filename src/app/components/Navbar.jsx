"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import {
  Menu,
  X,
  Search,
  User,
  Download,
  Share2,
  LogOut,
  ChevronRight,
  ChevronDown,
  CircleUserRound,
  CalendarCheck,
} from "lucide-react";

const WEBSITE_URL = "https://www.pujadham.co.in";
const INSTAGRAM_URL = "https://www.instagram.com/puja_dham/";
const SHARE_IMAGE_URL = "/Pujadhamlogo1.png";

const searchLinks = [
  { label: "Home", href: "/" },
  { label: "All Pujas", href: "/pujas?mode=all" },
  { label: "Online Pujas", href: "/pujas?mode=online" },
  { label: "Home Visit", href: "/pujas?mode=offline" },
  { label: "All Sevas", href: "/seva" },
  { label: "Gau Seva", href: "/gau-seva" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "About us", href: "/aboutpanditji" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const path = usePathname();
  const { data: session, status } = useSession();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const isAdmin =
    status === "authenticated" &&
    !!session?.user?.email &&
    !!adminEmail &&
    session.user.email.toLowerCase() === adminEmail.toLowerCase();

  // Pujas is rendered separately because it has a dropdown.
  const links = [
    { label: "Home", href: "/" },

    // Seva is a separate main navigation item.
    { label: "Seva", href: "/seva" },

    { label: "My Bookings", href: "/my-bookings" },

    ...(isAdmin
      ? [{ label: "Dashboard", href: "/pandit-dashboard" }]
      : []),

    { label: "About us", href: "/aboutpanditji" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  const pujaMenuLinks = [
    {
      label: "All Pujas",
      href: "/pujas?mode=all",
    },
    {
      label: "Ghar Par Puja",
      href: "/pujas?mode=offline",
    },
    {
      label: "Online Puja",
      href: "/pujas?mode=online",
    },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobilePujaOpen, setMobilePujaOpen] = useState(false);
  const [desktopPujaOpen, setDesktopPujaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const menuRef = useRef(null);
  const desktopPujaRef = useRef(null);
  const searchRef = useRef(null);
  const settingsRef = useRef(null);

  const isLoading = status === "loading";
  const isLoggedIn =
    status === "authenticated" && !!session?.user;

  const userName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "Guest User";

  const userEmail =
    session?.user?.email ||
    "Login to manage your account";

  const userImage = session?.user?.image;
  const firstLetter =
    userName?.charAt(0)?.toUpperCase() || "P";

  const isActive = (href) => {
    if (href === "/") {
      return path === "/";
    }

    return path === href || path.startsWith(`${href}/`);
  };

  const isPujaSectionActive = isActive("/pujas");

  useEffect(() => {
    setMenuOpen(false);
    setMobilePujaOpen(false);
    setDesktopPujaOpen(false);
    setSearchOpen(false);
    setSettingsOpen(false);
    setSearchText("");
  }, [path]);

  useEffect(() => {
    const closeOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        setMobilePujaOpen(false);
      }

      if (
        desktopPujaRef.current &&
        !desktopPujaRef.current.contains(event.target)
      ) {
        setDesktopPujaOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }

      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("touchstart", closeOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        closeOutside
      );

      document.removeEventListener(
        "touchstart",
        closeOutside
      );
    };
  }, []);

  const filteredSearchLinks = searchLinks.filter(
    (item) =>
      item.label
        .toLowerCase()
        .includes(searchText.trim().toLowerCase())
  );

  const SHARE_IMAGE_URL = "/Pujadhamlogo1.png";

const getShareMessage = () => {
  return `🙏 Puja Dham 🙏

Experience authentic Vedic pujas and spiritual services with experienced Pandit Ji.

🛕 Online & Offline Puja Services
🔮 Astrology Consultations
🧭 Vastu Guidance
🐄 Gau Seva & Spiritual Sevas

🌐 Website:
${WEBSITE_URL}

📸 Instagram:
${INSTAGRAM_URL}

Please share Puja Dham with your family and friends. 🙏`;
};

const getShareImageFile = async () => {
  const response = await fetch(SHARE_IMAGE_URL);

  if (!response.ok) {
    throw new Error("Share image could not be loaded");
  }

  const blob = await response.blob();

  return new File([blob], "puja-dham.png", {
    type: blob.type || "image/png",
  });
};

const handleShareApp = async () => {
  const shareMessage = getShareMessage();

  try {
    if (navigator.share) {
      const imageFile = await getShareImageFile();

      if (
        navigator.canShare &&
        navigator.canShare({
          files: [imageFile],
        })
      ) {
        await navigator.share({
          title: "Puja Dham",
          text: shareMessage,
          files: [imageFile],
        });

        setSettingsOpen(false);
        return;
      }

      await navigator.share({
        title: "Puja Dham",
        text: shareMessage,
      });

      setSettingsOpen(false);
      return;
    }

    await navigator.clipboard.writeText(
      shareMessage
    );

    alert("Puja Dham message copied!");

    setSettingsOpen(false);
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error("Share failed:", error);

      try {
        await navigator.clipboard.writeText(
          shareMessage
        );

        alert(
          "Image sharing was unavailable, so the complete message was copied."
        );
      } catch (clipboardError) {
        console.error(
          "Clipboard copy failed:",
          clipboardError
        );
      }
    }
  }
};

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-[#eee8e2] bg-white">
        <nav className="relative mx-auto flex h-[78px] max-w-[1500px] items-center px-4 sm:px-6 lg:h-[88px] lg:px-10">
          {/* MOBILE HAMBURGER */}
          <div
            ref={menuRef}
            className="relative z-30 lg:hidden"
          >
            <button
              type="button"
              aria-label={
                menuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((value) => !value);
                setSearchOpen(false);
                setSettingsOpen(false);
              }}
              className="flex h-11 w-11 items-center justify-center border-none bg-transparent text-[#28221f] shadow-none transition active:scale-90"
            >
              {menuOpen ? (
                <X size={25} strokeWidth={1.8} />
              ) : (
                <Menu size={27} strokeWidth={1.7} />
              )}
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-[59px] max-h-[calc(100dvh-92px)] w-[290px] max-w-[calc(100vw-24px)] overflow-y-auto overscroll-contain border border-[#eee8e2] bg-white p-3 shadow-[0_22px_60px_rgba(39,27,20,0.14)] [scrollbar-width:thin]">
                <Link
                  href="/"
                  className={`flex items-center justify-between border-b border-[#f3efeb] px-3 py-4 text-[14px] font-medium transition ${
                    isActive("/")
                      ? "text-[#b34d1d]"
                      : "text-[#332c28] hover:text-[#b34d1d]"
                  }`}
                >
                  Home
                  <ChevronRight
                    size={16}
                    strokeWidth={1.6}
                  />
                </Link>

                {/* MOBILE PUJAS DROPDOWN */}
                <div className="border-b border-[#f3efeb] bg-white">
                  <button
                    type="button"
                    aria-expanded={mobilePujaOpen}
                    onClick={() =>
                      setMobilePujaOpen((value) => !value)
                    }
                    className={`flex w-full items-center justify-between bg-white px-3 py-4 text-left text-[14px] font-medium transition ${
                      isPujaSectionActive
                        ? "text-[#b34d1d]"
                        : "text-[#332c28] hover:text-[#b34d1d]"
                    }`}
                  >
                    <span>Pujas</span>

                    <ChevronDown
                      size={17}
                      strokeWidth={1.7}
                      className={`transition-transform duration-200 ${
                        mobilePujaOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobilePujaOpen && (
                    <div className="border-t border-[#f4efeb] bg-white pb-2 pl-5 pr-1 pt-1">
                      {pujaMenuLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobilePujaOpen(false);
                          }}
                          className="flex min-h-12 items-center justify-between border-b border-[#f5f1ee] bg-white px-3 py-3 text-[13px] font-medium text-[#443b35] transition last:border-b-0 hover:text-[#b34d1d]"
                        >
                          <span>{item.label}</span>

                          <ChevronRight
                            size={15}
                            strokeWidth={1.6}
                            className="text-[#9e9189]"
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {links
                  .filter((item) => item.href !== "/")
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between border-b border-[#f3efeb] px-3 py-4 text-[14px] font-medium transition last:border-0 ${
                        isActive(item.href)
                          ? "text-[#b34d1d]"
                          : "text-[#332c28] hover:text-[#b34d1d]"
                      }`}
                    >
                      {item.label}

                      <ChevronRight
                        size={16}
                        strokeWidth={1.6}
                      />
                    </Link>
                  ))}

                <Link
                  href="/contact"
                  className="mt-3 flex h-12 items-center justify-center gap-2 bg-[#a8441b] px-5 text-sm font-semibold text-white transition hover:bg-[#873514]"
                >
                  <CalendarCheck size={17} />
                  Book Puja
                </Link>
              </div>
            )}
          </div>

          {/* LARGE LOGO */}
          <Link
            href="/"
            aria-label="Puja Dham Home"
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 lg:static lg:mr-12 lg:translate-x-0 lg:translate-y-0"
          >
            <img
              src="/Pujadhamlogo1.png"
              alt="Puja Dham Logo"
              className="block h-[100px] w-auto max-w-[320px] object-contain sm:h-[110px] sm:max-w-[350px] lg:h-[120px] lg:max-w-[400px] xl:h-[130px] xl:max-w-[450px]"
            />
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden flex-1 items-center justify-center gap-7 lg:flex xl:gap-10">
            <Link
              href="/"
              className={`relative whitespace-nowrap py-8 text-[14px] font-medium tracking-[0.01em] transition-colors duration-200 ${
                isActive("/")
                  ? "text-[#a8441b]"
                  : "text-[#28221f] hover:text-[#a8441b]"
              }`}
            >
              Home

              {isActive("/") && (
                <span className="absolute bottom-[22px] left-0 h-px w-full bg-[#a8441b]" />
              )}
            </Link>

            {/* DESKTOP PUJAS DROPDOWN */}
            <div
              ref={desktopPujaRef}
              className="relative"
              onMouseEnter={() =>
                setDesktopPujaOpen(true)
              }
              onMouseLeave={() =>
                setDesktopPujaOpen(false)
              }
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={desktopPujaOpen}
                onClick={() =>
                  setDesktopPujaOpen(
                    (value) => !value
                  )
                }
                className={`relative flex items-center gap-1.5 whitespace-nowrap bg-transparent py-8 text-[14px] font-medium tracking-[0.01em] transition-colors duration-200 ${
                  isPujaSectionActive
                    ? "text-[#a8441b]"
                    : "text-[#28221f] hover:text-[#a8441b]"
                }`}
              >
                Pujas

                <ChevronDown
                  size={15}
                  strokeWidth={1.7}
                  className={`transition-transform duration-200 ${
                    desktopPujaOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

                {isPujaSectionActive && (
                  <span className="absolute bottom-[22px] left-0 h-px w-full bg-[#a8441b]" />
                )}
              </button>

              {desktopPujaOpen && (
                <div className="absolute left-1/2 top-[74px] w-[260px] -translate-x-1/2 overflow-hidden rounded-[18px] border border-[#eadfd7] bg-white p-2 shadow-[0_22px_60px_rgba(39,27,20,0.14)]">
                  {pujaMenuLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDesktopPujaOpen(false)}
                      className="group flex min-h-12 items-center justify-between rounded-[13px] bg-white px-4 py-3 text-[13px] font-medium text-[#3d342f] transition hover:bg-[#fff7f1] hover:text-[#a8441b]"
                    >
                      <span>{item.label}</span>

                      <ChevronRight
                        size={15}
                        strokeWidth={1.6}
                        className="text-[#a79a92] transition group-hover:translate-x-0.5 group-hover:text-[#a8441b]"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {links
              .filter((item) => item.href !== "/")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative whitespace-nowrap py-8 text-[14px] font-medium tracking-[0.01em] transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-[#a8441b]"
                      : "text-[#28221f] hover:text-[#a8441b]"
                  }`}
                >
                  {item.label}

                  {isActive(item.href) && (
                    <span className="absolute bottom-[22px] left-0 h-px w-full bg-[#a8441b]" />
                  )}
                </Link>
              ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="relative z-30 ml-auto flex items-center gap-1 sm:gap-2">
            <div
              ref={searchRef}
              className="relative hidden sm:block"
            >
              <button
                type="button"
                aria-label="Search"
                aria-expanded={searchOpen}
                onClick={() => {
                  setSearchOpen(
                    (value) => !value
                  );

                  setMenuOpen(false);
                  setDesktopPujaOpen(false);
                  setSettingsOpen(false);
                }}
                className="flex h-11 w-11 items-center justify-center border-none bg-transparent text-[#28221f] shadow-none outline-none transition hover:text-[#a8441b] active:scale-90"
              >
                {searchOpen ? (
                  <X size={21} strokeWidth={1.7} />
                ) : (
                  <Search
                    size={21}
                    strokeWidth={1.7}
                  />
                )}
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-[59px] w-[310px] border border-[#eee8e2] bg-white p-4 shadow-[0_22px_60px_rgba(39,27,20,0.14)]">
                  <div className="flex h-11 items-center gap-2 border border-[#ddd5cf] px-3">
                    <Search
                      size={16}
                      className="text-[#9a8d85]"
                    />

                    <input
                      autoFocus
                      value={searchText}
                      onChange={(event) =>
                        setSearchText(
                          event.target.value
                        )
                      }
                      placeholder="Search Puja Dham..."
                      className="w-full bg-transparent text-[13px] text-[#28221f] outline-none placeholder:text-[#a89d96]"
                    />
                  </div>

                  <div className="mt-2">
                    {filteredSearchLinks.length > 0 ? (
                      filteredSearchLinks.map(
                        (item) => (
                          <Link
                            key={`${item.href}-${item.label}`}
                            href={item.href}
                            className="flex items-center justify-between px-3 py-3 text-[13px] text-[#332c28] transition hover:bg-[#faf7f4] hover:text-[#a8441b]"
                          >
                            {item.label}
                            <ChevronRight
                              size={15}
                            />
                          </Link>
                        )
                      )
                    ) : (
                      <p className="px-3 py-5 text-center text-xs text-[#958981]">
                        No page found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="hidden h-11 items-center justify-center bg-[#a8441b] px-5 text-[13px] font-semibold text-white transition hover:bg-[#873514] xl:flex"
            >
              Book Puja
            </Link>

            <div
              ref={settingsRef}
              className="relative"
            >
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={settingsOpen}
                onClick={() => {
                  setSettingsOpen(
                    (value) => !value
                  );

                  setMenuOpen(false);
                  setDesktopPujaOpen(false);
                  setSearchOpen(false);
                }}
                className="flex h-11 w-11 items-center justify-center overflow-hidden border-none bg-transparent text-[#28221f] shadow-none outline-none transition hover:text-[#a8441b] active:scale-90"
              >
                {isLoading ? (
                  <span className="h-7 w-7 animate-pulse rounded-full bg-[#eee8e2]" />
                ) : isLoggedIn && userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : settingsOpen ? (
                  <X
                    size={21}
                    strokeWidth={1.7}
                  />
                ) : (
                  <User
                    size={22}
                    strokeWidth={1.7}
                  />
                )}
              </button>

              {settingsOpen && (
                <div className="absolute right-0 top-[59px] w-[310px] max-w-[calc(100vw-20px)] border border-[#eee8e2] bg-white shadow-[0_22px_60px_rgba(39,27,20,0.14)]">
                  <div className="flex items-center gap-3 border-b border-[#eee8e2] p-5">
                    {isLoggedIn && userImage ? (
                      <img
                        src={userImage}
                        alt={userName}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7eee8] text-[#a8441b]">
                        {isLoggedIn ? (
                          <span className="text-lg font-semibold">
                            {firstLetter}
                          </span>
                        ) : (
                          <CircleUserRound
                            size={25}
                          />
                        )}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#28221f]">
                        {isLoggedIn
                          ? userName
                          : "Welcome"}
                      </p>

                      <p className="mt-1 truncate text-[11px] text-[#8f837c]">
                        {isLoggedIn
                          ? userEmail
                          : "Login or create your account"}
                      </p>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href={
                        isLoggedIn
                          ? "/account"
                          : "/login"
                      }
                      className="flex items-center gap-3 px-4 py-3 text-[13px] text-[#332c28] transition hover:bg-[#faf7f4] hover:text-[#a8441b]"
                    >
                      <CircleUserRound size={18} />

                      <span className="flex-1">
                        Account
                      </span>

                      <ChevronRight size={15} />
                    </Link>

                    <a
                      href="/downloads/puja-dham.apk"
                      download="puja-dham.apk"
                      className="flex items-center gap-3 px-4 py-3 text-[13px] text-[#332c28] transition hover:bg-[#faf7f4] hover:text-[#a8441b]"
                    >
                      <Download size={18} />

                      <span className="flex-1">
                        Download App
                      </span>

                      <ChevronRight size={15} />
                    </a>

                    <button
                      type="button"
                      onClick={handleShareApp}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] text-[#332c28] transition hover:bg-[#faf7f4] hover:text-[#a8441b]"
                    >
                      <Share2 size={18} />

                      <span className="flex-1">
                        Share
                      </span>

                      <ChevronRight size={15} />
                    </button>

                    {isLoggedIn && (
                      <button
                        type="button"
                        onClick={() =>
                          signOut({
                            callbackUrl: "/",
                          })
                        }
                        className="flex w-full items-center gap-3 border-t border-[#eee8e2] px-4 py-3 text-left text-[13px] text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={18} />

                        <span className="flex-1">
                          Logout
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <div
        className="h-[78px] lg:h-[88px]"
        aria-hidden="true"
      />
    </>
  );
}