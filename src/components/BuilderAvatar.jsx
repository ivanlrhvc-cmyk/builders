export default function BuilderAvatar({ builder, size = 36 }) {
  const initials = builder.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (builder.avatar) {
    return (
      <img
        src={builder.avatar}
        alt={builder.name}
        className="builder-avatar"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      className="builder-avatar builder-avatar--initials"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={builder.name}
    >
      {initials}
    </span>
  )
}
