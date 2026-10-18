// Restrained code theme: mostly ink, periwinkle for structure, muted for comments.
const ink = '#E6E6E6';
const muted = '#8C8C8C';
const primary = '#8FA8E8';
const soft = '#C3CEF0'; // primary, lightened, for strings

/** @type {import('shiki').ThemeRegistrationRaw} */
const theme = {
  name: 'pmzi-terminal',
  type: 'dark',
  colors: { 'editor.background': '#0A0A0A', 'editor.foreground': ink },
  settings: [
    { settings: { foreground: ink, background: '#0A0A0A' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: muted, fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.new'], settings: { foreground: primary } },
    { scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: soft } },
    { scope: ['constant.numeric', 'constant.language', 'support.constant'], settings: { foreground: ink } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: ink } },
    { scope: ['entity.name.tag', 'entity.name.type', 'support.class', 'entity.name.class'], settings: { foreground: primary } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: muted } },
  ],
};

export default theme;
