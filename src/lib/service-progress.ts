/** A stable hold followed by a complementary crossfade. Safe to seek in either direction. */
export function getServiceFrame(value: number, count: number) {
  const position = Math.max(0, Math.min(count - 1, value))
  const outgoing = Math.floor(position)
  const incoming = Math.min(count - 1, outgoing + 1)
  const linear = Math.max(0, Math.min(1, (position - outgoing - 0.58) / 0.42))
  const mix = linear * linear * (3 - 2 * linear)
  const active = mix >= 0.5 ? incoming : outgoing
  const opacities = Array.from({ length: count }, (_, index) => (
    index === outgoing ? 1 - mix : index === incoming ? mix : 0
  ))
  return { active, opacities }
}
