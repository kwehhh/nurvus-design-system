import React from 'react';
import NavBar from './NavBar';

function StyleguideRenderer(props) {
  const navHeight = 50;
  const border = '1px solid var(--nv-border)';

  return (
    <div
      style={{
        paddingTop: 30,
        paddingLeft: 200
      }}
    >

      <NavBar
        { ...props }
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          height: navHeight,
          background: 'var(--nv-bg-alt)',
          zIndex: 1,
          // paddingLeft: 200,
          borderBottom: border
          // height: '100%'
        }}
      />
    <div
      style={{
        position: 'fixed',
        top: navHeight,
        bottom: 0,
        left: 0,
        width: 200,
        background: 'var(--nv-bg-alt)',
        zIndex: 2,
        borderRight: border
      }}
    >
      { props.toc }
    </div>
    <div
      style={{
        background: 'var(--nv-bg)',
        minHeight: '100vh',
        padding: 20
      }}
    >
    { props.children }
    </div>
  </div>
  )
}
export default StyleguideRenderer;