import React from "react";
import { render } from "react-dom";
import RemedyRaterApp from "./rr_app.js";
import NodeReadWrite from "./components/NodeReadWrite.jsx";

// render(
//   <RemedyRaterApp nid={document.getElementById("rr_app")} />,
//   document.getElementById("rr_app")
// );

render(<NodeReadWrite />, document.getElementById('rr_app'));
