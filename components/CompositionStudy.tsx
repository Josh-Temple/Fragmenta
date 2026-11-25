import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const positions = [
  { id: 'C-001', name: '三分割法', note: '太陽を右上の交点に置くと、左側に広い空が残ります。' },
  { id: 'C-002', name: '中央構図', note: '太陽を画面の中心に置くと、左右の空が同じ幅になります。' },
] as const;

export default function CompositionStudy() {
  const [position, setPosition] = useState<(typeof positions)[number]>(positions[0]);
  const [guides, setGuides] = useState(true);
  return (
    <figure className="composition-study" aria-labelledby="study-title">
      <figcaption className="study-heading">
        <h2 id="study-title">構図を試す</h2>
        <label className="guide-toggle"><input type="checkbox" checked={guides}
          onChange={event => setGuides(event.target.checked)} />補助線</label>
      </figcaption>
      <div className="study-print" data-position={position.id}
        role="img" aria-label={'山並みと赤い太陽。' + position.note + (guides ? ' 補助線あり。' : '')}>
        <span className="study-sun" /><span className="ridge ridge-far" />
        <span className="ridge ridge-fold" /><span className="ridge ridge-near" />
        {guides && <span className="study-guides" aria-hidden="true" />}
      </div>
      <div className="study-toolbar">
        <fieldset className="study-positions">
          <legend className="sr-only">太陽の配置</legend>
          {positions.map(item => <label key={item.id}>
            <input type="radio" name="study-position" checked={position.id === item.id}
              onChange={() => setPosition(item)} /><span>{item.name}</span>
          </label>)}
        </fieldset>
        <Link className="study-link" to={'/composition?id=' + position.id}
          aria-label={position.name + 'の解説を読む'}>解説を読む <span aria-hidden="true">↗</span></Link>
      </div>
      <p className="study-note" aria-live="polite">{position.note}</p>
    </figure>
  );
}
