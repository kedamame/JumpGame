export default function Head() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const embed = {
    version: "next",
    action: { type: "launch_frame" },
    title: "Tower Jump",
    image: `${baseUrl}/opengraph-image`,
    button: "Play",
    homeUrl: baseUrl
  };

  return (
    <>
      <meta
        name="fc:miniapp"
        content={JSON.stringify(embed)}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}
