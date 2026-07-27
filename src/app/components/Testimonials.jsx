// "use client";

// import {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import {
//   ArrowUpRight,
//   BadgeCheck,
//   CheckCircle2,
//   ExternalLink,
//   Loader2,
//   LogIn,
//   Quote,
//   Star,
// } from "lucide-react";

// const GOOGLE_BUSINESS_URL =
//   process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || "#";

// const GOOGLE_REVIEW_URL =
//   process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
//   GOOGLE_BUSINESS_URL;

// const fallbackReviews = [
//   {
//     _id: "fallback-1",
//     name: "Rajesh Kumar",
//     image: "",
//     initials: "RK",
//     rating: 5,
//     message:
//       "Pandit Ji performed our Griha Pravesh Puja with great devotion and explained every ritual clearly.",
//     source: "website",
//     createdAt: "2026-07-20T10:00:00.000Z",
//   },
//   {
//     _id: "fallback-2",
//     name: "Priya Sharma",
//     image: "",
//     initials: "PS",
//     rating: 5,
//     message:
//       "The complete Puja experience was peaceful, organised and beautifully conducted.",
//     source: "website",
//     createdAt: "2026-07-18T10:00:00.000Z",
//   },
//   {
//     _id: "fallback-3",
//     name: "Amit Verma",
//     image: "",
//     initials: "AV",
//     rating: 5,
//     message:
//       "Booking was easy and Pandit Ji guided our family properly before the ceremony.",
//     source: "website",
//     createdAt: "2026-07-15T10:00:00.000Z",
//   },
// ];

// function createInitials(name = "") {
//   return (
//     String(name)
//       .trim()
//       .split(/\s+/)
//       .slice(0, 2)
//       .map((part) => part.charAt(0))
//       .join("")
//       .toUpperCase() || "PD"
//   );
// }

// function sortReviews(reviews = []) {
//   return [...reviews].sort(
//     (first, second) =>
//       new Date(second.createdAt || 0).getTime() -
//       new Date(first.createdAt || 0).getTime()
//   );
// }

// function mergeReviews(websiteReviews, googleReviews) {
//   const merged = [
//     ...websiteReviews,
//     ...googleReviews,
//   ];

//   const unique = new Map();

//   merged.forEach((review, index) => {
//     const key =
//       review._id ||
//       `${review.source}-${review.name}-${
//         review.createdAt || index
//       }`;

//     if (!unique.has(key)) {
//       unique.set(key, review);
//     }
//   });

//   return sortReviews(Array.from(unique.values()));
// }

// export default function Testimonials() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   const carouselRef = useRef(null);
//   const cardRefs = useRef([]);

//   const [websiteReviews, setWebsiteReviews] =
//     useState([]);
//   const [googleReviews, setGoogleReviews] =
//     useState([]);

//   const [activeIndex, setActiveIndex] =
//     useState(0);

//   const [loadingReviews, setLoadingReviews] =
//     useState(true);
//   const [submitting, setSubmitting] =
//     useState(false);

//   const [rating, setRating] = useState(5);
//   const [message, setMessage] = useState("");

//   const [errorMessage, setErrorMessage] =
//     useState("");
//   const [successMessage, setSuccessMessage] =
//     useState("");

//   const [googleData, setGoogleData] = useState({
//     rating:
//       process.env.NEXT_PUBLIC_GOOGLE_RATING ||
//       "—",
//     reviewCount:
//       process.env
//         .NEXT_PUBLIC_GOOGLE_REVIEW_COUNT ||
//       "—",
//   });

//   const reviews = useMemo(() => {
//     const merged = mergeReviews(
//       websiteReviews,
//       googleReviews
//     );

//     return merged.length > 0
//       ? merged
//       : fallbackReviews;
//   }, [websiteReviews, googleReviews]);

//   useEffect(() => {
//     let mounted = true;

//     async function loadReviews() {
//       try {
//         setLoadingReviews(true);

//         const [websiteResult, googleResult] =
//           await Promise.allSettled([
//             fetch("/api/reviews", {
//               cache: "no-store",
//             }),
//             fetch("/api/google-business", {
//               cache: "no-store",
//             }),
//           ]);

//         if (
//           mounted &&
//           websiteResult.status === "fulfilled" &&
//           websiteResult.value.ok
//         ) {
//           const data =
//             await websiteResult.value.json();

//           setWebsiteReviews(
//             Array.isArray(data.reviews)
//               ? data.reviews.map((review) => ({
//                   ...review,
//                   source: "website",
//                   initials:
//                     review.initials ||
//                     createInitials(review.name),
//                 }))
//               : []
//           );
//         }

//         if (
//           mounted &&
//           googleResult.status === "fulfilled" &&
//           googleResult.value.ok
//         ) {
//           const data =
//             await googleResult.value.json();

//           if (data.success) {
//             setGoogleReviews(
//               Array.isArray(data.reviews)
//                 ? data.reviews.map((review) => ({
//                     ...review,
//                     image:
//                       review.profilePhotoUri ||
//                       review.image ||
//                       "",
//                     source: "google",
//                     initials:
//                       review.initials ||
//                       createInitials(review.name),
//                   }))
//                 : []
//             );

//             setGoogleData({
//               rating:
//                 data.rating ??
//                 process.env
//                   .NEXT_PUBLIC_GOOGLE_RATING ??
//                 "—",
//               reviewCount:
//                 data.userRatingCount ??
//                 process.env
//                   .NEXT_PUBLIC_GOOGLE_REVIEW_COUNT ??
//                 "—",
//             });
//           }
//         }
//       } catch (error) {
//         console.error(
//           "Testimonials load error:",
//           error
//         );
//       } finally {
//         if (mounted) {
//           setLoadingReviews(false);
//         }
//       }
//     }

//     loadReviews();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     if (reviews.length <= 1) {
//       return undefined;
//     }

//     const timer = window.setInterval(() => {
//       setActiveIndex(
//         (current) =>
//           (current + 1) % reviews.length
//       );
//     }, 2000);

//     return () => window.clearInterval(timer);
//   }, [reviews.length]);

//   useEffect(() => {
//     const carousel = carouselRef.current;
//     const card = cardRefs.current[activeIndex];

//     if (!carousel || !card) {
//       return;
//     }

//     const nextLeft =
//       card.offsetLeft -
//       (carousel.clientWidth -
//         card.clientWidth) /
//         2;

//     carousel.scrollTo({
//       left: Math.max(0, nextLeft),
//       behavior: "smooth",
//     });
//   }, [activeIndex, reviews.length]);

//   const openGoogleProfile = () => {
//     if (
//       GOOGLE_BUSINESS_URL &&
//       GOOGLE_BUSINESS_URL !== "#"
//     ) {
//       window.open(
//         GOOGLE_BUSINESS_URL,
//         "_blank",
//         "noopener,noreferrer"
//       );
//     }
//   };

//   const submitReview = async (event) => {
//     event.preventDefault();

//     if (status !== "authenticated") {
//       router.push("/login");
//       return;
//     }

//     const cleanMessage = message.trim();

//     if (cleanMessage.length < 10) {
//       setErrorMessage(
//         "Please write at least 10 characters."
//       );
//       return;
//     }

//     let googleWindow = null;

//     if (
//       GOOGLE_REVIEW_URL &&
//       GOOGLE_REVIEW_URL !== "#"
//     ) {
//       googleWindow = window.open(
//         "about:blank",
//         "_blank"
//       );
//     }

//     try {
//       setSubmitting(true);
//       setErrorMessage("");
//       setSuccessMessage("");

//       const response = await fetch(
//         "/api/reviews",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type":
//               "application/json",
//           },
//           body: JSON.stringify({
//             rating,
//             message: cleanMessage,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.error ||
//             "Unable to submit review."
//         );
//       }

//       const savedReview = {
//         ...data.review,
//         source: "website",
//         initials:
//           data.review.initials ||
//           createInitials(data.review.name),
//       };

//       setWebsiteReviews((current) =>
//         sortReviews([
//           savedReview,
//           ...current,
//         ])
//       );

//       setActiveIndex(0);
//       setRating(5);
//       setMessage("");

//       try {
//         await navigator.clipboard.writeText(
//           cleanMessage
//         );
//       } catch (clipboardError) {
//         console.warn(
//           "Review text was not copied:",
//           clipboardError
//         );
//       }

//       setSuccessMessage(
//         "Review Puja Dham website par save ho gaya. Google review page open hua hai aur text copy ho chuka hai—Google par paste karke Post dabayein."
//       );

//       if (googleWindow) {
//         googleWindow.location.href =
//           GOOGLE_REVIEW_URL;
//       }
//     } catch (error) {
//       if (googleWindow) {
//         googleWindow.close();
//       }

//       setErrorMessage(
//         error instanceof Error
//           ? error.message
//           : "Unable to submit review."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const userName =
//     session?.user?.name ||
//     session?.user?.email?.split("@")[0] ||
//     "Puja Dham User";

//   const userImage =
//     session?.user?.image || "";

//   return (
//     <section
//       id="reviews"
//       className="w-full overflow-hidden bg-[#fffdfb] px-4 py-16 sm:px-6 md:py-24"
//     >
//       <div className="mx-auto max-w-[1240px]">
//         {/* HEADING */}
//         <div className="text-center">
//           <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a8441b]">
//             Devotee Experiences
//           </p>

//           <h2 className="mt-3 font-serif text-4xl leading-tight text-[#2e2723] sm:text-5xl md:text-6xl">
//             Testimonials
//           </h2>

//           <button
//             type="button"
//             onClick={openGoogleProfile}
//             className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[#eadfd7] bg-white px-4 py-2 text-[10px] font-bold text-[#675950] shadow-sm transition hover:border-[#a8441b] hover:text-[#a8441b]"
//           >
//             <span className="flex items-center gap-0.5">
//               {Array.from({
//                 length: 5,
//               }).map((_, index) => (
//                 <Star
//                   key={index}
//                   size={11}
//                   className="fill-[#f4b400] text-[#f4b400]"
//                 />
//               ))}
//             </span>

//             Google {googleData.rating} ·{" "}
//             {googleData.reviewCount} Reviews

//             <ExternalLink size={12} />
//           </button>
//         </div>

//         {/* CAROUSEL */}
//         <div className="relative mt-10 md:mt-14">
//           {loadingReviews && (
//             <div className="flex min-h-[300px] items-center justify-center">
//               <Loader2 className="h-8 w-8 animate-spin text-[#a8441b]" />
//             </div>
//           )}

//           {!loadingReviews && (
//             <div
//               ref={carouselRef}
//               className="testimonial-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto px-[8vw] pb-8 pt-5 sm:gap-5 sm:px-[18vw] lg:gap-6 lg:px-[33.5%]"
//             >
//               {reviews.map(
//                 (review, index) => {
//                   const active =
//                     index === activeIndex;

//                   return (
//                     <article
//                       ref={(element) => {
//                         cardRefs.current[
//                           index
//                         ] = element;
//                       }}
//                       key={
//                         review._id ||
//                         `${review.name}-${index}`
//                       }
//                       onClick={() =>
//                         setActiveIndex(index)
//                       }
//                       className={`relative min-h-[320px] w-[78vw] max-w-[360px] shrink-0 snap-center cursor-pointer overflow-hidden rounded-[28px] border bg-white p-5 transition-all duration-500 sm:w-[380px] sm:max-w-none sm:p-6 lg:w-[360px] ${
//                         active
//                           ? "scale-100 border-[#d9b9a5] opacity-100 shadow-[0_26px_70px_rgba(54,35,24,0.15)]"
//                           : "scale-[0.90] border-[#ebe4df] opacity-55 shadow-[0_12px_35px_rgba(54,35,24,0.06)]"
//                       }`}
//                     >
//                       <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#fff1e5]" />

//                       <div className="relative z-10 flex h-full flex-col text-center">
//                         <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#a8441b] text-xl font-extrabold text-white shadow-[0_10px_30px_rgba(62,35,21,0.18)]">
//                           {review.image ? (
//                             <img
//                               src={review.image}
//                               alt={review.name}
//                               className="h-full w-full object-cover"
//                             />
//                           ) : (
//                             review.initials ||
//                             createInitials(
//                               review.name
//                             )
//                           )}
//                         </div>

//                         <div className="mt-4">
//                           <div className="flex items-center justify-center gap-1.5">
//                             <h3 className="text-base font-extrabold text-[#312a26]">
//                               {review.name}
//                             </h3>

//                             <BadgeCheck
//                               size={15}
//                               className="text-[#4285f4]"
//                             />
//                           </div>

//                           <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#a8441b]">
//                             {review.source ===
//                             "google"
//                               ? "Google Review"
//                               : "Puja Dham Review"}
//                           </p>
//                         </div>

//                         <div className="mt-4 flex items-center justify-center gap-1">
//                           {Array.from({
//                             length: 5,
//                           }).map(
//                             (_, starIndex) => (
//                               <Star
//                                 key={starIndex}
//                                 size={15}
//                                 className={
//                                   starIndex <
//                                   Number(
//                                     review.rating ||
//                                       0
//                                   )
//                                     ? "fill-[#f4b400] text-[#f4b400]"
//                                     : "text-gray-200"
//                                 }
//                               />
//                             )
//                           )}
//                         </div>

//                         <Quote
//                           size={28}
//                           strokeWidth={1}
//                           className="mx-auto mt-5 text-[#d9b9a5]"
//                         />

//                         <p className="mt-3 line-clamp-6 flex-1 font-serif text-[18px] leading-7 text-[#655950]">
//                           “{review.message}”
//                         </p>
//                       </div>
//                     </article>
//                   );
//                 }
//               )}
//             </div>
//           )}

//           {!loadingReviews &&
//             reviews.length > 1 && (
//               <div className="mt-1 flex items-center justify-center gap-1.5">
//                 {reviews.map(
//                   (review, index) => (
//                     <button
//                       type="button"
//                       key={
//                         review._id ||
//                         `dot-${index}`
//                       }
//                       onClick={() =>
//                         setActiveIndex(index)
//                       }
//                       aria-label={`Show review ${
//                         index + 1
//                       }`}
//                       className={`h-1.5 rounded-full transition-all ${
//                         activeIndex === index
//                           ? "w-8 bg-[#a8441b]"
//                           : "w-2 bg-[#d8cec8]"
//                       }`}
//                     />
//                   )
//                 )}
//               </div>
//             )}
//         </div>

//         {/* REVIEW FORM */}
//         <div className="mx-auto mt-14 max-w-[760px] rounded-[30px] border border-[#e9dfd8] bg-white p-5 shadow-[0_24px_65px_rgba(61,40,28,0.08)] sm:p-7 md:mt-20 md:p-9">
//           <div className="text-center">
//             <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a8441b]">
//               Share Your Experience
//             </p>

//             <h3 className="mt-2 font-serif text-3xl text-[#302925] sm:text-4xl">
//               Give Your Review
//             </h3>

//             <p className="mx-auto mt-2 max-w-xl text-[11px] leading-5 text-[#877970] sm:text-xs">
//               Login user ka name aur profile
//               image automatically use hoga.
//             </p>
//           </div>

//           {status === "loading" ? (
//             <div className="flex min-h-[180px] items-center justify-center">
//               <Loader2 className="h-7 w-7 animate-spin text-[#a8441b]" />
//             </div>
//           ) : status !== "authenticated" ? (
//             <div className="mt-7 rounded-[22px] border border-[#eadfd7] bg-[#fffaf6] p-5 text-center sm:p-7">
//               <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#a8441b] shadow-sm">
//                 <LogIn size={21} />
//               </div>

//               <h4 className="mt-4 text-lg font-extrabold text-[#332b27]">
//                 Login required
//               </h4>

//               <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#83766e]">
//                 Review sirf logged-in users de
//                 sakte hain. Login ke baad aapka
//                 name aur profile photo
//                 automatically select ho jayega.
//               </p>

//               <button
//                 type="button"
//                 onClick={() =>
//                   router.push("/login")
//                 }
//                 className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#a8441b] px-6 text-xs font-bold text-white transition hover:bg-[#873515]"
//               >
//                 Login to Review
//                 <ArrowUpRight size={14} />
//               </button>
//             </div>
//           ) : (
//             <form
//               onSubmit={submitReview}
//               className="mt-7"
//             >
//               {/* AUTO USER */}
//               <div className="flex items-center gap-3 rounded-[18px] border border-[#e8dfd9] bg-[#fbf8f5] p-3.5">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#a8441b] text-sm font-extrabold text-white">
//                   {userImage ? (
//                     <img
//                       src={userImage}
//                       alt={userName}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     createInitials(userName)
//                   )}
//                 </div>

//                 <div className="min-w-0">
//                   <div className="flex items-center gap-1.5">
//                     <p className="truncate text-sm font-extrabold text-[#332b27]">
//                       {userName}
//                     </p>
//                     <BadgeCheck
//                       size={15}
//                       className="shrink-0 text-[#4285f4]"
//                     />
//                   </div>

//                   <p className="mt-0.5 truncate text-[10px] text-[#8b7d74]">
//                     {session?.user?.email}
//                   </p>
//                 </div>
//               </div>

//               {/* STARS ONLY */}
//               <div className="mt-5">
//                 <p className="text-center text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
//                   Select Rating
//                 </p>

//                 <div className="mt-3 flex items-center justify-center gap-2">
//                   {[1, 2, 3, 4, 5].map(
//                     (value) => (
//                       <button
//                         type="button"
//                         key={value}
//                         onClick={() =>
//                           setRating(value)
//                         }
//                         aria-label={`${value} stars`}
//                         className="rounded-full p-1 transition hover:scale-110"
//                       >
//                         <Star
//                           size={30}
//                           className={
//                             value <= rating
//                               ? "fill-[#f4b400] text-[#f4b400]"
//                               : "text-[#ddd4cf]"
//                           }
//                         />
//                       </button>
//                     )
//                   )}
//                 </div>
//               </div>

//               {/* DESCRIPTION ONLY */}
//               <textarea
//                 value={message}
//                 onChange={(event) =>
//                   setMessage(
//                     event.target.value
//                   )
//                 }
//                 placeholder="Write your Puja experience..."
//                 rows={5}
//                 minLength={10}
//                 maxLength={700}
//                 required
//                 className="mt-5 min-h-[140px] w-full resize-y rounded-[18px] border border-[#e9e0da] bg-[#fffdfb] px-4 py-4 text-sm leading-6 text-[#342d29] outline-none transition placeholder:text-[#aa9b92] focus:border-[#a8441b] focus:ring-4 focus:ring-orange-100"
//               />

//               {errorMessage && (
//                 <div className="mt-3 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
//                   {errorMessage}
//                 </div>
//               )}

//               {successMessage && (
//                 <div className="mt-3 flex items-start gap-2 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-700">
//                   <CheckCircle2
//                     size={16}
//                     className="mt-0.5 shrink-0"
//                   />
//                   <span>
//                     {successMessage}
//                   </span>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="mt-4 flex h-13 min-h-[52px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#96391f] px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#7c2b17] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {submitting ? (
//                   <>
//                     <Loader2
//                       size={16}
//                       className="animate-spin"
//                     />
//                     Saving Review...
//                   </>
//                 ) : (
//                   <>
//                     Submit Review
//                     <ArrowUpRight size={15} />
//                   </>
//                 )}
//               </button>

//               <p className="mt-3 text-center text-[9px] leading-4 text-[#9a8d86]">
//                 One click se website review
//                 save hoga aur Google ka official
//                 review page open hoga. Google par
//                 final Post user ko khud confirm
//                 karna hota hai.
//               </p>
//             </form>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         .testimonial-scroll {
//           scrollbar-width: none;
//         }

//         .testimonial-scroll::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </section>
//   );
// }