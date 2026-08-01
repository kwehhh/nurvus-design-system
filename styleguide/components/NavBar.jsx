import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Layout, Title } from '@nurvus/ui';

// ReactDOM.render(
//   <div>
//     asdsadas cvcxvcxv
//     <Button />
//   </div>,
//   document.body
// );



function NavBar(props) {
  const { style } = props;

  return (
    <div className="navbar" style={ style }>
      <Layout
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        style={{
          // maxWidth: 500,
          margin: '0 auto',
          height: '100%',
          padding: 20
        }}


      >
      <Title level={ 2 }>
        { props.title }
      </Title>
      <Layout display="flex" alignItems="center" itemSpacing={ 10 }>
        <Title level={ 5 } type="secondary">
          v{ props.version }
        </Title>
        <Button
          size="small"
          onClick={ () => window.location.href='https://github.com/UnfocusedDrive/nurvus-design-system' }
        >
          GitHub
        </Button>
      </Layout>
    </Layout>
    </div>
  )
}
export default NavBar;