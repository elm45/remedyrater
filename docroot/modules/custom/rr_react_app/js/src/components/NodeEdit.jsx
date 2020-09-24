import React from "react";
import NodeForm from "./NodeForm";

const NodeEdit = ({ id, title, body, onSuccess, setShowAdminOptions, showAdminOptions, showNodeAdd, setShowNodeAdd }) => (
  <NodeForm
    id={id}
    title={title}
    body={body}
    onSuccess={onSuccess}
    setShowAdminOptions={setShowAdminOptions}
    showAdminOptions={showAdminOptions}
    setShowNodeAdd={setShowNodeAdd}
    showNodeAdd={showNodeAdd}
  />
);

export default NodeEdit;
