import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const widgets = {
  styles: { path: '/styles/:id', load: () => import('../pages/DesignStyles') },
  browse: { path: '/p/:id', load: () => import('../pages/AnimationDetail') },
  contrast: { path: '/tools/contrast', load: () => import('../pages/ContrastTool') },
  typography: { path: '/tools/typography', load: () => import('../pages/TypographyTool') },
  guide: { path: '/guide', load: () => import('../pages/BestPractices') },
  licenses: { path: '/licenses', load: () => import('../pages/Licenses') },
};
export async function hydrate() {
  const inspection = document.querySelector<HTMLElement>('[data-inspection]');
  if (inspection) {
    const { default: Diagram } = await import('../components/CompositionDiagram');
    const guide = JSON.parse(document.getElementById('inspection-guide')!.textContent!);
    hydrateRoot(inspection, <Diagram guide={guide} variant="comparison" />, {
      identifierPrefix: 'comparison-',
    });
    return;
  }
  const root = document.querySelector<HTMLElement>('[data-widget]');
  if (!root) return;
  const widget = widgets[root.dataset.widget as keyof typeof widgets];
  const { default: Page } = await widget.load();
  const props = JSON.parse(document.getElementById('widget-props')!.textContent!);
  // The widget owns its interactive controls. Document links load the destination's own HTML and metadata.
  root.addEventListener(
    'click',
    (event) => {
      const a = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (
        !a ||
        a.origin !== location.origin ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        a.target ||
        a.hasAttribute('download')
      )
        return;
      if (a.pathname === location.pathname && a.search === location.search && a.hash) return;
      event.stopPropagation();
    },
    true,
  );
  hydrateRoot(
    root,
    <BrowserRouter>
      <Routes>
        <Route path={widget.path} element={<Page {...props} />} />
      </Routes>
    </BrowserRouter>,
  );
}
