// A restrained entrance example for each of the 24 design styles.
// These are illustrative motion choices, not historical rules or complete motion systems.
export interface StyleMotion {
  readonly description: string;
  readonly durationMs: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly scale: number;
  readonly easing: string;
}
export const styleMotion = {
  'minimalism':       { description: 'ほぼ移動しない穏やかなフェード', durationMs: 480, offsetX: 0, offsetY: 3, scale: 1, easing: 'ease-out' },
  'swiss':            { description: 'グリッドに沿う直線的な登場', durationMs: 320, offsetX: -11, offsetY: 0, scale: 1, easing: 'ease-out' },
  'bauhaus':          { description: '幾何学的な形が収まるような拡大', durationMs: 280, offsetX: 0, offsetY: 6, scale: .975, easing: 'cubic-bezier(.2,.75,.2,1)' },
  'editorial':        { description: '誌面が現れるようなゆっくりした上昇', durationMs: 620, offsetX: 0, offsetY: 12, scale: 1, easing: 'cubic-bezier(.18,.8,.2,1)' },
  'scandinavian':    { description: '小さな移動を伴う柔らかな登場', durationMs: 490, offsetX: 0, offsetY: 6, scale: .995, easing: 'ease-out' },
  'constructivism':  { description: '対角線を意識した短い移動', durationMs: 260, offsetX: -12, offsetY: 9, scale: 1, easing: 'cubic-bezier(.25,.7,.1,1)' },
  'brutalism':       { description: '段階的で歯切れのよい切り替え', durationMs: 160, offsetX: -5, offsetY: 0, scale: 1, easing: 'steps(2,end)' },
  'neo-brutalism':   { description: '軽快な拡大', durationMs: 280, offsetX: 0, offsetY: 9, scale: .97, easing: 'cubic-bezier(.2,.8,.2,1)' },
  'memphis':         { description: '斜め方向から遊び心を感じる登場', durationMs: 400, offsetX: 9, offsetY: -5, scale: .99, easing: 'ease-out' },
  'maximalism':      { description: '色面を強調するやや大きめの登場', durationMs: 430, offsetX: 0, offsetY: 14, scale: .965, easing: 'ease-out' },
  'postmodern':      { description: '非対称を意識した横方向の移動', durationMs: 360, offsetX: 8, offsetY: 5, scale: 1, easing: 'ease-out' },
  'flat':            { description: '装飾のない短いフェード', durationMs: 240, offsetX: 0, offsetY: 2, scale: 1, easing: 'ease-out' },
  'glass':           { description: '層が静かに浮かぶような登場', durationMs: 550, offsetX: 0, offsetY: 5, scale: .985, easing: 'ease-out' },
  'neumorphism':     { description: '面が少し持ち上がるような拡大', durationMs: 560, offsetX: 0, offsetY: 2, scale: .985, easing: 'ease-out' },
  'skeuomorphism':   { description: '操作部品の質量を感じる短い上昇', durationMs: 390, offsetX: 0, offsetY: 8, scale: .985, easing: 'ease-out' },
  'claymorphism':    { description: '丸い面が膨らむような登場', durationMs: 470, offsetX: 0, offsetY: 10, scale: .97, easing: 'cubic-bezier(.18,.8,.2,1)' },
  'art-deco':        { description: '対称的でゆったりした登場', durationMs: 610, offsetX: 0, offsetY: 9, scale: .995, easing: 'ease-out' },
  'y2k':             { description: '軽い横移動と拡大の組み合わせ', durationMs: 310, offsetX: 8, offsetY: 0, scale: .99, easing: 'ease-out' },
  'vaporwave':       { description: '夢のようなゆったりしたフェード', durationMs: 660, offsetX: 0, offsetY: 7, scale: .995, easing: 'ease-out' },
  'retro-futurism':  { description: '機械的な短いスライド', durationMs: 330, offsetX: -8, offsetY: 0, scale: 1, easing: 'ease-out' },
  'pixel-art':       { description: 'ピクセルのように段階的な登場', durationMs: 180, offsetX: 0, offsetY: 4, scale: 1, easing: 'steps(2,end)' },
  'cyberpunk':       { description: '素早く直線的な切り替え', durationMs: 210, offsetX: 11, offsetY: 0, scale: 1, easing: 'ease-out' },
  'organic':         { description: '自然な曲線を思わせる緩やかな上昇', durationMs: 640, offsetX: 0, offsetY: 8, scale: .99, easing: 'cubic-bezier(.2,.8,.25,1)' },
  'wabi-sabi':       { description: 'ほとんど動かない静かなフェード', durationMs: 720, offsetX: 0, offsetY: 3, scale: 1, easing: 'ease-out' },
} as const satisfies Record<string, StyleMotion>;

export function getStyleMotion(id: string): StyleMotion {
  return styleMotion[id as keyof typeof styleMotion] ?? styleMotion.minimalism;
}
