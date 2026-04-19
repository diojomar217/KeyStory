export type PrintLayoutInput = {
  widthMm: number;
  heightMm: number;
  copies: number;
  pairsPerRow?: number;
  pageWidthMm?: number;
  pageHeightMm?: number;
  outerMarginMm?: number;
  horizontalGapMm?: number;
  verticalGapMm?: number;
  sheetMode?: 'front-back-pair' | 'qr-only';
};

export function computePrintLayout({
  widthMm,
  heightMm,
  copies,
  pairsPerRow = 2,
  pageWidthMm = 210,
  pageHeightMm = 297,
  outerMarginMm = 2,
  horizontalGapMm = 0.8,
  verticalGapMm = 0.8,
  sheetMode = 'front-back-pair',
}: PrintLayoutInput) {
  const pairWidthMm = sheetMode === 'qr-only' ? widthMm : widthMm * 2;
  const usableWidthMm = pageWidthMm - outerMarginMm * 2;
  const usableHeightMm = pageHeightMm - outerMarginMm * 2;

  const actualPairsPerRow = Math.max(
    1,
    Math.min(
      pairsPerRow,
      Math.floor((usableWidthMm + horizontalGapMm) / (pairWidthMm + horizontalGapMm))
    )
  );

  const rowHeightMm = heightMm;
  const rowsPerPage = Math.max(1, Math.floor((usableHeightMm + verticalGapMm) / (rowHeightMm + verticalGapMm)));

  const totalRows = Math.ceil(copies / actualPairsPerRow);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const startRow = pageIndex * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, totalRows);

    const items: number[] = [];
    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < actualPairsPerRow; col++) {
        const itemIndex = row * actualPairsPerRow + col;
        if (itemIndex < copies) items.push(itemIndex);
      }
    }
    return items;
  });

  return {
    pairWidthMm,
    usableWidthMm,
    usableHeightMm,
    actualPairsPerRow,
    rowHeightMm,
    rowsPerPage,
    totalRows,
    totalPages,
    pages,
  };
}
