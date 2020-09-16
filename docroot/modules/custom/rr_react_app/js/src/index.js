import React from "react";
import { render } from "react-dom";
import RemedyRaterApp from "./rr_app.js";

render(
  <RemedyRaterApp nid={document.getElementById("rr_app")} />,
  document.getElementById("rr_app")
);
