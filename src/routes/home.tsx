import { Card } from "@/components/ui/card";
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-end justify-center gap-1 text-center">
          <h1 className="text-4xl font-bold">CountStream</h1>
          <sub className="mb-3.5 text-purple-500">by SCTools</sub>
        </div>
        <p className="text-center text-sm">
          A live counts website made by livestreamers for livestreamers.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex items-center justify-center gap-3 text-center">
            <svg
              viewBox="0 0 256 180"
              width="256"
              height="180"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              className="size-16"
            >
              <path
                d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
                fill="red"
              />
              <path
                fill="#FFF"
                d="m102.421 128.06 66.328-38.418-66.328-38.418z"
              />
            </svg>
            <h1 className="text-2xl font-bold">YouTube</h1>
          </div>
          <Link to="/youtube/channel" className="hover:underline">
            YouTube Live Subscriber Counter
          </Link>
        </Card>
      </div>
    </div>
  );
}
