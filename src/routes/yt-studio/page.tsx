import "./styles.css";

import { Link, useParams, useSearchParams } from "react-router";
import { apis, useLiveUser, useRecommendedApi } from "@/hooks/use-user";
import Odometer from "react-odometerjs";
import { useRef } from "react";
import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import Highcharts from "highcharts";

export default function YTStudio() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  if (!id) throw new Error("Invalid state?");

  const recommendedApi = useRecommendedApi(id);

  const api = searchParams.get("api") ?? recommendedApi;
  const selectedApi = apis.find((a) => a.id === api) ?? apis[0];
  const count = searchParams.get("count") ?? "subscribers";

  const chartRef = useRef<HighchartsReactRefObject>(null);

  const { user, counts } = useLiveUser({
    id,
    api: selectedApi,
    onRequest: (data) => {
      if (!chartRef.current) return;
      if (chartRef.current.chart.series[0].points.length >= 3600)
        chartRef.current.chart.series[0].data[0].remove();
      chartRef.current?.chart.series[0].addPoint([
        Date.now(),
        Number((data as any)?.[count]),
      ]);
    },
  });

  return (
    <>
      <div className="header-rectangle">
        <div className="sub-header">
          <div id="updating-dot">
            <span id="dot"></span>
          </div>
          <h4 className="live">Updating live</h4>
        </div>
        <div className="icon-container">
          <div className="yt-icon">
            <svg
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
              className="style-scope yt-icon pointer-events-none block h-full w-full"
            >
              <g
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="style-scope yt-icon"
              >
                <path
                  d="M21.58 7.19C21.35 6.33 20.67 5.65 19.81 5.42C18.25 5 12 5 12 5C12 5 5.75 5 4.19 5.42C3.33 5.65 2.65 6.33 2.42 7.19C2 8.75 2 12 2 12C2 12 2 15.25 2.42 16.81C2.65 17.67 3.33 18.35 4.19 18.58C5.75 19 12 19 12 19C12 19 18.25 19 19.81 18.58C20.67 18.35 21.35 17.67 21.58 16.81C22 15.25 22 12 22 12C22 12 22 8.75 21.58 7.19ZM10 15V9L15.2 12L10 15Z"
                  className="style-scope yt-icon"
                ></path>
              </g>
            </svg>
          </div>
        </div>
        <Link to="/" className="icon-container2">
          <svg
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
            className="svg3"
          >
            <g>
              <path d="M12.7,12l6.6,6.6l-0.7,0.7L12,12.7l-6.6,6.6l-0.7-0.7l6.6-6.6L4.6,5.4l0.7-0.7l6.6,6.6l6.6-6.6l0.7,0.7L12.7,12z"></path>
            </g>
          </svg>
        </Link>
      </div>
      <img src={user?.avatar} alt="" id="avatar" />
      <p id="title">{user?.title}</p>
      <div className="main-area">
        <div className="count-area">
          <Odometer
            value={(counts as any)[count]}
            // @ts-expect-error incorrect types
            animation="byDigit"
            id="count"
          />
          <p className="label">Subscribers</p>
        </div>
        <div className="chart-area">
          <div className="chart-text-area">
            <p className="channel-growth-label">Channel growth</p>
            <p className="last-growth-label">Last hour</p>
          </div>
          <div id="chart">
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  renderTo: "chart",
                  type: "line",
                  zoomType: "x",
                  backgroundColor: "transparent",
                  plotBorderColor: "transparent",
                  height: "153px",
                  animation: true,
                  style: {
                    fontFamily: "Roboto",
                  },
                },
                title: {
                  text: "",
                },
                xAxis: {
                  type: "datetime",
                  tickPixelInterval: 500,
                  labels: {
                    style: {
                      color: "#AAAAAA",
                    },
                  },
                  gridLineColor: "#9E9E9E",
                  lineColor: "#9E9E9E",
                  minorGridLineColor: "#858585",
                  tickColor: "#858585",
                  title: {
                    style: {
                      color: "#858585",
                    },
                  },
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  labels: {
                    style: {
                      color: "#AAAAAA",
                    },
                    formatter: function (this: any): any {
                      function abbreviate(
                        count: any,
                        withAbbr = true,
                        decimals = 2,
                      ) {
                        if (String(count)[0] === "0") {
                          if (count === 0) return "0";
                          else return count.toFixed(decimals);
                        }

                        let neg = false;
                        if (String(count)[0] == "-") {
                          neg = true;
                          count = ~Number(count) + 1;
                        }

                        const COUNT_ABBRS = ["", "K", "M", "B"];
                        const i =
                          count === 0
                            ? count
                            : Math.floor(Math.log(count) / Math.log(1000));
                        let result = parseFloat(
                          (count / Math.pow(1000, i)).toFixed(decimals),
                        ).toString();
                        if (withAbbr) result += `${COUNT_ABBRS[i]}`;
                        if (neg) result = `-${result}`;
                        return result;
                      }

                      return abbreviate(this.value);
                    },
                  },
                  gridLineColor: "#3D3D3D",
                  lineColor: "#3D3D3D",
                  minorGridLineColor: "#3D3D3D",
                  tickColor: "#3D3D3D",
                  opposite: true,
                },
                credits: {
                  enabled: false,
                },
                tooltip: {
                  shared: true,
                },
                series: [
                  {
                    showInLegend: false,
                    name: user?.title ?? "",
                    marker: { enabled: false },
                    color: "#3FABCD",
                    lineColor: "#3FABCD",
                    lineWidth: 2,
                  },
                ],
              }}
              ref={chartRef}
            />
          </div>
        </div>
      </div>
    </>
  );
}
