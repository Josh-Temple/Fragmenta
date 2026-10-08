import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Licenses: React.FC = () => {
  const navigate = useNavigate();
  return <main className="px-5 pb-28">
    <header className="flex items-center gap-3 py-4">
      <button type="button" onClick={() => navigate(-1)} aria-label="Go back"
        className="size-11 rounded-full hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-primary">
        <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 className="text-2xl font-bold font-display">Licensing information</h1>
    </header>
    <section className="space-y-4 leading-relaxed">
      <h2 className="text-xl font-semibold font-display">Fragmenta patterns</h2>
      <p>No repository-wide software license has been specified in an authoritative LICENSE file.
        Viewing or copying a code example does not establish permission to redistribute or reuse it.
        Confirm applicable rights with the repository owner before reuse.</p>
      <h2 className="text-xl font-semibold font-display">Sources and inspiration</h2>
      <p>References linked from individual patterns identify sources or inspiration where provided.
        They are not software licensing statements.</p>
      <h2 className="text-xl font-semibold font-display">Third-party dependencies</h2>
      <p>Dependencies have their own licenses. Check their current license texts in the corresponding packages and repositories.
        This page does not make claims about dependencies not installed in Fragmenta.</p>
      <Link to="/browse" className="inline-block text-primary underline">Browse patterns</Link>
    </section>
  </main>;
};
export default Licenses;
