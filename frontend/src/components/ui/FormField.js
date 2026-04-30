import React from 'react';

export default function FormField({
  label,
  required,
  error,
  children,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  options,   // [{ value, label }] for select
  disabled,
}) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-field">
      {label && (
        <label className="form-label" htmlFor={fieldId}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      {children ? (
        children
      ) : options ? (
        <select
          id={fieldId}
          className={`form-select${error ? ' error' : ''}`}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">— Sélectionner —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          type={type}
          className={`form-input${error ? ' error' : ''}`}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
