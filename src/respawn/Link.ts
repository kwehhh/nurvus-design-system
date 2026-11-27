import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps, Listener } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Link/Link.scss';

export interface LinkProps extends ElementProps {
  /** Where it goes. */
  href?: string;
  /** Called on a click with the event and the link. */
  onClick?: Listener<MouseEvent>;
  /** Content to render. */
  children?: Child;
}

/** A link in the theme's accent color. Any other prop (href, target…) goes on the `<a>`. */
export default function Link(props: LinkProps = {}): NurvusElement<HTMLAnchorElement, LinkProps> {
  return updatable(({ children, className, ...rest }: LinkProps) => spawn<HTMLAnchorElement>({
    className: classNames(className, 'link', CONSTANT.CLASS_PREFIX),
    ...rest,
    tag: 'a',
    children,
  }), props);
}
