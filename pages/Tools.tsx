import React from 'react';
import { Link } from 'react-router-dom';
import { liveTools } from '../data/live-tools';
import { plannedTools } from '../data/planned-tools';

const Tools: React.FC = () => (
  <div lang="ja" className="min-w-0 px-5 py-7">
    <p className="text-xs font-mono text-ink-muted">FRAGMENTA / TOOLS</p>
    <h1 className="mt-2 text-3xl font-bold">実用ツール</h1>
    <p className="mt-3 text-sm leading-relaxed text-ink-muted">デザイン図鑑で方向を決めたら、色と文字を自分の画面に合わせて調整できます。</p>
    <section aria-labelledby="live-tools-heading" className="mt-7">
      <h2 id="live-tools-heading" className="text-lg font-bold">いま使えるツール <span className="text-sm">{liveTools.length}件</span></h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {liveTools.map((tool, index) => (
          <Link key={tool.id} to={tool.path} className="block min-w-0 rounded-xl border border-ink/30 bg-surface-highlight p-5 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            <p className="text-xs font-mono text-ink-muted">0{index + 1}</p>
            <h3 className="mt-3 text-xl font-bold leading-snug">{tool.titleJa}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{tool.description}</p>
            <span className="mt-4 inline-block text-sm font-bold underline underline-offset-4">ツールを開く</span>
          </Link>
        ))}
      </div>
    </section>
    <section aria-labelledby="tool-workflow-heading" className="mt-8 border-t border-ink-border pt-6">
      <h2 id="tool-workflow-heading" className="text-lg font-bold">デザインを決めるところから</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">雰囲気を見比べるならデザイン図鑑、部品の動作や実装を調べるならパターン一覧へ。</p>
      <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold underline underline-offset-4"><Link to="/styles">24スタイルを比較</Link><Link to="/browse">UIパターンを見る</Link></div>
    </section>
    <details className="mt-8 border-t border-ink-border pt-5">
      <summary className="cursor-pointer py-2 text-sm font-semibold">今後のツール案 · {plannedTools.length}件</summary>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">文章作成やデータ変換などの企画を残しています。公開時期は未定です。</p>
      <Link to="/tools/upcoming" className="mt-3 inline-block py-2 text-sm font-semibold underline underline-offset-4">掲載予定を見る</Link>
    </details>
  </div>
);

export default Tools;
