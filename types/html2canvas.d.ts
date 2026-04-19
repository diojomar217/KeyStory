declare module 'html2canvas' {
  export default function html2canvas(element: Element, options?: any): Promise<HTMLCanvasElement>;
}
