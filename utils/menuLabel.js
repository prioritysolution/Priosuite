/** Split bilingual menu parts for stacked UI */
export const getMenuLabelParts = (name, nameLang) => {
  const primary = String(name ?? "").trim();
  const secondary = String(nameLang ?? "").trim();
  if (!primary) {
    return { primary: secondary, secondary: "" };
  }
  if (!secondary || secondary === primary) {
    return { primary, secondary: "" };
  }
  return { primary, secondary };
};

/** Single-line label for search / flat lists */
export const formatMenuLabel = (name, nameLang) => {
  const { primary, secondary } = getMenuLabelParts(name, nameLang);
  if (!secondary) return primary;
  return `${primary} ${secondary}`;
};
