import React from 'react';
import { Link } from 'react-router-dom';

const VARIANT_CLASS = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  ink: 'btn-ink',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

/**
 * Single button primitive for the whole app.
 *
 * Replaces the five overlapping button classes that previously existed
 * (`search-btn`, `add-action-btn`, `checkout-btn`, `auth-submit-btn`, `chip`) so
 * that focus, loading and sizing behaviour is defined exactly once.
 *
 * Renders a router `Link` when `to` is supplied, an anchor when `href` is
 * supplied, and a native `<button>` otherwise.
 *
 * @param {Object} props
 * @param {'primary'|'accent'|'ink'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.block=false] - Stretch to the container width.
 * @param {boolean} [props.loading=false] - Show a spinner and block interaction.
 * @param {React.ReactNode} [props.icon] - Leading icon.
 * @param {React.ReactNode} [props.iconRight] - Trailing icon.
 * @returns {JSX.Element} The rendered button, link or anchor.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  icon = null,
  iconRight = null,
  to,
  href,
  type = 'button',
  className = '',
  children,
  disabled = false,
  ...rest
}) {
  const classes = [
    'btn',
    VARIANT_CLASS[variant] || VARIANT_CLASS.primary,
    `btn-${size}`,
    block ? 'btn-block' : '',
    loading ? 'is-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || loading;

  const content = (
    <>
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        icon && <span className="btn-icon">{icon}</span>
      )}
      <span className="btn-label">{children}</span>
      {iconRight && !loading && <span className="btn-icon">{iconRight}</span>}
    </>
  );

  if (to && !isDisabled) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href && !isDisabled) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={isDisabled} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  );
}
