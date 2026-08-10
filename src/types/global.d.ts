// src/types/global.d.ts
// Yandex Maps SDK tashqi <script> orqali yuklanadi va rasmiy TypeScript tiplariga ega emas.
// Shu sabab uni "any" sifatida e'lon qilamiz — TypeScript "window.ymaps topilmadi" xatosini bermaydi.
export {};

declare global {
  interface Window {
    ymaps: any;
  }
}
