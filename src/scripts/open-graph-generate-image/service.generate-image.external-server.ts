export const generateOpenGraphImage = async ({ title, excerpt }: {
  title: string,
  excerpt: string,
}) => {
  const res = await fetch(`http://localhost:3001/api/seo/opengraph/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      aspectRatio: "16/9",
      bgColor: "#999",
      textColor: "black",
      brandTitle: "jacopomarrone.com",
      title,
      excerpt,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const imageBuffer = Buffer.from(await res.arrayBuffer());
  return imageBuffer;
};