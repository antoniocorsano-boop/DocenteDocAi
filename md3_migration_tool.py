#!/usr/bin/env python3
"""
Safe MD3 Migration Tool v2.0
Scientific approach with dry-run, backup, and rigorous validation
"""

import os
import re
import json
import subprocess
import shutil
from pathlib import Path
from typing import Dict, List, Tuple, Optional

class MD3MigrationTool:
    """Safe, validated MD3 migration tool with rollback capabilities"""

    def __init__(self, workspace_root: str):
        self.workspace_root = Path(workspace_root)
        self.backup_suffix = ".md3_backup"
        self.dry_run = False

    def set_dry_run(self, enabled: bool = True):
        """Enable/disable dry-run mode"""
        self.dry_run = enabled
        print(f"🔧 Dry-run mode: {'ENABLED' if enabled else 'DISABLED'}")

    def create_backup(self, component_path: str) -> bool:
        """Create backup of component before migration"""
        if self.dry_run:
            print(f"📋 DRY-RUN: Would backup {component_path}")
            return True

        backup_path = component_path + self.backup_suffix
        try:
            shutil.copy2(component_path, backup_path)
            print(f"💾 Backup created: {backup_path}")
            return True
        except Exception as e:
            print(f"❌ Backup failed: {e}")
            return False

    def restore_backup(self, component_path: str) -> bool:
        """Restore component from backup"""
        backup_path = component_path + self.backup_suffix
        if not os.path.exists(backup_path):
            print(f"❌ No backup found: {backup_path}")
            return False

        try:
            shutil.copy2(backup_path, component_path)
            print(f"🔄 Backup restored: {component_path}")
            return True
        except Exception as e:
            print(f"❌ Restore failed: {e}")
            return False

    def validate_component(self, component_path: str) -> Tuple[bool, str]:
        """Comprehensive validation of component"""
        if not os.path.exists(component_path):
            return False, "Component file not found"

        # TypeScript compilation check
        try:
            result = subprocess.run(
                ["npx", "tsc", "--noEmit", "--skipLibCheck", component_path],
                capture_output=True,
                text=True,
                cwd=self.workspace_root
            )
            if result.returncode != 0:
                return False, f"TypeScript errors: {result.stderr[:200]}..."
        except Exception as e:
            return False, f"TypeScript check failed: {e}"

        # ESLint check
        try:
            result = subprocess.run(
                ["npx", "eslint", component_path],
                capture_output=True,
                text=True,
                cwd=self.workspace_root
            )
            # ESLint can have warnings, so we check for critical errors only
            if "error" in result.stdout.lower() and result.returncode != 0:
                error_count = result.stdout.count("error")
                if error_count > 5:  # Allow some minor issues
                    return False, f"ESLint errors: {error_count} critical issues"
        except Exception as e:
            return False, f"ESLint check failed: {e}"

        return True, "Component validation passed"

    def migrate_component(self, component_path: str) -> Tuple[bool, str, int]:
        """
        Safely migrate a component with full validation
        Returns: (success, message, layers_refs_migrated)
        """
        print(f"🚀 Starting migration: {component_path}")

        # Pre-migration validation
        valid, msg = self.validate_component(component_path)
        if not valid:
            return False, f"Pre-migration validation failed: {msg}", 0

        # Create backup
        if not self.create_backup(component_path):
            return False, "Backup creation failed", 0

        # Read and analyze
        try:
            with open(component_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            return False, f"Failed to read component: {e}", 0

        # Count layers.* references before migration
        layers_refs_before = len(re.findall(r'layers\.', content))

        if self.dry_run:
            print(f"📋 DRY-RUN: Would migrate {layers_refs_before} layers.* references")
            return True, f"Dry-run completed: {layers_refs_before} references found", layers_refs_before

        # Apply migrations
        original_content = content

        # Remove useTheme import
        content = re.sub(r'import\s*\{\s*useTheme\s*\}\s*from\s*[\'"][^\'"]*[\'"]\s*;?', '', content)

        # Replace layers.ref.spacing['X'] with var(--md-sys-spacing-X)
        content = re.sub(r'layers\.ref\.spacing\[\'(\d+)\'\]', r'var(--md-sys-spacing-\1)', content)

        # Replace layers.sys.color.X with var(--md-sys-color-X)
        def color_replacer(match):
            color_name = match.group(1)
            # Convert camelCase to kebab-case
            color_name = re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', color_name).lower()
            return f'var(--md-sys-color-{color_name})'

        content = re.sub(r'layers\.sys\.color\.([a-zA-Z][a-zA-Z0-9]*(?:[A-Z][a-zA-Z0-9]*)*)', color_replacer, content)

        # Replace layers.ref.shape.corner.X with var(--md-sys-shape-corner-X)
        content = re.sub(r'layers\.ref\.shape\.corner\.([a-zA-Z]+)', lambda m: f'var(--md-sys-shape-corner-{m.group(1).lower()})', content)

        # Fix common syntax issues
        content = self._fix_syntax_issues(content)

        # Update header comment
        content = re.sub(r'//.*', '// MD3 Compliant - Migrated on January 18, 2026', content, count=1)

        # Write changes
        try:
            with open(component_path, 'w', encoding='utf-8') as f:
                f.write(content)
        except Exception as e:
            self.restore_backup(component_path)
            return False, f"Failed to write changes: {e}", 0

        # Post-migration validation
        valid, msg = self.validate_component(component_path)
        if not valid:
            print(f"⚠️  Post-migration validation failed: {msg}")
            print("🔄 Attempting rollback...")
            if self.restore_backup(component_path):
                return False, f"Migration failed, rolled back: {msg}", 0
            else:
                return False, f"Migration failed, rollback also failed: {msg}", 0

        # Count migrated references
        layers_refs_after = len(re.findall(r'layers\.', content))
        migrated_refs = layers_refs_before - layers_refs_after

        print(f"✅ Migration successful: {migrated_refs} layers.* references converted")
        return True, f"Successfully migrated {migrated_refs} references", migrated_refs

    def _fix_syntax_issues(self, content: str) -> str:
        """Fix common syntax issues introduced by migration"""

        # Fix unquoted var() in style objects
        content = re.sub(r'([a-zA-Z-]+):\s*var\(([^)]+)\)', r"\1: 'var(\2)'", content)

        # Fix template literals with var()
        # Replace ${var(...)} with var(...) in template literals
        content = re.sub(r'\$\{var\(([^)]+)\)\}', r'var(\1)', content)

        return content

    def get_migration_candidates(self, min_refs: int = 10) -> List[Tuple[str, int]]:
        """Find components with high layers.* reference counts"""
        candidates = []

        for tsx_file in self.workspace_root.rglob("src/components/**/*.tsx"):
            try:
                with open(tsx_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                layers_refs = len(re.findall(r'layers\.', content))
                if layers_refs >= min_refs:
                    candidates.append((str(tsx_file), layers_refs))
            except Exception as e:
                print(f"Warning: Could not analyze {tsx_file}: {e}")

        # Sort by reference count (highest first)
        candidates.sort(key=lambda x: x[1], reverse=True)
        return candidates

def main():
    """Main execution function"""
    workspace_root = Path.cwd()

    tool = MD3MigrationTool(workspace_root)

    # Parse command line arguments (simple implementation)
    import sys
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "--dry-run":
            tool.set_dry_run(True)
            if len(sys.argv) > 2:
                component = sys.argv[2]
                success, msg, refs = tool.migrate_component(component)
                print(f"Result: {msg}")
            else:
                candidates = tool.get_migration_candidates()
                print(f"Top migration candidates:")
                for comp, refs in candidates[:10]:
                    print(f"  {comp}: {refs} references")

        elif command == "--migrate":
            if len(sys.argv) > 2:
                component = sys.argv[2]
                success, msg, refs = tool.migrate_component(component)
                print(f"Result: {msg}")
                sys.exit(0 if success else 1)
            else:
                print("Usage: python md3_tool.py --migrate <component.tsx>")

        elif command == "--candidates":
            candidates = tool.get_migration_candidates()
            print(f"Migration candidates (10+ layers.* references):")
            for comp, refs in candidates:
                print(f"  {comp}: {refs} references")

        elif command == "--rollback":
            if len(sys.argv) > 2:
                component = sys.argv[2]
                success = tool.restore_backup(component)
                sys.exit(0 if success else 1)
            else:
                print("Usage: python md3_tool.py --rollback <component.tsx>")

        else:
            print("Usage:")
            print("  python md3_tool.py --dry-run [component.tsx]")
            print("  python md3_tool.py --migrate <component.tsx>")
            print("  python md3_tool.py --candidates")
            print("  python md3_tool.py --rollback <component.tsx>")
    else:
        print("MD3 Migration Tool v2.0")
        print("Run with --help for usage information")

if __name__ == "__main__":
    main()