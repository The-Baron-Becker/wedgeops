// Twitter card uses the same artwork as the OG card (large summary card).
// We re-export everything from opengraph-image.tsx, but Next.js 16 only
// allows specific Route Segment Config exports here, so we keep just the
// component + the file-convention metadata (alt, size, contentType, runtime).
import OG, {
  alt as ogAlt,
  size as ogSize,
  contentType as ogContentType,
} from "./opengraph-image";

export const runtime = "edge";
export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default OG;
