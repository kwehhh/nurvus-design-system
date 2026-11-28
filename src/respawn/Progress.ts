import classNames from 'classnames';
import CONSTANT from '../constants';
import { PROGRESS_STATUS, clampPercent, progressValueText, ProgressStatus } from '../progress';
import Icon from './Icon';
import { spawn, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Progress/Progress.scss';

export type ProgressSize = 'small' | 'medium' | 'large';
export type { ProgressStatus };

export interface ProgressProps extends ElementProps {
  /** How far along, 0 to 100. */
  percent?: number;
  /** Bar height. */
  size?: ProgressSize;
  /** The bar color: active (accent), success, warning or critical (danger). With a label or showValue, a status also shows as an icon and a word. */
  status?: ProgressStatus;
  /** What is in progress ("Uploading"): shown above the bar, and its name for screen readers. */
  label?: string;
  /** Keeps the label for screen readers only. */
  hideLabel?: boolean;
  /** Shows the percent (and the status, as an icon and a word) at the right, above the bar. */
  showValue?: boolean;
  /** What screen readers say for the value, instead of "40%" (e.g. "3 of 8 files"). */
  valueText?: string;
}

/**
 * A progress bar, the same markup as the React one: a progressbar with its
 * label and value for screen readers, and the status as an icon and a word
 * when it has a label or showValue. bar.update({ percent: 60 }) moves it.
 */
export default function Progress(props: ProgressProps = {}): NurvusElement<HTMLDivElement, ProgressProps> {
  return updatable(({
    className, percent = 0, size = 'medium', status = 'active', label, hideLabel = false, showValue = false, valueText, ...rest
  }: ProgressProps) => {
    const value = clampPercent(percent);
    const meaning = PROGRESS_STATUS[status] || PROGRESS_STATUS.active;
    const head = (label && !hideLabel) || showValue;
    return spawn<HTMLDivElement>({
      className: classNames(className, 'progress', CONSTANT.CLASS_PREFIX),
      'data-size': size,
      'data-status': status,
      role: 'progressbar',
      'aria-label': label || 'Progress',
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuenow': value,
      'aria-valuetext': valueText || progressValueText(value, status),
      ...rest,
      children: [
        head ? spawn({
          className: 'progress-head',
          children: [
            label && !hideLabel ? spawn({ tag: 'span', className: 'progress-label', children: label }) : null,
            showValue ? spawn({
              tag: 'span',
              className: 'progress-value',
              children: [
                meaning.icon ? Icon({ name: meaning.icon }) : null,
                meaning.word ? spawn({ tag: 'span', className: 'progress-word', children: meaning.word }) : null,
                spawn({ tag: 'span', children: `${value}%` }),
              ],
            }) : null,
          ],
        }) : null,
        spawn({ className: 'progress-track', children: spawn({ className: 'bar', style: { width: `${value}%` } }) }),
      ],
    });
  }, props);
}
