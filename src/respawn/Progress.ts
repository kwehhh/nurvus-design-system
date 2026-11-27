import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Progress/Progress.scss';

export type ProgressSize = 'small' | 'medium' | 'large';
export type ProgressStatus = 'active' | 'success' | 'warning' | 'critical';

export interface ProgressProps {
  /** How far along, 0 to 100. */
  percent?: number;
  /** Bar height. */
  size?: ProgressSize;
  /** The bar color: active (accent), success, warning or critical (danger). */
  status?: ProgressStatus;
  /** Custom class name. */
  className?: string;
}

/** A progress bar. Like the React one, it takes no other attributes. */
export default function Progress(props: ProgressProps = {}): NurvusElement<HTMLDivElement, ProgressProps> {
  return updatable(({ className, percent = 0, size = 'medium', status = 'active' }: ProgressProps) => spawn<HTMLDivElement>({
    className: classNames(className, 'progress', CONSTANT.CLASS_PREFIX),
    'data-size': size,
    'data-status': status,
    children: spawn({ className: 'bar', style: { width: `${percent}%` } }),
  }), props);
}
