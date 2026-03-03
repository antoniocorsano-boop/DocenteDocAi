// This file is part of the MD3 visual regression test suite.
// It generates snapshots for a wide range of UI components to ensure visual consistency.

import React from 'react';
import { renderWithM3Theme } from './test-utils';
import { describe, it, expect, vi } from 'vitest';

// Import all the components to test
import { M3Surface } from './M3Surface';
import M3IconButton from './M3IconButton';
import { M3Typography, M3TypographyProps } from './M3Typography';
import M3ListItem from './M3ListItem';
import M3ProgressBar from './M3ProgressBar';
import SelectField from './SelectField';
import TabGroup from './TabGroup';
import M3SuggestionCard from './M3SuggestionCard';
import M3SurfaceCard from './M3SurfaceCard';
import { MetricCard } from './MetricCard';
import { Skeleton, SkeletonList } from './Skeleton';
import { PageTransition } from './PageTransition';
import { ProgressIndicator } from './ProgressIndicator';
import M3SuggestionItem from './M3SuggestionItem';
import ManualSection from './ManualSection';

// Mocking components that might have complex dependencies or are not relevant for visual snapshot
vi.mock('./M3Menu', () => ({ default: () => <div>M3Menu</div>, M3Menu: () => <div>M3Menu</div> }));
vi.mock('./M3Popover', () => ({ default: () => <div>M3Popover</div>, M3Popover: () => <div>M3Popover</div> }));

describe('MD3 Visual Regression Snapshots', () => {
  it('M3Surface renders correctly at different levels', () => {
    const { container } = renderWithM3Theme(
      <>
        <M3Surface level={0}>Surface 0</M3Surface>
        <M3Surface level={1}>Surface 1</M3Surface>
        <M3Surface level={2}>Surface 2</M3Surface>
        <M3Surface level={3}>Surface 3</M3Surface>
        <M3Surface level={4}>Surface 4</M3Surface>
        <M3Surface level={5}>Surface 5</M3Surface>
      </>
    );
    expect(container).toMatchSnapshot();
  });

  it('M3Typography renders correctly for all variants', () => {
    const variants: NonNullable<M3TypographyProps['variant']>[] = [
      'display-large', 'display-medium', 'display-small',
      'headline-large', 'headline-medium', 'headline-small',
      'title-large', 'title-medium', 'title-small',
      'body-large', 'body-medium', 'body-small',
      'label-large', 'label-medium', 'label-small',
    ];
    const { container } = renderWithM3Theme(
      <div>
        {variants.map(variant => (
          <M3Typography key={variant} variant={variant}>{variant}</M3Typography>
        ))}
      </div>
    );
    expect(container).toMatchSnapshot();
  });

  it('M3IconButton renders correctly for all variants', () => {
    const { container } = renderWithM3Theme(
      <>
        <M3IconButton icon="favorite" ariaLabel="favorite" variant="standard" />
        <M3IconButton icon="favorite" ariaLabel="favorite" variant="filled" />
        <M3IconButton icon="favorite" ariaLabel="favorite" variant="tonal" />
        <M3IconButton icon="favorite" ariaLabel="favorite" variant="outlined" />
        <M3IconButton icon="favorite" ariaLabel="favorite" disabled />
      </>
    );
    expect(container).toMatchSnapshot();
  });

  it('M3ListItem renders correctly', () => {
    const { container } = renderWithM3Theme(
      <M3ListItem
        headline="List Item"
        supportingText="Supporting text"
        leadingElement={<span>L</span>}
        trailingElement={<span>T</span>}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('M3ProgressBar renders correctly', () => {
    const { container } = renderWithM3Theme(
      <>
        <M3ProgressBar value={0.5} label="Linear" showValue />
        <M3ProgressBar value={0.7} variant="circular" label="Circular" size="large" />
      </>
    );
    expect(container).toMatchSnapshot();
  });

  it('SelectField renders correctly', () => {
    const { container } = renderWithM3Theme(
      <>
        <SelectField label="Select">
          <option>Option 1</option>
        </SelectField>
        <SelectField label="Error Select" error errorMessage="This is an error">
          <option>Option 1</option>
        </SelectField>
      </>
    );
    expect(container).toMatchSnapshot();
  });

  it('TabGroup renders correctly', () => {
    const tabs = [{ id: '1', label: 'Tab 1', icon: 'home' }, { id: '2', label: 'Tab 2', badge: 3 }];
    const { container } = renderWithM3Theme(
      <TabGroup tabs={tabs} activeTab="1" onTabChange={() => {}} />
    );
    expect(container).toMatchSnapshot();
  });

  it('M3SuggestionCard renders correctly', () => {
    const { container } = renderWithM3Theme(
      <>
        <M3SuggestionCard variant="active">Active Suggestion</M3SuggestionCard>
        <M3SuggestionCard variant="empty">Empty Suggestion</M3SuggestionCard>
      </>
    );
    expect(container).toMatchSnapshot();
  });

  it('M3SuggestionItem renders correctly', () => {
    const { container } = renderWithM3Theme(
      <>
        <M3SuggestionItem onClick={() => {}}>Clickable Item</M3SuggestionItem>
        <M3SuggestionItem>Read-only Item</M3SuggestionItem>
      </>
    );
    expect(container).toMatchSnapshot();
  });

  it('M3SurfaceCard renders correctly', () => {
    const { container } = renderWithM3Theme(
      <>
        <M3SurfaceCard>Default Surface Card</M3SurfaceCard>
        <M3SurfaceCard color="primary">Primary Surface Card</M3SurfaceCard>
        <M3SurfaceCard glass interactive>Glass Interactive Card</M3SurfaceCard>
      </>
    );
    expect(container).toMatchSnapshot();
  });

  it('MetricCard renders correctly', () => {
    const { container } = renderWithM3Theme(
      <MetricCard value="1,234" label="Views" icon="visibility" trend="up" trendValue="+5.2%" />
    );
    expect(container).toMatchSnapshot();
  });

  it('Skeleton renders correctly', () => {
    const { container } = renderWithM3Theme(
      <>
        <Skeleton variant="text" />
        <Skeleton variant="circular" width="var(--md-sys-spacing-10)" height="var(--md-sys-spacing-10)" />
        <Skeleton variant="rectangular" width="100%" height="var(--md-sys-spacing-25, 100px)" />
        <SkeletonList count={2} />
      </>
    );
    expect(container).toMatchSnapshot();
  });

  it('PageTransition renders correctly', () => {
    const { container } = renderWithM3Theme(
      <PageTransition>
        <div>Page Content</div>
      </PageTransition>
    );
    expect(container).toMatchSnapshot();
  });

  it('ProgressIndicator renders correctly', () => {
    const { container } = renderWithM3Theme(
      <ProgressIndicator isLoading={true} />
    );
    expect(container).toMatchSnapshot();
  });

  it('ManualSection renders correctly', () => {
    const { container } = renderWithM3Theme(
      <>
        <ManualSection title="Closed Section" icon="info">
          <div>Hidden Content</div>
        </ManualSection>
        <ManualSection title="Open Section" icon="help" defaultOpen>
          <div>Visible Content</div>
        </ManualSection>
      </>
    );
    expect(container).toMatchSnapshot();
  });
});