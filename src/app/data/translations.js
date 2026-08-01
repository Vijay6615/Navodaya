import { commonTranslations } from "./translations/common";
import { homeTranslations } from "./translations/home";
import { aboutTranslations } from "./translations/about";
import { galleryTranslations } from "./translations/gallery";
import { contactTranslations } from "./translations/contact";
import { pujaDetailsTranslations } from "./translations/pujaDetails";
import { bookingTranslations } from "./translations/booking";
import { gauSevaTranslations } from "./translations/gauSeva";
import { myBookingsTranslations } from "./translations/myBookings";

// Pujas page translations remain here temporarily.
// They can be moved into translations/pujas.js later.
export const translations = {
  en: {
    ...commonTranslations.en,
    ...homeTranslations.en,
    ...aboutTranslations.en,
    ...galleryTranslations.en,
    ...contactTranslations.en,
    ...pujaDetailsTranslations.en,
    ...bookingTranslations.en,
    ...gauSevaTranslations.en,
    ...myBookingsTranslations.en,
    pujasPage: {
      eyebrow: "Sacred Puja Services",
      searchPlaceholder: "Search {title}...",
      clearSearch: "Clear search",
      showing: "Showing",
      popular: "Popular",
      loading: "Loading Puja services...",

      card: {
        shortDescription:
          "Explore the benefits, rituals, duration, and booking options for this Puja.",
      },

      count: {
        singular: "Puja",
        plural: "Pujas",
        hindi: "Pujas",
      },

      modes: {
        all: {
          label: "All Pujas",
          mobileLabel: "All",
          description: "Online and home-visit services",
        },
        offline: {
          label: "Home Visit",
          mobileLabel: "Home",
          description: "Pandit Ji visits your location",
        },
        online: {
          label: "Online Puja",
          mobileLabel: "Online",
          description: "Attend through live video",
        },
      },

      meta: {
        all: {
          title: "All Pujas",
          description:
            "Explore all available online and home-visit Vedic Puja services.",
        },
        offline: {
          title: "Home Visit",
          description:
            "Book an experienced Pandit Ji to perform the complete Puja at your home or selected venue.",
        },
        online: {
          title: "Online Pujas",
          description:
            "Attend authentic Vedic Puja through a live video session from anywhere.",
        },
      },

      price: {
        onlinePuja: "Online Puja",
        homeVisit: "Home Visit",
        startingFrom: "Starting from",
        homeSecondary: "Home {price}",
      },

      badges: {
        online: "Online",
        home: "Home",
      },

      buttons: {
        viewOnline: "View Online",
        viewHome: "View Home Puja",
        viewPuja: "View Puja",
      },

      empty: {
        title: "No {title} Found",
        description:
          "Try another search or return to all Puja services.",
        showAll: "Show All Pujas",
      },
    },
  },

  hi: {
    ...commonTranslations.hi,
    ...homeTranslations.hi,
    ...aboutTranslations.hi,
    ...galleryTranslations.hi,
    ...contactTranslations.hi,
    ...pujaDetailsTranslations.hi,
    ...bookingTranslations.hi,
    ...gauSevaTranslations.hi,
    ...myBookingsTranslations.hi,
    pujasPage: {
      eyebrow: "पवित्र पूजा सेवाएँ",
      searchPlaceholder: "{title} खोजें...",
      clearSearch: "खोज साफ करें",
      showing: "दिखाई जा रही हैं",
      popular: "लोकप्रिय",
      loading: "पूजा सेवाएँ लोड हो रही हैं...",

      card: {
        shortDescription:
          "इस पूजा के लाभ, विधि, अवधि और बुकिंग विकल्पों की जानकारी देखें।",
      },

      count: {
        singular: "पूजा",
        plural: "पूजाएँ",
        hindi: "पूजाएँ",
      },

      modes: {
        all: {
          label: "सभी पूजाएँ",
          mobileLabel: "सभी",
          description: "ऑनलाइन और घर पर पूजा सेवाएँ",
        },
        offline: {
          label: "घर पर पूजा",
          mobileLabel: "घर पर",
          description: "पंडित जी आपके स्थान पर आएँगे",
        },
        online: {
          label: "ऑनलाइन पूजा",
          mobileLabel: "ऑनलाइन",
          description: "लाइव वीडियो के माध्यम से शामिल हों",
        },
      },

      meta: {
        all: {
          title: "सभी पूजाएँ",
          description:
            "उपलब्ध ऑनलाइन और घर पर संपन्न होने वाली सभी वैदिक पूजा सेवाएँ देखें।",
        },
        offline: {
          title: "घर पर पूजा",
          description:
            "अनुभवी पंडित जी को अपने घर या चुने हुए स्थान पर संपूर्ण पूजा संपन्न करने के लिए बुक करें।",
        },
        online: {
          title: "ऑनलाइन पूजाएँ",
          description:
            "किसी भी स्थान से लाइव वीडियो के माध्यम से प्रामाणिक वैदिक पूजा में शामिल हों।",
        },
      },

      price: {
        onlinePuja: "ऑनलाइन पूजा",
        homeVisit: "घर पर पूजा",
        startingFrom: "शुरुआती मूल्य",
        homeSecondary: "घर पर {price}",
      },

      badges: {
        online: "ऑनलाइन",
        home: "घर पर",
      },

      buttons: {
        viewOnline: "ऑनलाइन पूजा देखें",
        viewHome: "घर पर पूजा देखें",
        viewPuja: "पूजा देखें",
      },

      empty: {
        title: "कोई {title} नहीं मिली",
        description:
          "दूसरी खोज करें या सभी पूजा सेवाओं पर वापस जाएँ।",
        showAll: "सभी पूजाएँ देखें",
      },
    },
  },
};