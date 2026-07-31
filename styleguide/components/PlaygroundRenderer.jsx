import React from 'react';
import cx from 'clsx';
import ReactDOM from 'react-dom';
import { Button, Layout } from '@nurvus/design-system';

// ReactDOM.render(
//   <div>
//     asdsadas cvcxvcxv
//     <Button />
//   </div>,
//   document.body
// );



function PlaygroundRenderer(props) {
  const {
    classes = {},
    exampleIndex,
    name,
    padded,
    preview,
    previewProps,
    tabButtons,
    tabBody,
    toolbar,
  } = props;

  const { className, ...pProps } = previewProps;
	const previewClasses = cx(classes.preview, className, { [classes.padded]: padded });
	return (
		<div className={`playground-renderer ${classes.root}`} data-testid={`${name}-example-${exampleIndex}`}>
			<div
        className={previewClasses}
        {...pProps}
        data-preview={name}
        data-testid="preview-wrapper"
        style={{
          padding: 20,
          background: 'white',
          borderRadius: 6
        }}
      >
				{preview}
			</div>
			<Layout display="flex" justifyContent="space-between"className={classes.controls}>
				<div className={classes.tabs}>{tabButtons}</div>
				<div className={classes.toolbar}>{toolbar}</div>
			</Layout>
			<div className={classes.tab}>{tabBody}</div>
		</div>
	);
  }
export default PlaygroundRenderer;