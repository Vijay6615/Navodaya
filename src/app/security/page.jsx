"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function PlusIcon({ open }) {
  return (
    <span
      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-[#6a3b20] transition-all duration-300 ${
        open ? "rotate-45 bg-orange-100" : ""
      }`}
      aria-hidden="true"
    >
      <span className="absolute h-[2px] w-4 rounded-full bg-current" />
      <span className="absolute h-4 w-[2px] rounded-full bg-current" />
    </span>
  );
}

export default function SecurityPage() {
  const { language } = useLanguage();

  const isHindi = language === "hi";
  const [openIndex, setOpenIndex] = useState(null);

  const content = {
    en: {
      badge: "Security & Safety",
      title: "Security",
      subtitle:
        "This page explains the general security practices, user responsibilities, payment safety guidance, and precautions relevant to the use of Puja Dham.",

      updated: "Last Updated: August 2026",

      sections: [
        {
          title: "1. Our Approach to Security",
          paragraphs: [
            "Puja Dham aims to use reasonable technical and operational measures to help protect website users, booking information, account-related information, and other data handled through our services.",
            "Security practices may evolve as our website, technologies, hosting environment, and services change.",
          ],
        },

        {
          title: "2. Secure Website Connection",
          paragraphs: [
            "Puja Dham is intended to operate over HTTPS so that data transferred between your browser and the website is encrypted in transit.",
            "Users should always verify that they are accessing the official Puja Dham website before submitting personal or booking information.",
          ],
        },

        {
          title: "3. Account Security",
          paragraphs: [
            "Where account or login features are available, users are responsible for keeping their login credentials confidential.",
            "Do not share your password or authentication details with anyone.",
            "If you believe your account may have been accessed without permission, contact Puja Dham and change your password where possible.",
          ],
        },

        {
          title: "4. Password Protection",
          paragraphs: [
            "Users should create strong and unique passwords and avoid reusing the same password across multiple websites.",
            "Where passwords are handled by Puja Dham systems, appropriate security methods should be used to avoid storing passwords in plain text.",
          ],
        },

        {
          title: "5. Payment Safety",
          paragraphs: [
            "Puja Dham may support payment methods such as UPI or other approved payment options.",
            "Always verify the payment amount and official payment details before completing a transaction.",
            "Never share your UPI PIN, debit card PIN, CVV, OTP, internet banking password, or similar sensitive credentials with anyone claiming to represent Puja Dham.",
          ],
        },

        {
          title: "6. Sensitive Banking Information",
          paragraphs: [
            "Puja Dham does not intend to request or store highly sensitive banking credentials such as UPI PINs, card PINs, CVVs, OTPs, or internet banking passwords.",
            "If anyone asks you for such information in the name of Puja Dham, do not share it and report the incident through an official Puja Dham contact channel.",
          ],
        },

        {
          title: "7. Booking Information Security",
          paragraphs: [
            "Booking details may include your name, contact information, Puja location, selected service, preferred date, and other relevant information.",
            "Access to such information should be limited to people or service providers who reasonably require it to manage the booking or operate the service.",
          ],
        },

        {
          title: "8. API and Backend Security",
          paragraphs: [
            "Puja Dham may use APIs, backend services, databases, authentication systems, and cloud infrastructure to operate website features.",
            "Reasonable controls should be used to reduce unauthorized access, misuse, or manipulation of these systems.",
          ],
        },

        {
          title: "9. Access Control",
          paragraphs: [
            "Administrative, dashboard, account, booking, and other restricted areas should only be accessible to authorized users.",
            "Attempting to gain unauthorized access to restricted areas, systems, accounts, APIs, or data is prohibited.",
          ],
        },

        {
          title: "10. Monitoring and Abuse Prevention",
          paragraphs: [
            "Puja Dham may review technical activity, logs, authentication events, booking activity, or other relevant signals where reasonably necessary to detect fraud, misuse, abuse, or security threats.",
          ],
        },

        {
          title: "11. Third-Party Services",
          paragraphs: [
            "Puja Dham may rely on third-party services for hosting, analytics, messaging, cloud storage, authentication, payments, maps, or other technical functions.",
            "These services may have their own security practices, privacy policies, and terms.",
          ],
        },

        {
          title: "12. External Links",
          paragraphs: [
            "Puja Dham may contain links to third-party websites or services.",
            "Once you leave Puja Dham, the security and privacy practices of the external website apply.",
            "Users should verify external websites before entering personal or payment information.",
          ],
        },

        {
          title: "13. Phishing and Fraud Awareness",
          paragraphs: [
            "Be cautious of fake websites, social media accounts, messages, calls, or payment requests pretending to represent Puja Dham.",
            "Always verify important booking or payment instructions through official Puja Dham channels.",
          ],
        },

        {
          title: "14. Official Communication",
          paragraphs: [
            "Puja Dham may communicate with users for booking confirmation, payment verification, support, scheduling, or service coordination.",
            "Users should verify suspicious messages before taking action, especially messages requesting money or sensitive information.",
          ],
        },

        {
          title: "15. Device Security",
          paragraphs: [
            "Users should keep their devices, browsers, and operating systems updated and protected.",
            "Avoid accessing sensitive account or payment features from public or untrusted devices where possible.",
          ],
        },

        {
          title: "16. Public Wi-Fi",
          paragraphs: [
            "Using public or unsecured Wi-Fi networks may increase security risks.",
            "Users should avoid entering sensitive account or payment information on networks they do not trust.",
          ],
        },

        {
          title: "17. Browser Security",
          paragraphs: [
            "Use a modern, updated browser and avoid installing unknown browser extensions or software that may interfere with website security.",
            "Check the website address carefully before entering personal information.",
          ],
        },

        {
          title: "18. Local Storage and Browser Data",
          paragraphs: [
            "Certain Puja Dham features may use browser storage for language preferences, booking-related information, or other website functionality.",
            "Users using shared devices should consider clearing browser data after completing sensitive activities.",
          ],
        },

        {
          title: "19. User Responsibilities",
          list: [
            "Use the official Puja Dham website",
            "Keep account credentials confidential",
            "Use strong and unique passwords",
            "Verify payment details before transferring money",
            "Never share PINs, OTPs, CVVs, or banking passwords",
            "Avoid suspicious links and unknown downloads",
            "Report suspicious account or payment activity",
            "Keep your device and browser updated",
          ],
        },

        {
          title: "20. Prohibited Security Activities",
          list: [
            "Attempting unauthorized access",
            "Testing or exploiting vulnerabilities without permission",
            "Introducing malware or harmful code",
            "Automated attacks against the website or APIs",
            "Credential theft or account takeover attempts",
            "Payment manipulation",
            "Data scraping where prohibited",
            "Interfering with normal website operation",
          ],
        },

        {
          title: "21. Security Incident Response",
          paragraphs: [
            "If Puja Dham becomes aware of a security issue affecting website functionality or user information, reasonable steps may be taken to investigate, contain, correct, and reduce the impact of the issue.",
            "Where appropriate and required, affected users may be informed through suitable communication channels.",
          ],
        },

        {
          title: "22. Reporting a Security Issue",
          paragraphs: [
            "If you believe you have discovered a security issue, suspicious activity, unauthorized access, fake payment request, or fraudulent Puja Dham account, please report it through the official Contact page.",
            "Provide enough information to help review the issue, but do not publicly disclose sensitive user data or exploit the issue.",
          ],
        },

        {
          title: "23. Responsible Disclosure",
          paragraphs: [
            "Security researchers or users who discover a potential vulnerability should report it responsibly and allow reasonable time for investigation and remediation.",
            "Unauthorized exploitation, data access, disruption, or misuse of a vulnerability is not permitted.",
          ],
        },

        {
          title: "24. No Absolute Security Guarantee",
          paragraphs: [
            "Although reasonable security measures may be used, no website, internet transmission, database, cloud platform, or electronic system can guarantee complete security.",
            "Users should follow safe online practices and promptly report suspicious activity.",
          ],
        },

        {
          title: "25. Changes to Security Practices",
          paragraphs: [
            "Puja Dham may update this Security page as website features, technologies, payment methods, infrastructure, or security practices change.",
            "The latest version will be published on this page with the updated date.",
          ],
        },

        {
          title: "26. Contact Us",
          paragraphs: [
            "For security concerns, suspicious payment requests, account-related issues, or suspected misuse of Puja Dham, please contact us through the official Contact page available on the website.",
          ],
        },
      ],
    },

    hi: {
      badge: "सुरक्षा एवं सावधानी",
      title: "सुरक्षा",
      subtitle:
        "यह पेज Puja Dham के उपयोग से संबंधित सामान्य सुरक्षा उपायों, उपयोगकर्ता की जिम्मेदारियों, भुगतान सुरक्षा और आवश्यक सावधानियों के बारे में जानकारी देता है।",

      updated: "अंतिम अपडेट: अगस्त 2026",

      sections: [
        {
          title: "1. सुरक्षा के प्रति हमारा दृष्टिकोण",
          paragraphs: [
            "Puja Dham वेबसाइट उपयोगकर्ताओं, booking information, account-related information और हमारी सेवाओं के माध्यम से संभाली जाने वाली अन्य जानकारी की सुरक्षा के लिए उचित technical और operational measures अपनाने का प्रयास करता है।",
            "Website, technology, hosting environment और services में बदलाव के साथ security practices भी समय-समय पर बदल सकती हैं।",
          ],
        },

        {
          title: "2. सुरक्षित Website Connection",
          paragraphs: [
            "Puja Dham को HTTPS के माध्यम से operate करने के उद्देश्य से बनाया गया है ताकि browser और website के बीच भेजी जाने वाली जानकारी transit के दौरान encrypted रहे।",
            "Personal या booking information submit करने से पहले हमेशा यह verify करें कि आप official Puja Dham website पर ही हैं।",
          ],
        },

        {
          title: "3. अकाउंट सुरक्षा",
          paragraphs: [
            "जहां account या login सुविधा उपलब्ध है, वहां अपने login credentials को सुरक्षित रखना उपयोगकर्ता की जिम्मेदारी है।",
            "अपना password या authentication information किसी के साथ share न करें।",
            "यदि आपको लगता है कि आपके account का बिना अनुमति access हुआ है, तो Puja Dham से संपर्क करें और जहां संभव हो अपना password बदलें।",
          ],
        },

        {
          title: "4. Password सुरक्षा",
          paragraphs: [
            "Users को strong और unique password रखना चाहिए तथा अलग-अलग websites पर एक ही password reuse नहीं करना चाहिए।",
            "जहां Puja Dham system passwords handle करता है, वहां passwords को plain text में store करने से बचने के लिए उचित security methods का उपयोग किया जाना चाहिए।",
          ],
        },

        {
          title: "5. Payment सुरक्षा",
          paragraphs: [
            "Puja Dham UPI या अन्य approved payment methods support कर सकता है।",
            "Payment करने से पहले amount और official payment details verify करें।",
            "अपना UPI PIN, debit card PIN, CVV, OTP, internet banking password या अन्य sensitive credentials किसी ऐसे व्यक्ति के साथ share न करें जो Puja Dham का नाम लेकर मांगे।",
          ],
        },

        {
          title: "6. Sensitive Banking Information",
          paragraphs: [
            "Puja Dham UPI PIN, card PIN, CVV, OTP या internet banking password जैसी अत्यंत sensitive banking information मांगने या store करने का उद्देश्य नहीं रखता है।",
            "यदि कोई Puja Dham के नाम पर ऐसी information मांगे, तो share न करें और official Puja Dham contact channel के माध्यम से report करें।",
          ],
        },

        {
          title: "7. Booking Information की सुरक्षा",
          paragraphs: [
            "Booking details में आपका नाम, contact information, पूजा का स्थान, selected service, preferred date और अन्य संबंधित जानकारी शामिल हो सकती है।",
            "ऐसी जानकारी का access केवल उन्हीं लोगों या service providers तक सीमित होना चाहिए जिन्हें booking manage करने या service operate करने के लिए इसकी आवश्यकता हो।",
          ],
        },

        {
          title: "8. API और Backend Security",
          paragraphs: [
            "Puja Dham website features चलाने के लिए APIs, backend services, databases, authentication systems और cloud infrastructure का उपयोग कर सकता है।",
            "इन systems के unauthorized access, misuse या manipulation को कम करने के लिए reasonable controls का उपयोग किया जाना चाहिए।",
          ],
        },

        {
          title: "9. Access Control",
          paragraphs: [
            "Admin, dashboard, account, booking और अन्य restricted areas केवल authorized users के लिए accessible होने चाहिए।",
            "Restricted areas, systems, accounts, APIs या data में unauthorized access का प्रयास करना prohibited है।",
          ],
        },

        {
          title: "10. Monitoring और Abuse Prevention",
          paragraphs: [
            "Fraud, misuse, abuse या security threats detect करने के लिए आवश्यकता होने पर Puja Dham technical activity, logs, authentication events, booking activity या अन्य relevant signals review कर सकता है।",
          ],
        },

        {
          title: "11. Third-Party Services",
          paragraphs: [
            "Puja Dham hosting, analytics, messaging, cloud storage, authentication, payments, maps या अन्य technical functions के लिए third-party services पर निर्भर हो सकता है।",
            "इन services की अपनी security practices, privacy policies और terms हो सकती हैं।",
          ],
        },

        {
          title: "12. बाहरी Links",
          paragraphs: [
            "Puja Dham पर third-party websites या services के links हो सकते हैं।",
            "Puja Dham website से बाहर जाने के बाद external website की security और privacy practices लागू होती हैं।",
            "Personal या payment information enter करने से पहले external website verify करें।",
          ],
        },

        {
          title: "13. Phishing और Fraud से सावधान रहें",
          paragraphs: [
            "Fake websites, social media accounts, messages, calls या payment requests से सावधान रहें जो Puja Dham होने का दावा करें।",
            "Important booking या payment instructions को हमेशा official Puja Dham channels से verify करें।",
          ],
        },

        {
          title: "14. Official Communication",
          paragraphs: [
            "Puja Dham booking confirmation, payment verification, support, scheduling या service coordination के लिए users से संपर्क कर सकता है।",
            "विशेष रूप से money या sensitive information मांगने वाले suspicious messages को action लेने से पहले verify करें।",
          ],
        },

        {
          title: "15. Device Security",
          paragraphs: [
            "अपने device, browser और operating system को updated और protected रखें।",
            "जहां संभव हो public या untrusted devices से sensitive account या payment features का उपयोग न करें।",
          ],
        },

        {
          title: "16. Public Wi-Fi",
          paragraphs: [
            "Public या unsecured Wi-Fi networks के उपयोग से security risk बढ़ सकता है।",
            "Untrusted network पर sensitive account या payment information enter करने से बचें।",
          ],
        },

        {
          title: "17. Browser Security",
          paragraphs: [
            "Modern और updated browser का उपयोग करें तथा unknown browser extensions या software install करने से बचें।",
            "Personal information enter करने से पहले website address को ध्यान से check करें।",
          ],
        },

        {
          title: "18. Local Storage और Browser Data",
          paragraphs: [
            "Puja Dham की कुछ features language preference, booking-related information या अन्य website functionality के लिए browser storage का उपयोग कर सकती हैं।",
            "Shared device use करने पर sensitive activity complete करने के बाद browser data clear करने पर विचार करें।",
          ],
        },

        {
          title: "19. User की जिम्मेदारियां",
          list: [
            "Official Puja Dham website का उपयोग करें",
            "Account credentials confidential रखें",
            "Strong और unique password रखें",
            "Payment करने से पहले payment details verify करें",
            "PIN, OTP, CVV या banking password share न करें",
            "Suspicious links और unknown downloads से बचें",
            "Suspicious account या payment activity report करें",
            "Device और browser updated रखें",
          ],
        },

        {
          title: "20. निषिद्ध Security Activities",
          list: [
            "Unauthorized access का प्रयास",
            "Permission के बिना vulnerabilities test या exploit करना",
            "Malware या harmful code introduce करना",
            "Website या APIs पर automated attacks करना",
            "Credentials चोरी या account takeover का प्रयास",
            "Payment manipulation",
            "जहां prohibited हो वहां unauthorized data scraping",
            "Website operation में जानबूझकर बाधा डालना",
          ],
        },

        {
          title: "21. Security Incident Response",
          paragraphs: [
            "यदि Puja Dham को website functionality या user information को प्रभावित करने वाली security issue की जानकारी मिलती है, तो issue को investigate, contain, correct और impact कम करने के लिए reasonable steps लिए जा सकते हैं।",
            "जहां उचित और आवश्यक हो, affected users को suitable communication channels के माध्यम से inform किया जा सकता है।",
          ],
        },

        {
          title: "22. Security Issue Report करना",
          paragraphs: [
            "यदि आपको किसी security issue, suspicious activity, unauthorized access, fake payment request या fraudulent Puja Dham account का पता चलता है, तो official Contact page के माध्यम से report करें।",
            "Issue review करने के लिए पर्याप्त जानकारी दें, लेकिन sensitive user data को publicly disclose न करें और issue का misuse न करें।",
          ],
        },

        {
          title: "23. Responsible Disclosure",
          paragraphs: [
            "Security researchers या users को potential vulnerability मिलने पर उसे responsibly report करना चाहिए और investigation तथा fix के लिए reasonable time देना चाहिए।",
            "Unauthorized exploitation, data access, disruption या vulnerability misuse permitted नहीं है।",
          ],
        },

        {
          title: "24. पूर्ण सुरक्षा की Guarantee नहीं",
          paragraphs: [
            "Reasonable security measures के बावजूद कोई भी website, internet transmission, database, cloud platform या electronic system complete security की guarantee नहीं दे सकता।",
            "Users को safe online practices follow करनी चाहिए और suspicious activity तुरंत report करनी चाहिए।",
          ],
        },

        {
          title: "25. Security Practices में बदलाव",
          paragraphs: [
            "Website features, technologies, payment methods, infrastructure या security practices बदलने पर Puja Dham इस Security page को update कर सकता है।",
            "Latest version इसी page पर updated date के साथ publish किया जाएगा।",
          ],
        },

        {
          title: "26. हमसे संपर्क करें",
          paragraphs: [
            "Security concern, suspicious payment request, account-related issue या Puja Dham के suspected misuse के लिए website के official Contact page के माध्यम से हमसे संपर्क करें।",
          ],
        },
      ],
    },
  };

  const page = isHindi ? content.hi : content.en;

  const toggleItem = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-orange-100 bg-gradient-to-b from-orange-50 to-[#fffaf5]">
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute -right-16 top-20 h-64 w-64 rounded-full bg-yellow-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 pb-12 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-32">
          <span className="inline-flex rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-orange-700 shadow-sm">
            {page.badge}
          </span>

          <h1
            className={`mt-5 text-3xl font-bold leading-tight text-[#402313] sm:text-4xl md:text-5xl ${
              isHindi ? "font-display-hi" : "font-display-en"
            }`}
          >
            {page.title}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
            {page.subtitle}
          </p>

          <p className="mt-5 text-xs font-medium text-gray-400">
            {page.updated}
          </p>
        </div>
      </section>

      {/* FAQ-STYLE SECURITY CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6">
          <h2
            className={`border-l-4 border-orange-500 pl-4 text-2xl font-bold text-[#402313] sm:text-3xl md:text-4xl ${
              isHindi ? "font-display-hi" : "font-display-en"
            }`}
          >
            {isHindi ? "सुरक्षा संबंधी जानकारी" : "Security Information"}
          </h2>
        </div>

        <div className="overflow-hidden border-y border-orange-100 bg-transparent">
          {page.sections.map((section, index) => {
            const open = openIndex === index;

            return (
              <div
                key={section.title}
                className="border-b border-orange-100 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between gap-5 px-1 py-6 text-left sm:px-4 sm:py-7"
                  aria-expanded={open}
                >
                  <span
                    className={`text-[15px] font-semibold leading-6 text-[#2f3338] sm:text-lg ${
                      isHindi ? "font-display-hi" : ""
                    }`}
                  >
                    {section.title}
                  </span>

                  <PlusIcon open={open} />
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-1 pb-7 pr-12 sm:px-4 sm:pb-8 sm:pr-20">
                      {section.paragraphs && (
                        <div className="space-y-3">
                          {section.paragraphs.map((paragraph) => (
                            <p
                              key={paragraph}
                              className="text-sm leading-7 text-gray-600 sm:text-[15px]"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}

                      {section.list && (
                        <ul
                          className={`space-y-3 ${
                            section.paragraphs ? "mt-5" : ""
                          }`}
                        >
                          {section.list.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 text-sm leading-6 text-gray-600 sm:text-[15px]"
                            >
                              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50/70 px-5 py-5 text-center">
          <p className="text-sm leading-6 text-[#6a3b20]">
            {isHindi
              ? "Puja Dham कभी भी UPI PIN, OTP, CVV या banking password जैसी sensitive credentials साझा करने के लिए नहीं कहता।"
              : "Puja Dham will never require you to share sensitive credentials such as your UPI PIN, OTP, CVV, or banking password."}
          </p>
        </div>
      </section>
    </main>
  );
}