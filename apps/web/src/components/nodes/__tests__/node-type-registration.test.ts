import { describe, it, expect } from 'vitest';
import { ALL_NODE_TYPES } from '../../../types/diagrams';
import { nodeTypeStyles } from '../node-styles';
import { cloudServiceIcons, isCloudService } from '../node-icons';
import { defaultNodeLabels } from '../../DiagramCanvas';

describe('NodeType Registration', () => {
  describe('ALL_NODE_TYPES', () => {
    it('should have no duplicate node types', () => {
      const duplicates = ALL_NODE_TYPES.filter(
        (type, index) => ALL_NODE_TYPES.indexOf(type) !== index
      );
      expect(duplicates).toHaveLength(0);
    });
  });

  describe('nodeTypeStyles', () => {
    it('should have an entry for every NodeType', () => {
      const missing = ALL_NODE_TYPES.filter((type) => !(type in nodeTypeStyles));
      expect(missing, `Missing: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('every entry should have valid bg, border, and icon classes', () => {
      for (const [type, style] of Object.entries(nodeTypeStyles)) {
        expect(style.bg, `${type}: missing bg`).toBeTruthy();
        expect(style.border, `${type}: missing border`).toBeTruthy();
        expect(style.icon, `${type}: missing icon`).toBeTruthy();
      }
    });
  });

  describe('cloudServiceIcons', () => {
    it('should have an entry for every cloud service NodeType', () => {
      const cloudServiceTypes = ALL_NODE_TYPES.filter((type) =>
        type.startsWith('gcp-') ||
        type.startsWith('aws-') ||
        type.startsWith('azure-') ||
        type.startsWith('oci-') ||
        type.startsWith('nosql-') ||
        type.startsWith('sql-') ||
        type.startsWith('proglang-') ||
        type.startsWith('animated-')
      );

      const missing = cloudServiceTypes.filter((type) => !(type in cloudServiceIcons));
      expect(missing, `Missing cloud service icons: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('every cloudServiceIcons entry should be a valid icon', () => {
      for (const [type, icon] of Object.entries(cloudServiceIcons)) {
        expect(typeof icon, `${type} icon should be a string`).toBe('string');
        expect(icon.length, `${type} icon should not be empty`).toBeGreaterThan(0);
      }
    });
  });

  describe('defaultNodeLabels', () => {
    it('should have an entry for every NodeType', () => {
      const missing = ALL_NODE_TYPES.filter((type) => !(type in defaultNodeLabels));
      expect(missing, `Missing labels for: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('every label should be a non-empty string', () => {
      for (const [type, label] of Object.entries(defaultNodeLabels)) {
        expect(typeof label, `${type} label should be a string`).toBe('string');
        expect(label.length, `${type} label should not be empty`).toBeGreaterThan(0);
      }
    });
  });

  describe('isCloudService', () => {
    it('should return true for cloud service node types', () => {
      const cloudServiceTypes = ALL_NODE_TYPES.filter((type) =>
        type.startsWith('gcp-') ||
        type.startsWith('aws-') ||
        type.startsWith('azure-') ||
        type.startsWith('oci-') ||
        type.startsWith('nosql-') ||
        type.startsWith('sql-') ||
        type.startsWith('proglang-') ||
        type.startsWith('animated-')
      );

      for (const type of cloudServiceTypes) {
        expect(isCloudService(type), `${type} should be a cloud service`).toBe(true);
      }
    });

    it('should return false for non-cloud service node types', () => {
      const nonCloudServiceTypes = ALL_NODE_TYPES.filter((type) =>
        !type.startsWith('gcp-') &&
        !type.startsWith('aws-') &&
        !type.startsWith('azure-') &&
        !type.startsWith('oci-') &&
        !type.startsWith('nosql-') &&
        !type.startsWith('sql-') &&
        !type.startsWith('proglang-') &&
        !type.startsWith('animated-')
      );

      for (const type of nonCloudServiceTypes) {
        expect(isCloudService(type), `${type} should NOT be a cloud service`).toBe(false);
      }
    });
  });
});
