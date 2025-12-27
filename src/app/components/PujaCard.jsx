export default function PujaCard({ puja }) {
  return (
    <article className="puja-card">
      <div className="puja-card-image-wrap">
        <img
          src={puja.image}
          alt={puja.title}
          className="puja-card-image"
        />
      </div>

      <div className="puja-card-body">
        <h3 className="puja-title">{puja.title}</h3>
        <p className="puja-desc">{puja.shortDescription}</p>

        <div className="puja-meta">
          <span>{puja.duration}</span>
          <span>{puja.price}</span>
        </div>

        <div className="puja-actions">
          <a href={`/pujas/${puja.id}`} className="puja-link">
            View Details
          </a>

          <a href={`/contact?puja=${encodeURIComponent(puja.title)}`}>
            <button className="btn-primary btn-sm" type="button">
              Book This Puja
            </button>
          </a>
        </div>
      </div>
    </article>
  );
}
