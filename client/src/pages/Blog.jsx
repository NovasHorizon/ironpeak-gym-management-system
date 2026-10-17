import { useEffect, useState } from 'react';

// Blog posts come from a WordPress site used as a headless CMS (its built-in REST API).
// Set VITE_WP_API in client/.env.local, e.g. http://localhost:8080/wp-json/wp/v2
const WP_API = import.meta.env.VITE_WP_API;

// WordPress returns titles and excerpts as HTML; show them as plain text (no HTML injection).
const textOf = (html) => new DOMParser().parseFromString(html, 'text/html').body.textContent.trim();

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!WP_API) return;
    fetch(`${WP_API}/posts?per_page=9&_embed=wp:featuredmedia`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`WordPress returned ${res.status}`))))
      .then(setPosts)
      .catch(setError);
  }, []);

  return (
    <section className="container page">
      <p className="eyebrow">Blog</p>
      <h1 className="section-title mb-3">Training <span className="text-accent">notes</span></h1>
      <p className="text-secondary mb-5" style={{ maxWidth: '52ch' }}>
        Tips from our coaches on training, food and recovery. Written in WordPress, shown here with React.
      </p>

      {!WP_API && (
        <div className="alert alert-secondary">The blog isn't connected to WordPress yet. Set <code>VITE_WP_API</code> (see README).</div>
      )}
      {error && <div className="alert alert-danger">Couldn't load posts from WordPress: {error.message}</div>}
      {WP_API && !posts && !error && <div className="text-secondary py-5 text-center">Loading posts…</div>}
      {posts?.length === 0 && <p className="text-secondary">No posts yet.</p>}

      <div className="row g-4">
        {posts?.map((post) => {
          const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          return (
            <div className="col-md-6 col-lg-4" key={post.id}>
              <article className="card h-100 overflow-hidden">
                {image && <img src={image} className="card-img-top object-fit-cover" style={{ aspectRatio: '16 / 10' }} alt="" loading="lazy" />}
                <div className="card-body p-4 d-flex flex-column">
                  <p className="small text-secondary mb-2">
                    {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <h2 className="h5 fw-bold">{textOf(post.title.rendered)}</h2>
                  <p className="text-secondary small flex-grow-1">{textOf(post.excerpt.rendered)}</p>
                  <a href={post.link} className="small fw-semibold" target="_blank" rel="noreferrer">Read more →</a>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
