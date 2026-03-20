import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1a237e 45%, #4f46e5 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "56px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "20px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "24px",
              display: "flex",
              fontSize: 42,
              fontWeight: 700,
              height: "84px",
              justifyContent: "center",
              letterSpacing: "-0.03em",
              width: "84px",
            }}
          >
            A
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div
              style={{
                fontSize: 28,
                letterSpacing: "0.24em",
                opacity: 0.78,
                textTransform: "uppercase",
              }}
            >
              Aspire Institute
            </div>
            <div
              style={{
                fontSize: 24,
                opacity: 0.72,
              }}
            >
              Leadership, communication, and personality development
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1.02,
            }}
          >
            1.5L+ Lives
            <br />
            Transformed
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.88)",
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
            }}
          >
            Transform your personality and career with India&apos;s leading
            training institute.
          </div>
        </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 24,
            justifyContent: "space-between",
            opacity: 0.8,
          }}
        >
          <div style={{ display: "flex" }}>Trusted across 15+ countries</div>
          <div style={{ display: "flex" }}>www.aspireinstitutein.com</div>
        </div>
      </div>
    ),
    size,
  );
}
