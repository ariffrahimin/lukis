import type { NodeType } from '../../../types/diagrams';
import { ALL_NODE_TYPES } from '../../../types/diagrams';

export function validateNodeTypeRegistration<T extends Record<string, unknown>>(
  _registryName: string,
  registry: T
): { missing: string[]; extra: string[] } {
  const registryKeys = Object.keys(registry);
  const nodeTypeSet = new Set(ALL_NODE_TYPES);

  const missing = ALL_NODE_TYPES.filter((type: NodeType) => !(type in registry));
  const extra = registryKeys.filter((key) => !nodeTypeSet.has(key as NodeType));

  return { missing, extra };
}

export function expectCompleteRegistration<T extends Record<string, unknown>>(
  registryName: string,
  registry: T
): void {
  const { missing, extra } = validateNodeTypeRegistration(registryName, registry);

  if (missing.length > 0) {
    throw new Error(
      `${registryName} is missing entries for: ${missing.join(', ')}\n` +
      `These node types will fall back to React Flow's default renderer.`
    );
  }

  if (extra.length > 0) {
    console.warn(`${registryName} has extra entries not in NodeType: ${extra.join(', ')}`);
  }
}
