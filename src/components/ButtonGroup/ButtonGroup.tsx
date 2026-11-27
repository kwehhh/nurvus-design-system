import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './ButtonGroup.scss';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The Buttons to join. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/**
 * Joins Buttons into one row: square corners where they meet, rounded at the
 * two outer ends. Any other prop goes on the wrapping `<div>`.
 */
export default function ButtonGroup({ className, ...restProps }: ButtonGroupProps) {
  return (
    <div
      className={ classNames(className, 'button-group', CONSTANT.CLASS_PREFIX) }
      { ...restProps } />
  );
}
