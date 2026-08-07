"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();

  const isHindi = language === "hi";
  const [openIndex, setOpenIndex] = useState(null);

  const content = {
    en: {
      badge: "Your Privacy Matters",
      title: "Privacy Policy",
      subtitle:
        "This Privacy Policy explains how Puja Dham collects, uses, stores, and protects information when you use our website and Puja booking services.",

      updated: "Last Updated: August 2026",

      sections: [
        {
          title: "1. About Puja Dham",
          paragraphs: [
            "Puja Dham is a digital platform that helps devotees explore and book Vedic Puja services, connect with Pandit Ji, access religious information, and use other devotional services available through our website.",
            "By using Puja Dham, you acknowledge that you have read and understood this Privacy Policy.",
          ],
        },

        {
          title: "2. Information We May Collect",
          paragraphs: [
            "When you use Puja Dham, we may collect information that you voluntarily provide while registering, contacting us, booking a Puja, or using other services.",
          ],
          list: [
            "Full name",
            "Mobile number",
            "Email address",
            "Address or Puja location",
            "Booking details",
            "Selected Puja and package",
            "Preferred Puja date and time",
            "Information provided through contact or enquiry forms",
            "Account information when account features are used",
          ],
        },

        {
          title: "3. Puja Booking Information",
          paragraphs: [
            "When you book a Puja through Puja Dham, we may process information required to manage and fulfil your booking.",
            "This may include your contact information, Puja details, location, selected package, preferred date, and other information necessary for coordination with Pandit Ji.",
          ],
        },

        {
          title: "4. Payment Information",
          paragraphs: [
            "Puja Dham may provide payment options such as UPI or other supported payment methods for Puja bookings.",
            "We do not intend to store sensitive banking credentials such as your UPI PIN, debit card PIN, CVV, or internet banking password.",
            "Payments may also be processed through third-party payment providers, and their respective privacy policies and terms may apply.",
          ],
        },

        {
          title: "5. How We Use Your Information",
          list: [
            "To process and manage Puja bookings",
            "To communicate regarding your booking",
            "To provide customer support",
            "To respond to enquiries and requests",
            "To coordinate Puja services with Pandit Ji",
            "To maintain and improve the Puja Dham website",
            "To detect misuse, fraud, or security-related issues",
            "To understand website usage and improve user experience",
            "To comply with applicable legal requirements",
          ],
        },

        {
          title: "6. Cookies and Website Analytics",
          paragraphs: [
            "Puja Dham may use cookies, browser storage, analytics tools, and similar technologies to understand how visitors use the website and to improve performance and user experience.",
            "These technologies may collect technical information such as browser type, device type, visited pages, general usage activity, and similar information.",
          ],
        },

        {
          title: "7. Google Analytics",
          paragraphs: [
            "Puja Dham may use Google Analytics to understand website traffic, user interactions, and general website performance.",
            "Google Analytics may process certain technical and usage information in accordance with Google's own privacy practices.",
          ],
        },

        {
          title: "8. Local Storage",
          paragraphs: [
            "Certain Puja Dham features may use your browser's local storage to temporarily remember information such as booking-related data, language preferences, or other website preferences.",
            "You may remove locally stored information through your browser settings.",
          ],
        },

        {
          title: "9. Sharing of Information",
          paragraphs: [
            "Puja Dham does not sell your personal information to advertisers.",
            "Information may be shared only when reasonably necessary to provide the requested service, such as coordinating a booking with the relevant Pandit Ji or service provider.",
          ],
          list: [
            "Pandit Ji associated with your booking",
            "Service providers required to operate the website",
            "Payment service providers where applicable",
            "Analytics or technical service providers",
            "Government or legal authorities when required by law",
          ],
        },

        {
          title: "10. Data Security",
          paragraphs: [
            "We take reasonable measures to protect information handled through Puja Dham against unauthorized access, misuse, loss, or disclosure.",
            "However, no internet-based service or electronic storage method can guarantee absolute security. Users should also protect their account credentials and personal devices.",
          ],
        },

        {
          title: "11. Third-Party Services",
          paragraphs: [
            "Puja Dham may use or link to third-party services such as payment platforms, maps, analytics services, social platforms, cloud services, or messaging applications.",
            "When you use an external service, its own privacy policy and terms may apply. Puja Dham is not responsible for the privacy practices of independent third-party services.",
          ],
        },

        {
          title: "12. External Links",
          paragraphs: [
            "Our website may contain links to external websites or platforms. Clicking such links may take you away from Puja Dham.",
            "We recommend reviewing the privacy policy of any external website before providing personal information.",
          ],
        },

        {
          title: "13. Children's Privacy",
          paragraphs: [
            "Puja Dham services are not intended to knowingly collect personal information from children without appropriate involvement or consent from a parent or legal guardian.",
            "If you believe information relating to a child has been submitted improperly, please contact us so that appropriate action can be taken.",
          ],
        },

        {
          title: "14. Data Retention",
          paragraphs: [
            "We may retain booking, account, enquiry, and related information for as long as reasonably necessary to provide services, maintain records, resolve disputes, improve our services, or comply with legal requirements.",
          ],
        },

        {
          title: "15. Your Choices and Rights",
          paragraphs: [
            "Depending on applicable law and the nature of the information we hold, you may contact Puja Dham regarding your personal information.",
          ],
          list: [
            "Request correction of inaccurate information",
            "Request information about personal data provided to us",
            "Request deletion where legally and technically appropriate",
            "Withdraw certain optional communications",
            "Raise a privacy-related concern",
          ],
        },

        {
          title: "16. Changes to This Privacy Policy",
          paragraphs: [
            "Puja Dham may update this Privacy Policy from time to time as our website, services, technologies, or legal requirements change.",
            "The latest version will be published on this page along with the updated date.",
          ],
        },

        {
          title: "17. Contact Us",
          paragraphs: [
            "For questions, concerns, correction requests, or other privacy-related enquiries, please contact Puja Dham through the official Contact page available on our website.",
          ],
        },
      ],
    },

    hi: {
      badge: "आपकी गोपनीयता हमारे लिए महत्वपूर्ण है",
      title: "गोपनीयता नीति",
      subtitle:
        "यह गोपनीयता नीति बताती है कि Puja Dham हमारी वेबसाइट और पूजा बुकिंग सेवाओं का उपयोग करते समय आपकी जानकारी को कैसे एकत्र, उपयोग, सुरक्षित और प्रबंधित करता है।",

      updated: "अंतिम अपडेट: अगस्त 2026",

      sections: [
        {
          title: "1. Puja Dham के बारे में",
          paragraphs: [
            "Puja Dham एक डिजिटल प्लेटफॉर्म है जो भक्तों को वैदिक पूजा सेवाओं की जानकारी प्राप्त करने, पूजा बुक करने, पंडित जी से जुड़ने और अन्य धार्मिक सेवाओं का उपयोग करने में सहायता करता है।",
            "Puja Dham का उपयोग करके आप स्वीकार करते हैं कि आपने इस गोपनीयता नीति को पढ़ा और समझा है।",
          ],
        },

        {
          title: "2. हम कौन-सी जानकारी एकत्र कर सकते हैं",
          paragraphs: [
            "जब आप Puja Dham का उपयोग करते हैं, तब रजिस्ट्रेशन, संपर्क, पूजा बुकिंग या अन्य सेवाओं के दौरान आपके द्वारा दी गई जानकारी एकत्र की जा सकती है।",
          ],
          list: [
            "पूरा नाम",
            "मोबाइल नंबर",
            "ईमेल पता",
            "पता या पूजा का स्थान",
            "बुकिंग की जानकारी",
            "चुनी गई पूजा और पैकेज",
            "पूजा की पसंदीदा तारीख और समय",
            "संपर्क या पूछताछ फॉर्म में दी गई जानकारी",
            "अकाउंट सुविधा उपयोग करने पर अकाउंट से संबंधित जानकारी",
          ],
        },

        {
          title: "3. पूजा बुकिंग की जानकारी",
          paragraphs: [
            "Puja Dham के माध्यम से पूजा बुक करने पर हम बुकिंग को प्रबंधित और पूरा करने के लिए आवश्यक जानकारी का उपयोग कर सकते हैं।",
            "इसमें आपका संपर्क विवरण, पूजा की जानकारी, स्थान, चुना गया पैकेज, पसंदीदा तारीख और पंडित जी के साथ समन्वय के लिए आवश्यक अन्य जानकारी शामिल हो सकती है।",
          ],
        },

        {
          title: "4. भुगतान संबंधी जानकारी",
          paragraphs: [
            "Puja Dham पूजा बुकिंग के लिए UPI या अन्य समर्थित भुगतान विकल्प उपलब्ध करा सकता है।",
            "हम आपके UPI PIN, डेबिट कार्ड PIN, CVV या इंटरनेट बैंकिंग पासवर्ड जैसी संवेदनशील बैंकिंग जानकारी को संग्रहीत करने का उद्देश्य नहीं रखते हैं।",
            "कुछ भुगतान तृतीय-पक्ष भुगतान सेवाओं के माध्यम से किए जा सकते हैं और उन सेवाओं की अपनी गोपनीयता नीति तथा शर्तें लागू हो सकती हैं।",
          ],
        },

        {
          title: "5. आपकी जानकारी का उपयोग कैसे किया जाता है",
          list: [
            "पूजा बुकिंग को प्रोसेस और प्रबंधित करने के लिए",
            "बुकिंग के संबंध में आपसे संपर्क करने के लिए",
            "ग्राहक सहायता प्रदान करने के लिए",
            "पूछताछ और अनुरोधों का उत्तर देने के लिए",
            "पंडित जी के साथ पूजा सेवा का समन्वय करने के लिए",
            "Puja Dham वेबसाइट को बेहतर बनाने के लिए",
            "दुरुपयोग, धोखाधड़ी या सुरक्षा संबंधी समस्याओं का पता लगाने के लिए",
            "वेबसाइट के उपयोग को समझने और उपयोगकर्ता अनुभव बेहतर करने के लिए",
            "लागू कानूनी आवश्यकताओं का पालन करने के लिए",
          ],
        },

        {
          title: "6. Cookies और Website Analytics",
          paragraphs: [
            "Puja Dham वेबसाइट के उपयोग को समझने और प्रदर्शन तथा उपयोगकर्ता अनुभव बेहतर करने के लिए cookies, browser storage, analytics tools और अन्य समान तकनीकों का उपयोग कर सकता है।",
            "इन तकनीकों के माध्यम से browser type, device type, देखे गए pages और सामान्य website activity जैसी तकनीकी जानकारी एकत्र हो सकती है।",
          ],
        },

        {
          title: "7. Google Analytics",
          paragraphs: [
            "Puja Dham वेबसाइट traffic, user interaction और सामान्य performance को समझने के लिए Google Analytics का उपयोग कर सकता है।",
            "Google Analytics कुछ तकनीकी और usage information को Google की अपनी privacy practices के अनुसार process कर सकता है।",
          ],
        },

        {
          title: "8. Local Storage",
          paragraphs: [
            "Puja Dham की कुछ सुविधाएं booking information, language preference या अन्य website preferences को अस्थायी रूप से याद रखने के लिए browser local storage का उपयोग कर सकती हैं।",
            "आप अपने browser settings के माध्यम से local storage में रखी जानकारी को हटा सकते हैं।",
          ],
        },

        {
          title: "9. जानकारी साझा करना",
          paragraphs: [
            "Puja Dham आपकी व्यक्तिगत जानकारी को विज्ञापनदाताओं को नहीं बेचता है।",
            "आपके द्वारा मांगी गई सेवा प्रदान करने के लिए आवश्यक होने पर ही संबंधित जानकारी पंडित जी या आवश्यक service provider के साथ साझा की जा सकती है।",
          ],
          list: [
            "आपकी बुकिंग से संबंधित पंडित जी",
            "वेबसाइट संचालन के लिए आवश्यक service providers",
            "जहां आवश्यक हो वहां payment service providers",
            "Analytics या technical service providers",
            "कानून द्वारा आवश्यक होने पर सरकारी या कानूनी अधिकारी",
          ],
        },

        {
          title: "10. डेटा सुरक्षा",
          paragraphs: [
            "Puja Dham के माध्यम से प्राप्त जानकारी को अनधिकृत पहुंच, दुरुपयोग, नुकसान या प्रकटीकरण से बचाने के लिए उचित सुरक्षा उपाय अपनाने का प्रयास किया जाता है।",
            "हालांकि किसी भी internet-based service या electronic storage method की पूर्ण सुरक्षा की गारंटी नहीं दी जा सकती। उपयोगकर्ताओं को भी अपने account credentials और devices को सुरक्षित रखना चाहिए।",
          ],
        },

        {
          title: "11. Third-Party Services",
          paragraphs: [
            "Puja Dham payment platforms, maps, analytics services, social platforms, cloud services या messaging applications जैसी third-party services का उपयोग कर सकता है या उनसे link कर सकता है।",
            "किसी बाहरी service का उपयोग करने पर उसकी अपनी privacy policy और terms लागू हो सकती हैं। स्वतंत्र third-party services की privacy practices के लिए Puja Dham जिम्मेदार नहीं है।",
          ],
        },

        {
          title: "12. बाहरी लिंक",
          paragraphs: [
            "हमारी वेबसाइट पर अन्य websites या platforms के links हो सकते हैं। ऐसे links खोलने पर आप Puja Dham वेबसाइट से बाहर जा सकते हैं।",
            "किसी बाहरी वेबसाइट पर व्यक्तिगत जानकारी देने से पहले उसकी privacy policy पढ़ने की सलाह दी जाती है।",
          ],
        },

        {
          title: "13. बच्चों की गोपनीयता",
          paragraphs: [
            "Puja Dham जानबूझकर माता-पिता या कानूनी अभिभावक की उचित भागीदारी या सहमति के बिना बच्चों की व्यक्तिगत जानकारी एकत्र करने के उद्देश्य से सेवाएं प्रदान नहीं करता है।",
            "यदि आपको लगता है कि किसी बच्चे से संबंधित जानकारी अनुचित रूप से प्रदान की गई है, तो उचित कार्रवाई के लिए हमसे संपर्क करें।",
          ],
        },

        {
          title: "14. जानकारी कितने समय तक रखी जा सकती है",
          paragraphs: [
            "बुकिंग, अकाउंट, पूछताछ और संबंधित जानकारी को सेवाएं प्रदान करने, रिकॉर्ड रखने, विवाद सुलझाने, सेवाएं सुधारने या कानूनी आवश्यकताओं का पालन करने के लिए उचित अवधि तक रखा जा सकता है।",
          ],
        },

        {
          title: "15. आपके विकल्प और अधिकार",
          paragraphs: [
            "लागू कानून और हमारे पास उपलब्ध जानकारी के प्रकार के आधार पर आप अपनी व्यक्तिगत जानकारी से संबंधित अनुरोध के लिए Puja Dham से संपर्क कर सकते हैं।",
          ],
          list: [
            "गलत जानकारी को सही करने का अनुरोध",
            "हमारे पास दी गई व्यक्तिगत जानकारी के बारे में जानकारी मांगना",
            "जहां कानूनी और तकनीकी रूप से उचित हो वहां deletion का अनुरोध",
            "कुछ वैकल्पिक communications को बंद करने का अनुरोध",
            "Privacy से संबंधित शिकायत या चिंता दर्ज करना",
          ],
        },

        {
          title: "16. गोपनीयता नीति में बदलाव",
          paragraphs: [
            "Website, services, technology या कानूनी आवश्यकताओं में बदलाव होने पर Puja Dham समय-समय पर इस गोपनीयता नीति को अपडेट कर सकता है।",
            "नई policy इसी page पर updated date के साथ प्रकाशित की जाएगी।",
          ],
        },

        {
          title: "17. हमसे संपर्क करें",
          paragraphs: [
            "Privacy से संबंधित प्रश्न, शिकायत, जानकारी में सुधार या अन्य अनुरोधों के लिए Puja Dham वेबसाइट के आधिकारिक Contact page के माध्यम से हमसे संपर्क करें।",
          ],
        },
      ],
    },
  };

  const page = isHindi ? content.hi : content.en;

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

      {/* FAQ-STYLE POLICY CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-5 sm:mb-7">
          <h2
            className={`border-l-4 border-[#8b3f24] pl-4 text-2xl font-bold text-[#2f3338] sm:text-3xl md:text-4xl ${
              isHindi ? "font-display-hi" : "font-display-en"
            }`}
          >
            {isHindi ? "गोपनीयता नीति से जुड़े प्रश्न" : "Privacy Policy Information"}
          </h2>
        </div>

        <div className="border-t border-orange-100">
          {page.sections.map((section, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={section.title}
                className="border-b border-orange-100"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex((current) =>
                      current === index ? null : index
                    )
                  }
                  className="flex w-full items-center justify-between gap-5 px-1 py-6 text-left sm:px-4 sm:py-7"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`pr-4 text-[15px] font-semibold leading-6 text-[#30353b] sm:text-lg ${
                      isHindi ? "font-display-hi" : ""
                    }`}
                  >
                    {section.title}
                  </span>

                  <span
                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8f3ee] text-[#5d4033] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <span className="absolute h-[2px] w-4 rounded-full bg-current" />
                    <span className="absolute h-4 w-[2px] rounded-full bg-current" />
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-1 pb-7 pr-10 sm:px-4 sm:pb-8 sm:pr-20">
                      {section.paragraphs && (
                        <div className="space-y-3">
                          {section.paragraphs.map(
                            (paragraph, paragraphIndex) => (
                              <p
                                key={paragraphIndex}
                                className="text-sm leading-7 text-gray-600 sm:text-[15px]"
                              >
                                {paragraph}
                              </p>
                            )
                          )}
                        </div>
                      )}

                      {section.list && (
                        <ul
                          className={`space-y-3 ${
                            section.paragraphs ? "mt-5" : ""
                          }`}
                        >
                          {section.list.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
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
              ? "Puja Dham का उपयोग जारी रखने पर आप इस गोपनीयता नीति के अनुसार जानकारी के उपयोग को स्वीकार करते हैं।"
              : "By continuing to use Puja Dham, you acknowledge the handling of information as described in this Privacy Policy."}
          </p>
        </div>
      </section>
    </main>
  );
}