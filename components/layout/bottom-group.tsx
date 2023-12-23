import React from "react";
import SocialCard from "./social-card";
import Footer from "./footer";
import Collaborate from "./collaborate";

const BottomGroup = () => {
  return (
    <React.Fragment>
      <Collaborate />
      <SocialCard />
      <Footer />
    </React.Fragment>
  );
};

export default BottomGroup;
