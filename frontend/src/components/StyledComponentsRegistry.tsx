'use client';
import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [styledComponentsStyleSheet] = useState(
    () => new ServerStyleSheet()
  );

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return React.createElement(React.Fragment, null, styles);
  });

  if (typeof window !== 'undefined') {
    return React.createElement(React.Fragment, null, children);
  }

  return React.createElement(
    StyleSheetManager,
    { sheet: styledComponentsStyleSheet.instance },
    children
  );
}