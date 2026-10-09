import { createRequire } from 'module';

const nodeRequire = createRequire(__filename);
const pdf = nodeRequire('@react-pdf/renderer') as typeof import('@react-pdf/renderer', {
  with: { 'resolution-mode': 'import' },
});

export const Document = pdf.Document;
export const Page = pdf.Page;
export const View = pdf.View;
export const Text = pdf.Text;
export const Image = pdf.Image;
export const StyleSheet = pdf.StyleSheet;
export const renderToBuffer = pdf.renderToBuffer;
