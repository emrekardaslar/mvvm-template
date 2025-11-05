import React, {
  lazy,
  type ComponentType,
  type LazyExoticComponent,
} from "react";

const LocalFallback: React.FC = () => null;

type Key = `${string}|${string}`;
const cache = new Map<Key, LazyExoticComponent<ComponentType<any>>>();

// For client-side lazy loading
const lazyModules = import.meta.glob("../views/**/**/**/*.{tsx,jsx,ts,js}");
// For server-side eager loading
const eagerModules = import.meta.glob("../views/**/**/**/*.{tsx,jsx,ts,js}", { eager: true });

const isSSR = import.meta.env.SSR;

const exts = [".tsx", ".jsx", ".ts", ".js"];

function resolvePath(
  viewFolder: string,
  languagePrefix = ""
): string | undefined {
  const lang = (languagePrefix || "").toLowerCase();
  const candidates: string[] = [];

  if (lang) {
    for (const ext of exts) {
      candidates.push(`../views/${viewFolder}/${lang}/${viewFolder}${ext}`);
    }
    for (const ext of exts) {
      candidates.push(`../views/${viewFolder}/${lang}/index${ext}`);
    }
  }

  for (const ext of exts) {
    candidates.push(`../views/${viewFolder}/generic/${viewFolder}${ext}`);
  }
  for (const ext of exts) {
    candidates.push(`../views/${viewFolder}/generic/index${ext}`);
  }

  if (lang) {
    const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
    for (const ext of exts) {
      candidates.push(`../views/${viewFolder}/${viewFolder}${suffix}${ext}`);
    }
  }

  for (const ext of exts) {
    candidates.push(`../views/${viewFolder}/${viewFolder}${ext}`);
  }
  for (const ext of exts) {
    candidates.push(`../views/${viewFolder}/index${ext}`);
  }

  for (const c of candidates) {
    if (c in lazyModules) return c;
  }
  return undefined;
}

export function viewMap(viewFolder: string, languagePrefix = "") {
  const path = resolvePath(viewFolder, languagePrefix);

  if (isSSR) {
    const mod = path ? eagerModules[path] : null;
    return (mod as any)?.default ?? LocalFallback;
  }

  // Client-side lazy-loading logic
  const lang = (languagePrefix || "").toLowerCase();
  const key: Key = `${viewFolder}|${lang}`;

  let Comp = cache.get(key);
  if (!Comp) {
    const loader = path
      ? (lazyModules as Record<string, () => Promise<any>>)[path]
      : null;

    Comp = lazy(() =>
      (loader ? loader() : Promise.resolve({ default: LocalFallback })).then(
        (m) => ({
          default: (m as any).default ?? LocalFallback,
        })
      )
    );

    cache.set(key, Comp);
  }
  return Comp;
}
