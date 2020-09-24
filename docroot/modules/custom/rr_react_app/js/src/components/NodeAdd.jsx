import React from "react";
import NodeForm from './NodeForm';

const NodeAdd = ({ onSuccess, setShowAdminOptions, showAdminOptions, showNodeAdd, setShowNodeAdd }) => (
  <NodeForm
    id={null}
    onSuccess={onSuccess}
    setShowAdminOptions={setShowAdminOptions}
    showAdminOptions={showAdminOptions}
    setShowNodeAdd={setShowNodeAdd}
    showNodeAdd={showNodeAdd}
  />
);

export default NodeAdd;
