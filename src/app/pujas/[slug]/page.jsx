import { PUJAS } from "../../pujasData";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PujaDetail({ params }) {
  const { slug } = await params;

  const puja = PUJAS.find(
    (p) => p?.slug?.toLowerCase() === slug?.toLowerCase()
  );

  if (!puja) return notFound();

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-yellow-50 px-4 py-6">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* IMAGE SECTION */}
        <div className="relative">
          <img
            src={puja.image}
            alt={puja.name}
            className="w-full h-56 sm:h-72 object-cover"
          />

          {/* CATEGORY BADGE */}
          <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs px-3 py-1 rounded-full shadow">
            {puja.category}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-5 sm:p-7">

          {/* TITLE */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            {puja.name}
          </h1>

          {/* SHORT DESC */}
          <p className="text-gray-600 mt-2">
            {puja.shortDescription}
          </p>

          {/* INFO CARDS */}
          <div className="grid grid-cols-2 gap-4 mt-5">

            <div className="bg-orange-50 p-3 rounded-xl border text-center">
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-orange-600 font-bold text-lg">
                {puja.price}
              </p>
            </div>

            <div className="bg-orange-50 p-3 rounded-xl border text-center">
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-gray-700 font-semibold">
                {puja.duration}
              </p>
            </div>

          </div>

          {/* FULL DESCRIPTION (OPTIONAL) */}
          {puja.description && (
            <div className="mt-5">
              <h2 className="font-semibold text-gray-800 mb-1">
                Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {puja.description}
              </p>
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">

            {/* BOOK BUTTON */}
            <Link href={`/booking?puja=${encodeURIComponent(puja.name)}`}>
              <button className="
                w-full py-3 rounded-xl
                bg-orange-600 text-white font-semibold
                hover:bg-orange-700 transition
                shadow-md
              ">
                Book This Puja 🙏
              </button>
            </Link>

            {/* BACK BUTTON */}
            <Link href="/pujas">
              <button className="
                w-full py-3 rounded-xl
                border border-gray-300
                text-gray-700 font-medium
                hover:bg-gray-100 transition
              ">
                ← Back to Pujas
              </button>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}