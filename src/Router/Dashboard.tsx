import React from "react";
import PortalLayout from "../Layout/PortalLayout";
import ProductsList from "./ProductsList";

function Dashboard() {
  return (
    <PortalLayout>
      <ProductsList />
    </PortalLayout>
  );
}

export default Dashboard;
