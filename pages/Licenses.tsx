import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { patternRights } from '../data/pattern-rights';

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
      <h2 className="text-xl font-semibold font-display">Planned code reuse license</h2>
      <p>MIT has been selected for original generated implementation code after each pattern's
        rights and any third-party contributions have been cleared. The intended copyright
        display name is Josh Temple (a pen name), with a 2026 notice for eligible original work.
        <strong> No pattern is currently marked as rights-cleared, and this is not an active license grant.</strong>
      </p>
      <p>The planned scope excludes this gallery application, branding, screenshots, prompts,
        third-party libraries and materials, and sample text not cleared for reuse.
        The <a href="https://opensource.org/license/mit" target="_blank" rel="noreferrer"
          className="text-primary underline">MIT license text</a> requires preservation of the
        copyright and permission notice in copies or substantial portions. Refer to the
        license supplied with a future rights-cleared example before redistributing it.</p>
      <h2 className="text-xl font-semibold font-display">Rights status of the code examples</h2>
      <p>Individual records below describe the available provenance. Rights clearance remains pending. <strong>Active MIT grants: {Object.values(patternRights).filter(rights => rights.grantActive).length} of {Object.keys(patternRights).length}.</strong> A source or inspiration credit is not proof of ownership.</p>
      <ul className="space-y-3">
        {Object.entries(patternRights).map(([id, rights]) => (
          <li key={id} className="rounded-xl border border-ink-border p-3 text-sm">
            <Link to={`/p/${id}`} className="font-semibold text-primary underline break-words">{id}</Link>
            <p className="mt-1"><strong>{rights.status}</strong> — {rights.grantActive ? 'License documentation must be checked before reuse.' : 'No code reuse license has been granted.'}</p>
            <p className="text-ink-muted text-xs mt-1">{rights.outputFormat} · {rights.dependencyNote}</p>
            <p className="text-ink-muted text-xs mt-1">{rights.sampleTextNote}</p>
          </li>
        ))}
      </ul>
      <p>Copy code copies text to your clipboard; it does not grant copyright permission. If rights are cleared later, the complete operative MIT license, any required copyright holder notices, and defined exclusions must accompany the eligible code. Editorial sample prose and third-party dependencies require separate treatment.</p>
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

