import express from "express";
import client from "prom-client";
import log from "jet-logger";

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
  name: "downloader_rest_response_time_duration_seconds",
  help: "REST API response time in seconds",
  labelNames: ["method", "route", "status_code"],
});


export function startMetricsServer() {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  collectDefaultMetrics();

  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);

    return res.send(await client.register.metrics());
  });

  app.listen(9100, () => {
    log.info("Metrics server started at http://localhost:9100");
  });
}
