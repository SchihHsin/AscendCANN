export const canvasNodeKey = (kind, ...ids) => ["node", kind, ...ids].join(":");

export function positionTreeNodes(tree, positions = {}, groupsKey = "stages", childrenKey = "steps") {
  const groups = tree[groupsKey].map(group => {
    const groupPoint = positions[canvasNodeKey("stage", group.id)];
    const nextGroup = {
      ...group,
      rect: groupPoint ? { ...group.rect, ...groupPoint } : group.rect,
      [childrenKey]: group[childrenKey].map(child => {
        const childPoint = positions[canvasNodeKey("step", group.id, child.id)];
        return { ...child, rect: childPoint ? { ...child.rect, ...childPoint } : child.rect };
      }),
    };
    return nextGroup;
  });
  const rects = groups.flatMap(group => [group.rect, ...group[childrenKey].map(child => child.rect)]);
  return {
    ...tree,
    [groupsKey]: groups,
    width: Math.max(tree.width, ...rects.map(rect => rect.x + rect.width + 28)),
    height: Math.max(tree.height, ...rects.map(rect => rect.y + rect.height + 28)),
  };
}

export function nodeConnector(source, target) {
  const sx = source.x + source.width / 2;
  const sy = source.y + source.height / 2;
  const tx = target.x + target.width / 2;
  const ty = target.y + target.height / 2;
  const dx = tx - sx;
  const dy = ty - sy;
  if (Math.abs(dx) > Math.abs(dy)) {
    const startX = dx > 0 ? source.x + source.width : source.x;
    const endX = dx > 0 ? target.x : target.x + target.width;
    const middleX = (startX + endX) / 2;
    return `M${startX},${sy} H${middleX} V${ty} H${endX}`;
  }
  const startY = dy > 0 ? source.y + source.height : source.y;
  const endY = dy > 0 ? target.y : target.y + target.height;
  const middleY = (startY + endY) / 2;
  return `M${sx},${startY} V${middleY} H${tx} V${endY}`;
}

// Draw a shared spine beside each stage's node column. The branches end at
// the card edges so the line never runs beneath a node.
export function stageSpineConnectors(stage, gap = 26, branchLength = 9) {
  const rects = [stage.rect, ...stage.children.map(child => child.rect)];
  if (!rects.length) return { spine: "", branches: [] };
  const left = Math.min(...rects.map(rect => rect.x));
  const spineX = left - gap;
  const centers = rects.map(rect => rect.y + rect.height / 2);
  const first = Math.min(...centers), last = Math.max(...centers);
  return {
    spine: `M${spineX},${first} V${last}`,
    branches: rects.map((rect, index) => ({ id: index === 0 ? "stage" : stage.children[index - 1]?.id, d: `M${spineX},${rect.y + rect.height / 2} H${rect.x - branchLength}` })),
  };
}

export function hierarchySpineConnectors(groups, gap = 26, branchLength = 9) {
  const rects = groups.flatMap(stage => [{ id: `stage:${stage.id}`, rect: stage.rect }, ...stage.children.map(child => ({ id: child.id, rect: child.rect }))]);
  if (!rects.length) return { spine: "", branches: [] };
  const spineX = Math.min(...rects.map(item => item.rect.x)) - gap;
  const centers = rects.map(item => item.rect.y + item.rect.height / 2);
  const first = Math.min(...centers), last = Math.max(...centers);
  return {
    spine: `M${spineX},${first} V${last}`,
    branches: rects.map(({ id, rect }) => ({ id, d: `M${spineX},${rect.y + rect.height / 2} H${rect.x - branchLength}` })),
  };
}
