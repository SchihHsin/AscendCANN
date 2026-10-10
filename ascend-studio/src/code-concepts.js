export const CODE_CONCEPTS = Object.freeze({
  total: { label: "输入与分块", code: "total / blocks", note: "元素总数决定完整块和最后一块的位置。" },
  tail: { label: "最后一块", code: "baseIndex / validCount", note: "从最后一块的起点，核对剩余有效元素数。" },
  access: { label: "访问范围", code: "offset / index", note: "循环次数决定本次示例实际访问到哪里。" },
});

export function codeConcept(line) {
  if (/\bvalidCount\b/.test(line) && !/for\s*\(/.test(line)) return "tail";
  if (/\bbaseIndex\b/.test(line) && !/\bindex\b/.test(line)) return "tail";
  if (/\b(offset|index)\b/.test(line)) return "access";
  if (/\b(rows|columns|tileSize|total|blocks)\b/.test(line) && !/for\s*\(/.test(line)) return "total";
  return null;
}
