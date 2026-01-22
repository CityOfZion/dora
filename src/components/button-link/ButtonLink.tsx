import Clickable, { ClickableProps } from '../clickable/Clickable'
import Link, { LinkProps } from '../link/Link'

type ButtonLinkProps = {
  href: string
} & ClickableProps &
  LinkProps

const ButtonLink: React.FC<ButtonLinkProps> = ({
  href,
  children,
  variant,
  schema,
  disabled,
  lowercase,
  ...props
}) => {
  return (
    <Link href={href} {...props}>
      <Clickable
        variant={variant}
        schema={schema}
        disabled={disabled}
        lowercase={lowercase}
        style={props.style}
      >
        {children}
      </Clickable>
    </Link>
  )
}

export default ButtonLink
