import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl =
    process.env.NEXT_PUBLIC_URL ||
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjg2OTk5OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDc2ZDUwQjBFMTQ3OWE5QmEyYkQ5MzVGMUU5YTI3QzBjNjQ5QzhDMTIifQ",
      payload: "eyJkb21haW4iOiJ0b3BoYi1icmVlenlnb2xkZW5zdW5zZXQudmVyY2VsLmFwcCJ9",
      signature: "MHhhNTM5N2M5ZjA0ODIzZmRkZTE0NTY5YzljNTM0OTk2OTFiZmQyY2VkNDBhZTVkYzg0ZjRjZTIxZTNjNTY0MTFiMzc0ZjkwODdlZWUyYjVjZGIxMjU0ZWQ0NjA0Y2E2MDllODVmYzYyNjgxODNiMTFmYTdjNWQyODJiMWQ2YzRmYTFi"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og.png`,
      buttonTitle: "Open",
      webhookUrl: `${appUrl}/api/webhook`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#555555",
      primaryCategory: "games",
      tags: ["snake", "game", "retro", "arcade", "puzzle"]
    }
  };

  return Response.json(config);
}
