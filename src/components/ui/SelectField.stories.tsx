/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// LEGACY - MD3 Non-compliant
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SelectField from './SelectField';

const meta = {
  title: 'Components/Form/SelectField',
  component: SelectField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Select Field component with label, error states, and dropdown indicator. Supports all standard HTML select attributes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the select field',
    },
    error: {
      control: 'boolean',
      description: 'Whether the field has an error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when error is true',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the field should take full width',
    },
  },
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'default-select',
    label: 'Choose an option',
    children: (
      <>
        <option value="">-- Select --</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  },
};

export const CountrySelector: Story = {
  args: {
    id: 'country-select',
    label: 'Country',
    children: (
      <>
        <option value="">Select a country</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
        <option value="au">Australia</option>
        <option value="de">Germany</option>
        <option value="fr">France</option>
        <option value="it">Italy</option>
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    id: 'error-select',
    label: 'Category',
    error: true,
    errorMessage: 'Plvar(--md-sys-motion-easing-standard) select a category',
    children: (
      <>
        <option value="">-- Select Category --</option>
        <option value="tech">Technology</option>
        <option value="health">Health</option>
        <option value="finance">Finance</option>
      </>
    ),
  },
};

export const PreSelected: Story = {
  args: {
    id: 'preselected-select',
    label: 'Priority',
    defaultValue: 'medium',
    children: (
      <>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-select',
    label: 'Disabled Field',
    disabled: true,
    children: (
      <>
        <option value="">Cannot select</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </>
    ),
  },
};

export const Required: Story = {
  args: {
    id: 'required-select',
    label: 'Required Field',
    required: true,
    children: (
      <>
        <option value="">-- Required --</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    id: 'fullwidth-select',
    label: 'Full Width Select',
    fullWidth: true,
    children: (
      <>
        <option value="">Select an option</option>
        <option value="1">This select spans full width</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </>
    ),
  },
  parameters: {
    layout: 'padded',
  },
};

export const Language: Story = {
  args: {
    id: 'language-select',
    label: 'Language',
    children: (
      <>
        <option value="">Select language</option>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="it">Italiano</option>
        <option value="pt">Português</option>
        <option value="zh">中文</option>
        <option value="ja">日本語</option>
      </>
    ),
  },
};

export const TimeZone: Story = {
  args: {
    id: 'timezone-select',
    label: 'Time Zone',
    children: (
      <>
        <option value="">Select time zone</option>
        <option value="utc-8">UTC-8 (Pacific)</option>
        <option value="utc-7">UTC-7 (Mountain)</option>
        <option value="utc-6">UTC-6 (Central)</option>
        <option value="utc-5">UTC-5 (Eastern)</option>
        <option value="utc">UTC (GMT)</option>
        <option value="utc+1">UTC+1 (CET)</option>
        <option value="utc+9">UTC+9 (JST)</option>
      </>
    ),
  },
};

export const ManyOptions: Story = {
  args: {
    id: 'many-options-select',
    label: 'Select Year',
    children: (
      <>
        <option value="">Select year</option>
        {Array.from({ length: 50 }, (_, i) => 2024 - i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </>
    ),
  },
};

export const GroupedOptions: Story = {
  args: {
    id: 'grouped-select',
    label: 'Document Type',
    children: (
      <>
        <option value="">Select document type</option>
        <optgroup label="Academic">
          <option value="thesis">Thesis</option>
          <option value="essay">Essay</option>
          <option value="research">Research Paper</option>
        </optgroup>
        <optgroup label="Business">
          <option value="report">Report</option>
          <option value="proposal">Proposal</option>
          <option value="contract">Contract</option>
        </optgroup>
        <optgroup label="Personal">
          <option value="letter">Letter</option>
          <option value="resume">Resume</option>
          <option value="note">Note</option>
        </optgroup>
      </>
    ),
  },
};













// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
