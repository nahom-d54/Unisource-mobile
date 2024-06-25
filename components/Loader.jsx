import React from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"

const MyLoader = (props) => {
    const { width, height } = props;
    const scaleX = width / 100;
    const scaleY = height / 150;
  
    return (
      <ContentLoader 
        speed={2}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        backgroundColor="#d4d4d4"
        foregroundColor="#9c9c9c"
        {...props}
      >
        <Rect x={3 * scaleX} y={128 * scaleY} rx={4} ry={4} width={72 * scaleX} height={4 * scaleY} /> 
        <Rect x={3 * scaleX} y={135 * scaleY} rx={3} ry={3} width={80 * scaleX} height={4 * scaleY} /> 
        <Rect x={3 * scaleX} y={3 * scaleY} rx={3} ry={3} width={94 * scaleX} height={120 * scaleY} /> 
        <Rect x={3 * scaleX} y={142 * scaleY} rx={3} ry={3} width={45 * scaleX} height={3 * scaleY} />
      </ContentLoader>
    );
  };
const MyLoader2 = (props) => {
    const { width, height } = props;
    const scaleX = width / 400;
    const scaleY = height / 150;
  
    return (
      <ContentLoader 
        speed={2}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        backgroundColor="#d4d4d4"
        foregroundColor="#9c9c9c"
        {...props}
      >    
    <Rect x={3 * scaleX } y={3 * scaleY} rx="3" ry="3" width={94* scaleX} height={120* scaleY} /> 
    <Rect x={114 * scaleX } y={14 * scaleY} rx="6" ry="6" width={149* scaleX} height={10* scaleY} /> 
    <Rect x={114 * scaleX } y={28 * scaleY} rx="6" ry="6" width={110* scaleX} height={10* scaleY} /> 
    <Rect x={114 * scaleX } y={52 * scaleY} rx="3" ry="3" width={149* scaleX} height={8* scaleY} /> 
    <Rect x={114 * scaleX } y={66 * scaleY} rx="3" ry="3" width={50* scaleX} height={6* scaleY} />
  </ContentLoader>
      
    );
  };

export {MyLoader, MyLoader2}