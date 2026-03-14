import React from 'react';
import BeatLoader from "react-spinners/BeatLoader";

const loaderContainerStyle: React.CSSProperties = {
  position: "fixed",
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backdropFilter: "blur(1px)",
  zIndex: 1000,
};

const loaderStyle: React.CSSProperties = {
  borderColor: "red",
};

interface LoadingAnimationProps {
  resion?: string;
}

export default function BeatLoadingAnimation({ resion = "" }: LoadingAnimationProps) {
  return (
    <div style={loaderContainerStyle}>
      <BeatLoader
        color="#F58634"
        loading={true}
        cssOverride={loaderStyle}
        size={25}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <p className='text-xl'>{resion}</p>
    </div>
  );
}



