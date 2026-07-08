import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Plansio — Marketing · Design · Software · Games";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 80px",
          background: "linear-gradient(135deg, #ffffff 0%, #fbf6f0 55%, #f7f0fb 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 3, color: "#857e94", textTransform: "uppercase" }}>
          Plansio Studio
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 700,
            color: "#141018",
            lineHeight: 1.05,
            maxWidth: 940,
          }}
        >
          We build brands, products &amp; worlds.
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#4a4558" }}>
          Marketing · Design · Software · Games
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 14,
            background: "linear-gradient(90deg, #f7b231, #f36844, #d93d72, #6a22d8)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
