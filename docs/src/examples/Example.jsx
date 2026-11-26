import React from 'react';
import { Button, Tag } from '@nurvus/ui';
import CodeEditor from './CodeEditor';
import { compileExample } from './compile';
import { href } from '../router';

/** Catches render errors in an example, so one broken example can't take the page down. */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) return <ExampleError message={ this.state.error.message } />;
    return this.props.children;
  }
}

function ExampleError({ message }) {
  return <pre className="dx-example-error" role="alert">{ message }</pre>;
}

function compile(code, owner) {
  try {
    return { Component: compileExample(code, owner), error: null };
  } catch (error) {
    return { Component: null, error: error.message };
  }
}

/**
 * One example: the live preview, then its code in an editor. Edits re-render
 * the preview (after a short pause); a broken edit shows the error instead.
 * Toolbar: show / hide code, copy, reset, open isolated.
 */
export default function Example({ owner, index, code: original, mode = 'live', isolated = false }) {
  const [code, setCode] = React.useState(original);
  const [result, setResult] = React.useState(() => compile(original, owner));
  const [run, setRun] = React.useState(0);
  const [showCode, setShowCode] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const copiedTimer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(copiedTimer.current), []);

  // Re-compile 300 ms after the last keystroke.
  React.useEffect(() => {
    if (code === original && run === 0) return undefined;
    const timer = setTimeout(() => { setResult(compile(code, owner)); setRun((n) => n + 1); }, 300);
    return () => clearTimeout(timer);
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = () => {
    const done = () => {
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(done).catch(() => {});
  };

  if (mode === 'static') {
    return <div className="dx-example" data-mode="static"><CodeEditor value={ original } readOnly label="Code" /></div>;
  }

  const { Component, error } = result;
  const preview = (
    <div className="dx-example-preview" data-preview={ owner }>
      { error ? <ExampleError message={ error } /> : (
        <ErrorBoundary key={ run }>{ Component && <Component /> }</ErrorBoundary>
      ) }
    </div>
  );

  if (isolated) return <div className="dx-example" data-isolated="true">{ preview }</div>;

  return (
    <div className="dx-example" data-mode={ mode }>
      { preview }
      { mode === 'live' && (
        <div className="dx-example-bar">
          <Button type="secondary" size="mini" onClick={ () => setShowCode((s) => !s) } aria-expanded={ showCode }>
            { showCode ? 'Hide code' : 'Show code' }
          </Button>
          <Button type="secondary" size="mini" onClick={ copy }>{ copied ? 'Copied' : 'Copy code' }</Button>
          { code !== original && (
            <>
              <Button type="secondary" size="mini" onClick={ () => setCode(original) }>Reset</Button>
              <Tag tone="accent">edited</Tag>
            </>
          ) }
          <a className="dx-example-isolate" href={ href('Components', owner, 'example', String(index)) }>Open isolated</a>
        </div>
      ) }
      { mode === 'live' && showCode && <CodeEditor value={ code } onChange={ setCode } label={ `${owner} example ${index + 1} code` } /> }
    </div>
  );
}
