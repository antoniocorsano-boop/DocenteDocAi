// MD3 Gold Compliant — M3 Staggered List Entry Animation
// Wraps a list of children and applies md3-item-enter animation with
// per-item delay, producing the Google-apps "cascade" entry effect.
// No useTheme() — pure MD3 CSS token animation.

import React from 'react';

interface M3StaggeredListProps {
  /** Items to animate. Each child receives a staggered delay. */
  children: React.ReactNode;
  /** Delay between each item in ms. Default: 40ms. */
  staggerMs?: number;
  /** Initial delay before the first item starts. Default: 0ms. */
  initialDelayMs?: number;
  /** Animation duration per item. Default: var(--md-sys-motion-duration-medium). */
  duration?: string;
  /** Easing for the enter animation. Default: spring-expressive-default-effects. */
  easing?: string;
  /** Wrapper element tag. Default: 'div'. */
  as?: keyof JSX.IntrinsicElements;
  /** Extra styles applied to the wrapper. */
  style?: React.CSSProperties;
  /** aria role for the wrapper element */
  role?: string;
}

/**
 * M3StaggeredList
 *
 * Renders children with a cascading MD3 expressive slide-up animation.
 * Uses the `md3-item-enter` keyframe defined in theme.css.
 *
 * @example
 * <M3StaggeredList staggerMs={50}>
 *   {items.map(item => <ItemCard key={item.id} {...item} />)}
 * </M3StaggeredList>
 */
export const M3StaggeredList: React.FC<M3StaggeredListProps> = ({
  children,
  staggerMs = 40,
  initialDelayMs = 0,
  duration = 'var(--md-sys-motion-duration-medium)',
  easing = 'var(--md-sys-motion-spring-expressive-default-effects)',
  as: Tag = 'div',
  style,
  role,
}) => {
  const items = React.Children.toArray(children);

  return (
    <Tag style={style} role={role}>
      {items.map((child, index) => (
        <div
          key={(child as React.ReactElement).key ?? index}
          style={{
            animation: `md3-item-enter ${duration} ${easing} ${initialDelayMs + index * staggerMs}ms both`,
          }}
        >
          {child}
        </div>
      ))}
    </Tag>
  );
};

export default M3StaggeredList;
