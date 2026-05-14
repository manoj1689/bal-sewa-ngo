'use client';

import ReactSelect, { type StylesConfig } from 'react-select';

export type FormSelectOption<T extends string = string> = {
  value: T;
  label: string;
};

const formSelectStyles: StylesConfig<FormSelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '44px',
    borderRadius: '0.75rem',
    borderColor: state.isFocused ? 'var(--ring)' : 'var(--border)',
    backgroundColor: 'var(--card)',
    boxShadow: state.isFocused ? '0 0 0 3px color-mix(in oklab, var(--ring) 30%, transparent)' : 'none',
    '&:hover': {
      borderColor: 'var(--ring)',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 0.75rem',
  }),
  input: (base) => ({
    ...base,
    color: '#334155',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#334155',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#94a3b8',
    paddingRight: '0.75rem',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 3000,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 3000,
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.14)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--popover)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'color-mix(in oklab, var(--accent) 12%, white)' : 'var(--popover)',
    color: '#334155',
    cursor: 'pointer',
  }),
};

type FormSelectProps<T extends string> = {
  inputId?: string;
  options: FormSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function FormSelect<T extends string>({
  inputId,
  options,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select option',
}: FormSelectProps<T>) {
  return (
    <ReactSelect<FormSelectOption<T>, false>
      inputId={inputId}
      options={options}
      value={options.find((option) => option.value === value) || null}
      onChange={(option) => {
        if (option) {
          onChange(option.value);
        }
      }}
      isDisabled={disabled}
      isSearchable={false}
      placeholder={placeholder}
      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
      styles={formSelectStyles as unknown as StylesConfig<FormSelectOption<T>, false>}
    />
  );
}
