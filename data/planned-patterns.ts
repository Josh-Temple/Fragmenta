import type { PatternKind } from '../types';

// These entries are reserved content slots, not released PatternDefinitions.
// Keep them out of definitions until preview, code, prompt, and review gates are complete.
export interface PlannedPattern {
  id: string;
  title: string;
  description: string;
  kind: PatternKind;
  icon: string;
  tags: readonly string[];
  acceptance: string;
  status: 'planned';
}

export const plannedPatterns: readonly PlannedPattern[] = [
  {
    id: 'command-palette',
    title: 'コマンドパレット',
    description: 'コマンドを検索し、移動や操作をキーボードで実行できるメニューです。',
    kind: 'interaction',
    icon: 'terminal',
    tags: ['キーボード', '検索'],
    acceptance: '検索と選択、矢印キーでの移動、Enterでの実行、Escapeでの終了、閉じた後のフォーカスとコマンドの動作を確かめます。',
    status: 'planned',
  },
  {
    id: 'modal-dialog-drawer',
    title: 'ダイアログとドロワー',
    description: '画面中央のダイアログと横から開くドロワーを画面幅に合わせて使います。',
    kind: 'component',
    icon: 'web_asset',
    tags: ['ダイアログ', '画面幅への対応'],
    acceptance: '開閉時のフォーカス、Escapeで閉じる操作、背景を操作できない状態、狭い画面での挙動を確かめます。',
    status: 'planned',
  },
  {
    id: 'toast-notifications',
    title: 'トースト通知',
    description: '操作に応じて、成功、注意、エラーを短い通知で伝えます。',
    kind: 'interaction',
    icon: 'notifications_active',
    tags: ['フィードバック', '状態'],
    acceptance: '状態の切り替わり、読み上げ、閉じる操作、自動で消すまでの時間と一時停止を確認します。',
    status: 'planned',
  },
  {
    id: 'ai-chat-interface',
    title: 'AIチャットの操作画面',
    description: 'メッセージの入力と応答を待つ間の状態を示すチャット画面です。',
    kind: 'component',
    icon: 'forum',
    tags: ['AI', 'チャット'],
    acceptance: '入力、停止、再試行とメッセージの読み順を確認し、応答が模擬表示であることを明示します。',
    status: 'planned',
  },
  {
    id: 'tabs-segmented-control',
    title: 'タブと区分選択',
    description: '関連する表示を切り替えたり、複数の候補から一つを選んだりします。',
    kind: 'interaction',
    icon: 'tab',
    tags: ['タブ', '選択'],
    acceptance: '用途に合うタブまたはラジオボタンの役割を設定し、選択状態、キーボード操作、動きを減らす設定で試します。',
    status: 'planned',
  },
  {
    id: 'filter-chips',
    title: '絞り込みチップ',
    description: '複数の条件を組み合わせて一覧を絞ります。',
    kind: 'interaction',
    icon: 'filter_alt',
    tags: ['絞り込み', '一覧'],
    acceptance: '選んだ条件に応じた結果、選択状態の表示、一括解除、0件の案内、キーボード操作を確認します。',
    status: 'planned',
  },
  {
    id: 'before-after-slider',
    title: '変更前後の比較スライダー',
    description: '境界線を動かし、二つの画像を見比べます。',
    kind: 'interaction',
    icon: 'compare',
    tags: ['比較', 'メディア'],
    acceptance: 'ポインターとキーボードでの操作、境界位置の読み上げ、画面幅に応じた切り抜き、素材の利用条件を確認します。',
    status: 'planned',
  },
  {
    id: 'scroll-progress-reveal',
    title: 'スクロールの進み具合と表示効果',
    description: '記事をどこまで読んだかを示し、必要に応じて表示に動きを加えます。',
    kind: 'motion',
    icon: 'vertical_align_bottom',
    tags: ['スクロール', '進行'],
    acceptance: '進み具合と実際のスクロール領域との対応、狭い画面での動作、動きを減らしても要点が読めることを確認します。',
    status: 'planned',
  },
  {
    id: 'aurora-gradient',
    title: 'オーロラ風グラデーション',
    description: '色がゆっくり移り変わる背景を調整します。',
    kind: 'style',
    icon: 'gradient',
    tags: ['グラデーション', '背景'],
    acceptance: '色と速度の調整、一時停止、動きを減らす設定、文字とのコントラストを確かめます。性能は実測して判断します。',
    status: 'planned',
  },
  {
    id: 'kinetic-typography',
    title: '動きのある文字組み',
    description: '読みやすさを保ちながら文字の登場や変形を演出します。',
    kind: 'text-effect',
    icon: 'text_fields',
    tags: ['文字組み', '動き'],
    acceptance: '時間の調整、読み上げ用テキスト、一時停止、動きを減らす設定、長い日英の文章での表示を確認します。',
    status: 'planned',
  },
  {
    id: 'responsive-bento-grid',
    title: '画面幅に応じたカードのグリッド',
    description: '大きさの異なるカードを並べ、画面幅に合わせて配置を変えます。',
    kind: 'layout',
    icon: 'dashboard',
    tags: ['カード', '画面幅への対応'],
    acceptance: 'カードが占める列数と間隔、読み順、長文の折り返しを、スマートフォンとパソコンの両方で確認します。',
    status: 'planned',
  },
  {
    id: 'file-upload-dropzone',
    title: 'ドラッグでファイルを選ぶ領域',
    description: 'ファイルをドラッグするほか、キーボードでも選択できます。',
    kind: 'component',
    icon: 'upload_file',
    tags: ['入力', 'ファイル'],
    acceptance: '標準のファイル選択、ドラッグ中の表示、形式とサイズの案内を確かめます。端末内の選択とサーバーへの送信を区別して表示します。',
    status: 'planned',
  },
];
