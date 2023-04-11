interface Metadata {
  title: string;
  date: string;
  excerpt?: string;
}

export function extractMetadata(content: string): Metadata {
  const lines = content.split("\n");
  let metadata: Metadata = {
    title: "",
    date: "",
  };

  for (const line of lines) {
    const titleMatch = line.match(/^title:\s*(.+)$/i);
    const dateMatch = line.match(/^date:\s*(.+)$/i);
    const excerptMatch = line.match(/^excerpt:\s*(.+)$/i);

    if (titleMatch) {
      metadata.title = titleMatch[1];
    } else if (dateMatch) {
      metadata.date = dateMatch[1];
    } else if (excerptMatch) {
      metadata.excerpt = excerptMatch[1];
    }

    if (metadata.title && metadata.date && metadata.excerpt) {
      break;
    }
  }

  return metadata;
}
