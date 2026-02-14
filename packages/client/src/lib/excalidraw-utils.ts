// Convert our simplified element format to full Excalidraw elements
let globalSeed = 1;

function randomSeed() {
  return globalSeed++;
}

const DEFAULTS = {
  strokeWidth: 2,
  roughness: 1,
  opacity: 100,
  strokeStyle: 'solid' as const,
  fillStyle: 'solid' as const,
  strokeColor: '#e2e8f0',
  backgroundColor: 'transparent',
  angle: 0,
  groupIds: [] as string[],
  frameId: null,
  boundElements: null,
  updated: Date.now(),
  link: null,
  locked: false,
  version: 1,
  versionNonce: 0,
  isDeleted: false,
};

export function toExcalidrawElement(el: any): any {
  if (el.type === 'cameraUpdate') return null;

  const base = {
    ...DEFAULTS,
    seed: randomSeed(),
    id: el.id || `el-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    x: el.x ?? 0,
    y: el.y ?? 0,
    width: el.width ?? 100,
    height: el.height ?? 100,
    strokeColor: el.strokeColor || DEFAULTS.strokeColor,
    backgroundColor: el.backgroundColor || DEFAULTS.backgroundColor,
    fillStyle: el.fillStyle || DEFAULTS.fillStyle,
    roundness: el.roundness || null,
    opacity: el.opacity ?? 100,
  };

  if (el.type === 'text') {
    return {
      ...base,
      type: 'text',
      text: el.text || '',
      fontSize: el.fontSize || 20,
      fontFamily: el.fontFamily || 1,
      textAlign: 'center',
      verticalAlign: 'middle',
      width: (el.text?.length || 5) * (el.fontSize || 20) * 0.6,
      height: (el.fontSize || 20) * 1.5,
      baseline: el.fontSize || 20,
      containerId: null,
      originalText: el.text || '',
      autoResize: true,
      lineHeight: 1.25,
    };
  }

  if (el.type === 'arrow' || el.type === 'line') {
    return {
      ...base,
      type: el.type,
      points: el.points || [[0, 0], [el.width || 100, 0]],
      startArrowhead: el.startArrowhead || null,
      endArrowhead: el.type === 'arrow' ? (el.endArrowhead || 'arrow') : null,
      startBinding: el.startBinding || null,
      endBinding: el.endBinding || null,
      lastCommittedPoint: null,
      elbowed: false,
    };
  }

  // rectangle, ellipse, diamond
  const shape: any = {
    ...base,
    type: el.type || 'rectangle',
  };

  // Handle label as bound text element
  if (el.label) {
    const textId = `${shape.id}-label`;
    shape.boundElements = [{ type: 'text', id: textId }];
    // Return both shape and its label
    return [shape, {
      ...DEFAULTS,
      seed: randomSeed(),
      type: 'text',
      id: textId,
      x: shape.x + 10,
      y: shape.y + shape.height / 2 - (el.label.fontSize || 20) / 2,
      width: shape.width - 20,
      height: el.label.fontSize || 20,
      text: el.label.text || '',
      fontSize: el.label.fontSize || 20,
      fontFamily: 1,
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: shape.id,
      originalText: el.label.text || '',
      autoResize: true,
      lineHeight: 1.25,
      baseline: el.label.fontSize || 20,
    }];
  }

  return shape;
}

export function convertElements(rawElements: any[]): any[] {
  const result: any[] = [];
  for (const el of rawElements) {
    const converted = toExcalidrawElement(el);
    if (!converted) continue;
    if (Array.isArray(converted)) {
      result.push(...converted);
    } else {
      result.push(converted);
    }
  }
  return result;
}
