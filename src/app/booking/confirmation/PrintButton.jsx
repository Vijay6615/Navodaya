"use client";

export default function PrintButton() {
  return (
    <button
      className="btn-outline"
      type="button"
      onClick={() => window.print()}
    >
      Print Receipt
    </button>
  );
}
