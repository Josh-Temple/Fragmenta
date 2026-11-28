import { definitions } from './definitions';
import { patternChoices } from './pattern-choices';
import { patternRights } from './pattern-rights';

export function getPatternSelection(id: string) {
  const choice = patternChoices[id];
  const rights = patternRights[id];
  return {
    id, title: definitions[id].title, href: '/#/p/' + id, status: 'draft_unreviewed',
    use: choice.useJa, avoid: choice.avoidJa, check: choice.checkJa,
    alternatives: choice.related.map(r => ({ id: r.id, title: definitions[r.id].title, reason: r.reasonJa, href: '/#/p/' + r.id })),
    sourceScope: 'このパターンの実装例をもとにした編集案です。用途の妥当性を示す外部出典は登録されていません。',
    sourcePath: rights.sourcePath, rights: { status: rights.status, grantActive: rights.grantActive },
  };
}
export function patternSelectionBrief(id: string) {
  const s = getPatternSelection(id);
  return [s.id + ' ' + s.title, '向く場面　' + s.use, '向きにくい場面　' + s.avoid,
    '実画面での確認　' + s.check, ...s.alternatives.map(a => '代案　' + a.title + '（' + a.id + '） ' + a.reason),
    s.sourceScope, '再利用条件　' + s.rights.status + (s.rights.grantActive ? '（許諾条件を要確認）' : '（再利用の許諾なし）'),
    '利用者の操作と画面の状態に照らし、採用できる場面と代案が適する場面を説明してください。判断に必要な情報があれば明記してください。',
  ].join('\n');
}
