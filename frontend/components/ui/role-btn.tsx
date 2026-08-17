interface RoleBtnProps {
  role: string;
  id?: string;
  ariaLl?: string;
  children: React.ReactNode;
  style?: string | React.CSSProperties;
}

function RoleBtn({ role, id, ariaLl, style, children }: RoleBtnProps) {
  return (
    <div
      role={role}
      id={id}
      aria-label={ariaLl}
      style={typeof style === "string" ? { display: style } : style}
    >
      {children}
    </div>
  );
}

export default RoleBtn;
