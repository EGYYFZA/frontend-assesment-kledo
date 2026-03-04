export async function regionsLoader() {
  const response = await fetch('/data/indonesia_regions.json');
  if (!response.ok) throw new Error('Gagal memuat data wilayah');
  return response.json();
}
